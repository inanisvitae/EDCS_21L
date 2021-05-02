import _ from 'underscore';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import iChords from '../interfaces/iChord';

const CHORD_PATH = `${__dirname}/chord.proto`;

const packageDefinition = protoLoader.loadSync(CHORD_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const chordProto = grpc.loadPackageDefinition(packageDefinition).Chord;

class Chord {
  constructor() {
    console.log('Initialized Chord object');
    this.address = '0.0.0.0:50051';
    this.predecessor = null;
    this.successor = null;
    this.start();
  }

  start() {
    this.server = new grpc.Server();
    this.server.addService(chordProto.CHORD_PROTO.service, 
      _.mapObject(iChords, iChord => iChord.bind(this)));
    this.server.bindAsync(this.address, grpc.ServerCredentials.createInsecure(), () => {
      this.server.start();
    });
  }

  stop() {
    console.log('Stopping...');
  }

  async lookup(id) { } // Locates the address of the key then perform operation

  async join(host) { }

  stabilize() { }

  getPredecessor() { return this.predecessor; }

  getSuccessor() { return this.successor; }

  async notify(host) { console.log('notified...'); }
}

export default Chord;
