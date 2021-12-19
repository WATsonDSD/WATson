import {
  addImageToProject, Annotation, createProject, createUser, ImageID, ProjectID, UserID, addUserToProject, findProjectById, findUserById,
} from '.';
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
  it('moves the image in waitingForAnnotation for the verifier', () => expect(getImagesOfUser(projectId, 'waitingForAnnotation', verifierId).then((images) => images.findIndex((image) => image.id === imageId))).resolves.toBeGreaterThanOrEqual(0));
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
    const day = now.getDay().toString();
    expect(project.workDoneInTime[year][month][day]).toContainEqual({ imageId, annotator: annotatorId, verifier: verifierId });
    expect(annotator.workDoneInTime[year][month][day][projectId].annotated).toContain(imageId);
    expect(verifier.workDoneInTime[year][month][day][projectId].verified).toContain(imageId);
  });
});
