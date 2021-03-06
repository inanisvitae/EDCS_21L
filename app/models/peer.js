import _ from 'underscore';
import Promise from 'bluebird';
let fs = Promise.promisifyAll(require('fs'));
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import Chord from './chord';
import iPeers from '../interfaces/iPeer';
import Collection from './collection';
import { execRpc, isAddress, sha1 } from '../utils/utils';
import { HEAD, TAIL } from '../constants';

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
    // Should see if there is data in localstorage
    fs.readFileAsync('data.json').then((readResult) => {
      const data = JSON.parse(readResult);
      _.keys(data).forEach((key) => {
        this.collection.set(key, data[key]);
      });
    }).catch((e) => {
      console.log('There is no data to read from');
    });
    this.server.addService(peerProto.PEER_PROTO.service,
      _.mapObject(iPeers, (iPeer) => iPeer.bind(this)));
    this.execPeerRpc = execPeerRpc;
    this.maintenance = (() => {
      let stopTime;
      return {
        start: () => {
          stopTime = setInterval(() => {
            this.stabilize();
            this.syncToStorage();
            if (this.isJoined) {
              this.partition(this.predecessor);
              this.partition(this.successor);
            }
          }, this.interval);
        },
        stop: () => {
          clearInterval(stopTime);
          stopTime = null;
        },
      };
    })();
    this.maintenance.start();
  }

  async syncToStorage() {
    const collectionData = JSON.stringify(this.collection.data);
    await fs.writeFileAsync('data.json', collectionData);
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
      await this.execPeerRpc(host, 'set', { key, value });
      return true;
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
      await this.execPeerRpc(host, 'del', { key });
      return true;
    } catch (e) {
      console.log('Unable to delete key due to error');
      throw e;
    }
  }

  /**
   * @param host: host ip
   * Sends partition request to target host to obtain data that should be on this peer, because
   * distributed system also acts as a load balancer in this case.
   */
  async partition(host) {
    if (!isAddress(host)) { return false; }
    console.log(`Partitioned keys on ${host}`);
    const result = JSON.parse((await this.execPeerRpc(host, 'partition', { originator: this.address })).entries || '[]');
    result.forEach((en) => {
      const {
        key,
        value,
      } = en;
      // TODO: Should test whether the key pair already exists
      this.collection.set(key, value);
    });
    return true;
  }

  /**
   * Obtains all key value pairs from all peers in the current network. Dump is the method to get 
   * all data from collection.
   */
  async showAll() {
    // Right now shows only the data on the node
    console.log(_.pairs(this.collection.data));
    let resultSuccessor = '{}';
    let resultPredecessor = '{}';
    if (this.successor !== TAIL) {
      resultSuccessor = (await this.execPeerRpc(this.successor, 'dump', { entries: '{}' })).entries;
    }
    if (this.predecessor !== HEAD) {
      resultPredecessor = (await this.execPeerRpc(this.predecessor, 'dump', { entries: resultSuccessor })).entries;
    }
    const result = { ...(JSON.parse(resultPredecessor)), ...(JSON.parse(resultSuccessor)) };
    result[this.address] = _.pairs(this.collection.data);
    console.log(`Show all result is: ${JSON.stringify(result)}`);
    return result;
  }
}

export default Peer;
