import {
  Annotation,
  ImageID, RejectedAnnotation, UserID,
} from '.';
import { RejectionsDB } from './databases';
import { DBDocument } from './PouchWrapper/PouchCache';
/**
 * Creates a new `RejectedImage`.
 */

export async function createRejectedImage(
  imageID: ImageID,
  comment: String,
  annotatorID: UserID,
  wrongAnnonation: Annotation,
) : Promise<void> {
  const rejection = {
    _id: imageID,
    imageID,
    comment,
    annotatorID,
    wrongAnnonation,
  } as DBDocument<RejectedAnnotation>;
  await RejectionsDB.put(rejection);
}

export async function getAllRejections(): Promise<RejectedAnnotation[]> {
  let rejections: RejectedAnnotation[] = [];
  return new Promise((resolve, reject) => {
    RejectionsDB.allDocs({
      startkey: 'a',
      include_docs: true,
    }).then((response) => {
      if (response) {
        rejections = response.rows.map((row: any) => ({
          imageID: row.doc.imageID,
          comment: row.doc.comment,
          annotatorID: row.doc.annotatorID,
          wrongAnnonation: row.doc.wrongAnnontation,
        } as RejectedAnnotation));
      }
      resolve(rejections);
    }).catch((error) => {
      reject(error);
    });
  });
}
export async function getRejectedAnnotationByID(imageID: ImageID): Promise <RejectedAnnotation> {
  return RejectionsDB.get(imageID);
}

export async function getRejectedImagesByAnnotatorID(annotatorId : UserID) : Promise<ImageID[]> {
  const rejections = await getAllRejections();
  return rejections.filter((rej) => rej.annotatorID === annotatorId).map((rej) => rej.imageID);
}
