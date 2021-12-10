import {
  updateUser, ImageID, Image, ProjectID, UserID, findUserById,
  findProjectById, Annotation, LandmarkSpecification,
} from '.';
import { ImagesDB, ProjectsDB } from './databases';

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
  const image : Image = {
    // eslint-disable-next-line no-underscore-dangle
    id: im._id,
    data: attach,
    annotation: im.annotation,
    idAnnotator: im.idAnnotator,
    idVerifier: im.idVerifier,
  };
  return image;
}

/**
 * Finds and returns images with the given `status` in a given `project`.
 * If the `user` parameter is specified, returns images assigned to that `User` only.
 */
export async function getImages(
  projectID: ProjectID,
  status: 'toAnnotate' | 'waitingForAnnotation' | 'annotated' | 'toVerify' | 'waitingForVerification' | 'verified' | 'done',
  userID: UserID | null = null,
): Promise<Image[]> {
  if (userID) {
    if (status === 'done') { throw Error('images associated to users must have specification between annotation and verification'); }
    const user = await findUserById(userID);
    return Promise.all(user.projects[projectID][status].map((id) => findImageById(id)));
  }

  if (status === 'waitingForAnnotation' || status === 'annotated' || status === 'waitingForVerification' || status === 'verified') {
    throw Error('images associated to project can be only in -toAnnotate, -toVerify and -done status');
  }
  const project = await findProjectById(projectID);
  return Promise.all(project.images[status].map((entry) => findImageById(entry.imageId)));
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

  // check if the image is waiting to be annotated.
  const imageIndexProject = project.images.toAnnotate.findIndex((entry) => entry.imageId === imageId);
  if (imageIndexProject < 0) { throw Error('The image does not expect an annotation'); }

  // save the annotation
  const image = await ImagesDB.get(imageId);
  image.annotation = annotation;

  // move to toVerify in project
  project.images.toVerify.push(project.images.toAnnotate[imageIndexProject]);
  project.images.toAnnotate.splice(imageIndexProject, 1); // remove from toAnnotate.

  // move from toAnnotate to waitingForVerification in the user annotator
  const annotatorId = image.idAnnotator;
  if (!annotatorId) throw Error('The image to be rejected has no annotator');
  const annotator = await findUserById(annotatorId);
  let imageIndexUser = annotator.projects[projectId].toAnnotate.findIndex((ent) => ent === imageId);

  annotator.projects[projectId].waitingForVerification.push(imageId);
  annotator.projects[projectId].toAnnotate.splice(imageIndexUser, 1);

  if (image.idVerifier) {
    const verifier = await findUserById(image.idVerifier);
    imageIndexUser = verifier.projects[projectId].waitingForAnnotation.findIndex((ent) => ent === imageId);
    verifier.projects[projectId].waitingForAnnotation.splice(imageIndexUser, 1);
    verifier.projects[projectId].toVerify.push(imageId);
  }

  // reflect the changes to the DB.
  await ImagesDB.put(image);
  await ProjectsDB.put(project);
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
  const image = await ImagesDB.get(imageId);
  image.idVerifier = verifierId;

  // assign the image to be verified to the verifier
  if (!image.annotation) {
    verifier.projects[projectId].waitingForAnnotation.push(imageId);
  } else {
    verifier.projects[projectId].toVerify.push(imageId);
  }

  // reflect changes in the database
  await updateUser(verifier);
  await ImagesDB.put(image);
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
  const image = await ImagesDB.get(imageId);
  image.idAnnotator = annotatorId;
  // assign image to be annotated the user
  annotator.projects[projectId].toAnnotate.push(imageId);

  // reflect changes in the database
  await updateUser(annotator);
  await ImagesDB.put(image);
}
