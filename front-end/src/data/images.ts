import {
  updateUser, ImageID, Image, ProjectID, UserID, findUserById,
  findProjectById, Annotation, LandmarkSpecification, ProjectsDB, addBlock, findAnnotatorBlockOfProject, addImagesToBlock, User,
} from '.';
import { ImagesDB } from './databases';
import { DBDocument } from './PouchWrapper/PouchCache';

/*
  Note: Notice that there is no method `createImage`.
  This is because images exist only in the context of a project.
    They are "weak entities", so to speak.
  To create an Image, use addImageToProject.
 */

/**
 * Creates an object of type ImageView with the id and the Blob image
 * of af the Image corresponding to the given ImageID. 
 * This function is used to display the image to the user. 
 * @param id The identificator of the requested image 
 */
export async function findImageById(id: ImageID): Promise<DBDocument<Image>> {
  const attach = await ImagesDB.getAttachment(id, 'image') as Blob;
  const im = await ImagesDB.get(id);
  return {
    ...im,
    data: attach,
    // eslint-disable-next-line no-underscore-dangle
    id: im._id,
  };
}

/**
 * Finds and returns images with the given `status` in a given `project`.
 * If the `user` parameter is specified, returns images assigned to that `User` only.
 */
export async function getImagesOfUser(
  projectID: ProjectID,
  status: 'toAnnotate' | 'waitingForAnnotation' | 'annotated' | 'toVerify' | 'waitingForVerification' | 'verified',
  userID: UserID,
): Promise<Image[]> {
  const user = await findUserById(userID);
  if (status === 'verified' || status === 'annotated') {
    return Promise.all(user.projects[projectID][status].map((image) => findImageById(image.imageID)));
  }
  return Promise.all(user.projects[projectID][status].map((id) => findImageById(id)));
}

/**
 * this function will be removed once the view components will be updated with the new requirements from the client.
 * the following three functions will be used instead
 * @param projectId 
 * @param status 
 * @returns 
 */
// eslint-disable-next-line consistent-return
export async function getImagesOfProject(
  projectId: ProjectID,
  status: 'needsAnnotatorAssignment' | 'needsVerifierAssignment' | 'pending' | 'done',
): Promise <Image[] | undefined> {
  const project = await findProjectById(projectId);
  if (status === 'done') {
    return Promise.all(project.images[status].map((image) => findImageById(image.imageId)));
  }
  // return Promise.all(project.images[status].map((imageId) => findImageById(imageId)));
}

/**
 * @returns the images of the project without annotator
 */
export async function getImagesOfProjectWithoutAnnotator(projectId: ProjectID): Promise <Image[]> {
  const project = await findProjectById(projectId);
  const images : Image[] = [];
  Object.entries(project.images.imagesWithoutAnnotator).forEach(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async ([key, imageId]) => {
      const image = await findImageById(imageId);
      images.push(image);
    },
  );
  return images;
}

/**
 * @returns the number of images of the project without annotator
 */
export async function getNumberOfImagesOfProjectWithoutAnnotator(projectId: ProjectID): Promise <number> {
  const project = await findProjectById(projectId);
  return project.images.imagesWithoutAnnotator.length;
}

/**
 * @returns all the users of the project
 */
export async function getAnnotatorWithoutVerifier(projectId: ProjectID): Promise <User[]> {
  const project = await findProjectById(projectId);
  const usersId = project.users; // list di tutti gli id

  // from users remove the annotator that has an association in annVer
  Object.entries(project.annVer).forEach(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async ([key, annVer]) => {
      const index = usersId.findIndex((userId) => annVer.annotatorId === userId);
      usersId.splice(index, 1);
    },
  );
  const users: User[] = [];
  Object.entries(usersId).forEach(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async ([key, userId]) => {
      const user = await findUserById(userId);
      users.push(user);
    },
  );
  return users;
}

/**
 * Determines whether `annotation` is valid for the `specification`. 
 */
