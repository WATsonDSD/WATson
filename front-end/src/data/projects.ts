import { v4 as uuid } from 'uuid';

import {
  UserID,
  Worker,
  updateUser,
  findUserById,
  ProjectsDB,
  Project,
  ProjectID,
  ImageID,
  ImagesDB,
  ImageData,
  findImageById,
  Block,
  findBlockOfProject,
  nonWrappedImagesDB,
  getAllUsers,
  // LandmarkSpecification,
} from '.';

import { FetchingError } from '../utils/errors';

import { calculateTotalCost, totalHoursOfWork } from './financier';

export async function findProjectById(id: ProjectID): Promise<Project & {_id: string, _rev: string}> {
  return ProjectsDB.get(id);
}
/**
 * Finds and returns all projects of a user.
 */
export async function getProjectsOfUser(userID: UserID): Promise<Project[]> {
  const user: Worker = await findUserById(userID);

  return new Promise((resolve, reject) => {
    ProjectsDB.allDocs({
      include_docs: true,
      keys: Object.keys(user.projects),
    }).then((response) => {
      resolve(response.rows.filter((row) => row.doc !== undefined).map((row) => row.doc!));
    }).catch(() => {
      reject(new FetchingError('We could not fetch the projects as requested.'));
    });
  });
}

/**
 * Creates a new `Project`.
 * @returns The newly created project's `id`, determined by the backend.
 */
export async function createProject(project: Project, images: any) : Promise<ProjectID> {
  const projectToCreate: Project = project;

  projectToCreate._id = uuid();

  await ProjectsDB
    .put(projectToCreate)
    .catch((error) => {
      console.log('We could not create the project');
      console.log(error);
    });

  await nonWrappedImagesDB.bulkDocs(images)
    .catch((error) => { throw error; });

  await Promise.all(project.users.map(async (userID) => {
    const updatedUser = await findUserById(userID);

    updateUser(
      {
        ...updatedUser,
        projects: {
          ...updatedUser.projects,
          [project._id]: {
            toAnnotate: [],
            waitingForAnnotation: [],
            annotated: [],
            toVerify: [],
            waitingForVerification: [],
            verified: [],
          },
        },
      },
    );
  }));

  return projectToCreate._id;
}

/**
 * Fetches all the project registered on the application
 */
export async function getAllProjects(): Promise<Project[]> {
  let projects: Project[] = [];
  return new Promise((resolve, reject) => {
    ProjectsDB.allDocs({
      include_docs: true,
    }).then((response) => {
      if (response) {
        projects = response.rows.map((row: any) => row.doc);
      }
      resolve(projects);
    }).catch((error) => {
      reject(error);
    });
  });
}

