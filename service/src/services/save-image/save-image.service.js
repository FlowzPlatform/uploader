// Initializes the `save-image` service on path `/save-image`
const createService = require('feathers-rethinkdb');
const hooks = require('./save-image.hooks');
const filters = require('./save-image.filters');

module.exports = function () {
  const app = this;
  const Model = app.get('rethinkdbClient');
  const paginate = app.get('paginate');

  const options = {
    name: 'save_image',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/save-image', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('save-image');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
