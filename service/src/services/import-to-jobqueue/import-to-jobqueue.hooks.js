let async = require('asyncawait/async');
let await = require('asyncawait/await');
const app = require('config');
const config = require('../config')
let axios = require('axios');
let errors = require('@feathersjs/errors') ;
let domainkey = process.env.domainKey ? process.env.domainKey : 'flowzcluster.tk'
let user_detail_url = 'http://api.' + domainkey + '/auth/api/userdetails'

module.exports = {
  before: {
    all: [],
    find: [

    ],
    get: [],
    create: [
        hook => beforeCreate(hook)
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

async function beforeCreate(hook) {
  let base_url = app.get("jobqueueUrl")
  module.exports.authorization = this.authorization
  let import_tracker_id = hook.data.importTrackerId
  let user_data = await(axios.get(user_detail_url,{'headers':{'Authorization':module.exports.authorization}}).then(res => {
    return res
  })
  .catch(err => {
    throw err
  }))
  let tdata = await(hook.app.service('/uploader').get(import_tracker_id).then(res => {
    return res
  }).catch(err => {
    throw err
  }))
  let timeout = 10000000
  let fullname = ''
  let company = ''
  if(user_data.data.data.firstname){
    fullname = user_data.data.data.firstname
  }
  if(user_data.data.data.company){
    company = user_data.data.data.company
  }
  hook.data = {
    "queue": {
      "name":"uploaderJobQue"
    },
    "jobs":[
      {
        "importTrackerId":import_tracker_id,
        "uploadType": tdata.uploadType,
        "userdetails":{
          "id":user_data.data.data._id,
          "email":user_data.data.data.email,
          "password":user_data.data.data.password,
          "fullname":fullname,
          "company":company
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
        await axios({
          method: 'post',
          url: base_url,
          data: hook.data,
          headers: {'content-type': 'application/json'}
        }).then(res => {
          if(res.status == 200 && res.data.error == undefined){
            let import_obj = {
              stepStatus : "import_in_progress"
            }
            hook.app.service('/uploader').patch(import_tracker_id,import_obj,{ query: { "id":import_tracker_id,"stepStatus":"validation_completed","masterJobStatus":"running" }}).then(result => {
            })
            .catch(error => {
              throw new errors.GeneralError('Status not updated');
            });
          } else {
            throw new errors.BadGateway('JobQueue not running');
          }
        })
        .catch(error => {
          if(error.response.status == 502 && error.response.data.message == "An invalid response was received from the upstream server"){
            throw new errors.BadGateway('JobQueue not running');
          }
          else{
            throw error;
          }
        });
  } catch (err) {
    throw err;
  }
}
