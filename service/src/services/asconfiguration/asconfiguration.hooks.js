

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      hook => beforeCreate(hook)
    ],
    update: [
      hook => beforeUpdate(hook)
    ],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};


function beforeCreate (hook) {
  let date = new Date();
  hook.data.createdAt = date.toISOString();
}

function beforeUpdate(hook) {
  let date = new Date();
  hook.data.createdAt = date.toISOString();
}