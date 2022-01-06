import {
  addImageToProject, Annotation, createProject, createUser, ImageID, ProjectID, UserID, addUserToProject, findUserById, createAnnotatorVerifierLink,
} from '.';
import {
  calculateTotalCost, dataChartProjects, dataChartWorker, earningsInTotalPerProjectPerUser, hoursWorkPerProjectPerUser, hoursWorkPerUser, percentageOfImagesDone, totalAnnotationMade, totalHoursOfWork, totalWorkers,
} from './financier';
import {
  assignImagesToAnnotator,
  saveAnnotation,
} from './images';
import { acceptAnnotation } from './verification';

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
const imageData4 = new Blob(['Heldfsgsfglo, world!'], { type: 'text/plain' });
let imageId1: ImageID;
let imageId2: ImageID;
let imageId3: ImageID;
let imageId4: ImageID;
let projectId: ProjectID;
let annotatorId: UserID;
let verifierId: UserID;
let annotatorId2: UserID;
let userId: UserID;
let userId2: UserID;
let userId3: UserID;
let userIdF: UserID;
let userIdPM: UserID;

describe('adding annotation', () => {
  beforeAll(async () => {
    projectId = await createProject('Test Project', 'Spongebob', [0, 3, 27], startDate, endDate, {
      pricePerImageAnnotation: 10, pricePerImageVerification: 23, hourlyRateAnnotation: 23, hourlyRateVerification: 56,
    });
    imageId1 = await addImageToProject(imageData1, projectId);
    imageId2 = await addImageToProject(imageData2, projectId);
    imageId3 = await addImageToProject(imageData3, projectId);
    annotatorId = await createUser('Laura', 'laura@watson', 'annotator');
    verifierId = await createUser('Cem', 'cem@watson', 'verifier');
    await addUserToProject(annotatorId, projectId);
    await addUserToProject(verifierId, projectId);
    await assignImagesToAnnotator(3, annotatorId, projectId);
    userId = await createUser('Laura', 'laura@watson', 'annotator');
    userId2 = await createUser('Cem', 'cem@watson', 'verifier');
    userIdF = await createUser('financ', 'finance@watson', 'finance');
    userIdPM = await createUser('pm', 'pm@watson', 'projectManager');
    await addUserToProject(userIdF, projectId);
    await addUserToProject(userIdPM, projectId);
    await addUserToProject(userId, projectId);
    await addUserToProject(userId2, projectId);
    await saveAnnotation(validAnnotation, imageId1, projectId);
    await saveAnnotation(validAnnotation, imageId2, projectId);
    await saveAnnotation(validAnnotation, imageId3, projectId);
  });

  it('number of images in annotated is 3',
    () => expect(findUserById(annotatorId).then((user) => user.projects[projectId].waitingForVerification.length)).resolves.toBe(3));

  test('total cost of the project', () => calculateTotalCost(projectId).then((data) => {
    expect(data[0]).toBe(0);
  }));

  test('number of total annotation made in a project', () => totalAnnotationMade(projectId).then((data) => {
    expect(data).toBe(0);
  }));

  test('number of total workers in a project', () => totalWorkers(projectId).then((data) => {
    expect(data).toBe(4);
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
    annotatorId = await createUser('Laura', 'laura@watson', 'annotator');
    verifierId = await createUser('Cem', 'cem@watson', 'verifier');
    annotatorId2 = await createUser('Ari', 'ari@watson', 'annotator');
    await addUserToProject(annotatorId, projectId);
    await addUserToProject(verifierId, projectId);
    await addUserToProject(annotatorId2, projectId);
    await assignImagesToAnnotator(3, annotatorId, projectId);
    // await assignImagesToAnnotator(2, annotatorId2, projectId);
    userId = await createUser('Laura', 'laura@watson', 'annotator');
    userId2 = await createUser('Cem', 'cem@watson', 'verifier');
    userId3 = await createUser('Ari', 'ari@watson', 'annotator');
    userIdF = await createUser('financ', 'finance@watson', 'finance');
    userIdPM = await createUser('pm', 'pm@watson', 'projectManager');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    imageId4 = await addImageToProject(imageData4, projectId);
    await addUserToProject(userId, projectId);
    await addUserToProject(userId2, projectId);
    await addUserToProject(userId3, projectId);
    await addUserToProject(userIdF, projectId);
    await addUserToProject(userIdPM, projectId);
    await saveAnnotation(validAnnotation, imageId1, projectId);
    await saveAnnotation(validAnnotation, imageId2, projectId);
    await saveAnnotation(validAnnotation, imageId3, projectId);
    await createAnnotatorVerifierLink(projectId, annotatorId, verifierId);
    await createAnnotatorVerifierLink(projectId, annotatorId2, verifierId);
    await acceptAnnotation(projectId, imageId1);
    await acceptAnnotation(projectId, imageId2);
    await acceptAnnotation(projectId, imageId3);
  });

  it('number images waiting for verification',
    () => expect(findUserById(annotatorId2).then((user) => user.projects[projectId].waitingForVerification.length)).resolves.toBe(0));

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
    expect(data).toBe(6);
  }));
  // 30/4 + 23*3/8-> 7,5 + 8,625
  test('total hours of work in total ', () => totalHoursOfWork(projectId).then((data) => {
    expect(data[0]).toBe(16.125);
  }));
  test('total hours of work per annotating', () => totalHoursOfWork(projectId).then((data) => {
    expect(data[1]).toBe(7.5);
  }));
  test('chart december', () => dataChartWorker(userId).then((data) => {
    expect(data[11]).toBe(0);
  }));
  test('chart january', () => dataChartWorker(userId).then((data) => {
    console.log(data);
    expect(data[0]).toBe(30);
  }));
  test('hours work', () => hoursWorkPerProjectPerUser(annotatorId, projectId).then((data) => {
    expect(data).toBe(7.5);
  }));
  test('hours work', () => hoursWorkPerProjectPerUser(verifierId, projectId).then((data) => {
    expect(data).toBe(8.625);
  }));
  test('earnings verifier', () => earningsInTotalPerProjectPerUser(verifierId, projectId).then((data) => {
    expect(data).toBe(69);
  }));
  test('chart project', () => dataChartProjects(projectId).then((data) => {
    expect(data[0]).toBe(99);
  }));
  test('percentage', () => percentageOfImagesDone(projectId).then((data) => {
    expect(data).toBe(0.75);
  }));
  test('total hours of work of an user', () => hoursWorkPerUser(userId).then((data) => {
    expect(data).toBe(7.5);
  }));
});
