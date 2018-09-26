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
  module.exports.authorization = this.authorization;
  if(!hook.params.query["user_id"]){
    let uploaderData = await(hook.app.service('/uploader').get(hook.params.query["import_tracker_id"]))
    let user_data = await(axios.get(subscription_url + '/' + hook.params.query["subscriptionId"]))
    if(uploaderData.user_id == user_data.data.userId){
      schemaData = await(hook.app.service('/uploader-schema').find({query:{"user_id":user_data.data.userId,$limit: 1000}}))
      hook.result = schemaData
    }
    else {
      throw new errors.GeneralError('You have selected wrong subscription id...');
    }
  }

}


var beforeCreate = async function(hook){
  module.exports.authorization = this.authorization;
  let schemaData = []
  let uploaderData = await(hook.app.service('/uploader').get(hook.data["import_tracker_id"]))
  let user_data = await(axios.get(subscription_url + '/' + hook.data["subscriptionId"]))
  if(uploaderData.user_id == user_data.data.userId){
    schemaData = await(hook.app.service('/uploader-schema').find({query:{"name":hook.data.name,"user_id":user_data.data.userId}}))
    if(schemaData.data.length == 0){
      hook.data["createdAt"] = new Date()
      hook.data["updatedAt"] = new Date()
      hook.data["user_id"] = user_data.data.userId
    }
    else if(schemaData.data.length > 0){
      removedSchemaData = await(hook.app.service('/uploader-schema').remove(schemaData.data[0].id))  //remove the old record and insert the updated one
      hook.data["createdAt"] = new Date()
      hook.data["updatedAt"] = new Date()
      hook.data["user_id"] = user_data.data.userId
      // throw new errors.GeneralError('This mapping name already exists');
    }
  }
  else{
    throw new errors.GeneralError('You have selected wrong subscription id...')
  }

}
