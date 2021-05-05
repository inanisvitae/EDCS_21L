import _ from 'underscore';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import Chord from './chord';
import iPeers from '../interfaces/iPeer';
import Collection from './collection';
import { execRpc, sha1 } from '../utils/utils';

const PEER_PATH = `${__dirname}/peer.proto`;

const packageDefinition = protoLoader.loadSync(PEER_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const peerProto = grpc.loadPackageDefinition(packageDefinition).Peer;
const execPeerRpc = execRpc(peerProto, 'PEER_PROTO');

class Peer extends Chord {
  constructor() {
    super();
    console.log('Initialized Peer object');
    this.collection = new Collection();
    this.server.addService(peerProto.PEER_PROTO.service,
      _.mapObject(iPeers, (iPeer) => iPeer.bind(this)));
    this.execPeerRpc = execPeerRpc;
  }

  async get(key) {
    const id = sha1(key);
    try {
      const host = await this.lookup(id);
      if (host === this.address) {
        return this.collection.get(key);
      }
      const response = await this.execPeerRpc(host, 'get', { key });
      return response.value;
    } catch (e) {
      console.log('Unable to get key due to error');
      throw e;
    }
  }

  async set(key, value) {
    const id = sha1(key);
    try {
      const host = await this.lookup(id);
      if (host === this.address) {
        this.collection.set(key, value);
        return true;
      }
      const response = await this.execPeerRpc(host, 'set', { key, value });
      return response.value;
    } catch (e) {
      console.log('Unable to set key due to error');
      throw e;
    }
  }

  async del(key) {
    const id = sha1(key);
    try {
      const host = await this.lookup(id);
      if (host === this.address) {
        return this.collection.del(key);
      }
      const response = await this.execPeerRpc(host, 'del', { key });
      return response.value;
    } catch (e) {
      console.log('Unable to delete key due to error');
      throw e;
    }
  }

  async partition(host) { console.log('Partitioned keys'); return 1; }

  showAll() {
    // Right now shows only the data on the node
    console.log(_.pairs(this.collection.data));
    return _.pairs(this.collection.data);
  }
}

export default Peer;
