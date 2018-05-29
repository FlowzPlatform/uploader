// Initializes the `upload-image` service on path `/upload-image`
const createService = require('./upload-image.class.js');
const hooks = require('./upload-image.hooks');
const filters = require('./upload-image.filters');
const multer = require('multer');
const multipartMiddleware = multer();
const blobService = require('feathers-blob');
const fs = require('fs-blob-store');
const blobStorage = fs(__dirname + '/upload-image');
const socketio = require('feathers-socketio');
let cloudinary = require('cloudinary')
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


module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');


  app.configure(socketio(function(io) {
  io.on('connection',function(socket) {
    socket.on('error', function (err) {
        console.log("err...",err)
    });

    socket.on('pdmimages',async function(data) {
      let promiseAll = []
        for(let item of data){
          promiseAll.push(uploadImage(item))
        }

        Promise.all(promiseAll).then(function(values) {
          console.log('----------------------------------------- values', values)
          socket.emit('img_res',values)
        });

    });

  });
  io.use(function (socket, next) {
   // Exposing a request property to services and hooks
   socket.feathers.referrer = socket.request.referrer;
   next();
 });
 }));

  const options = {
    name: 'upload-image',
    paginate,
    app: app
  };

  // Initialize our service with any options it requires
  app.use('/upload-image', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('upload-image');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};

var uploadImage = async function(data){
  let _promise = new Promise((resolve,reject) => {
    cloudinary.v2.uploader.upload(data.file.url,
      { public_id: data.file.filename, resource_type: "raw",folder: data.folder},
      function(error, result) {
        if(error){
          resolve({"iserror":true,"msg_error":error,"filename":data.file.filename})
        }
        else{
          result.file_name = data.file.filename
          console.log('result.....', result)
          resolve(result)
        }
      });
  })
  return Promise.resolve(_promise).then(res => {
    return res;
  }).catch(err => {
    return err;
  })
}
