import {
  addImageToProject, Annotation, createProject, createUser, ImageID, ProjectID, UserID, addUserToProject, findUserById,
} from '.';
import {
  findImageById, getImages, saveAnnotation, assignVerifierToImage,
} from './images';

jest.mock('axios', () => ({ post: async () => true }));
jest.mock('./databases');

const imageData = new Blob(['Hello, world!'], { type: 'text/plain' });

describe('addAnnotation', () => {
  let imageId: ImageID;
  let projectId: ProjectID;
  const validAnnotation = {
    0: { x: 1, y: 2, z: 3 },
    3: { x: 1, y: 2, z: 3 },
    27: { x: 1, y: 2, z: 3 },
  } as Annotation;
  const invalidAnnotation = {
    0: { x: 1, y: 2, z: 3 },
    3: { x: 1, y: 2, z: 3 },
  } as Annotation;
  beforeAll(async () => {
    projectId = await createProject('Test Project', 'Spongebob', [0, 3, 27], {
      pricePerImageAnnotation: 10, pricePerImageVerification: 23, hourlyRateAnnotation: 23, hourlyRateVerification: 56,
    });
    imageId = await addImageToProject(imageData, projectId);
    return saveAnnotation(validAnnotation, imageId, projectId);
  });

  it('adds the annotation to the image', () => expect(findImageById(imageId).then((image) => image.annotation)).resolves.toBeDefined());

  it('removes the image from toAnnotate', () => expect(getImages(projectId, 'toAnnotate').then((images) => images.findIndex((image) => image.id === imageId)))
    .resolves.toBe(-1));

  it('adds the image to toVerify', () => expect(getImages(projectId, 'toVerify').then((images) => images.findIndex((image) => image.id === imageId))).resolves.toBeGreaterThanOrEqual(0));

  it('reject invalid annotations', () => {
    expect(saveAnnotation(invalidAnnotation, imageId, projectId)).rejects.toThrow();
  });

  it('find image by id for view', () => expect(findImageById(imageId).then((imageView) => imageView.data === imageData)).resolves.toBe(true));
});

describe('assignVerifierToImage', () => {
  let imageId: ImageID;
  let projectId: ProjectID;
  let verifierId: UserID;
  beforeAll(async () => {
    projectId = await createProject('Test Project', 'Spongebob', [0, 3, 27], {
      pricePerImageAnnotation: 10, pricePerImageVerification: 23, hourlyRateAnnotation: 23, hourlyRateVerification: 56,
    });
    imageId = await addImageToProject(imageData, projectId);
    verifierId = await createUser('Bob', 'bob@verifier.com', 'verifier');
    addUserToProject(verifierId, projectId);
    return assignVerifierToImage(imageId, verifierId, projectId);
  });

  it('add the image to the toVerify field of the user', () => expect(findUserById(verifierId).then((verif) => verif.projects[projectId].toVerify.includes(imageId))).resolves.toBe(true));

  it('add the user id in the verifierId field of the image', () => expect(findImageById(imageId).then((image) => image.idVerifier === verifierId)).resolves.toBe(true));
});
