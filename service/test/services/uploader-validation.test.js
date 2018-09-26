const assert = require('assert');
const app = require('../../src/app');

describe('\'uploader-validation\' service', () => {
  it('registered the service', () => {
    const service = app.service('uploader-validation');

    assert.ok(service, 'Registered the service');
  });
});
