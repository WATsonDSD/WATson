import { v4 as uuid } from 'uuid';

type DBDocument<T> = T & { _id: string, _rev?: string, attach: IMGattachment }
type IMGattachment = { attachID: string, attachType: string, data: Blob }

const MockPouch = <T>() => ({
  documents: {} as { [id: string]: DBDocument<T> },

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

  allDocs: async () => new Promise((resolve) => resolve({
    rows: Object.values(RejectionsDB.documents)
      .map((doc) => ({ doc })),
  })),

});

export const UsersDB = MockPouch();
export const ImagesDB = MockPouch();
export const ProjectsDB = MockPouch();
export const RejectionsDB = MockPouch();

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

  allDocs: () => AuthDB.users,
};
