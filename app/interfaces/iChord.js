import {
  isAddress,
  sha1,
  fromStringToDecimal,
} from '../utils/utils';
import {
  HEAD,
  TAIL,
} from '../constants';

async function lookup(call, callback) {
  console.log(`Invoked Lookup with request ${JSON.stringify(call.request)}`);
  const { name: id } = call.request;
  const thisId = this.id;
  if (fromStringToDecimal(thisId) > fromStringToDecimal(id)) {
    if (this.predecessor === HEAD) {
      // Means it's at the beginning of the linked list but the hash value is still smaller
      return callback(null, { successor: this.address });
    }
    if (sha1(this.predecessor) >= fromStringToDecimal(id)) {
      try {
        const response = await this.execChordRpc(this.predecessor, 'lookup', { name: id });
        return callback(null, response);
      } catch (e) {
        console.log(`Error in forward routing is ${JSON.stringify(e)}`);
      }
    }
    return callback(null, { successor: this.address, predecessor: this.predecessor });
  }
  if (fromStringToDecimal(thisId) < fromStringToDecimal(id)) {
    if (this.successor === TAIL) {
      // Means it's at the end of the linked list but the hash value is still bigger
      return callback(null, { predecessor: this.address });
    }
    if (sha1(this.successor) <= fromStringToDecimal(id)) {
      try {
        const response = await this.execChordRpc(this.successor, 'lookup', { name: id });
        return callback(null, response);
      } catch (e) {
        console.log(`Error in backward routing is ${JSON.stringify(e)}`);
      }
    }
    return callback(null, { successor: this.successor, predecessor: this.address });
  }
  // If it's the same id, just send successor because successor is always preferred
  return callback(null, { successor: this.address });
}

async function notify(call, callback) {
  console.log(`Invoked notify with request ${JSON.stringify(call.request)}`);
  const { originator, role } = call.request;
  if (!isAddress(originator)) {
    return callback(new Error());
  }

  if (role === 'predecessor') {
    this.predecessor = originator;
  }
  if (role === 'successor') {
    this.successor = originator;
  }

  return callback(null);
}

function ping(call, callback) {
  console.log(`Invoked ping with request ${JSON.stringify(call.request)}`);
  const { originator } = call.request;

  if (!isAddress(originator)) {
    return callback(new Error('Ping return address is not valid'));
  }

  return callback(null, call.request);
}

function info(call, callback) {
  console.log(`Invoked info with request ${JSON.stringify(call.request)}`);
  return callback(null, {
    predecessor: this.predecessor,
    successor: this.successor,
  });
}

export default {
  lookup,
  notify,
  ping,
  info,
};
