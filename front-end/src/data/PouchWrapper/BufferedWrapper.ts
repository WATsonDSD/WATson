import { DBDocument } from './PouchCache';

import buffer from './PouchBuffer';

/**
 * I'll think about using this wrapper that only implements the buffer for the DB's I don't have the time to implement cache for.
 */
export default class PouchWrapper<T> {
  private pouch: PouchDB.Database<T>;

  constructor(pouch: PouchDB.Database<T>) {
    this.pouch = pouch;
  }

  public async get(id: string) {
    return buffer(() => this.pouch.get(id));
  }

  public async put(doc: DBDocument<T>) {
    return buffer(() => this.pouch.put(doc));
  }

  public async remove(doc: DBDocument<T> & {_rev: string}) {
    return buffer(() => this.pouch.remove(doc));
  }

  public async removeAttachment(docId: string, attachmentId: string, rev: string, callback: PouchDB.Core.Callback<PouchDB.Core.RemoveAttachmentResponse>) {
    return buffer(async () => this.pouch.removeAttachment(docId, attachmentId, rev, callback));
  }

  public async putAttachment(docId: string, imageId: string, attachment: Blob, type: string) {
    return buffer(async () => this.pouch.putAttachment(docId, imageId, attachment, type));
  }
}
