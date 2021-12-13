import {
  ImagesDB, ProjectsDB,
} from './databases';
import {
  ImageID, Annotation, ProjectID, updateUser, findUserById, findProjectById,
} from '.';
import { createRejectedImage } from './rejectedAnnotation';
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
  const verifier = await findUserById(verifierId);

  const wrongAnnotation = image.annotation;
  if (!wrongAnnotation) throw Error('The image has no Annotation');

  const imageIndexAnnotator = annotator.projects[projectID].waitingForVerification.findIndex((id) => id === imageID);
  const imageIndexVerifier = verifier.projects[projectID].toVerify.findIndex((id) => id === imageID);

  // a new rejectedObject is created
  createRejectedImage(imageID, comment, annotatorId, wrongAnnotation);

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
 * it move the image in the state of done for the project project
 * @param newAnnotation if not null, the image annotation is modified by the verifier
 */
export async function verifyImage(
  projectID: ProjectID,
  imageID: ImageID,
  newAnnotation: Annotation | null = null,
) : Promise<void> {
  const image = await findImageById(imageID);

  const annotatorId = image.idAnnotator;
  if (!annotatorId) throw Error('The image to be rejected has no annotator');
  const annotator = await findUserById(annotatorId);

  const verifierId = image.idVerifier;
  if (!verifierId) throw Error('The image has no verifier');
  const verifier = await findUserById(verifierId);

  const project = await findProjectById(projectID);

  const imageIndexAnnotator = annotator.projects[projectID].waitingForVerification.findIndex((id) => id === imageID);
  const imageIndexVerifier = verifier.projects[projectID].toVerify.findIndex((id) => id === imageID);
  const imageIndexProject = project.images.pending.findIndex((id) => id === imageID);

  // in project, the image goes from pending to done
  project.images.pending.splice(imageIndexProject, 1);
  const dateTime = new Date();
  project.images.done.push({ imageId: imageID, doneDate: dateTime });

  await ProjectsDB.put(project);

  // for the annotator user, image goes from waitingForVerification to annotated
  annotator.projects[projectID].waitingForVerification.splice(imageIndexAnnotator, 1);
  annotator.projects[projectID].annotated.push({ imageID, date: dateTime });
  await updateUser(annotator);

  // for the verifier user, image goes from toVerify to verified
  verifier.projects[projectID].toVerify.splice(imageIndexVerifier, 1);

  verifier.projects[projectID].verified.push({ imageID, date: dateTime });
  await updateUser(verifier);

  // the image's annotation becomes undefined
  if (newAnnotation) {
    const newImage = {
      ...image,
      annotation: newAnnotation,
    };
    await ImagesDB.put(newImage);
  }
}
