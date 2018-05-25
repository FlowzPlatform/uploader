// Initializes the `ProductSync` service on path `/product-sync`
const createService = require('feathers-rethinkdb');
const hooks = require('./product-sync.hooks');
const filters = require('./product-sync.filters');

module.exports = function () {
  const app = this;
  const Model = app.get('rethinkdbClient');
  const paginate = app.get('paginate');

  const options = {
    name: 'product_sync',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/product-sync', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('product-sync');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
