const assert = require('assert');
const app = require('../../src/app');

describe('\'saveImages\' service', () => {
  it('registered the service', () => {
    const service = app.service('save-images');

    assert.ok(service, 'Registered the service');
  });
});
