import _ from 'underscore';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import Chord from './chord';
import iPeers from '../interfaces/iPeer';
import Collection from './collection';

const PEER_PATH = `${__dirname}/peer.proto`;

const packageDefinition = protoLoader.loadSync(PEER_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const peerProto = grpc.loadPackageDefinition(packageDefinition).Peer;

class Peer extends Chord {
  constructor() {
    super();
    console.log('Initialized Peer object');
    this.collection = new Collection();
    this.server.addService(peerProto.PEER_PROTO.service,
      _.mapObject(iPeers, (iPeer) => iPeer.bind(this)));
  }

  async get(key) { console.log('Got key'); return 1; }

  async set(key, value) { console.log('Set key'); return 1; }

  async del(key) { console.log('Deleted key'); return 1; }

  async partition(host) { console.log('Partitioned keys'); return 1; }
}

export default Peer;
