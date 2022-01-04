import {
  addImageToProject, Annotation, createProject, createUser, ImageID, ProjectID, UserID, addUserToProject, findProjectById, findUserById, createWorkersLink, findBlockOfProject, BlockID,
} from '.';
import {
  saveAnnotation, getImagesOfUser, assignImagesToAnnotator, findImageById,
} from './images';

jest.mock('./databases');

const imageData = new Blob(['Hello, world!'], { type: 'text/plain' });
const imageData2 = new Blob(['Grandi Laura e Arianna!!!!'], { type: 'text/plain' });
const imageData3 = new Blob(['we have sprint planning'], { type: 'text/plain' });
const startDate: Date = new Date(2021, 4, 4, 17, 23, 42, 11);
const endDate: Date = new Date(2022, 4, 4, 17, 23, 42, 11);

const annotation = {
  0: { x: 1, y: 2, z: 3 },
  3: { x: 1, y: 2, z: 3 },
  27: { x: 1, y: 2, z: 3 },
} as Annotation;

describe('Accept annotated image', () => {
  let imageId: ImageID;
  let imageId2: ImageID;
  let imageId3: ImageID;
  let projectId: ProjectID;
  let annotatorId: UserID;
  let verifierId: UserID;
  let annotatorId2: UserID;
  let verifierId1: UserID;
  let annotatorId3: UserID;
  beforeAll(async () => {
    projectId = await createProject('Test Project', 'Spongebob', [0, 3, 27], startDate, endDate, {
      pricePerImageAnnotation: 10, pricePerImageVerification: 23, hourlyRateAnnotation: 23, hourlyRateVerification: 56,
    });
    imageId = await addImageToProject(imageData, projectId);
    imageId2 = await addImageToProject(imageData2, projectId);
    imageId3 = await addImageToProject(imageData3, projectId);
    annotatorId = await createUser('Laura', 'laura@watson', 'annotator');
    annotatorId2 = await createUser('Arianna', 'ari@watson', 'annotator');
    annotatorId3 = await createUser('Ramy', 'ramy@watson', 'annotator');
    verifierId = await createUser('Cem', 'cem@watson', 'verifier');
    verifierId1 = await createUser('Mateo', 'mateo@watson', 'verifier');

    await addUserToProject(annotatorId, projectId);
    await addUserToProject(verifierId, projectId);
    await addUserToProject(annotatorId2, projectId);
    await addUserToProject(annotatorId3, projectId);
    await addUserToProject(verifierId1, projectId);

    await assignImagesToAnnotator(1, annotatorId, projectId);
    await assignImagesToAnnotator(2, annotatorId2, projectId);
    await createWorkersLink(projectId, annotatorId, verifierId);
    await createWorkersLink(projectId, annotatorId2, verifierId);
    await createWorkersLink(projectId, annotatorId3, verifierId1);
  });
  it('annotator1 has ONE image in toAnnotate', () => expect(findUserById(annotatorId).then((annotator) => annotator.projects[projectId].assignedAnnotations.length)).resolves.toBe(1));
  it('annotator2 has TWO image in toAnnotate', () => expect(findUserById(annotatorId2).then((annotator) => annotator.projects[projectId].assignedAnnotations.length)).resolves.toBe(2));
  it('couple annVer exists in project', () => expect(findProjectById(projectId).then((proj) => proj.linkedWorkers.filter((x) => x.annotatorID === annotatorId && x.verifierID === verifierId).length)).resolves.toBe(1));
  it('verifier has the images in waitinfForAnnotation', () => expect(getImagesOfUser(projectId, 'waitingForAnnotation', verifierId).then((images) => images.findIndex((image) => image.id === imageId))).resolves.toBeGreaterThanOrEqual(0));
  it('couple annVer exists in project', () => expect(findProjectById(projectId).then((proj) => proj.linkedWorkers.filter((x) => x.annotatorID === annotatorId2 && x.verifierID === verifierId).length)).resolves.toBe(1));
  it('verifier has the images in waitinfForAnnotation', () => expect(getImagesOfUser(projectId, 'waitingForAnnotation', verifierId).then((images) => images.findIndex((image) => image.id === imageId2))).resolves.toBeGreaterThanOrEqual(0));
  it('verifier has the images in waitinfForAnnotation', () => expect(getImagesOfUser(projectId, 'waitingForAnnotation', verifierId).then((images) => images.findIndex((image) => image.id === imageId3))).resolves.toBeGreaterThanOrEqual(0));
  it('invalid link', () => {
    expect(createWorkersLink(projectId, annotatorId, verifierId1)).rejects.toThrow();
  });
});

