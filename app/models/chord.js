class Chord {
  constructor() {
    this.address = null;
    this.predecessor = null;
    this.successor = null;
  }

  start() {
    console.log('Starting...');
  }

  stop() {
    console.log('Stopping...');
  }

  listen(port = 0, host = '127.0.0.1') { } // Sets the ip and port

  lookup(id) { } // Locates the address of the key then perform operation

  join(host) { }

  stabilize() { }

  getPredecessor() { return this.predecessor; }

  getSuccessor() { return this.successor; }

  notify(host) { }
}

export default Chord;
