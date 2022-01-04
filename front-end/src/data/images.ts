import { v4 as uuid } from 'uuid';

import {
  DBDocument,
  User,
  UserID,
  getUsers,
  updateUser,
  findUserById,
  Image,
  ImageID,
  ImagesDB,
  ImageData,
  Landmark,
  Annotation,
  Project,
  ProjectID,
  ProjectsDB,
  findUserBlockFromProject,
  updateBlock,
} from '.';

import { FetchingError, UpdateError } from '../utils/errors';

export async function findImageById(imageID: ImageID): Promise<DBDocument<Image>> {
  return ImagesDB.get(imageID, { attachments: true, binary: true });
}

export async function getImages(images: ImageID[]): Promise<DBDocument<Image>[]> {
  return new Promise((resolve, reject) => {
    ImagesDB.allDocs({
      include_docs: true,
      attachments: true,
      binary: true,
      keys: images,
    }).then((response) => {
      resolve(response.rows.filter((row) => row.doc !== undefined).map((row) => row.doc!));
    }).catch(() => {
      reject(new FetchingError('We could not fetch the images as requested.'));
    });
  });
}

/**
 * Assigns an id to the image with the given
 * `ImageData` and adds it to the project.
 */
export async function addImageToProject(data: ImageData, project: DBDocument<Project>): Promise<ImageID> {
  const updatedProject: DBDocument<Project> = project;

  const image: Image & { _id: string } = {
    _id: uuid(),
    _attachments: {
      image: {
        content_type: 'image/jpeg',
        data,
      },
    },
  };

  updatedProject.images.pendingAssignments.push(image._id);

  await ImagesDB.put(image)
    .catch(() => {
      throw new UpdateError('The image could not be created.');
    });

  await ProjectsDB.put(updatedProject)
    .catch(() => {
      throw new UpdateError('The image could not be added to the project.');
    });

  return image._id;
}

export function numberOfImagesInProject(project: DBDocument<Project>): number {
  let numberOfImages = project.images.pendingAssignments.length + project.images.done.length;

  Object.values(project.images.blocks).forEach((block) => {
    numberOfImages += block.assignedAnnotations.length + block.assignedVerifications.length;
  });

  return numberOfImages;
}

/**
 * Finds and returns images with the given `status` in a given `project`.
 * If the `user` parameter is specified, returns images assigned to that `User` only.
 */
export async function getImagesOfUserFromProject(
  user: DBDocument<User>,
  projectID: ProjectID,
  status: 'assignedAnnotations' | 'rejectedAnnotations' | 'annotated' | 'assignedVerifications' | 'pendingVerifications' | 'verified',
): Promise<DBDocument<Image>[]> {
  const keys: ImageID[] = (status === 'verified' || status === 'annotated')
    ? user.projects[projectID][status].map((image) => image.imageID)
    : user.projects[projectID][status];

  return getImages(keys);
}

/**
 * @returns the images of the project without annotator
 */
export async function getPendingImagesFromProject(project: DBDocument<Project>): Promise<DBDocument<Image>[]> {
  return getImages(project.images.pendingAssignments);
}

/**
 * @returns the number of images of the project without annotator
 */
export function getNumberOfPendingImagesFromProject(project: DBDocument<Project>): number {
  return project.images.pendingAssignments.length;
}

/**
 * @returns all the users of the project
 */
export async function getUnlinkedAnnotators(project: DBDocument<Project>): Promise<DBDocument<User>[]> {
  const linkedAnnotators : UserID[] = project.linkedWorkers.map((worker) => worker.annotatorID);
  const unlinkedAnnotators: UserID[] = project.workers.filter((worker) => !linkedAnnotators.includes(worker));

  return getUsers(unlinkedAnnotators);
}

/**
 * Determines whether `annotation` is valid for the `specification`. 
 */
export function fitsSpecification(annotation: Annotation, specification: Landmark[]): boolean {
  return specification.every((landmark) => annotation[landmark]);
}

/**
 * Saves the annotation and associates it with the image.
 * Also moves the image from 'toAnnotate' to 'toVerify'.
 * @param annotation Has to be complete and has to match the project's `LandmarkSpecification`.
 * @param imageID The image the annotation will be associated to.
 * @param projectId The project that includes the image.
 */
export async function saveAnnotation(annotation: Annotation, image: DBDocument<Image>, project: DBDocument<Project>): Promise<void> {
  if (!fitsSpecification(annotation, project.landmarks)) throw new UpdateError("The annotation does not fit the project's specification.");
  if (!image.annotatorID) throw new UpdateError('The image has no annotator, therefore the annotation cannot be saved.');

  const updatedImage: DBDocument<Image> = image;

  // Saves the annotation
  updatedImage.annotation = annotation;

  // Move image from assignedAnnotations to pendingVerifications for the annotator
  const annotator: DBDocument<User> = await findUserById(image.annotatorID);

  const block = findUserBlockFromProject(project, annotator._id);

  if (!block) throw new UpdateError('The annotation could not be saved. The target block does not exist.');

  annotator.projects[project._id].pendingVerifications.push(image._id);
  annotator.projects[project._id].assignedAnnotations = annotator.projects[project._id].assignedAnnotations.filter((imageID) => imageID !== image._id);

  // if there is a verifier, move the image to the toVerify field.
  if (image.verifierID) {
    const verifier: DBDocument<User> = await findUserById(image.verifierID);

    verifier.projects[project._id].assignedVerifications.push(image._id);
    verifier.projects[project._id].rejectedAnnotations = verifier.projects[project._id].rejectedAnnotations.filter((imageID) => imageID !== image._id);

    await updateUser(verifier);
  }

  // move the image from toAnnotate to toVerify in the block
  block.assignedVerifications.push(image._id);
  block.assignedAnnotations = block.assignedAnnotations.filter((imageID) => imageID !== image._id);

  // reflect the changes to the DB.
  await updateUser(annotator);
  await updateBlock(block, project);
  await ImagesDB.put(updatedImage);
}

export async function deleteImage(imageId: ImageID): Promise <void> {
  ImagesDB.get(imageId).then((image) => ImagesDB.remove(image));
}
