

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
       hook => console.log("$$$$$$$$$$",hook.data)
    ],
    update: [],
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
