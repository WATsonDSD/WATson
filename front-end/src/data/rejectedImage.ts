import {
  Annotation,
  ImageID, RejectedAnnotation,  UserID,
} from '.';
import { rejectionsDB } from './databases';

/**
 * Creates a new `RejectedImage`.
 * @returns The newly created rejection's `id`, determined by the backend.
 */
export async function createRejectedImage(
  imageID: ImageID,
  comment: String,
  wrongAnnonation: Annotation,
) : Promise<void> {

  const rejection = {
    imageID,
    comment,
    wrongAnnonation,
  } as RejectedAnnotation;
  
  await rejectionsDB.put(rejection);
}


// eslint-disable-next-line no-empty-function
export async function ggetRejectedImagesByByVerifierID() {
}
// eslint-disable-next-line no-empty-function
export async function getModifiedAnnotationByVerifierID() {
}
// eslint-disable-next-line no-empty-function
export async function getRejectedImagesByAnnotatorID() {
}
// eslint-disable-next-line no-empty-function
export async function getRejectedImagesByVerifierID() {
}

/* TODO
* getRejectedImageByVerfierID: returns the IDs of the images rejected by a verifier
* getModifiedAnnotationsByVerifierID: returns the IDs of the images directly modified by a verifier
* getRejectedImageByAnnotatorID: returns the IDs of the images of an annotator that has been rejected 
* getRejectImageByProjectID: returns the IDs of the images of a project that has been rejected
*/
