import _ from 'underscore';
import ip from 'ip';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import iChords from '../interfaces/iChord';
import {
  isAddress,
  sha1,
  execRpc,
} from '../utils/utils';

const CHORD_PATH = `${__dirname}/chord.proto`;

const packageDefinition = protoLoader.loadSync(CHORD_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const chordProto = grpc.loadPackageDefinition(packageDefinition).Chord;
const execChordRpc = execRpc(chordProto, 'CHORD_PROTO');

class Chord {
  constructor() {
    console.log('Initialized Chord object');
    console.log(`IP is ${ip.address()}`);
    this.localhost = '0.0.0.0:50051';
    this.address = `${ip.address()}:50051`;
    this.id = sha1(this.address);
    this.predecessor = null;
    this.successor = null;
    this.isJoined = false;
    this.execChordRpc = execChordRpc;
    this.start();
  }

  async start() {
    this.server = new grpc.Server();
    this.server.addService(chordProto.CHORD_PROTO.service,
      _.mapObject(iChords, (iChord) => iChord.bind(this)));
    this.server.bindAsync(this.localhost, grpc.ServerCredentials.createInsecure(), () => {
      this.server.start();
    });

    // const resp = await execChordRpc('0.0.0.0:50051', 'lookup', { name: 'world' });
    // console.log(resp, 'here');
  }

  stop() {
    console.log('Stopping...');
    this.server.forceShutdown();
  }

  async lookup(id) {
    // Locates the address of the key then perform operation
    if (!Buffer.isBuffer(id)) {
      throw new Error('Id must be a buffer');
    }
    const response = await execChordRpc(this.address, 'lookup', { name: id });
    return response.successor;
  }

  async join(host) {
    console.log('joining...');
    if (this.isJoined) { return false; }

    if (!isAddress(host)) { throw new Error('Host is not an IPv4 address.'); }

    if (host === this.address) { throw new Error('Cannot join to the peer'); }

    // Should stop maintenance
    const lookupResponse = await execChordRpc(host, 'lookup', {
      name: sha1(this.address),
    });
    const newSuccessor = lookupResponse.successor;
    if (!isAddress(newSuccessor)) {
      throw new Error('Failed to find successor');
    }
    const infoResponse = await execChordRpc(newSuccessor, 'info', { });
    // set predecessor address
    const newPredecessor = infoResponse.predecessor;
    if (!isAddress(newPredecessor)) {
      throw new Error('Failed to find predecessor');
    }

    // added to linked list
    this.predecessor = newPredecessor;
    return true;
  }

  stabilize() { }

  async notify(host) { console.log('notified...'); }

  async info(host) {
    if (!isAddress(host)) {
      throw new Error('Host is not an IPv4 address.');
    }
    if (host === this.address) {
      const response = {
        predecessor: this.predecessor,
        address: host,
        successor: this.successor,
      };
      return response;
    }
    try {
      const response = this.execChordRpc(host, 'info', { });
      response.address = host;
      return response;
    } catch (e) {
      console.log(e);
    }
    return {};
  }
}

export default Chord;
