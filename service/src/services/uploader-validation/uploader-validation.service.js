// Initializes the `uploader-validation` service on path `/uploader-validation`
const createService = require('./uploader-validation.class.js');
const hooks = require('./uploader-validation.hooks');
const filters = require('./uploader-validation.filters');

module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');

  const options = {
    name: 'uploader-validation',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/uploader-validation', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('uploader-validation');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
