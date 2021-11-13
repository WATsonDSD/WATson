import {
  findUserById,
  LandmarkSpecification, Project, ProjectID, UserID, ImageData, ImageID,
} from '.';
import { Images, Projects } from './dummyData';

export async function findProjectById(id: ProjectID): Promise<Project> {
  const res = Projects[id];
  if (!res) {
    throw Error(`A project with id ${id} does not exist!`);
  }
  return res;
}

/**
 * Finds and returns all projects of a user.
 */
export async function getProjectsOfUser(userId: UserID): Promise<Project[]> {
  return Promise.all(
    Object.keys(await findProjectById(userId)).map((id) => findProjectById(id)),
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

  Projects[id] = {
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
  };
  return id;
}

/**
 * Adds the user (whatever the role) to the project.  
 * If they are an annotator or a verifier, this function will not assign them any image.
 */
export async function addUserToProject(userId: UserID, projectId: ProjectID): Promise<void> {
  const user = await findUserById(userId);
  const project = await findProjectById(projectId);
  if (user.projects[projectId]) { throw Error(`User ${user.name} is already in project ${project.name}`); }

  project.users.push(userId);
  user.projects[projectId] = { // initally, the user is assigned no images.
    toAnnotate: [],
    toVerify: [],
    done: [],
  };
}

/**
 * Assigns an id to the image with the given `ImageData` and adds it to the project.
 * ! This function does not assign an annotator (for now).
 */
export async function addImageToProject(data: ImageData, projectId: ProjectID): Promise<ImageID> {
  const imageId = new Date().toJSON(); // unique id's.
  const project = await findProjectById(projectId);

  Images[imageId] = {
    id: imageId,
    data,
  };

  project.images.toAnnotate.push({ imageId, annotator: null });

  return imageId;
}
