const config1 = require('../../../config/default.json');
let shell = require('shelljs');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
const _ = require('lodash');
let errors = require('@feathersjs/errors') ;
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
    // var url = 'mongodb://' + config1.mongodb_host + ':' + config1.mongodb_port + '/pdmuploader';
    var url = 'mongodb://' + config1.username + ':' + config1.password + '@' + config1.mongodb_host + ':' + config1.mongodb_port + '/pdmuploader';
    var cnn_with_mongo = await connectToMongo(url,hook).then(res => {

    })
    .catch(error => {
      throw error
    })
}

var connectToMongo = async function(url,hook){
  var db = await (MongoClient.connect(url).then(res => {
    return res
  })
  .catch(error => {
    throw new errors.GeneralError('Unable to connect to Mongodb');
  }))

    let tables = hook.params.query.tables
    if(db){
      var result = await (db.collection(tables).find({"import-tracker_id":hook.params.query.import_tracker_id}).toArray()).then(res => {
        return res
      }).then(error => {
        throw new errors.GeneralError('Unable to find data');
      })
      hook.result = result
    }
}

var beforeRemove = async function(hook) {
    // var url = 'mongodb://' + config1.mongodb_host + ':' + config1.mongodb_port + '/pdmuploader';
    var url = 'mongodb://' + config1.username + ':' + config1.password + '@' + config1.mongodb_host + ':' + config1.mongodb_port + '/pdmuploader';
    var cnn_with_mongo = await deleteFromMongo(url,hook).then(res => {

    })
    .catch(error => {
      throw error
    })
}

var deleteFromMongo = async function(url,hook){
  var db = await (MongoClient.connect(url).then(res => {
    return res
  }).catch(error => {
     throw new errors.GeneralError('Unable to connect to Mongodb');
  }))

  let sheet_name = hook.params.query.sheet_name
  sheet_name = sheet_name.replace(/ /g,"");
  collection_name = "uploader" + sheet_name.charAt(0).toUpperCase() + sheet_name.substr(1).toLowerCase()

  if(!hook.params.query.deletedIds){
    var result = await(db.collection(collection_name).remove({"import-tracker_id":hook.id}).then(res => {
      return res
    })
  .catch(error => {
    throw new errors.GeneralError('Unable to delete data');
  }))
    hook.result = result
  }
  else if(hook.params.query.deletedIds && hook.params.query.deletedIds.length != 0){
    let del_ids = hook.params.query.deletedIds.split(",")
    var result = await(db.collection(collection_name).remove({'_id':{'$in':del_ids}}).then(res => {
      return res
    })
  .catch(error => {
    throw new errors.GeneralError('Unable to delete data');
  }))
    hook.result = result
  }


}
