import { v4 as uuid } from 'uuid';
import {
  ImageID, ProjectID, Role, UserID,
} from '../types';

/* eslint-disable no-underscore-dangle */
type DBDocument<T> = T & { _id: string, _rev?: string, attach: IMGattachment }
type IMGattachment = { attachID: string, attachType: string, data: Blob }
type User = {id: UserID,
  projects: {
      [projectID: ProjectID]: {
          toAnnotate: ImageID[],
          waitingForAnnotation: ImageID[], // used when the annotation is rejected
          annotated: ImageID[],
          toVerify: ImageID[],
          waitingForVerification: ImageID[], // used when the annotation is rejected and annotated again and 
                                          // when the annotation is annotated for the first time and is not verified yet.
          verified: ImageID[],
      }
  },
  name: string,
  email: string,
  role: Role}

const MockPouch = <T>() => ({
  documents: {} as { [id: string]: DBDocument<T> },
  users: {} as { [id: string]: User},

  put(document: DBDocument<T>) {
    if (!document._id) { throw Error('document must have an _id'); }
    if (this.documents[document._id]) {
      if (this.documents[document._id]._rev !== document._rev) { throw Error('Document update conflict'); }
    }
    this.documents[document._id] = { ...document, _rev: uuid() };
  },

  get(id: string) {
    return { ...this.documents[id] };
  },

  putAttachment(docId: string, attachmentId: string, attachment: Blob, type: string) {
    const doc = this.documents[docId];
    if (!doc) this.put({ _id: docId } as unknown as DBDocument<T>);
    const att = {
      attachID: attachmentId,
      attachType: type,
      data: attachment,
    };
    this.documents[docId].attach = att;
  },

  getAttachment(docId: string) {
    return this.documents[docId].attach.data;
  },

  putUser(user: User) {
    if (!user.id) { throw Error('user must have an ID'); }
    if (this.users[user.id]) {
      if (this.users[user.id].name !== user.name) { throw Error('User update conflict'); }
    }
    this.users[user.id] = { ...user };
  },

});

export const UsersDB = MockPouch();
export const ImagesDB = MockPouch();
export const ProjectsDB = MockPouch();
export const rejectionsDB = MockPouch();

export const AuthDB = {
  users: {} as {[email: string]: any},
  signUp: (email: string, password: string, metadata: any, callback: (error: any, response: any) => void) => {
    AuthDB.users[email] = {
      _id: `org.couchdb.user:${email}`,
      name: email,
      roles: metadata.roles,
      ...metadata.metadata,
    };
    callback(null, true);
  },
  getUser: (email: string, callback: (error: any, response: any) => void) => { callback(null, AuthDB.users[email]); },
  putUser: (email: string, metadata: any, callback: (error: any, response: any) => void) => {
    AuthDB.signUp(email, '', metadata, callback);
  },
};
