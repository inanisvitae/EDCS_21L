import { isAddress, isLocatedBetween, sha1 } from '../utils/utils';

async function lookup(call, callback) {
  console.log(`Invoked Lookup with request ${JSON.stringify(call.request)}`);
  const { id } = call.request;

  if (!Buffer.isBuffer(id)) {
    return callback(new Error());
  }

  const successorShaId = sha1(this.successor);

  if (isLocatedBetween(this.id, id, successorShaId)
  || id.compare(successorShaId) === 0) {
    await this.execChordRpc(this.successor, 'ping', { originator: this.address });
    return callback(null, { successor: this.successor });
  }
  // Recursively get the correct successor of key
  try {
    const response = await this.execChordRpc(this.successor, 'lookup', { id });
    return callback(null, response);
  } catch (e) {
    console.log('The successor is no longer active');
  }
  return callback(null, new Error());
}

async function notify(call, callback) {
  console.log(`Invoked notify with request ${JSON.stringify(call.request)}`);
  const { originator } = call.request;
  if (!isAddress(originator)) {
    return callback(new Error());
  }

  if (!isAddress(this.predecessor)
  // Arrange linked list in ascending order clockwise
  || isLocatedBetween(sha1(this.predecessor), sha1(originator), this.id)) {
    this.predecessor = originator;
  } else {
    try {
      await this.execChordRpc(this.predecessor, 'ping', {
        originator: this.address,
      });
      console.log('Successfully invoked ping');
    } catch (e) {
      this.predecessor = originator;
      console.log(`Error, but updated predecessor to ${this.predecessor}`);
    }
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
