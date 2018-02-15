let errors = require('@feathersjs/errors') ;

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
  let schemaData = []
  schemaData = await(hook.app.service('/uploader-schema').find({query:{"name":hook.data.name,"user_id":hook.data.user_id}}))
  console.log("schemaData.......",schemaData)
  if(schemaData.data.length == 0){
    hook.data["createdAt"] = new Date()
    hook.data["updatedAt"] = new Date()
  }
  else if(schemaData.data.length > 0){
    throw new errors.GeneralError('This schema name already exists');
  }

}
