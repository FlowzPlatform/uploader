// Initializes the `asconfiguration` service on path `/asconfiguration`
const createService = require('feathers-rethinkdb');
const hooks = require('./asconfiguration.hooks');
const filters = require('./asconfiguration.filters');

module.exports = function () {
  const app = this;
  const Model = app.get('rethinkdbClient');
  const paginate = app.get('paginate');

  const options = {
    name: 'asconfiguration',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/asconfiguration', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('asconfiguration');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
