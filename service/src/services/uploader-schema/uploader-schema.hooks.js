let errors = require('@feathersjs/errors') ;
let async = require('asyncawait/async');
let await = require('asyncawait/await');
let axios = require('axios');
let domainkey = process.env.domainKey ? process.env.domainKey : 'flowzcluster.tk'
let subscription_url = 'https://api.' + domainkey + '/subscription/user-subscription'
module.exports = {
  before: {
    all: [],
    find: [
      hook => beforeFind(hook)
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
var beforeFind = async function(hook){
  if(!hook.params.query["user_id"]){
    let user_data = await(axios.get(subscription_url + '/' + hook.params.query["subscriptionId"] ))
    schemaData = await(hook.app.service('/uploader-schema').find({query:{"user_id":user_data.data.userId}}))
    hook.result = schemaData
  }

}


var beforeCreate = async function(hook){
  let schemaData = []
  let user_data = await(axios.get(subscription_url + '/' + hook.data["subscriptionId"] ))
  schemaData = await(hook.app.service('/uploader-schema').find({query:{"name":hook.data.name,"user_id":user_data.data.userId}}))
  if(schemaData.data.length == 0){
    hook.data["createdAt"] = new Date()
    hook.data["updatedAt"] = new Date()
    hook.data["user_id"] = user_data.data.userId
  }
  else if(schemaData.data.length > 0){
    throw new errors.GeneralError('This schema name already exists');
  }

}
