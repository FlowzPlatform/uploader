let async = require('asyncawait/async');
let await = require('asyncawait/await');
const app = require('config');
const config = require('../config')
let axios = require('axios');
let domainkey = process.env.domainKey ? process.env.domainKey : 'flowzcluster.tk'
let user_detail_url = 'http://auth.' + domainkey + '/api/userdetails'

module.exports = {
  before: {
    all: [],
    find: [
      hook => beforeFind(hook)
    ],
    get: [],
    create: [
      hook => beforeHook(hook)
    ],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [
        hook => beforeCreate(hook)
    ],
    update: [],
    patch: [],
    remove: [
    ]
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

function beforeHook (hook) {
    hook.result = hook.data
}

function beforeFind(hook){

}


async function beforeCreate(hook) {
  let base_url = app.get("jobqueueUrl")
  module.exports.authorization = this.authorization
  let import_tracker_id = hook.data.importTrackerId
  let user_data = await(axios.get(user_detail_url,{'headers':{'Authorization':module.exports.authorization}}))
  let tdata = await(hook.app.service('/uploader').get(import_tracker_id))
  console.log("tdata.....",tdata)
  let timeout = 400 * tdata["ProductInformation"].totalNoOfRecords
  hook.data = {
    "queue": {
      "name":"uploaderJobQue"
    },
    "jobs":[
      {
        "importTrackerId":import_tracker_id,
        "userdetails":{
          "id":user_data.data.data._id,
          "email":user_data.data.data.email,
          "password":user_data.data.data.password
        }
      }
    ],
    "connection":{
      "host":app.get("rdb_host"),
      "port": app.get("rdb_port"),
      "db": app.get("rdb_db")
    },
    "options":{
      "timeout": timeout
    }

  }

    try {
        axios.post(base_url,hook.data).then(res => {
        })
        .catch(error => {
          console.log('Error:: ', error)
        })
  } catch (err) {
    console.log('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<', err)
  }

}
