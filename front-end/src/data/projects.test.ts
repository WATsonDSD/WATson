/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  addImageToProject,
  addUserToProject,
  Annotation,
  BlockID,
  changeProjectName,
  closeProject,
  createAnnotatorVerifierLink,
  createProject, createUser, findBlockOfProject, findProjectById, findUserById, getAllProjects, ImageID, ProjectID, removeUserFromProject, statisticsInformation, UserID,
} from '.';

import { assignImagesToAnnotator, findImageById, saveAnnotation } from './images';
import { acceptAnnotation, rejectAnnotation } from './verification';

jest.mock('./databases');

const imageData = new Blob(['Hello, world!'], { type: 'text/plain' });
const imageData2 = new Blob(['Grandi Laura e Arianna!!!!'], { type: 'text/plain' });
const imageData3 = new Blob(['we have sprint planning'], { type: 'text/plain' });
const startDate: Date = new Date(2021, 4, 4, 17, 23, 42, 11);
const endDate: Date = new Date(2022, 4, 4, 17, 23, 42, 11);
let BlockId: BlockID;

const annotation = {
  0: { x: 1, y: 2, z: 3 },
  3: { x: 1, y: 2, z: 3 },
  27: { x: 1, y: 2, z: 3 },
} as Annotation;

test('Can find created project', async () => {
  const id = await createProject('Project 7', 'The Flintstones', [], startDate, endDate, {
    pricePerImageAnnotation: 10, pricePerImageVerification: 23, hourlyRateAnnotation: 23, hourlyRateVerification: 56,
  });
  const name = findProjectById(id).then((project) => project.name);
  return expect(name).resolves.toBe('Project 7');
});

describe('addUserToProject', () => {
  let userId: UserID;
  let projectId: ProjectID;
  beforeAll(async () => {
    userId = await createUser('User 1', 'user1@watson.com', 'annotator');
    projectId = await createProject('Project 6', 'Client 1', [], startDate, endDate, {
      pricePerImageAnnotation: 10, pricePerImageVerification: 23, hourlyRateAnnotation: 23, hourlyRateVerification: 56,
    });
    await addUserToProject(userId, projectId);
  });

  it('modifies user state', async () => expect(findUserById(userId).then((user) => user.projects[projectId]))
    .resolves.toBeDefined);

  it('modifies project state', async () => expect(findProjectById(projectId).then((project) => project.users))
    .resolves.toContain(userId));

  it('cant be done twice', async () => expect(addUserToProject(userId, projectId)).rejects.toThrow());
});

describe('addImageToProject', () => {
  let projectId: ProjectID;
  let imageId: ImageID;

  beforeAll(async () => {
    projectId = await createProject('Project 5', 'Dr. Doofenschmirtz', [], startDate, endDate, {
      pricePerImageAnnotation: 10, pricePerImageVerification: 23, hourlyRateAnnotation: 23, hourlyRateVerification: 56,
    });
    imageId = await addImageToProject(new Blob(['Hello, world!'], { type: 'text/plain' }), projectId);
  });

  test('creates the image', async () => {
    const imageToTest = (findImageById(imageId).then((image) => image.id));
    return expect(imageToTest).resolves.toBe(imageId);
  });

  /*
  it('adds the image to the project to be assigned an annotator', async () => expect(getImagesOfProject(projectId, 'needsAnnotatorAssignment')
    .then((images) => images.findIndex((image) => image.id === imageId))).resolves.toBeGreaterThanOrEqual(0));
    */
});

