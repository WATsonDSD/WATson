import {
  addImageToProject, Annotation, createProject, createUser, ImageID, ProjectID, UserID, addUserToProject, findUserById,
} from '.';
import {
  calculateTotalCost, totalAnnotationMade, totalWorkers,
} from './financier';
import {
  saveAnnotation, assignAnnotatorToImage,
} from './images';

jest.mock('axios', () => ({ post: async () => true }));
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

const imageData1 = new Blob(['Hello, world!'], { type: 'text/plain' });
const imageData2 = new Blob(['Hello, world!'], { type: 'text/plain' });
const imageData3 = new Blob(['Hello, world!'], { type: 'text/plain' });

describe('addinf first', () => {
  let imageId1: ImageID;
  let imageId2: ImageID;
  let imageId3: ImageID;
  let projectId: ProjectID;
  let userId: UserID;
  let userId2: UserID;
  beforeAll(async () => {
    projectId = await createProject('Test Project', 'Spongebob', [0, 3, 27], {
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
