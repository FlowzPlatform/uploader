// let cloudinary = require('cloudinary')
const dauria = require('dauria');
// let cloudname = ''
// let apikey = ''
// let apisecret = ''
// if(process.env.cloudname){
//   cloudname = process.env.cloudname
// }
// if(process.env.apikey){
//   apikey = process.env.apikey
// }
// if(process.env.apisecret){
//   apisecret = process.env.apisecret
// }
//
//
// cloudinary.config({
//   cloud_name: cloudname,
//   api_key: apikey,
//   api_secret: apisecret
// });

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      //  hook => beforeCreate(hook)
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
    //  hook => afterCreate(hook)
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

//  function beforeCreate  (hook) {
//          if (!hook.data.uri && hook.params.file){
//              const file = hook.params.file;
//              const uri = dauria.getBase64DataURI(file.buffer, file.mimetype);
//              hook.data = {uri: uri};
//          }
//
//         //  hook.result = hook.data
// }
//
// async function afterCreate (hook) {
//        //hook.result.file_name = hook.data.file_name
//        console.log("result after hook.......",hook.result)
//       //  let file_name = hook.data.file_name.split(".");
//       //  let result = await(cloudinary.uploader.upload(__dirname + "/upload-image/" + hook.result.id,function(){},{public_id: file_name[0]}));
//       //  hook.result.file_path = result.secure_url
// }
