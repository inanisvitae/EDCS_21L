import { isAddress } from '../utils/utils';

const lookup = (call, callback) => {
  console.log('Invoked Lookup');
  const { id } = call.request;

  if (!Buffer.isBuffer(id)) {
    return callback(new Error());
  }

  // TODO: implements lookup here
  callback(null, { message: 'lookup' });
};

const notify = (call, callback) => {

};

const ping = (call, callback) => {
  const { originator } = call.request;

  if (!isAddress(originator)) {
    return callback(new Error('Ping return address is not valid'));
  }

  return callback(null, call.request);
};

const info = (call, callback) => callback(null, {
  predecessor: this.predecessor,
  successor: this.successor,
});

export default {
  lookup,
  notify,
  ping,
  info,
};
