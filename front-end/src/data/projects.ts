import {
  findUserById,
  LandmarkSpecification, Project, ProjectID, UserID, ImageData, ImageID,
} from '.';
import { imagesDB, projectsDB, usersDB } from './databases';

export async function findProjectById(id: ProjectID): Promise<Project> {
  return projectsDB.get(id);
}
/**
 * Finds and returns all projects of a user.
 */
export async function getProjectsOfUser(userId: UserID): Promise<Project[]> {
  return Promise.all(
    Object.keys((await findUserById(userId)).projects).map((id) => findProjectById(id)),
  );
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
) : Promise<ProjectID> {
  const id = new Date().toISOString(); // unique id's.

  const project = {
    _id: id,
    id,
    users: [], // A newly created project has no users.
    name,
    client,
    startDate: new Date().toJSON(),
    endDate: '',
    status: 'inProgress', // A newly created project start in progress.
    landmarks,
    images: { // A newly created project has no images.
      toAnnotate: [],
      toVerify: [],
      done: [],
    },
  } as Project;

  await projectsDB.put(project);
  return id;
}
/**
 * Adds the user (whatever the role) to the project.  
 * If they are an annotator or a verifier, this function will not assign them any image.
 */
export async function addUserToProject(userId: UserID, projectId: ProjectID): Promise<void> {
  const user = await findUserById(userId);
  const project = await findProjectById(projectId);
  this is an error

  if (user.projects[projectId]) { throw Error(`User ${user.name} is already in project ${project.name}`); }
  project.users.push(userId);
  user.projects[projectId] = { // initally, the user is assigned no images.
    toAnnotate: [],
    toVerify: [],
    done: [],
  };

  await projectsDB.put(project);
  await usersDB.put(user);
}

/**
 * Assigns an id to the image with the given `ImageData` and adds it to the project.
 * ! This function does not assign an annotator (for now).
 */
export async function addImageToProject(data: ImageData, projectId: ProjectID): Promise<ImageID> {
  const imageId = new Date().toJSON(); // unique id's.
  const project = await findProjectById(projectId);

  // store the image id to the project it is associated to
  project.images.toAnnotate.push({ imageId });

  // store the image in the database (_attachment)
  await imagesDB.putAttachment(imageId, 'image', data, 'image/jpeg');
  const image = await imagesDB.get(imageId);
  image.id = imageId;
  await imagesDB.put(image);

  await projectsDB.put(project);

  return imageId;
}
