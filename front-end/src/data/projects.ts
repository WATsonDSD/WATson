import { v4 as uuid } from 'uuid';
import {
  updateUser,
  findUserById,
  LandmarkSpecification, Project, ProjectID, UserID, ImageData, ImageID, User, Block, findBlockOfProject,
} from '.';

import { ImagesDB, ProjectsDB } from './databases';
import { findImageById } from './images';

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
  await Promise.all(Object.entries(project.images.blocks).map(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async ([key, value]) => {
      await Promise.all(Object.entries(value.block.toAnnotate).map(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        async ([key, imageID]) => {
          await deleteImageFromProject(projectID, imageID);
        },
      ));
      await Promise.all(Object.entries(value.block.toVerify).map(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        async ([key, imageID]) => {
          await deleteImageFromProject(projectID, imageID);
        },
      ));
    },
  ));
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  await Promise.all(Object.entries(project.images.done).map(async ([key, image]) => {
    await deleteImageFromProject(projectID, image.imageId);
  }));
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  await Promise.all(Object.entries(project.images.imagesWithoutAnnotator).map(async ([key, imageId]) => {
    await deleteImageFromProject(projectID, imageId);
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
 * deletes an image that has never been annotated and/or verified
 */

async function deleteNewImageFromProject(projectId: ProjectID, imageId: ImageID): Promise<void> {
  const project = await findProjectById(projectId);
  const image = await findImageById(imageId);

  if (image.idAnnotator) {
    // delete from the annotator
    const annotator = await findUserById(image.idAnnotator);
    const imageIndexAnnotator = annotator.projects[projectId].toAnnotate.findIndex((id) => id === imageId);
    annotator.projects[projectId].toAnnotate.splice(imageIndexAnnotator, 1);
    await updateUser(annotator);
  }
  if (image.idVerifier) {
    // delete from the verifier
    const verifier = await findUserById(image.idVerifier);
    const imageIndexVerifier = verifier.projects[projectId].waitingForAnnotation.findIndex((id) => id === imageId);
    verifier.projects[projectId].waitingForAnnotation.splice(imageIndexVerifier, 1);
    await updateUser(verifier);
  }
  if (image.blockId) {
    // image is in a block, so we remove the image from the block 
    const block = await findBlockOfProject(image.blockId, projectId);
    if (!block) throw Error('the block does not exist');
    const imageIndexBlock = block.toAnnotate.findIndex((id) => id === imageId);
    block.toAnnotate.splice(imageIndexBlock, 1);
    await updateBlock(block, projectId);
  } else {
    // image is not assigned yet, we remove the image from imagesWithoutAnnotator
    const imageIndexProject = project.images.imagesWithoutAnnotator.findIndex((id) => id === imageId);
    project.images.imagesWithoutAnnotator.splice(imageIndexProject, 1);
    await ProjectsDB.put(project);
  }
}
/**
 * delete an image that has been annotated and verified
 */
async function deleteDoneImageFromProject(projectId: ProjectID, imageId: ImageID): Promise <void> {
  const project = await findProjectById(projectId);
  const imageIndexProject = project.images.imagesWithoutAnnotator.findIndex((id) => id === imageId);
  project.images.imagesWithoutAnnotator.splice(imageIndexProject, 1);
  await ProjectsDB.put(project);
}

/**
 * deletes an image from a project.
 * notice that this function throws an error if the image is in progress,
 * since it is possible to remove only new and done images
 */
export async function deleteImageFromProject(projectId: ProjectID, imageId: ImageID): Promise<void> {
  const image = await findImageById(imageId);
  const project = await findProjectById(imageId);
  if (!image.annotation) {
    await deleteNewImageFromProject(projectId, imageId);
  } else if (project.images.done.find((im) => im.imageId === imageId)) {
    await deleteDoneImageFromProject(projectId, imageId);
  } else {
    throw Error('This image cannot be removed!');
  }
}

/** 
 * 
*/
export async function removeUserFromProject(projectId: ProjectID, userId: UserID): Promise<void> {
  const project = await findProjectById(projectId);
  const user = await findUserById(userId);

  // await Promise.all(listOfUsers.map(async (user) => {
  await Promise.all(Object.entries(project.images.blocks).map(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async ([key, block]) => {
      // console.log(block.block);
      const myBlock = await findBlockOfProject(projectId, block.block.blockId);
      console.log(myBlock);
      if (!myBlock) throw Error('block not found');

      if (block.block.idAnnotator === userId) { // if user is an annotator
        if (block.block.idVerifier) {
          // if verifier assigned, remains a block with images in toVerify and the verifierId
          // const verifier = await findUserById(block.block.idVerifier);

          // remove the link annotator-verifier
          const index = project.annVer.findIndex((anVe) => anVe.annotatorId === userId && anVe.verifierId === block.block.idVerifier);
          project.annVer.splice(index, 1);

          // put the toAnnotate images in imagesWithoutAnnotator and remove them from the block
          project.images.imagesWithoutAnnotator.push(...block.block.toAnnotate);
          myBlock.toAnnotate = [];

          // delete idAnnotator from the block
          myBlock.idAnnotator = undefined;

          // reflect changes in the db
          await ProjectsDB.put(project);
          await updateBlock(myBlock, projectId);
          // await updateUser(verifier);
        } else {
          // if verifier not assigned, remove the block and put all the images in the block in imagesWithoutAnnotator
          // put the images in imagesWithoutAnnotator
          project.images.imagesWithoutAnnotator.push(...myBlock.toAnnotate);
          // remove the block from the project 
          delete project.images.blocks[myBlock.blockId];
          await ProjectsDB.put(project);
        }
        // remove idAnnotator from images
        await Promise.all(Object.entries(myBlock.toAnnotate).map(
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          async ([key, imId]) => {
            const image = await findImageById(imId);
            image.idAnnotator = undefined;
            await ImagesDB.put(image);
          },
        ));
      } else if (block.block.idVerifier === userId) { // if the user is a verifier
        // remove idVerifier from images
        await Promise.all(Object.entries(myBlock.toAnnotate).map(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
          async ([key, imId]) => {
            const image = await findImageById(imId);
            image.idVerifier = undefined;
            await ImagesDB.put(image);
          },
        ));

        await Promise.all(Object.entries(myBlock.toVerify).map(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
          async ([key, imId]) => {
            const image = await findImageById(imId);
            image.idVerifier = undefined;
            await ImagesDB.put(image);
          },
        ));
        if (block.block.idAnnotator) { // if the annotator is linked
        // remove the pair annotator-verifier
          const index = project.annVer.findIndex((anVe) => anVe.annotatorId === block.block.idAnnotator && anVe.verifierId === user.id);
          project.annVer.splice(index, 1);
          // remove the verifier id from the block
          myBlock.idVerifier = undefined;
          await updateBlock(myBlock, projectId);
        } else { // if the annotator is not linked
          delete project.images.blocks[myBlock.blockId];
          await ProjectsDB.put(project);
        }
      }
    },
  ));
  const userIdex = project.users.findIndex((user) => user === userId);
  project.users.splice(userIdex, 1);

  delete user.projects[projectId];
  await updateUser(user);
}

// delete the blocks for the user
//  if the user is an annotator, remove the block and if there is a verifier in the block, remove the link
//    and put the images in imagesWithoutAnnotator
//  if the user is a verifier, remove the verifierId field of the block,
//    remove the links with that verifier

// delete the user from users

// delete projects[projectId] for the user
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
