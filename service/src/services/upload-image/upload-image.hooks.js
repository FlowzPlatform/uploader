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
    create: [
       // hook => beforeCreate(hook)
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

async function beforeCreate  (hook) {
  let file_name = hook.data.file_name.split(".");
  console.log("file_name .....",file_name)
  let result = await (cloudinary.v2.uploader.upload(hook.data.uri,{public_id: file_name[0],resource_type: "raw",folder:'product_images/'+ hook.data.import_tracker_id + '/'}))
  console.log("result....",result)
  hook.data.secure_url = result.secure_url
}

// async function afterCreate(hook){
//   console.log("+++++++++++",resp)
//   hook.result.file_path = resp.secure_url
// }

//  function beforeCreate  (hook) {
//          if (!hook.data.uri && hook.params.file){
//              const file = hook.params.file;
//              const uri = dauria.getBase64DataURI(file.buffer, file.mimetype);
//              hook.data = {uri: uri};
//          }
// }
//
// async function afterCreate (hook) {
//        hook.result.file_name = hook.data.file_name
//        console.log("result after hook.......",hook.result)
//        let file_name = hook.data.file_name.split(".");
//        let result = await(cloudinary.uploader.upload(__dirname + "/upload-image/" + hook.result.id,function(){},{public_id: file_name[0]}));
//        hook.result.file_path = result.secure_url
// }
