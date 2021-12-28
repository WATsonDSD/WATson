import {
  addImageToProject, Annotation, createProject, createUser, ImageID, ProjectID, UserID, addUserToProject, findProjectById, findUserById, getWorkDoneByUser,
} from '.';
import generateReport from './financier';
import {
  saveAnnotation, assignVerifierToImage, assignAnnotatorToImage, getImagesOfUser, findImageById,
} from './images';

import { rejectAnnotation, verifyImage } from './verification';

jest.mock('./databases');

const imageData = new Blob(['Hello, world!'], { type: 'text/plain' });
const startDate: Date = new Date(2021, 4, 4, 17, 23, 42, 11);
const endDate: Date = new Date(2022, 4, 4, 17, 23, 42, 11);

const annotation = {
  0: { x: 1, y: 2, z: 3 },
  3: { x: 1, y: 2, z: 3 },
  27: { x: 1, y: 2, z: 3 },
} as Annotation;

describe('reject annotation', () => {
  let imageId: ImageID;
  let projectId: ProjectID;
  let annotatorId: UserID;
  let verifierId: UserID;
  beforeAll(async () => {
    projectId = await createProject('Test Project', 'Spongebob', [0, 3, 27], startDate, endDate, {
      pricePerImageAnnotation: 10, pricePerImageVerification: 23, hourlyRateAnnotation: 23, hourlyRateVerification: 56,
    });
    imageId = await addImageToProject(imageData, projectId);
    annotatorId = await createUser('Laura', 'laura@watson', 'annotator');
    verifierId = await createUser('Cem', 'cem@watson', 'verifier');
    await addUserToProject(annotatorId, projectId);
    await addUserToProject(verifierId, projectId);
    await assignAnnotatorToImage(imageId, annotatorId, projectId);
    await saveAnnotation(annotation, imageId, projectId);
    await assignVerifierToImage(imageId, verifierId, projectId);
    return rejectAnnotation(imageId, projectId, 'redo!!');
  });

  it('moves the image in toAnnotate for the annotator', () => expect(getImagesOfUser(projectId, 'toAnnotate', annotatorId).then((images) => images.findIndex((image) => image.id === imageId))).resolves.toBeGreaterThanOrEqual(0));
  it('removes the image from waitingForVerification for the verifier', () => expect(getImagesOfUser(projectId, 'waitingForVerification', verifierId).then((images) => images.findIndex((image) => image.id === imageId))).resolves.toBeLessThan(0));

  it('moves the image in waitingForAnnotation for the verifier', () => expect(getImagesOfUser(projectId, 'waitingForAnnotation', verifierId).then((images) => images.findIndex((image) => image.id === imageId))).resolves.toBeGreaterThanOrEqual(0));
  it('removes the image from toVerify for the verifier', () => expect(getImagesOfUser(projectId, 'toVerify', verifierId).then((images) => images.findIndex((image) => image.id === imageId))).resolves.toBeLessThan(0));

  it('removes the annotation to the image', () => expect(findImageById(imageId).then((image) => image.annotation)).resolves.toBeUndefined());
});

