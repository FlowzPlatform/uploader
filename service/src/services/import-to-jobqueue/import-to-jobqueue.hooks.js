let async = require('asyncawait/async');
let await = require('asyncawait/await');
const app = require('config');
const config = require('../config')
let axios = require('axios');

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
  hook.data.connection = {
	  "host":app.get("rdb_host"),
    "port": app.get("rdb_port"),
    "db": app.get("rdb_db")
  }
  hook.data.options = {
    "timeout": 10000000
  }
  console.log("hook.data........",hook.data)

    try {
      setTimeout(function() {
        axios.post(base_url, hook.data).then(res => {
          console.log("res.....",res)
          hook.result = res
        })
        .catch(error => {

        })
      },10000)
  } catch (err) {
    //
  }

}
