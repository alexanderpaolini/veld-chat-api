export default class CacheObject extends Object {
  constructor(object = {}) {
    super();
    Object.assign(this, object)
  }

  get(key: string) {
    return this[key];
  }

  set(key: string, value: any) {
    this[key] = value;
    return this;
  }

  delete(key: string) {
    delete this[key];
    return this;
  }

  toString() {
    return JSON.stringify(this);
  }

  values() {
    return Object.values(this);
  }

  keys() {
    return Object.keys(this);
  }
}