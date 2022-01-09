import {
  addImageToProject, addUserToProject, Annotation, calculatePercentageWorkerProgressForProject, createAnnotatorVerifierLink, createProject, createUser, findUserById, ImageID, ProjectID, UserID,
} from '.';
import { assignImagesToAnnotator, saveAnnotation } from './images';
import { acceptAnnotation } from './verification';

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
let imageId4: ImageID;
let imageId5: ImageID;
let projectId: ProjectID;
let userId: UserID;
let userId2: UserID;
let userId3: UserID;
let userIdF: UserID;
let userIdPM: UserID;

jest.mock('./databases');

test('Can find created user', async () => {
  const id = await createUser('Cem Cebeci', 'cem@watson.com', 'annotator');
  const name = findUserById(id).then((user) => user.name);
  return expect(name).resolves.toBe('Cem Cebeci');
});

describe('calculate workers progress', () => {
  beforeAll(async () => {
    projectId = await createProject('Test Project', 'Spongebob', [0, 3, 27], startDate, endDate, {
      pricePerImageAnnotation: 10, pricePerImageVerification: 23, hourlyRateAnnotation: 4, hourlyRateVerification: 8,
    });
    imageId1 = await addImageToProject(imageData1, projectId);
    imageId2 = await addImageToProject(imageData2, projectId);
    imageId3 = await addImageToProject(imageData3, projectId);
    imageId4 = await addImageToProject(imageData3, projectId);
    imageId5 = await addImageToProject(imageData3, projectId);
    // 
    userId = await createUser('Laura', 'laura@watson', 'annotator');
    userId2 = await createUser('Cem', 'cem@watson', 'verifier');
    userId3 = await createUser('Ari', 'ari@watson', 'annotator');
    userIdF = await createUser('financ', 'finance@watson', 'finance');
    userIdPM = await createUser('pm', 'pm@watson', 'projectManager');
    await addUserToProject(userId, projectId);
    await addUserToProject(userId2, projectId);
    await addUserToProject(userId3, projectId);
    await addUserToProject(userIdF, projectId);
    await addUserToProject(userIdPM, projectId);
    await assignImagesToAnnotator(3, userId, projectId);
    await assignImagesToAnnotator(2, userId3, projectId);
    await saveAnnotation(validAnnotation, imageId1, projectId);
    await saveAnnotation(validAnnotation, imageId2, projectId);
    await saveAnnotation(validAnnotation, imageId3, projectId);
    await saveAnnotation(validAnnotation, imageId4, projectId);
    await saveAnnotation(validAnnotation, imageId5, projectId);
    await createAnnotatorVerifierLink(projectId, userId, userId2);
    await createAnnotatorVerifierLink(projectId, userId3, userId2);
    await acceptAnnotation(projectId, imageId1);
    await acceptAnnotation(projectId, imageId2);
    await acceptAnnotation(projectId, imageId3);
  });

  it('progress',
    () => expect(calculatePercentageWorkerProgressForProject(userId, projectId)).resolves.toBe(100));
  it('progress',
    () => expect(calculatePercentageWorkerProgressForProject(userId3, projectId)).resolves.toBe(0));
  it('progress', () => expect(acceptAnnotation(projectId, imageId5).then(() => calculatePercentageWorkerProgressForProject(userId3, projectId))).resolves.toBe(50));
});
