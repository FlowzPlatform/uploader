const path = require('path');
const favicon = require('serve-favicon');
const compress = require('compression');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const feathers = require('feathers');
const configuration = require('feathers-configuration');
const hooks = require('feathers-hooks');
const rest = require('feathers-rest');
const socketio = require('feathers-socketio');
const handler = require('feathers-errors/handler');
const notFound = require('feathers-errors/not-found');
const middleware = require('./middleware');
const services = require('./services');
const appHooks = require('./app.hooks');
const rethinkdb = require('./rethinkdb');
const subscription = require('flowz-subscription');

// const mongodb = require('./mongodb');
const app = feathers();



// Load app configuration
app.configure(configuration());
// Enable CORS, security, compression, favicon and body parsing
app.use(cors());
app.use(helmet());
app.use(compress());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(favicon(path.join(app.get('public'), 'favicon.ico')));
// Host the public folder
app.use('/', feathers.static(app.get('public')));


app.use(function(req, res, next) {
 this.subscriptionId = req.headers['subscriptionid'];
 module.exports.subscriptionId = this.subscriptionId;
 this.authorization = req.headers['authorization'];
 module.exports.authorization = this.authorization;
 next();
});
// Set up Plugins and providers
app.configure(hooks());
// app.configure(mongodb);
app.configure(rethinkdb);
app.configure(rest());
// app.configure(socketio());

// app.configure(socketio(socketport,{
//   wsEngine: 'uws',
//   origin: '*.' + (process.env.domainkey ? 'localhost' : process.env.domainkey) + ':*'
// }));
app.use(subscription.featherSubscription)
// Configure other middleware (see `middleware/index.js`)
app.configure(middleware);
// Set up our services (see `services/index.js`)
app.configure(services);

// Configure a middleware for 404s and the error handler
app.use(notFound());
app.use(handler());
app.hooks(appHooks);

app.configure(socketio({
  wsEngine: 'uws',
  origin: '*.' + (process.env.domainKey ? 'localhost' : process.env.domainKey) + ':*'
}));
module.exports = app;
