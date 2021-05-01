import Chord from './chord';
import Collection from './collection';

class Peer extends Chord {
  constructor() {
    super();
    console.log('Initialized Peer object');
    this.collection = new Collection();
  }

  get(key) { console.log('Got key'); }

  set(key, value) { console.log('Set key'); }

  del(key) { console.log('Deleted key'); }
}

export default Peer;
