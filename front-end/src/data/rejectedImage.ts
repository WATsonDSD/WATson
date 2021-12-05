import {
  Annotation, ImageID, RejectedAnnotation, RejectionID, UserID,
} from '.';
import { rejectionsDB } from './databases';

/**
 * Creates a new `RejectedImage`.
 * @returns The newly created rejection's `id`, determined by the backend.
 */
export async function createRejectedImage(
  rejectedImageID: ImageID,
  imageAnnotatorID: UserID,
  imageVerifierID: UserID,
  wrongAnnotations: Annotation,
  comment: String,
) : Promise<RejectionID> {
  const id = new Date().toISOString(); // unique id's.

  const rejection = {
    _id: id,
    id,
    rejectedImageID,
    imageAnnotatorID,
    imageVerifierID,
    wrongAnnotations,
    comment,
  } as RejectedAnnotation;

  await rejectionsDB.put(rejection);
  return id;
}

// eslint-disable-next-line no-empty-function
export async function getRejectedImageByVerifierID() {
}
// eslint-disable-next-line no-empty-function
export async function getModifiedAnnotationsByVerifierID() {
}
// eslint-disable-next-line no-empty-function
export async function getRejectedImageByAnnotatorID() {
}
// eslint-disable-next-line no-empty-function
export async function getRejectImageByProjectID() {
}

/* TODO
* getRejectedImageByVerfierID: returns the IDs of the images rejected by a verifier
* getModifiedAnnotationsByVerifierID: returns the IDs of the images directly modified by a verifier
* getRejectedImageByAnnotatorID: returns the IDs of the images of an annotator that has been rejected 
* getRejectImageByProjectID: returns the IDs of the images of a project that has been rejected
*/
