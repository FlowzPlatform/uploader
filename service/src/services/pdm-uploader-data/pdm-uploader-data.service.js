// Initializes the `/pdm_uploader_data` service on path `/pdm-uploader-data`
const createService = require('./pdm-uploader-data.class.js');
const hooks = require('./pdm-uploader-data.hooks');
const filters = require('./pdm-uploader-data.filters');
const socketio = require('feathers-socketio');
const config1 = require('../../../config/default.json');
let shell = require('shelljs');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
const _ = require('lodash');
config1.mongodb_host = process.env.mongodb_host ? process.env.mongodb_host : 'localhost'
config1.mongodb_port = process.env.mongodb_port ? process.env.mongodb_port : '27017'
config1.username = process.env.username ? process.env.username : null
config1.password = process.env.password ? process.env.password : null


module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');

  app.configure(socketio(function(io) {
  io.on('connection', function(socket) {
    socket.on('pdmData',async function( data){
          var url = 'mongodb://' + config1.username + ':' + config1.password + '@' + config1.mongodb_host + ':' + config1.mongodb_port + '/pdmuploader';
          var cnn_with_mongo = await connectToMongo(url,data)
          socket.emit('response',{stdout:cnn_with_mongo.result})

  });
  });
  io.use(function (socket, next) {
   // Exposing a request property to services and hooks
   socket.feathers.referrer = socket.request.referrer;
   next();
 });
 }));

  const options = {
    name: 'pdm-uploader-data',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/pdm-uploader-data', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('pdm-uploader-data');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};

var connectToMongo = async function(url,data){
  var db = await (MongoClient.connect(url))
    let collection_name = data.activetab.split(" ")
    collection_name = data.activetab.split(" ")
    let prod_name = collection_name[0]
    collection_name.splice(0,1)
    for(let i=0 ;i<collection_name.length;i++){
      name = collection_name[i].toLowerCase()
    }
    collection_name = "uploader" + prod_name + name

    var response = await (db.listCollections().toArray())
       let index = _.findIndex(response, function(o) { return o.name == collection_name; });
        if(index == -1){
          var response = await db.createCollection(collection_name)
          var result = await (db.collection(collection_name).insert(data.newCSV))
          return result
      }
      else{
        var result = await (db.collection(collection_name).insert(data.newCSV))
        return result
      }
}
