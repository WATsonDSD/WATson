import {
  addImageToProject, Annotation, createProject, createUser, ImageID, ProjectID, UserID, addUserToProject, findUserById,
} from '.';
import {
  calculateTotalCost, dataChartWorker, earningsInTotalPerProjectPerUser, hoursWorkPerProjectPerUser, totalAnnotationMade, totalHoursOfWork, totalWorkers,
} from './financier';
import {
  saveAnnotation, assignAnnotatorToImage, assignVerifierToImage,
} from './images';
import { verifyImage } from './verification';

jest.mock('./databases');

const validAnnotation = {
  0: { x: 1, y: 2, z: 3 },
  3: { x: 1, y: 2, z: 3 },
  27: { x: 1, y: 2, z: 3 },
} as Annotation;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const invalidAnnotation = {
  0: { x: 1, y: 2, z: 3 },
  3: { x: 1, y: 2, z: 3 },
} as Annotation;

const startDate: Date = new Date(2021, 4, 4, 17, 23, 42, 11);
const endDate: Date = new Date(2022, 4, 4, 17, 23, 42, 11);
const imageData1 = new Blob(['Hello, world!'], { type: 'text/plain' });
const imageData2 = new Blob(['Hello, world!'], { type: 'text/plain' });
const imageData3 = new Blob(['Hello, world!'], { type: 'text/plain' });
let imageId1: ImageID;
let imageId2: ImageID;
let imageId3: ImageID;
let projectId: ProjectID;
let userId: UserID;
let userId2: UserID;
let userId3: UserID;

describe('adding annotation', () => {
  beforeAll(async () => {
    projectId = await createProject('Test Project', 'Spongebob', [0, 3, 27], startDate, endDate, {
      pricePerImageAnnotation: 10, pricePerImageVerification: 23, hourlyRateAnnotation: 23, hourlyRateVerification: 56,
    });
    imageId1 = await addImageToProject(imageData1, projectId);
    imageId2 = await addImageToProject(imageData2, projectId);
    imageId3 = await addImageToProject(imageData3, projectId);
    userId = await createUser('Laura', 'laura@watson', 'annotator');
    userId2 = await createUser('Cem', 'cem@watson', 'verifier');
    await addUserToProject(userId, projectId);
    await addUserToProject(userId2, projectId);
    await assignAnnotatorToImage(imageId1, userId, projectId);
    await assignAnnotatorToImage(imageId2, userId, projectId);
    await assignAnnotatorToImage(imageId3, userId, projectId);
    await saveAnnotation(validAnnotation, imageId1, projectId);
    await saveAnnotation(validAnnotation, imageId2, projectId);
    await saveAnnotation(validAnnotation, imageId3, projectId);
  });

  it('number of images in annotated is 3',
    () => expect(findUserById(userId).then((user) => user.projects[projectId].waitingForVerification.length)).resolves.toBe(3));

  test('total cost of the project', () => calculateTotalCost(projectId).then((data) => {
    expect(data[0]).toBe(0);
  }));

  test('number of total annotation made in a project', () => totalAnnotationMade(projectId).then((data) => {
    expect(data).toBe(0);
  }));

  test('number of total workers in a project', () => totalWorkers(projectId).then((data) => {
    expect(data).toBe(2);
  }));
});

describe('adding verification', () => {
  beforeAll(async () => {
    projectId = await createProject('Test Project', 'Spongebob', [0, 3, 27], startDate, endDate, {
      pricePerImageAnnotation: 10, pricePerImageVerification: 23, hourlyRateAnnotation: 4, hourlyRateVerification: 8,
    });
    imageId1 = await addImageToProject(imageData1, projectId);
    imageId2 = await addImageToProject(imageData2, projectId);
    imageId3 = await addImageToProject(imageData3, projectId);
    userId = await createUser('Laura', 'laura@watson', 'annotator');
    userId2 = await createUser('Cem', 'cem@watson', 'verifier');
    userId3 = await createUser('Ari', 'ari@watson', 'annotator');
    await addUserToProject(userId, projectId);
    await addUserToProject(userId2, projectId);
    await addUserToProject(userId3, projectId);
    await assignAnnotatorToImage(imageId1, userId, projectId);
    await assignAnnotatorToImage(imageId2, userId, projectId);
    await assignAnnotatorToImage(imageId3, userId, projectId);
    await saveAnnotation(validAnnotation, imageId1, projectId);
    await saveAnnotation(validAnnotation, imageId2, projectId);
    await saveAnnotation(validAnnotation, imageId3, projectId);
    await assignVerifierToImage(imageId2, userId2, projectId);
    await assignVerifierToImage(imageId1, userId2, projectId);
    await assignVerifierToImage(imageId3, userId2, projectId);
    await verifyImage(projectId, imageId1);
    await verifyImage(projectId, imageId2);
    await verifyImage(projectId, imageId3);
  });

  it('number of images in annotated is 3',
    () => expect(findUserById(userId).then((user) => user.projects[projectId].waitingForVerification.length)).resolves.toBe(0));

  // 3 images annotated + 3 images verified 30 + 23*3 
  test('total cost of the project', () => calculateTotalCost(projectId).then((data) => {
    expect(data[0]).toBe(99);
  }));

  test('total cost of annotation for the project', () => calculateTotalCost(projectId).then((data) => {
    expect(data[1]).toBe(30);
  }));

  test('total cost of verification for the project', () => calculateTotalCost(projectId).then((data) => {
    expect(data[2]).toBe(69);
  }));

  test('number of total workers in a project', () => totalWorkers(projectId).then((data) => {
    expect(data).toBe(3);
  }));
  // 30/4 + 23*3/8-> 7,5 + 8,625
  test('total hours of work in total ', () => totalHoursOfWork(projectId).then((data) => {
    expect(data[0]).toBe(16.125);
  }));
  test('total hours of work per annotating', () => totalHoursOfWork(projectId).then((data) => {
    expect(data[1]).toBe(7.5);
  }));
  test('chart december', () => dataChartWorker(userId).then((data) => {
    expect(data[11]).toBe(30);
  }));
  test('chart january', () => dataChartWorker(userId).then((data) => {
    expect(data[0]).toBe(0);
  }));
  test('hours work', () => hoursWorkPerProjectPerUser(userId, projectId).then((data) => {
    expect(data).toBe(7.5);
  }));
  test('hours work', () => hoursWorkPerProjectPerUser(userId2, projectId).then((data) => {
    expect(data).toBe(8.625);
  }));
  test('earnings verifier', () => earningsInTotalPerProjectPerUser(userId2, projectId).then((data) => {
    expect(data).toBe(69);
  }));
});
