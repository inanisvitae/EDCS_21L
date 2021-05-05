import _ from 'underscore';
import { HEAD, TAIL } from '../constants';
import { sha1, fromStringToDecimal } from '../utils/utils';

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
  return callback(null, { });
}

function del(call, callback) {
  const { key } = call.request;
  this.collection.del(key);
  return callback(null, { });
}

function partition(call, callback) {
  const { originator } = call.request;
  const entries = [];
  _.keys(this.collection.data).forEach((key) => {
    const keyId = fromStringToDecimal(sha1(key));
    // Partitions data for request from predecessor
    if (originator === this.predecessor
      && keyId > fromStringToDecimal(this.predecessor)
      && keyId < fromStringToDecimal(this.id)) {
      entries.push({
        key,
        value: this.collection[key],
      });

      this.collection.del(key);
    }
    // Partitions data for request from successor
    if (originator === this.successor
      && keyId < fromStringToDecimal(this.successor)
      && keyId > fromStringToDecimal(this.id)) {
      entries.push({
        key,
        value: this.collection[key],
      });

      this.collection.del(key);
    }
  });
  return callback(null, { entries: JSON.stringify(entries) });
}

async function dump(call, callback) {
  let entries = JSON.parse(call.request.entries);
  if (!(this.address in entries)) {
    entries[this.address] = _.pairs(this.collection.data);
  }
  if (this.predecessor !== HEAD && !(this.predecessor in entries)) {
    const result = JSON.parse((await this.execPeerRpc(this.predecessor, 'dump', { entries: JSON.stringify(entries) })).entries);
    entries = { ...result, ...entries };
  }
  if (this.successor !== TAIL && !(this.successor in entries)) {
    const result = JSON.parse((await this.execPeerRpc(this.successor, 'dump', { entries: JSON.stringify(entries) })).entries);
    entries = { ...result, ...entries };
  }
  return callback(null, { entries: JSON.stringify(entries) });
}

export default {
  get,
  set,
  del,
  partition,
  dump,
};
