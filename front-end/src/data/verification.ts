import {
  ImagesDB, ProjectsDB,
} from './databases';
import {
  ImageID, Annotation, ProjectID, updateUser, findUserById, findProjectById,
} from '.';
import { createRejectedImage } from './rejectedImage';
import { findImageById } from './images';

/**
 * rejects the annotation done by an annotator:
 * it is expected that later the annotator will correct the annotation
 * also, the function creates a 'RejectedAnnotation' object.
 */
export async function rejectAnnotation(
  imageID: ImageID,
  projectID: ProjectID,
  comment: String,
) : Promise<void> {
  const image = await findImageById(imageID);
  const annotatorId = image.idAnnotator;

  if (!annotatorId) throw Error('The image to be rejected has no annotator');
  const annotator = await findUserById(annotatorId);
  const verifierId = image.idVerifier;

  if (!verifierId) throw Error('The image has no verifier');
  const verifier = await findUserById(annotatorId);
  const wrongAnnotation = image.annotation;

  if (!wrongAnnotation) throw Error('The image has no Annotation');
  const imageIndexAnnotator = annotator.projects[projectID].waitingForVerification.findIndex((id) => id === imageID);
  const imageIndexVerifier = verifier.projects[projectID].toVerify.findIndex((id) => id === imageID);

  // a new rejectedObject is created
  createRejectedImage(imageID, comment, wrongAnnotation);

  // for the annotator user, image goes from waitingForVerification to toAnnotate
  annotator.projects[projectID].waitingForVerification.splice(imageIndexAnnotator, 1);
  annotator.projects[projectID].toAnnotate.push(imageID);
  await updateUser(annotator);

  // for the verifier user, image goes from toVerify to waitingForAnnotation
  verifier.projects[projectID].toVerify.splice(imageIndexVerifier, 1);
  verifier.projects[projectID].waitingForAnnotation.push(imageID);
  await updateUser(verifier);

  // the image's annotation becomes undefined
  const imageCleared = {
    ...image,
    annotation: undefined,
  };
  await ImagesDB.put(imageCleared);
}

/**
 * Modifies the annotation with the one suggested by the verifier
 */
export async function modifyAnnotation(
  projectID: ProjectID,
  imageID: ImageID,
  newAnnotation: Annotation,
) : Promise<void> {
  const image = await findImageById(imageID);

  const annotatorId = image.idAnnotator;
  if (!annotatorId) throw Error('The image to be rejected has no annotator');
  const annotator = await findUserById(annotatorId);
  const verifierId = image.idVerifier;

  if (!verifierId) throw Error('The image has no verifier');
  const verifier = await findUserById(annotatorId);
  const project = await findProjectById(projectID);

  const imageIndexAnnotator = annotator.projects[projectID].waitingForVerification.findIndex((id) => id === imageID);
  const imageIndexVerifier = verifier.projects[projectID].toVerify.findIndex((id) => id === imageID);
  const imageIndexProject = project.images.pending.findIndex((id) => id === imageID);

  // in project, the image foes from pending to done
  project.images.pending.splice(imageIndexProject, 1);
  project.images.done.push(imageID);
  await ProjectsDB.put(project);

  // for the annotator user, image goes from waitingForVerification to annotated
  annotator.projects[projectID].waitingForVerification.splice(imageIndexAnnotator, 1);
  annotator.projects[projectID].annotated.push(imageID);
  await updateUser(annotator);

  // for the verifier user, image goes from toVerify to verified
  verifier.projects[projectID].toVerify.splice(imageIndexVerifier, 1);
  verifier.projects[projectID].verified.push(imageID);
  await updateUser(verifier);

  // the image's annotation becomes undefined
  const newImage = {
    ...image,
    annotation: newAnnotation,
  };
  await ImagesDB.put(newImage);
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
  const image = await findImageById(imageID);
  const annotatorId = image.idAnnotator;

  if (!annotatorId) throw Error('The image to be rejected has no annotator');
  const annotator = await findUserById(annotatorId);
  const verifierId = image.idVerifier;

  if (!verifierId) throw Error('The image has no verifier');
  const verifier = await findUserById(annotatorId);
  const project = await findProjectById(projectID);

  const imageIndexAnnotator = annotator.projects[projectID].waitingForVerification.findIndex((id) => id === imageID);
  const imageIndexVerifier = verifier.projects[projectID].toVerify.findIndex((id) => id === imageID);
  const imageIndexProject = project.images.pending.findIndex((id) => id === imageID);

  // in project, the image foes from pending to done
  project.images.pending.splice(imageIndexProject, 1);
  project.images.done.push(imageID);
  await ProjectsDB.put(project);

  // for the annotator user, image goes from waitingForVerification to annotated
  annotator.projects[projectID].waitingForVerification.splice(imageIndexAnnotator, 1);
  annotator.projects[projectID].annotated.push(imageID);
  await updateUser(annotator);

  // for the verifier user, image goes from toVerify to verified
  verifier.projects[projectID].toVerify.splice(imageIndexVerifier, 1);
  verifier.projects[projectID].verified.push(imageID);
  await updateUser(verifier);
}
