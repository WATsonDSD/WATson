/* eslint-disable no-underscore-dangle */
type DBDocument<T> = T & { _id: string, _rev?: string}

const TTL = 1000;

export default <T>() => ({
  documents: {} as { [id: string]: DBDocument<T> },

  put(document: DBDocument<T>) {
    if (!document._id) { throw Error('document must have an _id'); }
    if (this.documents[document._id]) {
      if (this.documents[document._id]._rev !== document._rev) { throw Error('Document update conflict'); }
    }
    this.documents[document._id] = { ...document };
    setTimeout(() => { delete this.documents[document._id]; }, TTL);
  },

  get(id: string) {
    if (!this.documents[id]) { return null; }
    return { ...this.documents[id] };
  },

  //   putAttachment(docId: string, attachmentId: string, attachment: Blob, type: string) {
  //     const doc = this.documents[docId];
  //     if (!doc) this.put({ _id: docId } as unknown as DBDocument<T>);
  //     const att = {
  //       attachID: attachmentId,
  //       attachType: type,
  //       data: attachment,
  //     };
  //     this.documents[docId].attach = att;
  //   },

//   getAttachment(docId: string) {
//     return this.documents[docId].attach.data;
//   },
});
