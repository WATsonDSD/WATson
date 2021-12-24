/* eslint-disable no-underscore-dangle */
import {
  ImagesDB, ProjectsDB,
} from './databases';
import {
  ImageID, Annotation, ProjectID, updateUser, findUserById, findProjectById, User, Project,
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
 * Verifies the annotation associated with an image.
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

  // for the annotator user, image goes from waitingForVerification to annotated
  annotator.projects[projectID].waitingForVerification.splice(imageIndexAnnotator, 1);
  annotator.projects[projectID].annotated.push({ imageID, date: dateTime });

  // for the verifier user, image goes from toVerify to verified
  verifier.projects[projectID].toVerify.splice(imageIndexVerifier, 1);
  verifier.projects[projectID].verified.push({ imageID, date: dateTime });

  // the image's annotation may be updated.
  if (newAnnotation) {
    const newImage = {
      ...image,
      annotation: newAnnotation,
    };
    await ImagesDB.put(newImage);
  }

  // populate the workDoneInTime fields.
  putWorkDoneInTime(annotator, verifier, project, imageID);

  await ProjectsDB.put(project);
  await updateUser(annotator);
  await updateUser(verifier);
}

/**
 * Modifies parameters `annotator`, `verifier`, `project` to record that the image was verified on the current date.  
 * WARNING:  
 * ! Does not save the objects to the database !  
 * ! Modifies the passed objects !  
 */
function putWorkDoneInTime(annotator:User, verifier: User, project: Project, image: ImageID) {
  // find the time fields.
  const now = new Date();
  const year = now.getFullYear().toString();
  const month = now.getMonth().toString();
  const day = now.getDate().toString();

  // handle edge case where one of the fields may not exist.
  // ! If you know a better way to do this, please tell Cem, he needs help :( ----------------------
  [annotator, verifier].forEach((user) => {
    // eslint-disable-next-line no-param-reassign
    if (!user.workDoneInTime[year]) { user.workDoneInTime[year] = {}; }
    // eslint-disable-next-line no-param-reassign
    if (!user.workDoneInTime[year][month]) { user.workDoneInTime[year][month] = {}; }
    // eslint-disable-next-line no-param-reassign
    if (!user.workDoneInTime[year][month][day]) { user.workDoneInTime[year][month][day] = {}; }
    // eslint-disable-next-line no-param-reassign
    if (!user.workDoneInTime[year][month][day][project._id]) { user.workDoneInTime[year][month][day][project._id] = { annotated: [], verified: [] }; }
  });
  // eslint-disable-next-line no-param-reassign
  if (!project.workDoneInTime[year]) { project.workDoneInTime[year] = {}; }
  // eslint-disable-next-line no-param-reassign
  if (!project.workDoneInTime[year][month]) { project.workDoneInTime[year][month] = {}; }
  // eslint-disable-next-line no-param-reassign
  if (!project.workDoneInTime[year][month][day]) { project.workDoneInTime[year][month][day] = []; }
  // ! ---------------------------------------------------------------------------------------------

  // put the new entry in the required fields.
  annotator.workDoneInTime[year][month][day][project._id].annotated.push(image);
  verifier.workDoneInTime[year][month][day][project._id].verified.push(image);
  project.workDoneInTime[year][month][day].push({ annotator: annotator.id, verifier: verifier.id, imageId: image });
}
