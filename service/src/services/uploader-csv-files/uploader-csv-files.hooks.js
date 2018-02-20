let async = require('asyncawait/async');
let await = require('asyncawait/await');
let axios = require('axios');
let domainkey = process.env.domainKey ? process.env.domainKey : 'flowzcluster.tk'
let subscription_url = 'https://api.' + domainkey + '/subscription/user-subscription'

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

var beforeCreate = async function(hook){
    let user_data = await(axios.get(subscription_url + '/' + hook.data["subscriptionId"] ))
    hook.data["createdAt"] = new Date()
    hook.data["updatedAt"] = new Date()
    hook.data["deletedAt"] = ''
    hook.data["user_id"] = user_data.data.userId
}
