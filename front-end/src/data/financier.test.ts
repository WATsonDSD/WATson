/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ImageID, ProjectID, Annotation, createProject, addImageToProject, createUser, findUserById,
} from '.';
import { saveAnnotation } from './images';

jest.mock('axios', () => ({ post: async () => true }));
jest.mock('./databases');

const imageData1 = new Blob(['Hello, world!'], { type: 'text/plain' });
const imageData2 = new Blob(['Hello, world!'], { type: 'text/plain' });
const AnnotatorId = createUser('Cem Cebeci', 'cem@watson.com', 'annotator');
// const FinanceId = createUser('Laura', 'laura@watson.com', 'finance');
const projectId = createProject('Test Project', 'Spongebob', [0, 3, 27], {
  pricePerImageAnnotation: 10, pricePerImageVerification: 23, hourlyRateAnnotation: 23, hourlyRateVerification: 56,
});

const validAnnotation = {
  0: { x: 1, y: 2, z: 3 },
  3: { x: 1, y: 2, z: 3 },
  27: { x: 1, y: 2, z: 3 },
} as Annotation;
const invalidAnnotation = {
  0: { x: 1, y: 2, z: 3 },
  3: { x: 1, y: 2, z: 3 },
} as Annotation;

describe('addAnnotation', () => {
  let imageId1: ImageID;
  let imageId2: ImageID;
  let imageId3: ImageID;
  let projectId: ProjectID;

  beforeAll(async () => {
    imageId1 = await addImageToProject(imageData1, projectId);
    imageId2 = await addImageToProject(imageData2, projectId);
    imageId3 = await addImageToProject(imageData2, projectId);
    saveAnnotation(validAnnotation, imageId1, projectId);
    saveAnnotation(validAnnotation, imageId2, projectId);
    saveAnnotation(validAnnotation, imageId3, projectId);
    const AnnotatorId = createUser('Cem Cebeci', 'cem@watson.com', 'annotator');
  });
});

test('Can find created user', async () => {
  const id = await createUser('Cem Cebeci', 'cem@watson.com', 'annotator');
  const name = findUserById(id).then((user) => user.name);
  return expect(name).resolves.toBe('Cem Cebeci');
});
