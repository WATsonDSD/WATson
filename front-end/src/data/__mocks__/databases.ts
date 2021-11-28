/* eslint-disable no-underscore-dangle */
type DBDocument <T> = T & {_id: string, _rev?: string}

const MockPouch = <T>() => ({
  documents: {} as {[id:string]:DBDocument<T>},

  put(document: DBDocument<T>) {
    if (!document._id) { throw Error('document must have an _id'); }
    if (this.documents[document._id]) {
      if (this.documents[document._id]._rev !== document._rev) { throw Error('Document update conflict'); }
    }
    this.documents[document._id] = { ...document, _rev: new Date().toISOString() };
  },

  get(id: string) {
    return this.documents[id];
  },
});

export const usersDB = MockPouch();
export const projectsDB = MockPouch();
export const imagesDB = MockPouch();
