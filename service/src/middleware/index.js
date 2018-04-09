const subscription = require('flowz-subscription');
module.exports.subscription = subscription
const authentication = require('../authentication')
// const flowzError = require('flowz-error-handler');

let app = undefined;
module.exports = function () {
  // Add your custom middleware here. Remember, that
  // in Express the order matters
  app = this; // eslint-disable-line no-unused-vars

  // check authentication
  app.use(authentication)

  subscription.moduleResource.moduleName = 'uploader'
 let registerAppModule = {
   'uploader': ['create']
 }

 subscription.moduleResource.registerAppModule = registerAppModule
 subscription.moduleResource.appRoles = ['Admin', 'CSR']
 subscription.registeredAppModulesRole()

 subscription.registerDynamicHooks(app, registerAppModule)



  // Check subscription
  // app.use(subscription.subscription);
  // subscription.secureService.validate = (route, params, secureRouteInfo) => {
  //   return new Promise(async(resolve, reject) => {
  //     var data = await handleSubscription(route, params, secureRouteInfo)
  //     resolve(data)
  //   });
  // };
  // app.use(flowzError());
};




var handleSubscription = (route, params, secureRouteInfo) => {
  var routes = {
    '/databases': async() => {
      let _count = await getDatabasesCount()
      return secureRouteInfo.value > _count
    }
  }
  return (routes[route]) ? routes[route]() : true
}

var getDatabasesCount = async() => {
  return await app.service('databases').find({
    query: {
      $limit: 0
    }
  }).then(result => result.total)
}
