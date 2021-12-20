import { v4 as uuid } from 'uuid';
import {
  Block, BlockID, findProjectById, findUserById, ImageID, ImagesDB, ProjectID, ProjectsDB, updateUser, User, UserID,
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
  const toBeAssigned = project.images.imagesWithoutAnnotator;

  // retrieve images for the block
  if (size >= toBeAssigned.length) {
    toAnnotate = toBeAssigned;
    project.images.imagesWithoutAnnotator = [];
  } else {
    toAnnotate = toBeAssigned.slice(0, size);
    const remainedToBeAssigned = project.images.imagesWithoutAnnotator.slice(size + 1, toBeAssigned.length);
    project.images.imagesWithoutAnnotator = remainedToBeAssigned;
  }

  let idVerifier: UserID | undefined;

  // search the verifier
  Object.entries(project.annVer).forEach(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async ([key, value]) => {
      if (value.annotatorId === idAnnotator) {
        idVerifier = value.verifierId;
      }
    },
  );

  const block = {
    _id: id,
    blockId: id,
    size,
    toAnnotate,
    toVerify: [],
    idAnnotator,
    idVerifier,
    projectId,
  } as Block;

  // add block to the project
  project.images.blocks[id] = { block };
  ProjectsDB.put(project);

  // assign images to the annotator
  const annotator = await findUserById(idAnnotator);
  annotator.projects[projectId].toAnnotate = toAnnotate;
  updateUser(annotator);

  // assign images to the verifier if assigned
  if (idVerifier) {
    const verifier = await findUserById(idVerifier);
    verifier.projects[projectId].waitingForAnnotation = toAnnotate;
    updateUser(verifier);
  }

  // update the annotator and verifier field for each assigned image
  Object.entries(block.toAnnotate).forEach(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async ([key, value]) => {
      const image = await findImageById(value);
      image.idAnnotator = idAnnotator;
      image.idVerifier = idVerifier;
      ImagesDB.put(image);
    },
  );
  return id;
}

/**
 * adds toAdd images to an existing block,
 * assign those images to the associated annotator, and
 * if the association verifier-annotator already exists, assigns those images to the verifier
 */
export async function addImagesToBlock(toAdd: number, blockId: BlockID, projectId: ProjectID): Promise <void> {
  const block = await findBlockOfProject(projectId, blockId);
  if (!block) throw Error('the block does not exist');
  const project = await findProjectById(projectId);

  const toBeAssigned = project.images.imagesWithoutAnnotator;
  const imagesToAdd = toBeAssigned.slice(0, toAdd);

  const annotator = await findUserById(block.idAnnotator);
  let verifier: User|undefined;
  if (block.idVerifier) {
    verifier = await findUserById(block.idVerifier);
  }

  // remove the image from allImagesWithoutAnnotator in project
  const remainedToBeAssigned = project.images.imagesWithoutAnnotator.slice(toAdd + 1, toBeAssigned.length);
  project.images.imagesWithoutAnnotator = remainedToBeAssigned;

  imagesToAdd.forEach((im) => {
    // add the image to the block
    block.toAnnotate.push(im);
    // assign the image to the annotator (put it in toAnnotate field)
    annotator.projects[projectId].toAnnotate.push(im);
    updateUser(annotator);
    // if the verifier exists, assign the image to the verifier (put it in waitingForAnnotation field)
    if (verifier) {
      verifier.projects[projectId].waitingForAnnotation.push(im);
      updateUser(verifier);
    }
  });

  // update the annotator and verifier field for each assigned image
  Object.entries(imagesToAdd).forEach(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async ([key, value]) => {
      const image = await findImageById(value);
      image.idAnnotator = annotator.id;
      if (verifier) {
        image.idVerifier = verifier.id;
      }
      ImagesDB.put(image);
    },
  );
}

/**
 * assigns the verifier to the block
 */
export async function assignVerifier(blockId: BlockID, verifierId: UserID, projectId: ProjectID) {
  const project = await findProjectById(projectId);
  const verifier = await findUserById(verifierId);

  await findBlockOfProject(blockId, projectId).then((block) => {
    if (!block) throw Error('the block does not exist');
    const annotatorId = block.idAnnotator;

    // add the annotator-verifier link to the project
    project.annVer.push({ annotatorId, verifierId });

    if (block.idVerifier) throw Error('the verifies has been already assigned!');

    // add idVerifier to the block
    // eslint-disable-next-line no-param-reassign
    block.idVerifier = verifierId;
    ProjectsDB.put(project);

    // add the images to the waitingForAnnotation and/or toVerify field of the verifier
    const blockImagestoAnnotate = block.toAnnotate;
    verifier.projects[projectId].waitingForAnnotation.concat(blockImagestoAnnotate);

    const blockImagesToVerify = block.toVerify;
    verifier.projects[projectId].toVerify.concat(blockImagesToVerify);

    updateUser(verifier);
  });
}

/**
 * finds the block with blockId of the projectId
 */
export async function findBlockOfProject(blockId: BlockID, projectId: ProjectID): Promise <Block | undefined> {
  const project = await findProjectById(projectId);
  let myBlock: Block | undefined;
  Object.entries(project.images.blocks).forEach(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async ([key, value]) => {
      if (value.block.blockId === blockId) {
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
    async ([key, value]) => {
      if (value.block.idAnnotator === annotatorId) {
        myBlock = value.block;
      }
    },
  );
  return myBlock;
}
