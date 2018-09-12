const assert = require('assert');
const app = require('../../src/app');

describe('\'asconfiguration\' service', () => {
  it('registered the service', () => {
    const service = app.service('asconfiguration');

    assert.ok(service, 'Registered the service');
  });
});
