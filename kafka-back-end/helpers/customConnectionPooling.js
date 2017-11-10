const mongoose = require('mongoose');
require('dotenv').config();

const dbConfig = {
  development: 'mongodb://127.0.0.1/273_lab1_dropbox_dev',
  test: 'mongodb://127.0.0.1/273_lab1_dropbox_test'
};
const appEnv = 'development'; //app.settings.env;

const connections = [];
const poolSize = 10;
const customOptions = {
  useMongoClient: true,
  // autoIndex: false, // Don't build indexes
  // reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
  // reconnectInterval: 500, // Reconnect every 500ms
  // poolSize: 10, // Maintain up to 10 socket connections
  // // If not connected, return errors immediately rather than waiting for reconnect
  // bufferMaxEntries: 0,
};

// create connections and save them in the array
// for (let i = 0; i < poolSize; i++) {
//   mongoose.connect(dbConfig[appEnv], customOptions, (err, db) => {
//     connections.push(db);
//     console.log(`create connection #${i} `);
//   });
// }
// console.log('connections');
// console.log(connections);

class MongoPool {
  constructor(poolSize) {
    this.poolSize = poolSize;
    this.pools = [];
    this.index = 0;
  }

  initPool() {
    console.log('* Create Custom Connection Pool');
    for (let i = 0; i < this.poolSize; i++) {
      mongoose.connect(dbConfig[appEnv], customOptions, (err, db) => {
        this.pools.push(db);
        console.log(`create connection #${i} `);
      });
    }
  }

  getIndex() {
    console.log(`getIndex = ${this.index}`);
    return this.index;
  }

  get() {
    const current = this.index;
    this.index += 1;
    if (this.index >= this.poolSize) {
      this.index = 0;
    }
    // console.log(` this.pools[${current}] =`, this.pools[current]);
    return this.pools[current];
  }
}

// function MongoPool(poolSize) {
//   this.poolSize = poolSize;
//   this.pools = [];
// }

// MongoPool.prototype.createConnections = function createConnections() {
//   for (let i = 0; i < this.poolSize; i++) {
//     mongoose.connect(dbConfig[appEnv], customOptions, (err, db) => {
//       this.pools.push(db);
//       console.log(`create connection #${i} `);
//     });
//   }
// }


module.exports = MongoPool;
