import PouchCache, { DBDocument } from './PouchCache';

import buffer from './PouchBuffer';

export default class PouchWrapper<T> {
  private pouch: PouchDB.Database<T>;

  private cache: PouchCache<T>;

  constructor(pouch: PouchDB.Database<T>) {
    this.pouch = pouch;
    this.cache = new PouchCache<T>();
  }

  public async get(id: string) {
    const cachedResult = this.cache.get(id);
    if (cachedResult) return cachedResult;

    const fetchedResult = await buffer(() => this.pouch.get(id));
    this.cache.put(fetchedResult);

    return fetchedResult;
  }

  public async put(doc: DBDocument<T>) {
    this.cache.flush();
    return buffer(() => this.pouch.put(doc));
  }

  public async remove(doc: DBDocument<T> & {_rev: string}) {
    this.cache.flush();
    return buffer(() => this.pouch.remove(doc));
  }
}
