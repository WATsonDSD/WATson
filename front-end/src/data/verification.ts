import {
  ImagesDB, ProjectsDB,
} from './databases';
import {
  ImageID, Annotation, ProjectID, updateUser, findUserById, findProjectById, User, Project, findUserBlockFromProject, updateBlock,
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

  const annotatorId = image.annotatorID;
  if (!annotatorId) throw Error('The image to be rejected has no annotator');
  const annotator = await findUserById(annotatorId);

  const verifierId = image.verifierID;
  if (!verifierId) throw Error('The image has no verifier');
  const verifier = await findUserById(verifierId);

  const wrongAnnotation = image.annotation;
  if (!wrongAnnotation) throw Error('The image has no Annotation');

  const imageIndexAnnotator = annotator.projects[projectID].pendingVerifications.findIndex((id) => id === imageID);
  const imageIndexVerifier = verifier.projects[projectID].assignedVerifications.findIndex((id) => id === imageID);

  // a new rejectedObject is created
  createRejectedImage(imageID, comment, annotatorId, wrongAnnotation);

  // for the annotator user, image goes from waitingForVerification to toAnnotate
  annotator.projects[projectID].pendingVerifications.splice(imageIndexAnnotator, 1);
  annotator.projects[projectID].assignedAnnotations.push(imageID);
  await updateUser(annotator);

  // for the verifier user, image goes from toVerify to waitingForAnnotation
  verifier.projects[projectID].assignedVerifications.splice(imageIndexVerifier, 1);
  verifier.projects[projectID].rejectedAnnotations.push(imageID);
  await updateUser(verifier);

  // move the image from to verify to to annotate in the block 
  const block = await findUserBlockFromProject(projectID, annotatorId);
  if (!block) throw Error('the block does not exist');
  const index = block.assignedVerifications.findIndex((imId) => imId === imageID);
  block.assignedVerifications.splice(index, 1);
  block.assignedAnnotations.push(imageID);

  // the image's annotation becomes undefined
  const imageCleared = {
    ...image,
    annotation: undefined,
  };
  await ImagesDB.put(imageCleared);
  await updateBlock(block, projectID);
}

/**
 * accept the annotation done by the annotator
 */
export async function acceptAnnotation(
  projectID: ProjectID,
  imageID: ImageID,
): Promise <void> {
  const image = await findImageById(imageID);

  const annotatorId = image.annotatorID;
  if (!annotatorId) throw Error('The image to be rejected has no annotator');
  const annotator = await findUserById(annotatorId);

  const verifierId = image.verifierID;
  if (!verifierId) throw Error('The image has no verifier');
  const verifier = await findUserById(verifierId);

  const project = await findProjectById(projectID);

  // populate the workDoneInTime fields.
  putWorkDoneInTime(annotator, verifier, project, imageID);

  // remove the image from the block
  const block = await findUserBlockFromProject(projectID, annotatorId);
  if (!block) throw Error('the block does not exist');
  const index = block.assignedVerifications.findIndex((imId) => imId === imageID);
  block.assignedVerifications.splice(index, 1);

  const imageIndexAnnotator = annotator.projects[projectID].pendingVerifications.findIndex((id) => id === imageID);
  const imageIndexVerifier = verifier.projects[projectID].assignedVerifications.findIndex((id) => id === imageID);

  const dateTime = new Date();
  project.images.done.push({ imageID, doneDate: dateTime });

  // for the annotator user, image goes from waitingForVerification to annotated
  annotator.projects[projectID].pendingVerifications.splice(imageIndexAnnotator, 1);
  annotator.projects[projectID].annotated.push({ imageID, date: dateTime });

  // for the verifier user, image goes from toVerify to verified
  verifier.projects[projectID].assignedVerifications.splice(imageIndexVerifier, 1);
  verifier.projects[projectID].verified.push({ imageID, date: dateTime });

  await ProjectsDB.put(project);
  await updateUser(annotator);
  await updateUser(verifier);
}

/**
 * modifies the annotation done by the annotator with the one done by the verifier
 * and sets the verifier as the final annotator
 */
export async function modifyAnnotation(
  projectID: ProjectID,
  imageID: ImageID,
  newAnnotation: Annotation,
): Promise <void> {
  const image = await findImageById(imageID);

  const annotatorId = image.annotatorID;
  if (!annotatorId) throw Error('The image to be rejected has no annotator');
  const annotator = await findUserById(annotatorId);

  const verifierId = image.verifierID;
  if (!verifierId) throw Error('The image has no verifier');
  const verifier = await findUserById(verifierId);

  const project = await findProjectById(projectID);

  // populate the workDoneInTime fields.
  putWorkDoneInTime(annotator, verifier, project, imageID);

  // remove the image from the block
  const block = await findUserBlockFromProject(projectID, annotatorId);
  if (!block) throw Error('the block does not exist');
  const index = block.assignedVerifications.findIndex((imId) => imId === imageID);
  block.assignedVerifications.splice(index, 1);

  const imageIndexAnnotator = annotator.projects[projectID].pendingVerifications.findIndex((id) => id === imageID);
  const imageIndexVerifier = verifier.projects[projectID].assignedVerifications.findIndex((id) => id === imageID);

  const dateTime = new Date();
  project.images.done.push({ imageID, doneDate: dateTime });

  const newImage = {
    ...image,
    annotation: newAnnotation,
  };
  await ImagesDB.put(newImage);

  // for the annotator user, the image is removed
  annotator.projects[projectID].pendingVerifications.splice(imageIndexAnnotator, 1);

  // for the verifier user, image goes from toVerify to verified and is inserted in annotated
  verifier.projects[projectID].assignedVerifications.splice(imageIndexVerifier, 1);
  verifier.projects[projectID].verified.push({ imageID, date: dateTime });
  verifier.projects[projectID].annotated.push({ imageID, date: dateTime });

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
    if (!user.timedWork[year]) { user.timedWork[year] = {}; }
    // eslint-disable-next-line no-param-reassign
    if (!user.timedWork[year][month]) { user.timedWork[year][month] = {}; }
    // eslint-disable-next-line no-param-reassign
    if (!user.timedWork[year][month][day]) { user.timedWork[year][month][day] = {}; }
    // eslint-disable-next-line no-param-reassign
    if (!user.timedWork[year][month][day][project.id]) { user.timedWork[year][month][day][project.id] = { annotated: [], verified: [] }; }
  });
  // eslint-disable-next-line no-param-reassign
  if (!project.timedWork[year]) { project.timedWork[year] = {}; }
  // eslint-disable-next-line no-param-reassign
  if (!project.timedWork[year][month]) { project.timedWork[year][month] = {}; }
  // eslint-disable-next-line no-param-reassign
  if (!project.timedWork[year][month][day]) { project.timedWork[year][month][day] = []; }
  // ! ---------------------------------------------------------------------------------------------

  // put the new entry in the required fields.
  annotator.timedWork[year][month][day][project.id].annotated.push(image);
  verifier.timedWork[year][month][day][project.id].verified.push(image);
  project.timedWork[year][month][day].push({ annotator: annotator._id, verifier: verifier._id, imageID: image });
}