export function fitsSpecification(annotation: Annotation, specification: LandmarkSpecification): boolean {
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
  const annotatorId = image.idAnnotator;
  if (!annotatorId) throw Error('The image to be annotated has no annotator');
  const annotator = await findUserById(annotatorId);
  const imageIndexAnnotator = annotator.projects[projectId].toAnnotate.findIndex((ent) => ent === imageId);

  annotator.projects[projectId].waitingForVerification.push(imageId);
  annotator.projects[projectId].toAnnotate.splice(imageIndexAnnotator, 1);

  // if there is a verifier, move the image to the toVerify field.
  if (image.idVerifier) {
    const verifier = await findUserById(image.idVerifier);
    const imageIndexVerifier = verifier.projects[projectId].waitingForAnnotation.findIndex((ent) => ent === imageId);
    verifier.projects[projectId].waitingForAnnotation.splice(imageIndexVerifier, 1);
    verifier.projects[projectId].toVerify.push(imageId);
    await updateUser(verifier);
  }

  // move the image from toAnnotate to toVerify in the block
  const block = await findAnnotatorBlockOfProject(projectId, annotatorId);
  if (!block) throw Error('the block does not exist');
  const imageIndexBlock = block.toAnnotate.findIndex((im) => im === imageId);
  block.toAnnotate.splice(imageIndexBlock, 1);
  block.toVerify.push(imageId);

  // reflect the changes to the DB.
  await ProjectsDB.put(project);
  await ImagesDB.put(image);
  await updateUser(annotator);
}

/*
* assign the image to the verifier
*THIS FUNCTION WILL NEVER BE USED! USE assignVerifier IN BLOCKS.TS
*/
export async function assignVerifierToImage(
  imageId: ImageID,
  verifierId: UserID,
  projectId: ProjectID,
): Promise<void> {
  const verifier = await findUserById(verifierId);

  if (verifier.role !== 'verifier') {
    throw Error('this user is not a verifier');
  }

  // assign verifier to the image
  const image = await findImageById(imageId);
  if (!image.idAnnotator) { throw Error('The images needs to be assigned an annotator first'); }
  image.idVerifier = verifierId;

  // assign the image to be verified to the verifier
  if (!image.annotation && !verifier.projects[projectId].waitingForAnnotation.find((i) => i === imageId)) {
    verifier.projects[projectId].waitingForAnnotation.push(imageId);
  } else if (image.annotation && !verifier.projects[projectId].toVerify.find((i) => i === imageId)) {
    verifier.projects[projectId].toVerify.push(imageId);
  }

  // move the image to pending in the project.

  // reflect changes in the database
  await updateUser(verifier);
  await ImagesDB.put(image);
}

/* this function is no more used: USE ASSIGNIMAGESTOANNOTATOR IN BLOCK.IT
* assign the image to the annotator
*/
export async function assignAnnotatorToImage(
  imageId: ImageID,
  annotatorId: UserID,
  projectId: ProjectID,
): Promise<void> {
  const annotator = await findUserById(annotatorId);
  if (annotator.role !== 'annotator' && annotator.role !== 'verifier') {
    throw Error('this user is not is not allowed to annotate images!');
  }

  // assign annotator to image
  const image = await findImageById(imageId);
  image.idAnnotator = annotatorId;
  // assign image to be annotated the user
  // Users have in their cards the pictures already assigned to them
  if (!annotator.projects[projectId].toAnnotate.find((i) => i === imageId)) {
    annotator.projects[projectId].toAnnotate.push(imageId);
  }

  // reflect changes in the database
  await updateUser(annotator);
  await ImagesDB.put(image);
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
) : Promise <void> {
  // create the block and assign images to annotator (and verifier if exists)
  const block = await findAnnotatorBlockOfProject(projectId, annotatorId);
  if (!block) {
    await addBlock(size, annotatorId, projectId);
  } else {
    await addImagesToBlock(size, block.blockId, projectId);
  }
}

export async function deleteImage(imageId: ImageID): Promise <void> {
  ImagesDB.get(imageId).then((image) => ImagesDB.remove(image));
}
