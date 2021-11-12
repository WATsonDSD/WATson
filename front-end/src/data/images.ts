import { Images } from './dummyData';
import {
  ImageID, Image, ProjectID, UserID, findUserById,
  findProjectById, Annotation, LandmarkSpecification,
} from '.';

/*
  Note: Notice that there is no method `createImage`.
  This is because images exist only in the context of a project.
    They are "weak entities", so to speak.
  To create an Image, use addImageToProject.
 */

export async function findImageById(id: ImageID): Promise<Image> {
  const res = Images[id];
  if (!res) {
    throw Error(`An image with id ${id} does not exist!`);
  }
  return res;
}

/**
 * Finds and returns images with the given `status` in a given `project`.
 * If the `user` parameter is specified, returns images assigned to that `User` only.
 */
export async function getImages(
  projectID: ProjectID,
  status: 'toAnnotate' | 'toVerify' | 'done',
  userID: UserID | null = null,
): Promise<Image[]> {
  if (userID) {
    const user = await findUserById(userID);
    return Promise.all(user.projects[projectID][status].map((id) => findImageById(id)));
  }
  const project = await findProjectById(projectID);
  return Promise.all(project.images[status].map((id) => findImageById(id)));
}

/**
 * Determines whether `annotation` is valid for the `specification`. 
 */
function fitsSpecification(annotation: Annotation, specification:LandmarkSpecification): boolean {
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
  const imageIndex = project.images.toAnnotate.findIndex((id) => id === projectId);
  if (imageIndex < 0) { throw Error('The image does not expect an annotation'); }

  // save the annotation
  const image = await findImageById(imageId);
  image.annotation = annotation;

  // move to toVerify
  project.images.toAnnotate.splice(imageIndex, 1); // remove from toAnnotate.
  project.images.toVerify.push(imageId);
}
