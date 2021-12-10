import {
  ImagesDB, ProjectsDB,
} from './databases';
import {
  ImageID, Annotation, RejectionID, ProjectID, updateUser, findUserById,
} from '.';

import { createRejectedImage } from './rejectedImage';

import { fitsSpecification } from './images';

/**
 * rejects the annotation done by an annotator: 
 * discards what is inside the 'annotation' field of the 'Image', and
 * moves the image from the 'toVerify' field to the 'toAnnotate' field of the project

 * also, it creates a 'RejectedAnnotation' object.
 * @returns the id of the 'RejectedAnnotation' object
 */
export async function rejectAnnotation(
  imageID: ImageID,
  projectID: ProjectID,
  comment: String,
) : Promise<RejectionID> {
// retrieve annotation and create the 'rejectedAnnotation' object to be returned
  const rejectedImage = await ImagesDB.get(imageID);
  const project = await ProjectsDB.get(projectID);

  const imageAnnotatorID = rejectedImage.idAnnotator;
  const imageVerifierID = rejectedImage.idVerifier;

  if (!imageAnnotatorID) throw Error('The image to be rejected has no annotator');
  if (!imageVerifierID) throw Error('The image to be rejected has no verifier');

  const rejectedAnnotationId = await createRejectedImage(imageID, imageAnnotatorID, imageVerifierID, comment);

  // check if the image is waiting to be verified.
  const imageIndex = project.images.toVerify.findIndex((entry) => entry.imageId === imageID);
  if (imageIndex < 0) { throw Error('The image does not expect to be verified'); }

  // clear the annotation field of the image
  const imageCleared = {
    ...rejectedImage,
    annotation: undefined,
  };
  await ImagesDB.put(imageCleared);

  // move the image from the toVerify field to the toAnnotate field of Project
  project.images.toAnnotate.push({
    imageId: project.images.toVerify[imageIndex].imageId,
  });
  project.images.toVerify.splice(imageIndex, 1);
  await ProjectsDB.put(project);

  // update user document with the modifed project
  const annotator = await findUserById(imageAnnotatorID);

  /* annotator.projects[projectID] = {
    toAnnotate: 
    toVerify: 
    done: 
  }; */
  updateUser(annotator);

  return rejectedAnnotationId;
}

/**
 * Modifies the annotation with the one suggested by the verifier:
 * modifies the 'annotation' field of the 'Image', 
 * moves the image from the 'toVerify' field to the 'done' field of the project, and
 * moves the image from the 'toVerify' field to the 'done' field related to the project of the specific user
 */
export async function modifyAnnotation(
  projectID: ProjectID,
  imageID: ImageID,
  newAnnotation: Annotation,
) : Promise<void> {
  const image = await ImagesDB.get(imageID);
  const imageAnnotatorID = image.idAnnotator;
  const imageVerifierID = image.idVerifier;

  // check if the annotation is valid.
  const project = await ProjectsDB.get(projectID);
  if (!fitsSpecification(newAnnotation, project.landmarks)) {
    throw Error("The annotation does not fit the project's specification");
  }
  // check if the image is waiting to be verified.
  const imageIndex = project.images.toVerify.findIndex((entry) => entry.imageId === imageID);
  if (imageIndex < 0) { throw Error('The image does not expect to be verified'); }

  // assign the new annotation to the imaage
  image.annotation = newAnnotation;
  await ImagesDB.put(image);

  // move the image from the toVerify to the done field of the project
  project.images.done.push({
    imageId: imageID,
    annotator: imageAnnotatorID!,
    verifier: imageVerifierID!,
  });
  project.images.toVerify.splice(imageIndex, 1);
  await ProjectsDB.put(project);
}

/**
 * it accepts the annotation: 
 * moves the image from the 'toVerify' field to the 'done' field of the project, and 
 * moves the image from the 'toVerify' field to the 'done' field related to the project of the specific user
 */
export async function acceptAnnotatedImage(
  projectID: ProjectID,
  imageID: ImageID,

) : Promise<void> {
  const image = await ImagesDB.get(imageID);
  const project = await ProjectsDB.get(projectID);

  // check if the image is waiting to be verified.
  const imageIndex = project.images.toVerify.findIndex((entry) => entry.imageId === imageID);
  if (imageIndex < 0) { throw Error('The image does not expect to be verified'); }

  const annotatorID = image.idAnnotator;
  const verifierID = image.idVerifier;

  // move the image from toVerify to done
  project.images.done.push({
    imageId: project.images.toVerify[imageIndex].imageId,
    annotator: annotatorID!,
    verifier: verifierID!,
  });
  project.images.toVerify.splice(imageIndex, 1);

  // reflect the changes to the DB.
  await ImagesDB.put(image);
  await ProjectsDB.put(project);
}
