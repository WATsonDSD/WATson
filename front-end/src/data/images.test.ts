import {
  addImageToProject, Annotation, createProject, createUser, ImageID, ProjectID, UserID, addUserToProject, findUserById,
} from '.';
import {
  findImageById, saveAnnotation, assignVerifierToImage, assignAnnotatorToImage, getImagesOfUser,
} from './images';

jest.mock('axios', () => ({ post: async () => true }));
jest.mock('./databases');

const validAnnotation = {
  0: { x: 1, y: 2, z: 3 },
  3: { x: 1, y: 2, z: 3 },
  27: { x: 1, y: 2, z: 3 },
} as Annotation;
const invalidAnnotation = {
  0: { x: 1, y: 2, z: 3 },
  3: { x: 1, y: 2, z: 3 },
} as Annotation;

const imageData = new Blob(['Hello, world!'], { type: 'text/plain' });

describe('addAnnotation', () => {
  let imageId: ImageID;
  let projectId: ProjectID;
  let userId: UserID;
  beforeAll(async () => {
    projectId = await createProject('Test Project', 'Spongebob', [0, 3, 27]);
    imageId = await addImageToProject(imageData, projectId);
    userId = await createUser('Laura', 'laura@watson', 'annotator');
    await addUserToProject(userId, projectId);
    await assignAnnotatorToImage(imageId, userId, projectId);
    return saveAnnotation(validAnnotation, imageId, projectId);
  });

  it('adds the annotation to the image', () => expect(findImageById(imageId).then((image) => image.annotation)).resolves.toBeDefined());

  it('removes the image from toAnnotate', () => expect(getImagesOfUser(projectId, 'toAnnotate', userId).then((images) => images.findIndex((image) => image.id === imageId)))
    .resolves.toBe(-1));

  it('adds the image to waitingForVerification', () => expect(getImagesOfUser(projectId, 'waitingForVerification', userId).then((images) => images.findIndex((image) => image.id === imageId))).resolves.toBeGreaterThanOrEqual(0));

  it('reject invalid annotations', () => {
    expect(saveAnnotation(invalidAnnotation, imageId, projectId)).rejects.toThrow();
  });

  it('find image by id for view', () => expect(findImageById(imageId).then((imageView) => imageView.data === imageData)).resolves.toBe(true));
});

describe('assignVerifierToImage', () => {
  let imageId: ImageID;
  let projectId: ProjectID;
  let verifierId: UserID;
  let annotatorId: UserID;
  let annotatedImageId: ImageID;
  beforeAll(async () => {
    projectId = await createProject('Test Project', 'Spongebob', [0, 3, 27]);
    imageId = await addImageToProject(imageData, projectId);
    annotatedImageId = await addImageToProject(imageData, projectId);
    verifierId = await createUser('Bob', 'bob@verifier.com', 'verifier');
    annotatorId = await createUser('Bob', 'bobby@verifier.com', 'annotator');
    await addUserToProject(annotatorId, projectId);
    await addUserToProject(verifierId, projectId);
    await assignAnnotatorToImage(imageId, annotatorId, projectId);
    await assignAnnotatorToImage(annotatedImageId, annotatorId, projectId);
    await saveAnnotation(validAnnotation, annotatedImageId, projectId);
    await assignVerifierToImage(annotatedImageId, verifierId, projectId);
    return assignVerifierToImage(imageId, verifierId, projectId);
  });

  it('add the image to the waitingForAnnotation field of the user', () => expect(findUserById(verifierId).then((verif) => verif.projects[projectId].waitingForAnnotation.includes(imageId))).resolves.toBe(true));

  it('add the user id in the verifierId field of the image', () => expect(findImageById(imageId).then((image) => image.idVerifier === verifierId)).resolves.toBe(true));

  it('if the image is already annotated, moves the image to the toVerify filed', () => expect(findUserById(verifierId).then((verif) => verif.projects[projectId].toVerify.includes(annotatedImageId))).resolves.toBe(true));
  it('if the image is already annotated, does not put the image to the waitingForAnnotation filed', () => expect(findUserById(verifierId)
    .then((verif) => verif.projects[projectId].waitingForAnnotation.includes(annotatedImageId))).resolves.toBe(false));
});
