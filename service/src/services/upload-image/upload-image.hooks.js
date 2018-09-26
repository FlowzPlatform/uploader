let cloudinary = require('cloudinary')
const dauria = require('dauria');
let cloudname = ''
let apikey = ''
let apisecret = ''
let response
if(process.env.cloudname){
  cloudname = process.env.cloudname
}
if(process.env.apikey){
  apikey = process.env.apikey
}
if(process.env.apisecret){
  apisecret = process.env.apisecret
}


cloudinary.config({
  cloud_name: cloudname,
  api_key: apikey,
  api_secret: apisecret
});

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [
       hook => beforeRemove(hook)
    ]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [
     // hook => afterCreate(hook)
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

async function beforeRemove(hook) {
  let image = ""
  if(hook.params.query.resource){
    resource = hook.params.query.resource
  }
  let response = await deleteFromCloudinary(resource,hook).then(result => {
    return result
  })
  .catch(err => {
    throw err
  })
}


function deleteFromCloudinary(resource,hook) {
  return new Promise((resolve,reject) => {
    cloudinary.v2.api.delete_resources_by_prefix(resource,{resource_type:'raw'}).then(res => {
     hook.data = res
     resolve(res)
   })
   .catch(err => {
      reject(err)
   })
  })
}
