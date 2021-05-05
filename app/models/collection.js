import { isClean } from '../utils/utils';

class Collection {
  constructor() {
    this.data = {};
  }

  get(key) {
    if (isClean(key)) {
      return this.data[key];
    }
    return 0;
  }

  set(key, value) {
    if (isClean(key) && isClean(value)) {
      this.data[key] = value;
      return 1;
    }
    return 0;
  }

  del(key) {
    if (isClean(key)) {
      delete this.data[key];
      return 1;
    }
    return 0;
  }

  has(key) {
    if (isClean(key) && (key in this.data)) {
      return 1;
    }
    return 0;
  }
}

export default Collection;
