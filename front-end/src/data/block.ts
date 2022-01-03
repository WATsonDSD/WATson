import { v4 as uuid } from 'uuid';
import {
  Block, BlockID, findProjectById, findUserById, ImageID, ImagesDB, ProjectID, ProjectsDB, updateBlock, updateUser, User, UserID,
} from '.';
import { findImageById } from './images';

/**
 * creates a new block with 'size' images
 * assigns the images to the annotator, and
 * if the association verifier-annotator already exists, assigns images to the verifier
 * @param size number of images to be assigned
 */
export async function addBlock(
  size: number,
  idAnnotator: UserID,
  projectId: ProjectID,
): Promise<BlockID> {
  const id = uuid();
  let toAnnotate: ImageID[] = [];
  const project = await findProjectById(projectId);
  const toBeAssigned = project.images.pendingAssignment;

  // retrieve images for the block
  if (size >= toBeAssigned.length) {
    toAnnotate = toBeAssigned;
    project.images.pendingAssignment = [];
  } else {
    toAnnotate = toBeAssigned.slice(0, size);
    const remainedToBeAssigned = project.images.pendingAssignment.slice(size, toBeAssigned.length);
    project.images.pendingAssignment = remainedToBeAssigned;
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
    id,
    size,
    assignedAnnotation: toAnnotate,
    assignedVerification: [],
    annotatorID: idAnnotator,
    verifierID: idVerifier,
    projectID: projectId,
  };

  // add block to the project
  project.images.blocks[id] = { block };
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
  await Promise.all(Object.entries(block.assignedAnnotation).map(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async ([key, value]) => {
      const image = await findImageById(value);
      image.annotatorID = idAnnotator;
      image.verifierID = idVerifier;
      image.blockID = block.id;
      await ImagesDB.put(image);
    },
  ));
  return id;
}

/**
 * adds toAdd images to an existing block,
 * assign those images to the associated annotator, and
 * if the association verifier-annotator already exists, assigns those images to the verifier
 */
export async function addImagesToBlock(toAdd: number, blockId: BlockID, projectId: ProjectID): Promise <void> {
  const block = await findBlockOfProject(blockId, projectId);
  if (!block) throw Error('the block does not exist');
  const project = await findProjectById(projectId);

  const toBeAssigned = project.images.pendingAssignment;
  const imagesToAdd = toBeAssigned.slice(0, toAdd);
  const annotatorId = block.annotatorID;
  if (!annotatorId) throw Error('the block does not have an annotator');

  const annotator = await findUserById(annotatorId);
  let verifier: User | undefined;
  if (block.verifierID) {
    verifier = await findUserById(block.verifierID);
  }

  // remove the image from allImagesWithoutAnnotator in project
  const remainedToBeAssigned = project.images.pendingAssignment.slice(toAdd);
  console.log('remainedToBeAssigned', remainedToBeAssigned);
  project.images.pendingAssignment = remainedToBeAssigned;

  // add the images to the block
  block.assignedAnnotation = block.assignedAnnotation.concat(imagesToAdd);
  // assign the images to the annotator (put it in toAnnotate field)
  annotator.projects[projectId].assignedAnnotations = annotator.projects[projectId].assignedAnnotations.concat(imagesToAdd);
  updateUser(annotator);
  // if the verifier exists, assign the image to the verifier (put it in waitingForAnnotation field)
  if (verifier) {
    verifier.projects[projectId].rejectedAnnotations = verifier.projects[projectId].rejectedAnnotations.concat(imagesToAdd);
    updateUser(verifier);
  }

  // update the annotator and verifier field for each assigned image
  await Promise.all(Object.entries(imagesToAdd).map(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async ([key, value]) => {
      const image = await findImageById(value);
      image.annotatorID = annotator.uuid;
      console.log('hsdgjahdg', image.annotatorID);
      if (verifier) {
        image.verifierID = verifier.uuid;
      }
      ImagesDB.put(image);
    },
  ));
  await ProjectsDB.put(project);
  await updateBlock(block, projectId);
}

/**
 * assigns the verifier to the block
 */
export async function assignVerifier(blockId: BlockID, verifierId: UserID, projectId: ProjectID): Promise<void> {
  const project = await findProjectById(projectId);
  const verifier = await findUserById(verifierId);
  const block = await findBlockOfProject(blockId, projectId);

  if (!block) throw Error('the block does not exist');
  const annotatorId = block.annotatorID;
  if (!annotatorId) throw Error('the block does not have an annotator');

  // add the annotator-verifier link to the project
  project.linkedWorkers.push({ annotatorID: annotatorId, verifierID: verifierId });

  if (block.verifierID) throw Error('the verifies has been already assigned!');

  // add idVerifier to the block
  // eslint-disable-next-line no-param-reassign
  block.verifierID = verifierId;

  // add the images to the waitingForAnnotation and/or toVerify field of the verifier
  const blockImagestoAnnotate = block.assignedAnnotation;
  verifier.projects[projectId].rejectedAnnotations.push(...blockImagestoAnnotate);

  const blockImagesToVerify = block.assignedVerification;
  verifier.projects[projectId].assignedVerifications.push(...blockImagesToVerify);

  await Promise.all(Object.entries(blockImagestoAnnotate).map(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async ([key, value]) => {
      const image = await findImageById(value);
      image.verifierID = verifierId;
      await ImagesDB.put(image);
    },
  ));
  await Promise.all(Object.entries(blockImagesToVerify).map(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async ([key, value]) => {
      const image = await findImageById(value);
      image.verifierID = verifierId;
      await ImagesDB.put(image);
    },
  ));

  await ProjectsDB.put(project);
  await updateBlock(block, projectId);
  await updateUser(verifier);
}

/**
 * finds the block with blockId of the projectId
 */
export async function findBlockOfProject(blockId: BlockID, projectId: ProjectID): Promise <Block | undefined> {
  const project = await findProjectById(projectId);
  let myBlock: Block | undefined;
  Object.entries(project.images.blocks).forEach(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ([key, value]) => {
      if (value.block.id === blockId) {
        myBlock = value.block;
      }
    },
  );
  return myBlock;
}

/**
 * finds the block of a project associated to an annotator
 * @returns the id of the block if it exists, undefined otherwise
 */
export async function findAnnotatorBlockOfProject(projectId: ProjectID, annotatorId: UserID): Promise < Block | undefined > {
  const project = await findProjectById(projectId);
  let myBlock: Block | undefined;
  Object.entries(project.images.blocks).forEach(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ([key, value]) => {
      if (value.block.annotatorID === annotatorId) {
        myBlock = value.block;
      }
    },
  );
  return myBlock;
}
