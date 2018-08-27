// Initializes the `product-validation` service on path `/product-validation`
const createService = require('./product-validation.class.js');
const hooks = require('./product-validation.hooks');
const filters = require('./product-validation.filters');

module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');

  const options = {
    name: 'product-validation',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/product-validation', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('product-validation');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
