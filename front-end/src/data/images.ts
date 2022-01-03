import { v4 as uuid } from 'uuid';

import {
  DBDocument,
  User,
  UserID,
  updateUser,
  findUserById,
  Image,
  ImageID,
  ImagesDB,
  ImageData,
  BlockID,
  addBlock,
  addImagesToBlock,
  Landmark,
  Annotation,
  Project,
  ProjectID,
  ProjectsDB,
  findProjectById,
  findAnnotatorBlockOfProject,
} from '.';

import { UpdateError } from '../utils/errors';

export async function findImageById(imageID: ImageID): Promise<DBDocument<Image>> {
  return ImagesDB.get(imageID, { attachments: true, binary: true });
}

/**
 * Assigns an id to the image with the given
 * `ImageData` and adds it to the project.
 */
export async function addImageToProject(data: ImageData, project: DBDocument<Project>): Promise<ImageID> {
  const updatedProject: DBDocument<Project> = project;

  const image: Image & { _id: string } = {
    _id: uuid(),
    _attachments: {
      image: {
        content_type: 'image/jpeg',
        data,
      },
    },
  };

  updatedProject.images.pendingAssignment.push(image._id);

  await ImagesDB.put(image)
    .catch(() => {
      throw new UpdateError('The image could not be created.');
    });

  await ProjectsDB.put(updatedProject)
    .catch(() => {
      throw new UpdateError('The image could not be added to the project.');
    });

  return image._id;
}

export function numberOfImagesInProject(project: DBDocument<Project>): number {
  let numberOfImages = project.images.pendingAssignment.length + project.images.done.length;

  Object.values(project.images.blocks).forEach((value) => {
    numberOfImages += value.block.assignedAnnotation.length + value.block.assignedVerification.length;
  });

  return numberOfImages;
}

/**
 * Finds and returns images with the given `status` in a given `project`.
 * If the `user` parameter is specified, returns images assigned to that `User` only.
 */
export async function getImagesOfUser(
  projectID: ProjectID,
  status: 'assignedAnnotations' | 'rejectedAnnotations' | 'annotated' | 'assignedVerifications' | 'pendingVerifications' | 'verified',
  userID: UserID,
): Promise<Image[]> {
  const user = await findUserById(userID);
  if (status === 'verified' || status === 'annotated') {
    return Promise.all(user.projects[projectID][status].map((image) => findImageById(image.imageID)));
  }
  return Promise.all(user.projects[projectID][status].map((id) => findImageById(id)));
}

/**
 * @returns the images of the project without annotator
 */
export async function getImagesOfProjectWithoutAnnotator(projectId: ProjectID): Promise <Image[]> {
  const project = await findProjectById(projectId);
  const images : Image[] = [];
  await Promise.all(Object.entries(project.images.pendingAssignment).map(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async ([key, imageId]) => {
      const image = await findImageById(imageId);
      images.push(image);
    },
  ));
  return images;
}

/**
 * @returns the number of images of the project without annotator
 */
export async function getNumberOfImagesOfProjectWithoutAnnotator(projectId: ProjectID): Promise <number> {
  const project = await findProjectById(projectId);
  return project.images.pendingAssignment.length;
}

/**
 * @returns all the users of the project
 */
export async function getAnnotatorWithoutVerifier(projectId: ProjectID): Promise <User[]> {
  const project = await findProjectById(projectId);
  const usersId = project.workers; // list di tutti gli id

  // from users remove the annotator that has an association in annVer
  Object.entries(project.linkedWorkers).forEach(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async ([key, annVer]) => {
      const index = usersId.findIndex((userId) => annVer.annotatorID === userId);
      usersId.splice(index, 1);
    },
  );
  const users: User[] = [];
  await Promise.all(Object.entries(usersId).map(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async ([key, userId]) => {
      const user = await findUserById(userId);
      users.push(user);
    },
  ));
  return users;
}

/**
 * Determines whether `annotation` is valid for the `specification`. 
 */
export function fitsSpecification(annotation: Annotation, specification: Landmark[]): boolean {
  let valid = true;
  specification.forEach((landmark) => { if (!annotation[landmark]) valid = false; });
  return valid;
}

/**
 * Saves the annotation and associates it with the image.
 * Also moves the image from 'toAnnotate' to 'toVerify'.
 * ! This function does NOT assign a verifier (yet).
 * @param annotation Has to be complete and has to match the project's `LandmarkSpecification`.
 * @param imageId The image the annotation will be associated to.
 * @param projectId The project that includes the image.
 */
export async function saveAnnotation(
  annotation: Annotation,
  imageId: ImageID,
  projectId: ProjectID,
): Promise<void> {
  const project = await findProjectById(projectId);

  // check if the annotation is valid.
  if (!fitsSpecification(annotation, project.landmarks)) {
    throw Error("The annotation does not fit the project's specification");
  }

  // save the annotation
  const image = await findImageById(imageId);
  image.annotation = annotation;

  // move from toAnnotate to waitingForVerification in the user annotator
  const annotatorId = image.annotatorID;
  console.log('savve Annotation', image.annotatorID);
  if (!annotatorId) throw Error('The image to be annotated has no annotator');
  const annotator = await findUserById(annotatorId);
  const imageIndexAnnotator = annotator.projects[projectId].assignedAnnotations.findIndex((ent) => ent === imageId);

  annotator.projects[projectId].pendingVerifications.push(imageId);
  annotator.projects[projectId].assignedAnnotations.splice(imageIndexAnnotator, 1);

  // if there is a verifier, move the image to the toVerify field.
  if (image.verifierID) {
    const verifier = await findUserById(image.verifierID);
    const imageIndexVerifier = verifier.projects[projectId].rejectedAnnotations.findIndex((ent) => ent === imageId);
    verifier.projects[projectId].rejectedAnnotations.splice(imageIndexVerifier, 1);
    verifier.projects[projectId].assignedVerifications.push(imageId);
    await updateUser(verifier);
  }

  // move the image from toAnnotate to toVerify in the block
  const block = await findAnnotatorBlockOfProject(projectId, annotatorId);
  if (!block) throw Error('the block does not exist');
  const imageIndexBlock = block.assignedAnnotation.findIndex((im) => im === imageId);
  block.assignedAnnotation.splice(imageIndexBlock, 1);
  block.assignedVerification.push(imageId);

  // reflect the changes to the DB.
  await ProjectsDB.put(project);
  await ImagesDB.put(image);
  await updateUser(annotator);
}

/**
 * assigns the image to an annotator: 
 * if a block for that annotator already exists, 
 * it adds size images to the existing block, 
 * otherwise it creates a new block
 */
export async function assignImagesToAnnotator(
  size: number,
  annotatorId: UserID,
  projectId: ProjectID,
) : Promise <BlockID> {
  let blockId: BlockID = '';
  // create the block and assign images to annotator (and verifier if exists)
  const block = await findAnnotatorBlockOfProject(projectId, annotatorId);
  if (!block) {
    blockId = await addBlock(size, annotatorId, projectId);
  } else {
    blockId = block.id;
    await addImagesToBlock(size, blockId, projectId);
  }
  return blockId;
}

export async function deleteImage(imageId: ImageID): Promise <void> {
  ImagesDB.get(imageId).then((image) => ImagesDB.remove(image));
}
