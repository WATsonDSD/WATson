import {
  addImageToProject, Annotation, createProject, createUser, ImageID, ProjectID, UserID, addUserToProject, Rejection, createAnnotatorVerifierLink,
} from '.';
import {
  saveAnnotation, assignImagesToAnnotator,
} from './images';
import { getAllRejections, getRejectedImagesByAnnotatorID } from './rejectedAnnotation';

import { rejectAnnotation } from './verification';

jest.mock('./databases');

const imageData = new Blob(['Hello, world!'], { type: 'text/plain' });
const imageData2 = new Blob(['Hello!'], { type: 'text/plain' });
const imageData3 = new Blob(['Hellorsdfg!'], { type: 'text/plain' });
const startDate: Date = new Date(2021, 4, 4, 17, 23, 42, 11);
const endDate: Date = new Date(2022, 4, 4, 17, 23, 42, 11);

const annotation = {
  0: { x: 1, y: 2, z: 3 },
  3: { x: 1, y: 2, z: 3 },
  27: { x: 1, y: 2, z: 3 },
} as Annotation;

const annotation2 = {
  0: { x: 2, y: 3, z: 4 },
  3: { x: 1, y: 2, z: 3 },
  27: { x: 1, y: 2, z: 3 },
} as Annotation;

const annotation3 = {
  0: { x: 2, y: 3, z: 4 },
  3: { x: 1, y: 2, z: 3 },
  27: { x: 1, y: 2, z: 3 },
} as Annotation;

describe('get rejected images', () => {
  let imageId: ImageID;
  let image2Id: ImageID;
  let image3Id: ImageID;
  let projectId: ProjectID;
  let annotatorId: UserID;
  let annotator2Id: UserID;
  let verifierId: UserID;
  let rejections: string[];
  let rejections2: string[];
  let allRejections: Rejection[];
  const expectedRejectionsId: ImageID[] = [];
  const expectedRejections2Id: ImageID[] = [];
  const allExpectedRejectionsId: ImageID[] = [];
  // annotatorID has imageId and image3id
  // annotator2ID has image2Id
  beforeAll(async () => {
    projectId = await createProject('Test Project', 'Spongebob', [0, 3, 27], startDate, endDate, {
      pricePerImageAnnotation: 10, pricePerImageVerification: 23, hourlyRateAnnotation: 23, hourlyRateVerification: 56,
    });
    imageId = await addImageToProject(imageData, projectId);
    image2Id = await addImageToProject(imageData2, projectId);
    image3Id = await addImageToProject(imageData3, projectId);
    annotatorId = await createUser('Laura', 'laura@watson', 'annotator');
    annotator2Id = await createUser('Arianna', 'arianna@watson', 'annotator');
    verifierId = await createUser('Cem', 'cem@watson', 'verifier');
    await addUserToProject(annotatorId, projectId);
    await addUserToProject(annotator2Id, projectId);
    await addUserToProject(verifierId, projectId);
    await assignImagesToAnnotator(1, annotatorId, projectId);
    await assignImagesToAnnotator(2, annotator2Id, projectId);
    await createAnnotatorVerifierLink(projectId, annotatorId, verifierId);
    await saveAnnotation(annotation, imageId, projectId);
    await saveAnnotation(annotation2, image2Id, projectId);
    await saveAnnotation(annotation3, image3Id, projectId);
    await createAnnotatorVerifierLink(projectId, annotator2Id, verifierId);
    await rejectAnnotation(imageId, projectId, 'redo!!');
    await rejectAnnotation(image2Id, projectId, 'redoooooo!!');
    await rejectAnnotation(image3Id, projectId, 'redooooo!');
    expectedRejectionsId.push(imageId);
    expectedRejections2Id.push(image2Id);
    expectedRejections2Id.push(image3Id);
    allExpectedRejectionsId.push(imageId);
    allExpectedRejectionsId.push(image2Id);
    allExpectedRejectionsId.push(image3Id);
    rejections = await getRejectedImagesByAnnotatorID(annotatorId);
    rejections2 = await getRejectedImagesByAnnotatorID(annotator2Id);
    allRejections = await getAllRejections();
  });

  it('returns all the imageId of the rejected images', () => {
    const arraysMatch = (arr1: string[], arr2: string[]) => {
      if (arr1.length !== arr2.length) return false;
      for (let i = 0; i < arr1.length; i += 1) {
        if (arr1[i] !== arr2[i]) return false;
      }
      return true;
    };

    expect(arraysMatch(allRejections.map((rej) => rej.imageID), allExpectedRejectionsId)).toBe(true);
  });

  it('returns all the rejected imageId of AnnotatorId', () => {
    const arraysMatch = (arr1: string[], arr2: string[]) => {
      if (arr1.length !== arr2.length) return false;
      for (let i = 0; i < arr1.length; i += 1) {
        if (arr1[i] !== arr2[i]) return false;
      }
      return true;
    };
    expect(arraysMatch(rejections, expectedRejectionsId)).toBe(true);
  });

  it('returns all the rejected imageId of Annotator2Id', () => {
    const arraysMatch = (arr1: string[], arr2: string[]) => {
      if (arr1.length !== arr2.length) return false;
      for (let i = 0; i < arr1.length; i += 1) {
        if (arr1[i] !== arr2[i]) return false;
      }
      return true;
    };
    expect(arraysMatch(rejections2, expectedRejections2Id)).toBe(true);
  });
});
