const assert = require('assert');
const app = require('../../src/app');

describe('\'product-validation\' service', () => {
  it('registered the service', () => {
    const service = app.service('product-validation');

    assert.ok(service, 'Registered the service');
  });
});
