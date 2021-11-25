import {
  addImageToProject,
  addUserToProject,
  createProject, createUser, findProjectById, findUserById, ImageID, ProjectID, UserID,
} from '.';
import { findImageById, getImages } from './images';

jest.mock('./databases');

test('Can find created project', async () => {
  const id = await createProject('Test Project', 'The Flintstones', []);
  const name = findProjectById(id).then((project) => project.name);
  return expect(name).resolves.toBe('Test Project');
});

describe('addUserToProject', () => {
  let userId: UserID;
  let projectId: ProjectID;
  beforeAll(async () => {
    userId = await createUser('User 1', 'user1@watson.com', 'annotator');
    projectId = await createProject('Project 1', 'Client 1', []);
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
    projectId = await createProject('Test Project', 'Dr. Doofenschmirtz', []);
    imageId = await addImageToProject(new Blob(['Hello, world!'], { type: 'text/plain' }), projectId);
  });

  it('creates the image', async () => expect(findImageById(imageId).then((image) => image.id)).resolves.toBe(imageId));

  it('adds the image to the project to be annotated', async () => expect(
    getImages(projectId, 'toAnnotate').then((images) => images.findIndex((image) => image.id === imageId)),
  ).resolves.toBeGreaterThanOrEqual(0));
});
