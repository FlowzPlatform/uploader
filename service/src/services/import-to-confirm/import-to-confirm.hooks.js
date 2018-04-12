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
    find: [],
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
        // hook => beforeCreate(hook)
    ],
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

// function beforeHook (hook) {
//     hook.result = hook.data
// }

async function beforeCreate(hook) {
  let base_url = app.get("jobqueueUrl")
  module.exports.authorization = this.authorization
  let user_data = await(axios.get(user_detail_url,{'headers':{'Authorization':module.exports.authorization}}))
  let import_tracker_id = hook.data.importTrackerId
  hook.data = {
    "queue": {
      "name":"uploaderJobQueConfirm"
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
    }

  }

  try {
    let tdata = await(hook.app.service('/uploader').get(import_tracker_id))
    if(tdata.stepStatus == 'import_to_confirm'){
      await axios.post(base_url, hook.data).then(res => {
        console.log("Import-to-confirm res....",res)
        if(res.status == 200){
          let confirm_obj = {
            stepStatus : "import_to_confirm_in_progress"
          }
          hook.app.service('/uploader').patch(import_tracker_id,confirm_obj,{ query: { "id":import_tracker_id,"masterJobStatus":"running" }}).then(result => {
          })
          .catch(error => {
            throw new errors.GeneralError('Status not updated');
          })
        }
      })
      .catch(error => {
        if(error.response.status == 502 && error.response.data.message == "An invalid response was received from the upstream server"){
          throw new errors.BadGateway('JobQueue not running')
        }
        else {
          throw error
        }
      })
   }
  } catch (err) {
      throw err
  }

}