describe('remove user correctly,', () => {
  let userId: UserID;
  let imageId: ImageID;
  let imageId2: ImageID;
  let imageId3: ImageID;
  let verifierId: UserID;
  let annotatorId2: UserID;
  let projectId: ProjectID;
  let projectId2: ProjectID;
  beforeAll(async () => {
    userId = await createUser('User 1', 'user1@watson.com', 'annotator');
    annotatorId2 = await createUser('User 2', 'user2@watson.com', 'annotator');
    verifierId = await createUser('User 3', 'user3@watson.com', 'verifier');
    projectId = await createProject('Project 3', 'Client 1', [], startDate, endDate, {
      pricePerImageAnnotation: 10, pricePerImageVerification: 23, hourlyRateAnnotation: 23, hourlyRateVerification: 56,
    });
    projectId2 = await createProject('Project 4', 'Client 1', [], startDate, endDate, {
      pricePerImageAnnotation: 10, pricePerImageVerification: 23, hourlyRateAnnotation: 23, hourlyRateVerification: 56,
    });
    imageId = await addImageToProject(imageData, projectId);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    imageId2 = await addImageToProject(imageData2, projectId);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    imageId3 = await addImageToProject(imageData3, projectId);
    await addUserToProject(userId, projectId);
    await addUserToProject(verifierId, projectId);
    await addUserToProject(annotatorId2, projectId);
    await addUserToProject(annotatorId2, projectId2);
    // se link prima di Save -> no idVerifier
    // se link dopo save -> no block 
    await createAnnotatorVerifierLink(projectId, userId, verifierId);
    await createAnnotatorVerifierLink(projectId, annotatorId2, verifierId);
    await assignImagesToAnnotator(1, userId, projectId);
    await assignImagesToAnnotator(2, annotatorId2, projectId);
    await saveAnnotation(annotation, imageId, projectId); // one annotated
    await saveAnnotation(annotation, imageId2, projectId); // one rejected
    await acceptAnnotation(projectId, imageId);
    await rejectAnnotation(imageId2, projectId, 'nah');
    await removeUserFromProject(projectId, userId);
  });
  it('couple annVer no more exists in project', async () => expect(findProjectById(projectId).then((proj) => proj.annVer.filter((x) => x.annotatorId === userId && x.verifierId === verifierId).length)).resolves.toBe(0));

  it('block returns correctly', async () => expect(findBlockOfProject(BlockId, projectId).then((block) => block?.blockId === BlockId)).resolves.toBe(true));

  it('modifies user state', async () => expect(findUserById(userId).then((user) => user.projects)).resolves.not.toContain(projectId));

  it('doesnt contain user anymore', async () => expect(findProjectById(projectId).then((project) => project.users)).resolves.not.toContain(userId));

  it('closed project', async () => expect(closeProject(projectId).then(() => findProjectById(projectId).then((project) => project.status === 'closed'))).resolves.toBe(true));

  it('change project name', async () => expect(changeProjectName(projectId, 'lauretta').then(() => findProjectById(projectId).then((project) => project.name === 'lauretta'))).resolves.toBe(true));
});

describe('statistics numbers', () => {
  let userId: UserID;
  let imageId: ImageID;
  let imageId2: ImageID;
  let imageId3: ImageID;
  let verifierId: UserID;
  let annotatorId2: UserID;
  let projectId: ProjectID;
  let projectIdtoClose: ProjectID;
  beforeAll(async () => {
    projectId = await createProject('Project 1', 'Client 1', [], startDate, endDate, {
      pricePerImageAnnotation: 10, pricePerImageVerification: 20, hourlyRateAnnotation: 100, hourlyRateVerification: 200,
    });
    projectIdtoClose = await createProject('Project 2', 'Client 1', [], startDate, endDate, {
      pricePerImageAnnotation: 15, pricePerImageVerification: 25, hourlyRateAnnotation: 60, hourlyRateVerification: 75,
    });
    const projects = await getAllProjects();
    // console.log(projects);
    const statistics = await statisticsInformation();
    // console.log(statistics);
    await closeProject(projectIdtoClose);
  });
  // totalSpendings, totalHours, users.length);
  it('n umber of projects', () => statisticsInformation().then((data) => {
    expect(data[0]).toBe(7);
  }));
  it('number of active projects', () => statisticsInformation().then((data) => {
    expect(data[1]).toBe(5);
  }));
  it('total Spendings', () => statisticsInformation().then((data) => {
    expect(data[2]).toBe(33);
  }));
  it('numer of users', () => statisticsInformation().then((data) => {
    expect(data[4]).toBe(4);
  }));
});
