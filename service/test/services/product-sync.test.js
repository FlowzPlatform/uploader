const assert = require('assert');
const app = require('../../src/app');

describe('\'ProductSync\' service', () => {
  it('registered the service', () => {
    const service = app.service('product-sync');

    assert.ok(service, 'Registered the service');
  });
});
