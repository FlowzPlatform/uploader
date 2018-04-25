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
let image_response = []
let image_err = []
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
          // let imgupld_res = await uploadImage(item).then(res => {
          //   if(res.hasOwnProperty('iserror')){
          //     image_err.push(res)
          //   }
          //   else{
          //     image_response.push(res)
          //   }
          // })
          promiseAll.push(uploadImage(item))
        }

        Promise.all(promiseAll).then(function(values) {
          console.log(values);
          socket.emit('img_res',values)
        });


        // if(image_response.length != 0){
        //   socket.emit('img_res',image_response)
        //   image_response = []
        // }
        //
        // if(image_err.length != 0){
        //   console.log("image_err.length +++",image_err.length)
        //   socket.emit('img_err',image_err)
        //   image_err = []
        // }


      // return new Promise(async(resolve,reject) => {
      //   for(let i=0 ;i<data.length ;i++){
      //     await cloudinary.v2.uploader.upload(data[i].file.url,
      //       { public_id: data[i].file.filename, resource_type: "raw",folder: data[i].folder},
      //       function(error, result) {
      //         if(error){
      //           console.log('&&&&&&&&&&',error)
      //           socket.emit('img_err',error)
      //         }
      //         else{
      //           console.log("result....",result)
      //           result.file_name = data[i].file.filename
      //           image_response.push(result)
      //           // socket.emit('img_res',result)
      //         }
      //       });
      //   }
      //   console.log('%%%%%% image_response %%%%%%',image_response)
      //   socket.emit('img_res',image_response)
      //   image_response = []
      //   resolve('done')
      // })
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
          // console.log('&&&&&&&&&&',error)
          resolve({"iserror":true,"msg_error":error,"filename":data.file.filename})
        }
        else{
          result.file_name = data.file.filename
          resolve(result)
        }
      });
  })
  return Promise.resolve(_promise).then(res => {
    return res;
  }).catch(err => {
    // console.log("err....",err)
    return err;
  })
}
