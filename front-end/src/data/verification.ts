import {
  imagesDB, projectsDB,
} from './databases';
import {
  ImageID, UserID, Annotation, RejectionID, ProjectID,
} from '.';

import { createRejectedImage } from './rejectedImage';

import { fitsSpecification } from './images';

/**
 * reject the annotation done by an annotator: discard what is inside the annotation field of the image
 * also, it creates a RejectedAnnotation object.
 * @returns the id of the RejectedAnnotation object
 */
export async function rejectAnnotation(
  rejectedImageID: ImageID,
  imageAnnotatorID: UserID,
  imageVerifierID: UserID,
  comment: String,
) : Promise<RejectionID> {
// retrieve annotation and create the 'rejectedAnnotation' object to be returned
  const rejectedImage = await imagesDB.get(rejectedImageID);
  const wrongAnnotation = rejectedImage.annotation;
  const rejectedAnnotationId = await createRejectedImage(rejectedImageID, imageAnnotatorID, imageVerifierID, wrongAnnotation, comment);

  // clear the annotation field of the image
  const imageCleared = {
    ...rejectedImage,
    annotation: [],
  };
  await imagesDB.put(imageCleared);

  return rejectedAnnotationId;
}

/**
 * it modify the annotation with the one suggested by the verifier.
 * also, it creates a RejectedAnnotation object with verifierId = annotatorID
 * to keep track of the modified images. 
 * @returns the id of the RejectedAnnotation object
 */
export async function modifyAnnotation(
  projectId: ProjectID,
  imageId: ImageID,
  verifierID: UserID,
  newAnnotation: Annotation,
  comment: String,
) : Promise<RejectionID> {
  const image = await imagesDB.get(imageId);

  // check if the annotation is valid.
  const project = await projectsDB.get(projectId);
  if (!fitsSpecification(newAnnotation, project.landmarks)) {
    throw Error("The annotation does not fit the project's specification");
  }

  const modification = createRejectedImage(imageId, verifierID, verifierID, image.annotation, comment);

  image.annotation = newAnnotation;
  await imagesDB.put(image);

  return modification;
}

/**
 * it accept the annotation: 
 * moves the image from the 'toVerify' field 
 * to the 'done' field of the project. 
 */
export async function acceptAnnotatedImage(
  projectID: ProjectID,
  imageID: ImageID,
  annotatorID: UserID,
  verifierID: UserID,

) : Promise<void> {
  const image = await imagesDB.get(imageID);
  const project = await projectsDB.get(projectID);

  // check if the image is waiting to be annotated.
  const imageIndex = project.images.toVerify.findIndex((entry) => entry.imageId === imageID);
  if (imageIndex < 0) { throw Error('The image does not expect to be verified'); }

  // move the image from toVerify to done
  project.images.done.push({
    imageId: project.images.toVerify[imageIndex].imageId,
    annotator: annotatorID,
    verifier: verifierID,
  });
  project.images.toVerify.splice(imageIndex, 1);

  // reflect the changes to the DB.
  await imagesDB.put(image);
  await projectsDB.put(project);
}
