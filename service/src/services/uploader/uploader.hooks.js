let errors = require('@feathersjs/errors') ;
let async = require('asyncawait/async');
let await = require('asyncawait/await');
let axios = require('axios');
let domainkey = process.env.domainKey ? process.env.domainKey : 'flowzcluster.tk'
let subscription_url = 'https://api.' + domainkey + '/subscription/user-subscription'
let getUserdetailUrl = 'https://api.' + domainkey + '/user/getuserdetails/'
const _ = require('lodash');
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
    patch: [
      hook => beforePatch(hook)
    ],
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
  if(hook.params.query["subscriptionId"] && !hook.params.query["role"] && !hook.params.query["user_id"]){

    let user_data = await(axios.get(subscription_url + '/' + hook.params.query["subscriptionId"]))
    if(hook.params.query["masterJobStatus"] && hook.params.query["key"]){

      let uploaderData = await(hook.app.service('/uploader').find({query:{"user_id":user_data.data.userId,"masterJobStatus":hook.params.query.masterJobStatus,"key":hook.params.query.key}}))

      hook.result = uploaderData
    }
    else if(hook.params.query["id"] && hook.params.query["masterJobStatus"]){

      let uploaderData = await(hook.app.service('/uploader').find({query:{"user_id":user_data.data.userId,"masterJobStatus":hook.params.query.masterJobStatus,"id":hook.params.query.id}}))
      hook.result = uploaderData
    }
  }
  else if(hook.params.query["user_id"] && hook.params.query["role"]){

    delete hook.params.query["role"]
    let uploaderData = await(hook.app.service('/uploader').find({query:{"user_id":hook.params.query["user_id"],$sort: {"id": -1},$limit: 1000}}))
    hook.result = uploaderData
  }
  else if(hook.params.query["user_id"] && hook.params.query["subscriptionId"] && !hook.params.query["$sort"]){

    let uploaderData = await(hook.app.service('/uploader').find({query:{"subscriptionId":hook.params.query["subscriptionId"],"user_id":hook.params.query["user_id"],$sort: {"id": -1},$limit: 1000}}))
    hook.result = uploaderData
  }
}


var beforeCreate = async function(hook){
  module.exports.subscriptionId = this.subscriptionId;
  module.exports.authorization = this.authorization;
  let user_data = await(axios.get(subscription_url + '/' + hook.data["subscriptionId"] ))
  let tdata = []
  tdata = await(hook.app.service('/uploader').find({query:{"masterJobStatus":"running","user_id":user_data.data.userId}}))
  if(tdata.data.length == 0){
    let user_details = await axios({
       method: 'get',
       url: getUserdetailUrl + user_data.data.userId,
       headers: {
         'authorization': module.exports.authorization
       }
     })
    if(hook.data.stepStatus == 'upload_pending'){
      hook.data["createdAt"] = new Date()
      hook.data["key"] = 'pdm_uploader'
      hook.data["masterJobStatus"] = 'running',
      hook.data["user_id"] = user_data.data.userId
      if(user_details.data.data[0].firstname && user_details.data.data[0].lastname){
        hook.data["username"] = user_details.data.data[0].firstname +  " " + user_details.data.data[0].lastname
      }
      else if(user_details.data.data[0].email){
        hook.data["username"] = user_details.data.data[0].email
      }
    }
    else{
      throw new errors.BadRequest('Invalid Parameters', {
        errors: { stepStatus: 'Invalid stepStatus' }
      });
    }
  }
  else if(tdata.data.length > 0){
    throw new errors.GeneralError('Running Job already exists');
  }
}

var beforePatch = async function(hook){
  let pdata = []
  pdata = await(hook.app.service('/uploader').get(hook.id))
  if(pdata != ""){
    if(pdata.masterJobStatus == 'running'){
      if(hook.data.stepStatus == 'validation_running'){
        if(pdata.stepStatus != 'upload_pending'){
          throw new errors.BadRequest({
            errors: { stepStatus: 'Invalid initial stepStatus' }
          });
        }
        else if(pdata.stepStatus == 'upload_pending' && Object.keys(pdata).indexOf('ProductInformation') == -1){
          throw new errors.GeneralError('No file uploaded...stepStatus cannot be changed');
        }
      }
      else if(hook.data.stepStatus == 'validation_completed' && !hook.data["abort"]  && !hook.data["abort_from_import"]){
        if(pdata.stepStatus != 'validation_running'){
          throw new errors.BadRequest({
            errors: { stepStatus: 'Invalid initial stepStatus' }
          });
        }
      }
      else if(hook.data.stepStatus == 'validation_completed' && hook.data["abort"]){
        delete hook.data["abort"]
        let status_array = ['import_to_confirm','import_to_confirm_in_progress']
        if(_.indexOf(status_array, pdata.stepStatus) == -1){
          throw new errors.BadRequest({
            errors: { stepStatus: 'Invalid initial stepStatus' }
          });
        }
      }
      else if(hook.data.stepStatus == 'validation_completed' && hook.data["abort_from_import"]){
        delete hook.data["abort_from_import"]
        if(pdata.stepStatus != 'import_in_progress'){
          throw new errors.BadRequest({
            errors: { stepStatus: 'Invalid initial stepStatus' }
          });
        }
      }
      else if(hook.data.stepStatus == 'import_in_progress'){
        if(pdata.stepStatus != 'validation_completed'){
          throw new errors.BadRequest({
            errors: { stepStatus: 'Invalid initial stepStatus' }
          });
        }
      }
      else if(hook.data.stepStatus == 'import_to_confirm'){
        if(pdata.stepStatus != 'import_in_progress'){
          throw new errors.BadRequest({
            errors: { stepStatus: 'Invalid initial stepStatus' }
          });
        }
      }
      else if(hook.data.stepStatus == 'import_to_confirm_in_progress'){
        if(pdata.stepStatus != 'import_to_confirm'){
          throw new errors.BadRequest({
            errors: { stepStatus: 'Invalid initial stepStatus' }
          });
        }
      }
      else if(hook.data.stepStatus == 'import_completed'){
        if(pdata.stepStatus != 'import_to_confirm_in_progress'){
          throw new errors.BadRequest({
            errors: { stepStatus: 'Invalid initial stepStatus' }
          });
        }
      }
    }
    else if(pdata.masterJobStatus == 'rejected' || pdata.masterJobStatus == 'completed'){
        throw new errors.GeneralError('stepStatus cannot be changed');
    }
  }
}
