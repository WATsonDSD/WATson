import PouchDB from 'pouchdb';
import { DBDocument } from './PouchCache';

const syncOptions = {
  live: true,
  retry: true,
};

const replicators = [] as Function[];
let notified = false;
export function notifyReplicators() {
  if (notified) return;
  notified = true;
  replicators.forEach((replicate) => replicate());
}

export default class ReplicatedPouch<T> {
    private pouch: PouchDB.Database<T>;

    private localCache: PouchDB.Database<T>;

    private name;

    private replicated = false;

    private heldOperations = [] as {resolve: Function, reject: Function, operation: () => Promise<any>}[];

    constructor(pouch: PouchDB.Database<T>) {
      this.pouch = pouch;
      this.name = pouch.name.split('/')[-1];
      this.localCache = new PouchDB<T>(pouch.name);
      replicators.push(() => this.sync());
    }

    /* -------------------------------------------------------------------------- */
    /*                                   Public                                   */
    /* -------------------------------------------------------------------------- */
    public async get(id: string) {
      return this.hold(() => this.pouch.get(id));
    }

    public async put(doc: DBDocument<T>) {
      return this.hold(() => this.pouch.put(doc));
    }

    public async remove(doc: DBDocument<T> & {_rev: string}) {
      return this.hold(() => this.pouch.remove(doc));
    }

    public async removeAttachment(docId: string, attachmentId: string, rev: string) {
      return this.hold(async () => this.pouch.removeAttachment(docId, attachmentId, rev));
    }

    public async putAttachment(docId: string, imageId: string, attachment: Blob, type: string) {
      return this.hold(async () => this.pouch.putAttachment(docId, imageId, attachment, type));
    }

    public async getAttachment(docId: string, attachmentId: string) {
      return this.hold(async () => this.pouch.getAttachment(docId, attachmentId));
    }

    public async allDocs(opts?: any) {
      return this.hold(async () => this.pouch.allDocs(opts));
    }

    /* -------------------------------------------------------------------------- */
    /*                                   Private                                  */
    /* -------------------------------------------------------------------------- */
    private sync() {
      this.localCache.replicate.from(this.pouch).on('complete', () => {
        console.log('replicated ', this.name);
        this.runHeldOperations();
        this.replicated = true;
      }).on('error', (_err) => {
        throw Error(`Couldn't replicate ${this.name}`);
      });

      this.localCache.sync(this.pouch, syncOptions).on('change', (change) => {
        console.log(`[${this.name}] replicating change: `, change);
      }).on('error', (err) => {
        console.log(`[${this.name}]error on replicaiton: `, err);
      });
    }

    private hold <T>(operation: () => Promise<T>) : Promise<T> {
      if (!this.replicated) {
        // put the operation on hold.
        console.log('holding');
        return new Promise((resolve, reject) => {
          this.heldOperations.push({ resolve, reject, operation });
        });
      }
      return operation();
    }

    private runHeldOperations() {
      console.log(`Executing ${this.heldOperations.length} operations`);
      this.heldOperations.forEach((op) => {
        op.resolve(
          op.operation()
            .catch((e) => op?.reject(e)),
        );
      });
    }
}
