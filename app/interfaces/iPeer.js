import { isAddress, isLocatedBetween, sha1, fromStringToDecimal } from '../utils/utils';

function get(call, callback) {
  const { key } = call.request;
  const predecessorId = this.predecessor;
  if (!isAddress(predecessorId)) {
    return callback(new Error());
  }
  // Checks if the key is on this node;
  if (!isLocatedBetween(fromStringToDecimal(predecessorId),
    fromStringToDecimal(sha1(key)),
    fromStringToDecimal(this.id))
  && sha1(key) !== this.id) {
    return callback(new Error('The key is not on this node'));
  }
  if (!this.collection.has(key)) {
    return callback(new Error('This key does not exist on this node'));
  }
  return callback(null, { value: this.collection.get(key) });
}

function set(call, callback) {

}

function del(call, callback) {

}

function partition(call, callback) {

}

export {
  get,
  set,
  del,
  partition,
};
