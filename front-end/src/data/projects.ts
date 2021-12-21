import { v4 as uuid } from 'uuid';
import {
  updateUser,
  findUserById,
  LandmarkSpecification, Project, ProjectID, UserID, ImageData, ImageID, User, Block, findBlockOfProject,
} from '.';

import { ImagesDB, ProjectsDB } from './databases';
import { deleteImage, findImageById } from './images';

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
    annVer: [],
    workDoneInTime: {},
    images: {
      blocks: {},
      imagesWithoutAnnotator: [],
      done: [],
    }, // A newly created project has no images.

  } as Project & {_id: string};

  await ProjectsDB.put(project);
  return id;
}

/**
 * Deletes a project:
 * it deletes the images from the database, 
 * remove the projects[projectId] field from all the users, and 
 * remove the project from the database
 * notice that it does not remove the project from the workDoneInTime since 
 * the user will be paid for images already done
 */
export async function deleteProject(projectID: ProjectID): Promise<void> {
  // Fetches the project
  const project: Project = await findProjectById(projectID);

  // delete all the images from the images' database
  Object.entries(project.images.blocks).forEach(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async ([key, value]) => {
      Object.entries(value.block.toAnnotate).forEach(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        async ([key, imageID]) => {
          await deleteImage(imageID);
        },
      );
      Object.entries(value.block.toVerify).forEach(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        async ([key, imageID]) => {
          await deleteImage(imageID);
        },
      );
    },
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Object.entries(project.images.done).forEach(async ([key, image]) => {
    await deleteImage(image.imageId);
  });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Object.entries(project.images.imagesWithoutAnnotator).forEach(async ([key, imageId]) => {
    await deleteImage(imageId);
  });

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
  project.images.imagesWithoutAnnotator.push(imageId);

  // store the image in the database (_attachment)
  await ImagesDB.putAttachment(imageId, 'image', data, 'image/jpeg');

  await ProjectsDB.put(project);

  return imageId;
}

export async function numberOfImagesInProject(projectId: ProjectID): Promise <number> {
  const project = await findProjectById(projectId);
  let totImages = project.images.imagesWithoutAnnotator.length + project.images.done.length;
  Object.entries(project.images.blocks).forEach(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async ([key, value]) => {
      totImages += value.block.toAnnotate.length + value.block.toVerify.length;
    },
  );
  return totImages;
}

export async function updateBlock(block: Block, projectId: ProjectID): Promise<void> {
  const project = await findProjectById(projectId);
  project.images.blocks[block.blockId] = { block };
  await ProjectsDB.put(project);
}

/**
 * 
 * Never  -> check that image is not annotated 
CASO A: IMAGE HAS NO ANNOTATOR AND NO VERIFIER ASSIGNED
PROJECT: image removed from project.images.allImagesWithoutAnnotator and from project.images.needaAnnotatorAssignement
BLOCCO: not exists
ANNOTATOR: not exists
VERIFIER: not exists
IMAGE: removed from the db
   @param projectId 
 * @param imageId 
 */

export async function deleteNewImageFromProject(projectId: ProjectID, imageId: ImageID): Promise<void> {
  const project = await findProjectById(projectId);
  const image = await findImageById(imageId);

  if (image.idAnnotator) {
    // delete from the annotator
    const annotator = await findUserById(image.idAnnotator);
    const imageIndexAnnotator = annotator.projects[projectId].toAnnotate.findIndex((id) => id === imageId);
    annotator.projects[projectId].toAnnotate.splice(imageIndexAnnotator, 1);
  }
  if (image.idVerifier) {
    // delete from the verifier
    const verifier = await findUserById(image.idVerifier);
    const imageIndexVerifier = verifier.projects[projectId].waitingForAnnotation.findIndex((id) => id === imageId);
    verifier.projects[projectId].waitingForAnnotation.splice(imageIndexVerifier, 1);
  }
  if (image.blockId) {
    // image is in a block, so we remove the image from the block 
    const block = await findBlockOfProject(image.blockId, projectId);
    if (!block) throw Error('the block does not exist');
    const imageIndexBlock = block.toAnnotate.findIndex((id) => id === imageId);
    block.toAnnotate.splice(imageIndexBlock, 1);
  } else {
    // image is not assigned yet, we remove the image from imagesWithoutAnnotator
    const imageIndexProject = project.images.imagesWithoutAnnotator.findIndex((id) => id === imageId);
    project.images.imagesWithoutAnnotator.splice(imageIndexProject, 1);
  }
}
