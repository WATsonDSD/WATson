import { v4 as uuid } from 'uuid';

import {
  DBDocument,
  User,
  UserID,
  updateUser,
  findUserById,
  ImageID,
  ImagesDB,
  findImageById,
  Block,
  BlockID,
  Project,
  ProjectID,
  ProjectsDB,
  updateProject,
  findProjectById,
  Image,
  getImages,
} from '.';

import { UpdateError } from '../utils/errors';

/**
 * creates a new block with 'size' images
 * assigns the images to the annotator, and
 * if the association verifier-annotator already exists, assigns images to the verifier
 * @param size number of images to be assigned
 */
export async function createBlock(size: number, idAnnotator: UserID, projectId: ProjectID): Promise<BlockID> {
  const id = uuid();
  let toAnnotate: ImageID[] = [];
  const project = await findProjectById(projectId);
  const toBeAssigned = project.images.pendingAssignments;

  // retrieve images for the block
  if (size >= toBeAssigned.length) {
    toAnnotate = toBeAssigned;
    project.images.pendingAssignments = [];
  } else {
    toAnnotate = toBeAssigned.slice(0, size);
    const remainedToBeAssigned = project.images.pendingAssignments.slice(size, toBeAssigned.length);
    project.images.pendingAssignments = remainedToBeAssigned;
  }

  let idVerifier: UserID | undefined;

  /**
   * search the verifier->if link exixts-> add verifier to block (is the one in annVer)
   */
  Object.entries(project.linkedWorkers).forEach(
    ([_key, value]) => {
      if (value.annotatorID === idAnnotator) {
        idVerifier = value.verifierID;
      }
    },
  );
  const block: Block = {
    _id: id,
    size,
    assignedAnnotations: toAnnotate,
    assignedVerifications: [],
    annotatorID: idAnnotator,
    verifierID: idVerifier,
    projectID: projectId,
  };

  // add block to the project
  project.images.blocks[id] = block;
  await ProjectsDB.put(project);

  // assign images to the annotator
  const annotator = await findUserById(idAnnotator);
  annotator.projects[projectId].assignedAnnotations.push(...toAnnotate);
  await updateUser(annotator);

  // if verifier-ass exixted assign images to the verifier 

  if (idVerifier) {
    const verifier = await findUserById(idVerifier);
    verifier.projects[projectId].rejectedAnnotations = (toAnnotate);
    await updateUser(verifier);
  }

  // update the annotator and verifier field for each assigned image
  await Promise.all(Object.entries(block.assignedAnnotations).map(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async ([key, value]) => {
      const image = await findImageById(value);
      image.annotatorID = idAnnotator;
      image.verifierID = idVerifier;
      image.blockID = block._id;
      await ImagesDB.put(image);
    },
  ));
  return id;
}

export async function updateBlock(block: Block, project: DBDocument<Project>): Promise<void> {
  return new Promise((resolve, reject) => {
    const updatedProject: DBDocument<Project> = project;
    updatedProject.images.blocks[block._id] = block;

    updateProject(updatedProject)
      .then(() => resolve())
      .catch(() => reject(new UpdateError('The block could not be updated as requested.')));
  });
}

/**
 * adds toAdd images to an existing block,
 * assign those images to the associated annotator, and
 * if the association verifier-annotator already exists, assigns those images to the verifier
 */
export async function addImagesToBlock(toAdd: number, block: Block, project: DBDocument<Project>): Promise <void> {
  const updatedProject: DBDocument<Project> = project;
  const updatedBlock: Block = block;

  if (!block.annotatorID) throw new UpdateError('The image could not be added because no annotator is assigned to this block yet.');

  const imagesToBeAssigned: ImageID[] = project.images.pendingAssignments.slice(0, toAdd);
  const annotator: DBDocument<User> = await findUserById(block.annotatorID);

  // remove the image from pendingAssignments in project
  updatedProject.images.pendingAssignments = project.images.pendingAssignments.slice(toAdd);

  // add the images to the block
  updatedBlock.assignedAnnotations = [...block.assignedAnnotations, ...imagesToBeAssigned];

  // assign the images to the annotator (add to assignedAnnotations field)
  annotator.projects[project._id].assignedAnnotations = annotator.projects[project._id].assignedAnnotations.concat(imagesToBeAssigned);
  await updateUser(annotator);

  // if the verifier exists, assign the image to the verifier (put it in waitingForAnnotation field)
  if (block.verifierID) {
    const verifier = await findUserById(block.verifierID);

    verifier.projects[project._id].rejectedAnnotations = verifier.projects[project._id].rejectedAnnotations.concat(imagesToBeAssigned);
    await updateUser(verifier);
  }

  // update the annotator and verifier field for each assigned image
  const imagesToUpdate: DBDocument<Image>[] = await getImages(imagesToBeAssigned);

  await ImagesDB.bulkDocs(
    imagesToUpdate
      .map((image) => ({ ...image, annotatorID: annotator._id, verifierID: block.verifierID })),
  );

  await updateProject(updatedProject);
  await updateBlock(updatedBlock, updatedProject);
}

/**
 * assigns the image to an annotator: 
 * if a block for that annotator already exists, 
 * it adds size images to the existing block, 
 * otherwise it creates a new block
 */
export async function assignBlockToAnnotator(size: number, annotatorId: UserID, project: DBDocument<Project>) : Promise <BlockID> {
  let blockId: BlockID = '';
  // create the block and assign images to annotator (and verifier if exists)
  const block = findUserBlockFromProject(project, annotatorId);
  if (!block) {
    blockId = await createBlock(size, annotatorId, project._id);
  } else {
    blockId = block._id;
    await addImagesToBlock(size, block, project);
  }
  return blockId;
}

/**
 * assigns the verifier to the block
 */
export async function assignBlockToVerifier(block: Block, verifier: DBDocument<User>, project: DBDocument<Project>): Promise<void> {
  const updatedProject: DBDocument<Project> = project;
  const updatedVerifier: DBDocument<User> = verifier;
  const updatedBlock: Block = block;

  if (!block.annotatorID) throw new UpdateError('This block does not have an assigned annotator yet!');
  if (block.verifierID) throw new UpdateError('The block is already assigned to another verifier!');

  // Adds the annotator-verifier link to the project
  updatedProject.linkedWorkers.push({ annotatorID: block.annotatorID, verifierID: verifier._id });

  // Adds the verifier id to the block
  updatedBlock.verifierID = verifier._id;

  // Adds the block to the verifier
  updatedVerifier.projects[project._id].rejectedAnnotations.push(...block.assignedAnnotations); // ! this is confusing...
  updatedVerifier.projects[project._id].assignedVerifications.push(...block.assignedVerifications);

  // Updates images' verifierID field
  const imagesToUpdate: DBDocument<Image>[] = await getImages([...block.assignedAnnotations, ...block.assignedVerifications]);

  await ImagesDB.bulkDocs(
    imagesToUpdate
      .map((image) => ({ ...image, verifierID: verifier._id })),
  );

  await updateUser(updatedVerifier);
  await updateProject(updatedProject);
  await updateBlock(updatedBlock, updatedProject);
}

/**
 * finds the block with blockId of the projectId
 */
export function getBlockFromProject(blockID: BlockID, project: DBDocument<Project>): Block | undefined {
  return project.images.blocks[blockID];
}

/**
 * finds the block of a project associated to an annotator
 * @returns the id of the block if it exists, undefined otherwise
 */
export function findUserBlockFromProject(project: DBDocument<Project>, annotatorID: UserID): Block | undefined {
  return Object.values(project.images.blocks).find((block) => block.annotatorID === annotatorID);
}
