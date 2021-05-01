import Chord from './chord';
import Collection from './collection';

class Peer extends Chord {
  constructor() {
    super();
    console.log('Initialized Peer object');
    this.collection = new Collection();
  }

  async get(key) { console.log('Got key'); return 1; }

  async set(key, value) { console.log('Set key'); return 1; }

  async del(key) { console.log('Deleted key'); return 1; }
}

export default Peer;
