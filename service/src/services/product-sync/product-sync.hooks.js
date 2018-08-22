// let config = require('../config');
let app = require('config');
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
      hook => aftercreateInstance(hook)
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

function beforeCreate (hook) {
  hook.data.cretedOn = new Date()
}

function aftercreateInstance(hook) {
  if (hook.data.id != undefined) {
  let id = hook.data.id;
    const Queue = require('rethinkdb-job-queue')
      //--------------- Connection Options -----------------
    const cxnOptions = app.rethinkdb
    console.log('.....................', cxnOptions)
    cxnOptions.servers[0].host = app.get("rdb_host")
    cxnOptions.servers[0].port = app.get("rdb_port")
    console.log("&&&&&&&&&&&&&&", cxnOptions)
      //--------------- Queue Options -----------------
    const qOptions = {
      name: app.get('ProductSyncWorker')
    }
    const q = new Queue(cxnOptions, qOptions)
    var jobOptions = {}
    jobOptions.data = {}
    jobOptions.data.Sync_id = id
    jobOptions.data.userdetails = {
      // "vid": "b00ef491-d25e-4f50-9327-299bc78e5789",
      // "vid": "b509c151-682c-46ec-9c2a-cb1288fbbeda",
      "vid": hook.data.vid
      // "fullname": "aakron"
    }
    jobOptions.timeout = app.get('qJobTimeout')
    jobOptions.retryMax = app.get('qJobRetryMax')
      //--------------- Create new job -----------------
    const job = q.createJob(jobOptions)
      //--------------- Add job -----------------
    q.addJob(job).then((savedJobs) => {}).catch(err => console.error('Hook Errors', err))
  }
}