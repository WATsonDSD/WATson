import {
  addImageToProject, Annotation, createProject, createUser, ImageID, ProjectID, UserID, addUserToProject, findUserById, createAnnotatorVerifierLink,
} from '.';
import {
  findImageById, saveAnnotation, getImagesOfUser, assignImagesToAnnotator,
} from './images';

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
const startDate: Date = new Date(2021, 4, 4, 17, 23, 42, 11);
const endDate: Date = new Date(2022, 4, 4, 17, 23, 42, 11);

describe('addAnnotation', () => {
  let imageId: ImageID;
  let projectId: ProjectID;
  let userId: UserID;
  beforeAll(async () => {
    projectId = await createProject('Test Project', 'Spongebob', [0, 3, 27], startDate, endDate, {
      pricePerImageAnnotation: 10, pricePerImageVerification: 23, hourlyRateAnnotation: 23, hourlyRateVerification: 56,
    });
    await addImageToProject(imageData, projectId);
    await addImageToProject(imageData, projectId);
    imageId = await addImageToProject(imageData, projectId);
    userId = await createUser('Laura', 'laura@watson', 'annotator');
    await addUserToProject(userId, projectId);
    await assignImagesToAnnotator(3, userId, projectId);
    // add test on block 
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
  // let annotatedImageId: ImageID;
  beforeAll(async () => {
    projectId = await createProject('Test Project', 'Spongebob', [0, 3, 27], startDate, endDate, {
      pricePerImageAnnotation: 10, pricePerImageVerification: 23, hourlyRateAnnotation: 23, hourlyRateVerification: 56,
    });
    imageId = await addImageToProject(imageData, projectId);
    await addImageToProject(imageData, projectId);
    verifierId = await createUser('Bob', 'bob@verifier.com', 'verifier');
    annotatorId = await createUser('Bobby', 'bobby@annotator.com', 'annotator');
    await addUserToProject(annotatorId, projectId);
    await addUserToProject(verifierId, projectId);
    await createAnnotatorVerifierLink(projectId, annotatorId, verifierId);
    // check lenght of images 
    await assignImagesToAnnotator(2, annotatorId, projectId);
    // await saveAnnotation(validAnnotation, annotatedImageId, projectId);
  }); rejectedAnnotation;

  it('add the image to the waitingForAnnotation field of the user', () => expect(findUserById(verifierId).then((verif) => verif.projects[projectId].waitingForAnnotation.includes(imageId))).resolves.toBe(true));

  it('add the user id in the verifierId field of the image', () => expect(findImageById(imageId).then((image) => image.verifierID === verifierId)).resolves.toBe(true));
});
rejectedAnnotation;
describe('save Annotation ', () => {
  let imageId: ImageID;
  let projectId: ProjectID;
  let verifierId: UserID;
  let annotatorId: UserID;
  let annotatedImageId: ImageID;
  beforeAll(async () => {
    projectId = await createProject('Test Project', 'Spongebob', [0, 3, 27], startDate, endDate, {
      pricePerImageAnnotation: 10, pricePerImageVerification: 23, hourlyRateAnnotation: 23, hourlyRateVerification: 56,
    });
    imageId = await addImageToProject(imageData, projectId);
    annotatedImageId = await addImageToProject(imageData, projectId);
    verifierId = await createUser('Bob', 'bob@verifier.com', 'verifier');
    annotatorId = await createUser('Bobby', 'bobby@annotator.com', 'annotator');
    await addUserToProject(annotatorId, projectId);
    await addUserToProject(verifierId, projectId);
    await createAnnotatorVerifierLink(projectId, annotatorId, verifierId);
    // check lenght of images 
    await assignImagesToAnnotator(2, annotatorId, projectId);
    await saveAnnotation(validAnnotation, imageId, projectId);
  });

  it('add the image to the toVerify field of the user', () => expect(findUserById(verifierId).then((verif) => verif.projects[projectId].assignedVerifications.includes(imageId))).resolves.toBe(true));

  it('add the user id in the verifierId field of the image', () => expect(findImageById(imageId).then((image) => image.verifierID === verifierId)).resolves.toBe(true));

  it('if the image is already annotated, does not put the image to the waitingForAnnotation filed', () => expect(findUserById(verifierId).then((verif) => verif.projects[projectId].waitingForAnnotation.includes(annotatedImageId))).resolves.toBe(false));
});