export async function statisticsInformation(): Promise<[number, number, number, number, number, number, number, number]> {
  const projects = await getAllProjects();
  console.log('number of projects', projects.length);
  console.log(projects);
  const users = await getAllUsers();
  const totalNumberOfProjects = projects.length;
  const numberOfActiveProjects = (projects.filter((project) => project.status === 'active'));
  let totalSpendings = 0;
  let totalHours = 0;
  let averageProjectSpendings = 0;
  let averageProjectHours = 0;
  let averageProjectWorkers = 0;
  if (totalNumberOfProjects !== 0) {
    await Promise.all(Object.entries(projects).map(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
      async ([key, value]) => {
        const cost = await calculateTotalCost(value._id);
        totalSpendings += cost[0];
        const hours = await totalHoursOfWork(value._id);
        totalHours += hours[0];
      },
    ));
    averageProjectSpendings = totalSpendings / totalNumberOfProjects;
    averageProjectHours = totalHours / totalNumberOfProjects;
  }
  averageProjectWorkers = users.length / totalNumberOfProjects;

  return [totalNumberOfProjects, numberOfActiveProjects.length, totalSpendings, +totalHours.toFixed(2), (users.length), +averageProjectSpendings.toFixed(2), +averageProjectHours.toFixed(2), +averageProjectWorkers.toFixed(2)];
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
          await deleteImageFromProject(projectID, imageID);
        },
      );
      Object.entries(value.block.toVerify).forEach(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        async ([key, imageID]) => {
          await deleteImageFromProject(projectID, imageID);
        },
      );
    },
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  await Promise.all(Object.entries(project.images.done).map(async ([key, image]) => {
    await deleteImageFromProject(projectID, image.imageId);
  }));
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  await Promise.all(Object.entries(project.images.imagesWithoutAnnotator).map(async ([key, imageId]) => {
    await deleteImageFromProject(projectID, imageId);
  }));

  // Fetches the users of this project
  const users: Worker[] = await Promise.all(project.users.map((userID) => findUserById(userID)));

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

  if (!project.users.includes(userId)) {
    project.users.push(userId);
  }

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
  const project = await findProjectById(projectId);
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
      if (block.block.idAnnotator === userId) { // if user is an annotator
        if (block.block.idVerifier) {
          // remove the link annotator-verifier
          const index = project.annVer.findIndex((anVe) => anVe.annotatorId === userId && anVe.verifierId === block.block.idVerifier);
          project.annVer.splice(index, 1);

          // put the toAnnotate images in imagesWithoutAnnotator and remove them from the block
          project.images.imagesWithoutAnnotator.push(...block.block.toAnnotate);
          // eslint-disable-next-line no-param-reassign
          block.block.toAnnotate = [];

          // delete idAnnotator from the block
          // eslint-disable-next-line no-param-reassign
          block.block.idAnnotator = undefined;

          // reflect changes in the db
          // await ProjectsDB.put(project);
          await updateBlock(block.block, projectId);
          // await updateUser(verifier);
        } else {
          // if verifier not assigned, remove the block and put all the images in the block in imagesWithoutAnnotator
          // put the images in imagesWithoutAnnotator
          project.images.imagesWithoutAnnotator.push(...block.block.toAnnotate);
          // remove the block from the project 
          delete project.images.blocks[block.block.blockId];
          // await ProjectsDB.put(project);
        }
        // remove idAnnotator from images
        await Promise.all(Object.entries(block.block.toAnnotate).map(
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          async ([key, imId]) => {
            const image = await findImageById(imId);
            image.idAnnotator = undefined;
            await ImagesDB.put(image);
          },
        ));
      } else if (block.block.idVerifier === userId) { // if the user is a verifier
        // remove idVerifier from images
        await Promise.all(Object.entries(block.block.toAnnotate).map(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
          async ([key, imId]) => {
            const image = await findImageById(imId);
            image.idVerifier = undefined;
            await ImagesDB.put(image);
          },
        ));

        await Promise.all(Object.entries(block.block.toVerify).map(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
          async ([key, imId]) => {
            const image = await findImageById(imId);
            image.idVerifier = undefined;
            await ImagesDB.put(image);
          },
        ));
        if (block.block.idAnnotator) { // if the annotator is linked
        // remove the pair annotator-verifier
          const index = project.annVer.findIndex((anVe) => anVe.annotatorId === block.block.idAnnotator && anVe.verifierId === user._id);
          project.annVer.splice(index, 1);
          // remove the verifier id from the block
          // eslint-disable-next-line no-param-reassign
          block.block.idVerifier = undefined;
          // await updateBlock(block.block, projectId);
        } else { // if the annotator is not linked
          delete project.images.blocks[block.block.blockId];
          // await ProjectsDB.put(project);
        }
      }
    },
  ));
  const project2 = await findProjectById(projectId);
  const userIdex = project2.users.findIndex((user) => user === userId);
  project2.users.splice(userIdex, 1);
  await ProjectsDB.put(project2);
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

  let csvContent = 'landmark,x,y,z,image\n';
  let control = 0;
  // landmarks: #,x,y,z,imageid
  for (let i = 0; i < project.images.done.length; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    const im = await findImageById(project.images.done[i].imageId);
    const landmarks = Object.keys(im!.annotation as Object);
    // eslint-disable-next-line no-loop-func
    for (let j = 0; j < landmarks.length; j += 1) {
    // landmarks.forEach((number) => {
      const nr = landmarks[j] as unknown as number;
      const { annotation } = im!;
      csvContent += nr;
      csvContent += ',';
      csvContent += annotation![nr].x;
      csvContent += ',';
      csvContent += annotation![nr].y;
      csvContent += ',';
      csvContent += annotation![nr].z;
      csvContent += ',';
      csvContent += im.id;
      csvContent += '\n';
    }
    control += 1;
    console.log('Done landmarks');
  }

  if (control === project.images.done.length) {
    const anchor = document.createElement('a');
    anchor.href = `data:text/csv;charset=utf-8,${encodeURIComponent(csvContent)}`;
    anchor.target = '_blank';
    anchor.download = 'landmarkData.csv';
    anchor.click();
  }
  project.status = 'closed';
  await ProjectsDB.put(project);
}

/**
 * modifies parameters of projects that are not passed as undefined
 */
export async function modifyProject(
  projectId: ProjectID,
  name: string|undefined,
  client: string|undefined,
  pricePerImageAnnotation: number|undefined,
  pricePerImageVerification: number|undefined,
  hourlyRateAnnotation: number|undefined,
  hourlyRateVerification: number|undefined,
): Promise<void> {
  const project = await findProjectById(projectId);
  if (name) {
    project.name = name;
  }
  if (client) {
    project.client = client;
  }
  if (pricePerImageAnnotation) {
    project.pricePerImageAnnotation = pricePerImageAnnotation;
  }
  if (pricePerImageVerification) {
    project.pricePerImageVerification = pricePerImageVerification;
  }
  if (hourlyRateAnnotation) {
    project.hourlyRateAnnotation = hourlyRateAnnotation;
  }
  if (hourlyRateVerification) {
    project.hourlyRateVerification = hourlyRateVerification;
  }

  await ProjectsDB.put(project);
}
