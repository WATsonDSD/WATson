import {
  updateUser, ImageID, Image, ProjectID, UserID, findUserById,
  findProjectById, Annotation, LandmarkSpecification, ProjectsDB,
} from '.';
import { ImagesDB } from './databases';

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
export async function findImageById(id: ImageID): Promise<Image> {
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

export async function getImagesOfProject(
  projectId: ProjectID,
  status: 'needsAnnotatorAssignment' | 'needsVerifierAssignment' | 'pending' | 'done',
): Promise <Image[]> {
  const project = await findProjectById(projectId);
  if (status === 'done') {
    return Promise.all(project.images[status].map((image) => findImageById(image.imageId)));
  }
  return Promise.all(project.images[status].map((imageId) => findImageById(imageId)));
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

  // reflect the changes to the DB.
  await ImagesDB.put(image);
  await updateUser(annotator);
}

/*
* assign the image to the verifier
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
  const project = await findProjectById(projectId);
  const imageIndex = project.images.needsVerifierAssignment.findIndex((id) => id === imageId);
  if (imageIndex >= 0) {
    project.images.needsVerifierAssignment.splice(imageIndex, 1);
    project.images.pending.push(image.id);
  }

  // reflect changes in the database
  await updateUser(verifier);
  await ImagesDB.put(image);
  await ProjectsDB.put(project);
}

/*
* assign the image to the annotator
*/
export async function assignAnnotatorToImage(
  imageId: ImageID,
  annotatorId: UserID,
  projectId: ProjectID,
): Promise<void> {
  const annotator = await findUserById(annotatorId);
  if (annotator.role !== 'annotator' && annotator.role !== 'verifier') {
    throw Error('this user is not is not allowd to annotate images!');
  }

  // assign annotator to image
  const image = await findImageById(imageId);
  image.idAnnotator = annotatorId;
  // assign image to be annotated the user
  if (!annotator.projects[projectId].toAnnotate.find((i) => i === imageId)) {
    annotator.projects[projectId].toAnnotate.push(imageId);
  }

  // move the image to needsVerifierAssignment in the project.
  const project = await findProjectById(projectId);
  const imageIndex = project.images.needsAnnotatorAssignment.findIndex((id) => id === imageId);
  if (imageIndex >= 0) {
    project.images.needsAnnotatorAssignment.splice(imageIndex, 1);
    project.images.needsVerifierAssignment.push(image.id);
  }

  // reflect changes in the database
  await updateUser(annotator);
  await ImagesDB.put(image);
  await ProjectsDB.put(project);
}
