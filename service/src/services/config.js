const config = require('config');
const fs = require('fs');

let ssl = process.env.cert ? { ca: fs.readFileSync(__dirname + process.env.cert) } : null
let rauth = process.env.rauth ? process.env.rauth : null
let host = process.env.RDB_HOST ? config.get('rdb_host').trim() : 'localhost'
let port = process.env.RDB_PORT ? config.get('rdb_port').trim() : '28015'
let
var rethinkdb = {
  rethinkdb: {
    db: 'FlowzDBETL',
    servers: [{
      host: host,
      port: port,
      authKey: rauth,
      ssl: ssl
    }]
  }
};
if (config.get('rdb_user').trim() !== '') {
  rethinkdb.rethinkdb.servers.user = config.get('rdb_user').trim();
  rethinkdb.rethinkdb.servers.password = config.get('rdb_password').trim()
}
module.exports = rethinkdb;