describe('Accept annotated image', () => {
  let imageId: ImageID;
  let projectId: ProjectID;
  let annotatorId: UserID;
  let verifierId: UserID;
  beforeAll(async () => {
    projectId = await createProject('Test Project', 'Spongebob', [0, 3, 27], startDate, endDate, {
      pricePerImageAnnotation: 10, pricePerImageVerification: 23, hourlyRateAnnotation: 23, hourlyRateVerification: 56,
    });
    imageId = await addImageToProject(imageData, projectId);
    annotatorId = await createUser('Laura', 'laura@watson', 'annotator');
    verifierId = await createUser('Cem', 'cem@watson', 'verifier');
    await addUserToProject(annotatorId, projectId);
    await addUserToProject(verifierId, projectId);
    await assignAnnotatorToImage(imageId, annotatorId, projectId);
    await saveAnnotation(annotation, imageId, projectId);
    await assignVerifierToImage(imageId, verifierId, projectId);
    // const listOfUsers = await getAllUsers();
    return verifyImage(projectId, imageId);
  });

  it('moves the image in done for the project', () => expect(findProjectById(projectId).then((project) => project.images.done.findIndex((image) => image.imageId === imageId))).resolves.toBeGreaterThanOrEqual(0));
  it('moves the image in annotated for the annotator', () => expect(getImagesOfUser(projectId, 'annotated', annotatorId).then((images) => images.findIndex((image) => image.id === imageId))).resolves.toBeGreaterThanOrEqual(0));
  it('moves the image in verified for the verifier', () => expect(getImagesOfUser(projectId, 'verified', verifierId).then((images) => images.findIndex((image) => image.id === imageId))).resolves.toBeGreaterThanOrEqual(0));

  it('correctly modifies all workDoneInTime fields', async () => {
    const project = await findProjectById(projectId);
    const annotator = await findUserById(annotatorId);
    const verifier = await findUserById(verifierId);
    const now = new Date();
    const year = now.getFullYear().toString();
    const month = now.getMonth().toString();
    const day = now.getDate().toString();
    expect(project.workDoneInTime[year][month][day]).toContainEqual({ imageId, annotator: annotatorId, verifier: verifierId });
    expect(annotator.workDoneInTime[year][month][day][projectId].annotated).toContain(imageId);
    expect(verifier.workDoneInTime[year][month][day][projectId].verified).toContain(imageId);
    // exhaust inputs to getWorkDoneByUser
    expect(getWorkDoneByUser(annotatorId, { year })).resolves.toEqual({ annotation: 1, verification: 0 });
    expect(getWorkDoneByUser(annotatorId, { year, month })).resolves.toEqual({ annotation: 1, verification: 0 });
    expect(getWorkDoneByUser(annotatorId, { year, month, day })).resolves.toEqual({ annotation: 1, verification: 0 });
    expect(getWorkDoneByUser(annotatorId, { year }, projectId)).resolves.toEqual({ annotation: 1, verification: 0 });
    expect(getWorkDoneByUser(annotatorId, { year, month }, projectId)).resolves.toEqual({ annotation: 1, verification: 0 });
    expect(getWorkDoneByUser(annotatorId, { year, month, day }, projectId)).resolves.toEqual({ annotation: 1, verification: 0 });
    expect(getWorkDoneByUser(verifierId, { year })).resolves.toEqual({ annotation: 0, verification: 1 });
    expect(getWorkDoneByUser(verifierId, { year, month })).resolves.toEqual({ annotation: 0, verification: 1 });
    expect(getWorkDoneByUser(verifierId, { year, month, day })).resolves.toEqual({ annotation: 0, verification: 1 });
    expect(getWorkDoneByUser(verifierId, { year }, projectId)).resolves.toEqual({ annotation: 0, verification: 1 });
    expect(getWorkDoneByUser(verifierId, { year, month }, projectId)).resolves.toEqual({ annotation: 0, verification: 1 });
    expect(getWorkDoneByUser(verifierId, { year, month, day }, projectId)).resolves.toEqual({ annotation: 0, verification: 1 });
  });
});

describe('Accept annotated image', () => {
  let imageId: ImageID;
  let imageId2: ImageID;
  let projectId: ProjectID;
  let annotatorId: UserID;
  let verifierId: UserID;
  beforeAll(async () => {
    projectId = await createProject('Test Project', 'Spongebob', [0, 3, 27], startDate, endDate, {
      pricePerImageAnnotation: 10, pricePerImageVerification: 23, hourlyRateAnnotation: 23, hourlyRateVerification: 56,
    });
    imageId = await addImageToProject(imageData, projectId);
    imageId2 = await addImageToProject(imageData, projectId);
    annotatorId = await createUser('Laura', 'laura@watson', 'annotator');
    verifierId = await createUser('Cem', 'cem@watson', 'verifier');
    await addUserToProject(annotatorId, projectId);
    await addUserToProject(verifierId, projectId);
    await assignAnnotatorToImage(imageId, annotatorId, projectId);
    await assignAnnotatorToImage(imageId2, annotatorId, projectId);
    await saveAnnotation(annotation, imageId, projectId);
    await saveAnnotation(annotation, imageId, projectId);
    await assignVerifierToImage(imageId, verifierId, projectId);
    await assignVerifierToImage(imageId2, verifierId, projectId);
    // await verifyImage(projectId, imageId2);
    // const listOfUsers = await getAllUsers();
    await generateReport();
    await createUser('ramy', 'ramy@watson', 'annotator');
    return verifyImage(projectId, imageId);
  });

  it('moves the image in done for the project', () => expect(findProjectById(projectId).then((project) => project.images.done.findIndex((image) => image.imageId === imageId))).resolves.toBeGreaterThanOrEqual(0));
});
