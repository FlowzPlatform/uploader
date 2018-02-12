// Initializes the `saveImages` service on path `/save-images`
const createService = require('feathers-rethinkdb');
const hooks = require('./save-images.hooks');
const filters = require('./save-images.filters');
const socketio = require('feathers-socketio');

module.exports = function () {
  const app = this;
  const Model = app.get('rethinkdbClient');
  const paginate = app.get('paginate');

  app.configure(socketio(function(io) {
  io.on('connection', function(socket) {
    socket.on('image',async function( data){
      console.log("data....",data)
      // let file = data.file_name.toJSON()
      // console.log("file.....",JSON.parse(data.toString()))
    //   cloudinary.uploader.upload("Cute-Cat-HD-Wallpapers-624x440.jpg", function(result) {
    //    console.log(result)
    //  });

  });
  });
  io.use(function (socket, next) {
   // Exposing a request property to services and hooks
   socket.feathers.referrer = socket.request.referrer;
   next();
 });
 }));

  const options = {
    name: 'save_images',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/save-images', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('save-images');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
