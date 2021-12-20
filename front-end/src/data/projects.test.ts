import {
  addImageToProject,
  addUserToProject,
  createProject, createUser, findProjectById, findUserById, ImageID, ProjectID, UserID,
} from '.';

import { findImageById } from './images';

jest.mock('./databases');

const startDate: Date = new Date(2021, 4, 4, 17, 23, 42, 11);
const endDate: Date = new Date(2022, 4, 4, 17, 23, 42, 11);

test('Can find created project', async () => {
  const id = await createProject('Test Project', 'The Flintstones', [], startDate, endDate, {
    pricePerImageAnnotation: 10, pricePerImageVerification: 23, hourlyRateAnnotation: 23, hourlyRateVerification: 56,
  });
  const name = findProjectById(id).then((project) => project.name);
  return expect(name).resolves.toBe('Test Project');
});

describe('addUserToProject', () => {
  let userId: UserID;
  let projectId: ProjectID;
  beforeAll(async () => {
    userId = await createUser('User 1', 'user1@watson.com', 'annotator');
    projectId = await createProject('Project 1', 'Client 1', [], startDate, endDate, {
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
    projectId = await createProject('Test Project', 'Dr. Doofenschmirtz', [], startDate, endDate, {
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
