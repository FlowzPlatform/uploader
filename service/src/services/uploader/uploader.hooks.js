let errors = require('@feathersjs/errors') ;
const _ = require('lodash');
module.exports = {
  before: {
    all: [],
    find: [],
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



var beforeCreate = async function(hook){
  module.exports.subscriptionId = this.subscriptionId;
  let tdata = []
  tdata = await(hook.app.service('/uploader').find({query:{"masterJobStatus":"running","user_id":hook.data.user_id}}))
  if(tdata.data.length == 0){
    if(hook.data.stepStatus == 'upload_pending'){
      hook.data["subscriptionId"] = module.exports.subscriptionId
      hook.data["createdAt"] = new Date()
      hook.data["key"] = 'pdm_uploader'
      hook.data["masterJobStatus"] = 'running'
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
