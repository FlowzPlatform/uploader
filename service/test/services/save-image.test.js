const assert = require('assert');
const app = require('../../src/app');

describe('\'save-image\' service', () => {
  it('registered the service', () => {
    const service = app.service('save-image');

    assert.ok(service, 'Registered the service');
  });
});