describe('Accept annotated image', () => {
  let imageId3: ImageID;
  let imageId2: ImageID;
  let projectId: ProjectID;
  let annotatorId: UserID;
  let verifierId: UserID;
  let annotatorId2: UserID;
  let verifierId1: UserID;
  let annotatorId3: UserID;
  let blockId: BlockID;
  let blockId2: BlockID;
  beforeAll(async () => {
    projectId = await createProject('Test Project', 'Spongebob', [0, 3, 27], startDate, endDate, {
      pricePerImageAnnotation: 10, pricePerImageVerification: 23, hourlyRateAnnotation: 23, hourlyRateVerification: 56,
    });
    await addImageToProject(imageData, projectId);
    imageId2 = await addImageToProject(imageData2, projectId);
    imageId3 = await addImageToProject(imageData3, projectId);
    annotatorId = await createUser('Laura', 'laura@watson', 'annotator');
    annotatorId2 = await createUser('Arianna', 'ari@watson', 'annotator');
    annotatorId3 = await createUser('Ramy', 'ramy@watson', 'annotator');
    verifierId = await createUser('Cem', 'cem@watson', 'verifier');
    verifierId1 = await createUser('Mateo', 'mateo@watson', 'verifier');

    await addUserToProject(annotatorId, projectId);
    await addUserToProject(verifierId, projectId);
    await addUserToProject(annotatorId2, projectId);
    await addUserToProject(annotatorId3, projectId);
    await addUserToProject(verifierId1, projectId);

    blockId2 = await assignImagesToAnnotator(1, annotatorId, projectId); // imageId1 
    blockId = await assignImagesToAnnotator(2, annotatorId2, projectId); // imageId2, imageid3 
    await createWorkersLink(projectId, annotatorId, verifierId);
    await createWorkersLink(projectId, annotatorId3, verifierId1);
    await saveAnnotation(annotation, imageId2, projectId);
    await createWorkersLink(projectId, annotatorId2, verifierId1);
  });

  it('annotator has image in waitingForVerification', () => expect(getImagesOfUser(projectId, 'waitingForVerification', annotatorId2).then((images) => images.findIndex((image) => image.id === imageId2))).resolves.toBeGreaterThanOrEqual(0));
  it('annotator has One in waitingForVerification', () => expect(findUserById(annotatorId2).then((annotator) => annotator.projects[projectId].pendingVerifications.length)).resolves.toBe(1));
  it('verifier has image in toVerify', () => expect(getImagesOfUser(projectId, 'toVerify', verifierId1).then((images) => images.findIndex((image) => image.id === imageId2))).resolves.toBeGreaterThanOrEqual(0));
  it('block has image2 in toVerify', () => expect(findBlockOfProject(blockId, projectId).then((block) => block?.assignedVerifications.includes(imageId2))).resolves.toBe(true));
  it('block has image3 in toAnnotate', () => expect(findBlockOfProject(blockId, projectId).then((block) => block?.assignedAnnotations.includes(imageId3))).resolves.toBe(true));
  it('add the verifierd in the verifierId field of the image', () => expect(findImageById(imageId2).then((image) => image.verifierID === verifierId1)).resolves.toBe(true));
  it('add the verifierd in the verifierId field of the image', () => expect(findImageById(imageId3).then((image) => image.verifierID === verifierId1)).resolves.toBe(true));
  it('add the annotator in the annotatorId field of the image', () => expect(findImageById(imageId2).then((image) => image.annotatorID === annotatorId2)).resolves.toBe(true));
  it('add the annotator in the annotatorId field of the image', () => expect(findImageById(imageId3).then((image) => image.annotatorID === annotatorId2)).resolves.toBe(true));
  it('project has two blocks', () => expect(findProjectById(projectId).then((project) => (project.images.blocks[blockId]))).toBeDefined());
  it('project has two blocks', () => expect(findProjectById(projectId).then((project) => (project.images.blocks[blockId2]))).toBeDefined());
});
