// Initializes the `upload-image` service on path `/upload-image`
const createService = require('./upload-image.class.js');
const hooks = require('./upload-image.hooks');
const filters = require('./upload-image.filters');
const multer = require('multer');
const multipartMiddleware = multer();
const blobService = require('feathers-blob');
const fs = require('fs-blob-store');
const blobStorage = fs(__dirname + '/upload-image');


module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');

  const options = {
    name: 'upload-image',
    paginate,
    app: app
  };

//   app.use('/upload-image',multipartMiddleware.single('uri'),function(req,res,next){
//         req.feathers.file = req.file;
//         next();
//     },
//   blobService({Model: blobStorage})
// );


  // Initialize our service with any options it requires
  app.use('/upload-image', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('upload-image');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
