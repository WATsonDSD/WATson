import {
  DBDocument,
  User,
  updateUser,
  Project,
  ProjectID,
  ProjectsDB,
  Image,
  ImageID,
  ImagesDB,
  updateBlock,
  findBlockOfProject,
  getUsersOfProject,
  removeImageFromUser,
} from '.';

import { FetchingError, UpdateError } from '../utils/errors';

export async function findProjectById(id: ProjectID): Promise<DBDocument<Project>> {
  return ProjectsDB.get(id);
}

/**
 * Finds and returns all projects of a user.
 */
export async function getProjectsOfUser(user: DBDocument<User>): Promise<DBDocument<Project>[]> {
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
 * Creates a new project.
 */
export async function createProject(project: Project): Promise<void> {
  // const project = {
  //   _id: id,
  //   id,
  //   workers: [], // A newly created project has no users.
  //   name,
  //   client,
  //   startDate: new Date().toJSON(),
  //   endDate: '',
  //   status: 'pending', // A newly created project starts as pending if startDate is > of date at moment of creation.
  //   landmarks,
  //   pricePerImageAnnotation: financialModel.pricePerImageAnnotation,
  //   pricePerImageVerification: financialModel.pricePerImageVerification,
  //   hourlyRateAnnotation: financialModel.hourlyRateAnnotation,
  //   hourlyRateVerification: financialModel.hourlyRateVerification,
  //   linkedWorkers: [],
  //   timedWork: {},
  //   images: {
  //     blocks: {},
  //     pendingAssignment: [],
  //     done: [],
  //   }, // A newly created project has no images.

  // } as Project & {_id: string};

  return new Promise((resolve) => {
    ProjectsDB.put(project)
      .then(() => resolve())
      .catch(() => new UpdateError('The project could not be created as requested.'));
  });
}

export async function updateProject(project: DBDocument<Project>): Promise<void> {
  return new Promise((resolve) => {
    ProjectsDB.put(project)
      .then(() => resolve())
      .catch(() => new UpdateError('The project could not be updated as requested.'));
  });
}

/**
 * Deletes a project:
 * it deletes the images from the database, 
 * remove the projects[projectId] field from all the users, and 
 * remove the project from the database
 * notice that it does not remove the project from the workDoneInTime since 
 * the user will be paid for images already done
 */
export async function deleteProject(project: DBDocument<Project>): Promise<void> {
  const images : ImageID[] = [
    ...Object.values(project.images.blocks).map((value) => [
      ...value.block.assignedAnnotations,
      ...value.block.assignedVerifications,
    ]).flat(),
    ...project.images.done.map((image) => image.imageID),
    ...project.images.pendingAssignments,
  ];

  const imagesToDelete = await ImagesDB.allDocs({
    include_docs: true,
    keys: images,
  });

  // Deletes all the images from the images database
  await ImagesDB.bulkDocs(
    imagesToDelete.rows
      .filter((row) => row.doc !== undefined)
      .map((row) => ({ ...row.doc!, _deleted: true })),
  );

  await Promise.all(imagesToDelete.rows.filter((row) => row.doc !== undefined).map(async (row) => {
    await removeImageFromProject(project, row.doc!, false);
  }));

  // Fetches the users of this project
  const users: DBDocument<User>[] = await getUsersOfProject(project);

  // Removes the project from the list of projects of each user
  await Promise.all(users.map(async (user) => {
    const updatedUser = user;
    delete updatedUser.projects[project._id];

    return updateUser(updatedUser);
  }));

  // Removes the project from ProjectsDB
  // await ProjectsDB.get(project._id).then((project) => ProjectsDB.remove(project));
  await ProjectsDB.remove(project);
}

/**
 * Adds the user (whatever the role) to the project.  
 * If they are an annotator or a verifier, this
 * function will not assign them any image.
 */
export async function addUserToProject(user: DBDocument<User>, project: DBDocument<Project>): Promise<void> {
  return new Promise((resolve, reject) => {
    if (user.projects[project._id]) resolve();

    const updatedUser: DBDocument<User> = user;
    const updatedProject: DBDocument<Project> = project;

    updatedProject.workers = [...project.workers, user._id];

    updatedUser.projects[project._id] = {
      assignedAnnotations: [],
      rejectedAnnotations: [],
      assignedVerifications: [],
      pendingVerifications: [],

      annotated: [],
      verified: [],
    };

    ProjectsDB.put(updatedProject)
      .then(() => {
        updateUser(updatedUser)
          .then(() => resolve())
          .catch(() => reject(new UpdateError('The project could not be added to the user\'s project list.')));
      })
      .catch(() => reject(new UpdateError('The project could not be updated as requested.')));
  });
}

export async function addUsersToProject(users: DBDocument<User>[], project: DBDocument<Project>): Promise<void> {
  return new Promise((resolve, reject) => {
    const updatedProject: DBDocument<Project> = project;

    updatedProject.workers = [
      ...project.workers,
      ...users
        .map((user) => user._id)
        .filter((userID) => !project.workers.includes(userID)),
    ];

    const updatedUsers: DBDocument<User>[] = users.map((user) => ({
      ...user,
      projects: {
        ...user.projects,
        [project._id]: {
          assignedAnnotations: [],
          rejectedAnnotations: [],
          assignedVerifications: [],
          pendingVerifications: [],

          annotated: [],
          verified: [],
        },
      },
    }));

    ProjectsDB.put(updatedProject)
      .then(() => {
        Promise.all(updatedUsers.map((user) => updateUser(user)))
          .then(() => resolve())
          .catch(() => reject(new UpdateError('The project could not be added to the user\'s project list.')));
      })
      .catch(() => reject(new UpdateError('The project could not be updated as requested.')));
  });
}

async function removePendingImageFromProject(project: DBDocument<Project>, image: DBDocument<Image>, updateProject: boolean = true): Promise <void> {
  const updatedProject: DBDocument<Project> = project;
  const updatedAssignments = project.images.pendingAssignments.filter((id) => id !== image._id);

  updatedProject.images.pendingAssignments = updatedAssignments;

  if (updateProject) await ProjectsDB.put(updatedProject);
}

async function removeDoneImageFromProject(project: DBDocument<Project>, image: DBDocument<Image>, updateProject: boolean = true): Promise <void> {
  const updatedProject: DBDocument<Project> = project;
  const updatedAssignments = project.images.done.filter((img) => img.imageID !== image._id);

  updatedProject.images.done = updatedAssignments;

  if (updateProject) await ProjectsDB.put(updatedProject);
}

/**
 * Deletes an image that has never been annotated and/or verified.
 */
async function removeNewImageFromProject(project: DBDocument<Project>, image: DBDocument<Image>, updateProject: boolean = true): Promise<void> {
  if (image.annotatorID) await removeImageFromUser(image.annotatorID, image._id, project._id);
  if (image.verifierID) await removeImageFromUser(image.verifierID, image._id, project._id);

  // Image is part of a block, so we remove it
  if (image.blockID) {
    const block = await findBlockOfProject(image.blockID, project);
    if (!block) throw Error('the block does not exist');

    const imageIndexBlock = block.assignedAnnotations.findIndex((id) => id === image._id);
    block.assignedAnnotations.splice(imageIndexBlock, 1);
    await updateBlock(block, project);
  }

  // Image is not assigned yet, so we remove it from the pending annotations
  await removePendingImageFromProject(project, image, updateProject);
}

/**
 * Deletes an image from a project.
 * Notice that this function throws an error if the image is in
 * progress, since it is possible to remove only new and done images.
 */
export async function removeImageFromProject(project: DBDocument<Project>, image: DBDocument<Image>, updateProject: boolean = true): Promise<void> {
  if (image.annotation) throw new UpdateError('The image cannot be removed from the project while an annotation is in progress!');

  if (project.images.done.find((img) => img.imageID === image._id)) {
    await removeDoneImageFromProject(project, image, updateProject);
  } else {
    await removeNewImageFromProject(project, image, updateProject);
  }
}

/** 
export async function removeUserFromProject(projectId: ProjectID, userId: UserID): Promise<void> {
  const project = await findProjectById(projectId);
  const user = await findUserById(userId);

  Object.entries(project.images.blocks).forEach(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async ([key, block]) => {
      const myBlock = await findBlockOfProject(projectId, block.block.blockId);
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
          await updateBlock(myBlock, projectId);
          // await updateUser(verifier);
          await ProjectsDB.put(project);
          console.log('ciao');
        } else {
          // if verifier not assigned, remove the block and put all the images in the block in imagesWithoutAnnotator
          // put the images in imagesWithoutAnnotator
          project.images.imagesWithoutAnnotator.push(...myBlock.toAnnotate);
          // remove the block from the project 
          delete project.images.blocks[myBlock.blockId];
          await ProjectsDB.put(project);
        }
        // remove idAnnotator from images
        Object.entries(myBlock.toAnnotate).forEach(
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          async ([key, imId]) => {
            const image = await findImageById(imId);
            image.idAnnotator = undefined;
            await ImagesDB.put(image);
          },
        );
      } else if (block.block.idVerifier === userId) { // if the user is a verifier
        // remove idVerifier from images
        Object.entries(myBlock.toAnnotate).forEach(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
          async ([key, imId]) => {
            const image = await findImageById(imId);
            image.idVerifier = undefined;
            await ImagesDB.put(image);
          },
        );

        Object.entries(myBlock.toVerify).forEach(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
          async ([key, imId]) => {
            const image = await findImageById(imId);
            image.idVerifier = undefined;
            await ImagesDB.put(image);
          },
        );
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
  );
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
*/
