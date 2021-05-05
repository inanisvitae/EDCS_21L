function get(call, callback) {
  const { key } = call.request;
  if (!this.collection.has(key)) {
    return callback(new Error('This key does not exist on this node'));
  }
  return callback(null, { value: this.collection.get(key) });
}

function set(call, callback) {
  const { key, value } = call.request;
  this.collection.set(key, value);
  return callback(null);
}

function del(call, callback) {
  const { key } = call.request;
  this.collection.del(key);
  return callback(null);
}

function partition(call, callback) {

}

export {
  get,
  set,
  del,
  partition,
};
