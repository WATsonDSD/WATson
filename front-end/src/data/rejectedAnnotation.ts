import {
  Annotation,
  ImageID, Rejection, UserID,
} from '.';
import { RejectionsDB } from './databases';
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
    rejectedAnnonation: wrongAnnonation,
  } as Rejection;
  await RejectionsDB.put(rejection);
}

export async function getAllRejections(): Promise<Rejection[]> {
  let rejections: Rejection[] = [];
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
          rejectedAnnonation: row.doc.wrongAnnontation,
        } as Rejection));
      }
      resolve(rejections);
    }).catch((error) => {
      reject(error);
    });
  });
}
export async function getRejectedAnnotationByID(imageID: ImageID): Promise <Rejection> {
  return RejectionsDB.get(imageID);
}

export async function getRejectedImagesByAnnotatorID(annotatorId : UserID) : Promise<ImageID[]> {
  const rejections = await getAllRejections();
  return rejections.filter((rej) => rej.annotatorID === annotatorId).map((rej) => rej.imageID);
}
