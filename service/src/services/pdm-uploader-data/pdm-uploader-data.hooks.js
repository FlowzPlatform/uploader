const config1 = require('../../../config/default.json');
let shell = require('shelljs');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
const _ = require('lodash');
if (process.env.mongodb_host)
    config1.mongodb_host = process.env.mongodb_host
if (process.env.mongodb_port)
    config1.mongodb_port = process.env.mongodb_port
if (process.env.username)
    config1.username = process.env.username
if (process.env.password)
    config1.password = process.env.password


module.exports = {
  before: {
    all: [],
    find: [
      hook => beforeFind(hook)
    ],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [
      hook => beforeRemove(hook)
    ]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};

var beforeFind = async function(hook) {
    var url = 'mongodb://' + config1.username + ':' + config1.password + '@' + config1.mongodb_host + ':' + config1.mongodb_port + '/pdmuploader';
    var cnn_with_mongo = await connectToMongo(url,hook)
}

var connectToMongo = async function(url,hook){
  var db = await (MongoClient.connect(url))
    let tables = hook.params.query.tables
    var result = await (db.collection(tables).find({"import-tracker_id":hook.params.query.import_tracker_id}).toArray())
    hook.result = result
}

var beforeRemove = async function(hook) {
    var url = 'mongodb://' + config1.username + ':' + config1.password + '@' + config1.mongodb_host + ':' + config1.mongodb_port + '/pdmuploader';
    var cnn_with_mongo = await deleteFromMongo(url,hook)
}

var deleteFromMongo = async function(url,hook){
  var db = await (MongoClient.connect(url))
  var tdata = await(hook.app.service('/uploader').get(hook.id))
  var result_array = []

  let sheets = []
  let keys = Object.keys(tdata)
  let filtered_keys = _.filter(keys, function(o) {
    if(o == 'ProductInformation' || o == 'ProductPrice' || o == 'ProductImprintData' || o == 'ProductShipping' || o == 'ProductImage' || o == 'ProductVariationPrice' || o == "ProductAdditionalCharges"){
      return o;
    }
  });

 if(filtered_keys.length != 0){
  for(let i=0;i<filtered_keys.length ;i++){
    for(let key in tdata){
      if(key == filtered_keys[i] && tdata[key].uploadStatus == "completed"){
        sheets.push(key)
      }
    }
  }

  for(let i=0;i<sheets.length;i++){
    collection_name = "uploader" + sheets[i].charAt(0).toUpperCase() + sheets[i].substr(1).toLowerCase()
    var result = await(db.collection(collection_name).remove({"import-tracker_id":hook.id}))
    result_array.push(result)
  }
}

  hook.result = result_array
}
