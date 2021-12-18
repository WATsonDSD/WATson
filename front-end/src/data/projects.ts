import { v4 as uuid } from 'uuid';
import {
  updateUser,
  findUserById,
  LandmarkSpecification, Project, ProjectID, UserID, ImageData, ImageID, User, getUsersOfProject,
} from '.';

import { ImagesDB, ProjectsDB } from './databases';

export async function findProjectById(id: ProjectID): Promise<Project & {_id: string, _rev: string}> {
  return ProjectsDB.get(id);
}
/**
 * Finds and returns all projects of a user.
 */
export async function getProjectsOfUser(userID: UserID): Promise<Project[]> {
  const user: User = await findUserById(userID);

  const projects = await Promise.all(
    Object.keys(user.projects).map((id) => findProjectById(id)),
  );

  return projects;
}

/**
 * Creates a new `Project`.
 * @returns The newly created project's `id`, determined by the backend.
 * 
 * @example
 * const projectId = await createUser('Laura's project', 'Laura', []);
 * // returns 'Laura's project'
 * getUserById(projecId).then(project => project.name);
 */
export async function createProject(
  name: string,
  client: string,
  landmarks: LandmarkSpecification,
  startDate: Date,
  endDate: Date,
  financialModel: {
  pricePerImageAnnotation: number
  pricePerImageVerification: number,
  hourlyRateAnnotation: number,
  hourlyRateVerification: number,
  },
) : Promise<ProjectID> {
  const id = uuid(); // unique id's.

  const project = {
    _id: id,
    id,
    users: [], // A newly created project has no users.
    name,
    client,
    startDate: new Date().toJSON(),
    endDate: '',
    status: 'active', // A newly created project start in progress.
    landmarks,
    pricePerImageAnnotation: financialModel.pricePerImageAnnotation,
    pricePerImageVerification: financialModel.pricePerImageVerification,
    hourlyRateAnnotation: financialModel.hourlyRateAnnotation,
    hourlyRateVerification: financialModel.hourlyRateVerification,
    workDoneInTime: {},
    images: { // A newly created project has no images.
      needsAnnotatorAssignment: [],
      needsVerifierAssignment: [],
      pending: [],
      done: [],
    },
  } as Project & {_id: string};

  await ProjectsDB.put(project);
  return id;
}

/**
 * Deletes a project.
 */
export async function deleteProject(projectID: ProjectID): Promise<void> {
  // Fetches the project
  const project: Project = await findProjectById(projectID);

  const images: ImageID[] = [
    project.images.needsAnnotatorAssignment,
    project.images.needsVerifierAssignment,
    project.images.pending,
    project.images.done.map((im) => im.imageId)].flat();

  // Removes all the images associated with the project from ImagesDB
  await Promise.all(images.map(async (imageID) => {
    const image = await ImagesDB.get(imageID);

    // Deletes the attachment
    // eslint-disable-next-line no-underscore-dangle
    await ImagesDB.removeAttachment(imageID, 'image', image._rev);

    // Removes the image from ImagesDB
    return ImagesDB.remove(image);
  }));

  // Fetches the users of this project
  const users: User[] = await Promise.all(project.users.map((userID) => findUserById(userID)));

  // Removes the project from the list of projects of each user
  await Promise.all(users.map(async (user) => {
    const updatedUser = user;
    delete updatedUser.projects[projectID];

    return updateUser(updatedUser);
  }));

  // Removes the project from ProjectsDB
  await ProjectsDB.get(projectID).then((project) => ProjectsDB.remove(project));
}

/**
 * Adds the user (whatever the role) to the project.  
 * If they are an annotator or a verifier, this function will not assign them any image.
 */
export async function addUserToProject(userId: UserID, projectId: ProjectID): Promise<void> {
  const user = await findUserById(userId);
  const project = await findProjectById(projectId);

  if (user.projects[projectId]) {
    throw Error(`User ${user.name} is already in project ${project.name}`);
  }

  project.users.push(userId);

  user.projects[projectId] = { // initally, the user is assigned no images.
    toAnnotate: [],
    waitingForAnnotation: [],
    annotated: [],
    toVerify: [],
    waitingForVerification: [],
    verified: [],
  };

  await ProjectsDB.put(project);
  await updateUser(user);
}

/**
 * Assigns an id to the image with the given `ImageData` and adds it to the project.
 * ! This function does not assign an annotator (for now).
 */
export async function addImageToProject(data: ImageData, projectId: ProjectID): Promise<ImageID> {
  const imageId = uuid(); // unique id's.
  const project = await findProjectById(projectId);

  // store the image id to the project it is associated to
  project.images.needsAnnotatorAssignment.push(imageId);

  // store the image in the database (_attachment)
  await ImagesDB.putAttachment(imageId, 'image', data, 'image/jpeg');

  await ProjectsDB.put(project);

  return imageId;
}
export async function changeProjectName(projectID: ProjectID, name: string) {
  const project = await findProjectById(projectID);
  project.name = name;
  await ProjectsDB.put(project);
}
export async function closeProject(projectID: ProjectID) {
  const project = await findProjectById(projectID);
  project.status = 'closed';
  await ProjectsDB.put(project);
}

/**
 * removes a worke to a project and changes the status of the assigned images in project. 
 * if the worker was a verifier for that project, images goes in needsVerifierAssignment, 
 * otherwise images goes in needsAnnotatorAssignment
 */

export async function removeWorkerToProject(userId: UserID, projectId: ProjectID): Promise<void> {
  const user = await findUserById(userId);

  const toAnnotateUser = user.projects[projectId].toAnnotate;
  const waitingForAnnotationUser = user.projects[projectId].waitingForAnnotation;
  const toVerifyUser = user.projects[projectId].toVerify;
  const waitingForVerificationUser = user.projects[projectId].waitingForVerification;
  const annotatedUser: ImageID[] = [];
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Object.entries(user.projects[projectId].annotated).forEach(async ([key, value]) => annotatedUser.push(value.imageID));

  await projectMoveTo(projectId, toAnnotateUser, 'needsAnnotatorAssignment');
  await projectMoveTo(projectId, waitingForAnnotationUser, 'needsVerifierAssignment');
  await projectMoveTo(projectId, toVerifyUser, 'needsVerifierAssignment');
  await projectMoveTo(projectId, waitingForVerificationUser, 'needsAnnotatorAssignment');
  await projectMoveTo(projectId, annotatedUser, 'needsVerifierAssignment');
}

/**
 * moves the images in the indicated field in the project
 * @param To where to move the images
 */
async function projectMoveTo(
  projectID: ProjectID,
  images: ImageID[],
  To: 'needsAnnotatorAssignment' | 'needsVerifierAssignment' | 'pending',
) : Promise<void> {
  // search each image and remove it
  const project = await findProjectById(projectID);
  images.forEach((imageId) => {
    const indexnnA = project.images.needsAnnotatorAssignment.findIndex((id) => id === imageId);
    if (indexnnA !== -1) {
      project.images.needsAnnotatorAssignment.splice(indexnnA, 1);
    } else {
      const indexnnV = project.images.needsVerifierAssignment.findIndex((id) => id === imageId);
      if (indexnnV !== -1) {
        project.images.needsVerifierAssignment.splice(indexnnA, 1);
      } else {
        const indexP = project.images.pending.findIndex((id) => id === imageId);
        project.images.pending.splice(indexP, 1);
      }
    }
    // add the image in the To field
    project.images[To].push(imageId);
  });
}
