let async = require('asyncawait/async');
let await = require('asyncawait/await');
let errors = require('@feathersjs/errors') ;
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
  module.exports.authorization = this.authorization;
  let uploaderData = await(hook.app.service('/uploader').get(hook.data["import_tracker_id"]))
  let user_data = await(axios.get(subscription_url + '/' + hook.data["subscriptionId"]))
    if(uploaderData.user_id == user_data.data.userId){
      csvData = await(hook.app.service('/uploader-csv-files').find({query:{"name":hook.data.name,"user_id":user_data.data.userId,"import_tracker_id":hook.data.import_tracker_id}}))
      if(csvData.data.length == 0){
        hook.data["createdAt"] = new Date()
        hook.data["updatedAt"] = new Date()
        hook.data["deletedAt"] = ''
        hook.data["user_id"] = user_data.data.userId
      }
      else if(csvData.data.length > 0){
        throw new errors.GeneralError('This csv file entry already exists',{CSVFileId: csvData.data[0].id});
      }
    }
    else{
      throw new errors.GeneralError('You have selected wrong subscription id...')
    }
}
