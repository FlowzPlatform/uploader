/* eslint-disable no-unused-vars */
const multer = require('multer');
const multipartMiddleware = multer();
const blobService = require('feathers-blob');
const fs = require('fs-blob-store');
const blobStorage = fs(__dirname + '/upload-image');
var feathers = require('feathers');
var app = feathers();
class Service {
  constructor (options) {
    this.options = options || {};
    // console.log("options....",this.options)
  }

  find (params) {
    return Promise.resolve([]);
  }

  get (id, params) {
    return Promise.resolve({
      id, text: `A new message with ID: ${id}!`
    });
  }

  async create (data, params) {

    // console.log(data);
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current)));
    }

    // let createUrl = await this.createUrl();
    //
    // console.log("create_url+++++++++++++++++++++++++++",createUrl);
    return Promise.resolve(data);
  }

  update (id, data, params) {
    return Promise.resolve(data);
  }

  patch (id, data, params) {
    return Promise.resolve(data);
  }

  remove (id, params) {
    return Promise.resolve({ id });
  }

   createUrl(){
    return new Promise((resolve , reject) => {
      app.use('/upload-image',multipartMiddleware.single('uri'),function(req,res,next){
         console.log("req.....",req.file)
              req.feathers.file = req.file;
              next();
          },
        blobService({Model: blobStorage})
      );
      // console.log("blob_storage.....",blobStorage)
      // return image_url
      resolve(blobStorage)
    })
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
