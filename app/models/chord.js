import _ from 'underscore';
import ip from 'ip';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import {
  HEAD,
  TAIL,
} from '../constants';
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
    this.predecessor = HEAD;
    this.successor = TAIL;
    this.isJoined = false;
    this.execChordRpc = execChordRpc;
    this.start();
    this.interval = 2000;

    // Try to initialize the server with ip address
  }

  async start() {
    this.server = new grpc.Server();
    this.server.addService(chordProto.CHORD_PROTO.service,
      _.mapObject(iChords, (iChord) => iChord.bind(this)));
    this.server.bindAsync(this.localhost, grpc.ServerCredentials.createInsecure(), () => {
      this.server.start();
    });

    // const resp = await this.execChordRpc('0.0.0.0:50051', 'lookup', { name: 'world' });
    // console.log(resp, 'here');
  }

  stop() {
    console.log('Stopping...');
    this.maintenance.stop();
    this.server.forceShutdown();
  }

  async lookup(id) {
    // Locates the address of the key then perform operation
    const response = await this.execChordRpc(this.address, 'lookup', { name: id });
    console.log(`Lookup response is: ${JSON.stringify(response)}`);
    const {
      successor,
      predecessor,
    } = response;
    if (successor && predecessor) {
      return successor;
    }
    if (successor) {
      return successor;
    }
    if (predecessor) {
      return predecessor;
    }
    return successor;
  }

  async join(host) {
    console.log('joining...');
    if (this.isJoined) { return false; }

    if (!isAddress(host)) { throw new Error('Host is not an IPv4 address.'); }

    if (host === this.address) { throw new Error('Cannot join to the peer'); }

    // Should stop maintenance
    const lookupResponse = await this.execChordRpc(host, 'lookup', {
      name: sha1(this.address),
    });
    console.log(`Lookup response is: ${JSON.stringify(lookupResponse)}`);
    const {
      predecessor: newPredecessor,
      successor: newSuccessor,
    } = lookupResponse;
    const newSuccessorFlag = isAddress(newSuccessor);
    const newPredecessorFlag = isAddress(newPredecessor);

    if (!newSuccessorFlag && !newPredecessorFlag) {
      throw new Error('Failed to find any joinable node');
    }
    if (newSuccessorFlag) {
      this.successor = newSuccessor;
    }
    if (newPredecessorFlag) {
      this.predecessor = newPredecessor;
    }
    try {
      if (newPredecessorFlag) {
        await this.execChordRpc(this.predecessor, 'notify', {
          originator: this.address,
          role: 'successor',
        });
      }
      if (newSuccessorFlag) {
        await this.execChordRpc(this.successor, 'notify', {
          originator: this.address,
          role: 'predecessor',
        });
      }
    } catch (e) {
      console.log(`Notify error: ${JSON.stringify(e)}`);
      return false;
    }
    return true;
  }

  testIsJoined() {
    return this.predecessor === HEAD && this.successor === TAIL;
  }

  async stabilize() {
    console.log('Make sure it starts...');
    // Make sure both successor and predecessor are valid and alive
    if (this.predecessor !== HEAD) {
      try {
        await this.execChordRpc(this.predecessor, 'ping', { originator: this.address });
      } catch (e) {
        console.log(`Tried pinging ${this.predecessor} failed, so set predecessor to HEAD`);
        this.predecessor = HEAD;
      }
    }
    if (this.successor !== TAIL) {
      try {
        await this.execChordRpc(this.successor, 'ping', { originator: this.address });
      } catch (e) {
        console.log(`Tried pinging ${this.successor} failed, so set predecessor to TAIL`);
        this.successor = TAIL;
      }
    }
    // Updates is joined status
    this.isJoined = this.testIsJoined();
  }

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
      const response = await this.execChordRpc(host, 'info', { });
      response.address = host;
      console.log(`Info response is: ${JSON.stringify(response)}`);
      return response;
    } catch (e) {
      console.log(e);
    }
    return {};
  }
}

export default Chord;
