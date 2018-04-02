// Initializes the `/pdm_uploader_data` service on path `/pdm-uploader-data`
const createService = require('./pdm-uploader-data.class.js');
const hooks = require('./pdm-uploader-data.hooks');
const filters = require('./pdm-uploader-data.filters');
const socketio = require('feathers-socketio');
const config1 = require('../../../config/default.json');
let shell = require('shelljs');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
const _ = require('lodash');
const ProductInformationSchema = require('../../schema/product_information');
const ProductPriceSchema = require('../../schema/product_price');
const ProductImprintDataSchema = require('../../schema/product_imprint_data');
const ProductShippingSchema = require('../../schema/product_shipping');
const ProductImageSchema = require('../../schema/product_images');
const ProductVariationPriceSchema = require('../../schema/product_variation_pricing');
const ProductAdditionalChargeSchema = require('../../schema/product_additional_charge');


config1.mongodb_host = process.env.mongodb_host ? process.env.mongodb_host : 'localhost'
config1.mongodb_port = process.env.mongodb_port ? process.env.mongodb_port : '27017'
config1.username = process.env.username ? process.env.username : null
config1.password = process.env.password ? process.env.password : null


module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');

  app.configure(socketio(function(io) {
  io.on('connection',function(socket) {
    socket.on('pdmData',async function( data){
          var url = 'mongodb://' + config1.username + ':' + config1.password + '@' + config1.mongodb_host + ':' + config1.mongodb_port + '/pdmuploader';
          var cnn_with_mongo = await connectToMongo(url,data,socket).then(res => {
            if(res.result){
              socket.emit('response',{stdout:res.result})
            }
            else{
              if(res.message){
                socket.emit('err',{stdout: res.message})
              }
            }
          }).catch(error => {
            socket.emit('err',{stdout: 'Error in saving data'})
          })
  });
  });
  io.use(function (socket, next) {
   // Exposing a request property to services and hooks
   socket.feathers.referrer = socket.request.referrer;
   next();
 });
 }));

  const options = {
    name: 'pdm-uploader-data',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/pdm-uploader-data', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('pdm-uploader-data');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};

var connectToMongo = async function(url,data,socket){
    var db = await (MongoClient.connect(url).then(res => {
      return res
    })
    .catch(err => {
       socket.emit('err',{stdout:'Unable to connect mongodb database.'})
       // throw new errors.GeneralError(err);
    }))

    let collection_name = data.activetab.split(" ")
    collection_name = data.activetab.split(" ")
    let prod_name = collection_name[0]
    let name = ''
    let schemarules = {}
    collection_name.splice(0,1)
    for(let i=0 ;i<collection_name.length;i++){
      name = name + collection_name[i].toLowerCase()
    }
    collection_name = "uploader" + prod_name + name


    if(data.activetab == "Product Information"){
      schemarules = ProductInformationSchema
    }
    else if(data.activetab == "Product Price"){
      schemarules = ProductPriceSchema
    }
    else if(data.activetab == "Product Imprint Data"){
      schemarules = ProductImprintDataSchema
    }
    else if(data.activetab == "Product Image"){
      schemarules = ProductImageSchema
    }
    else if(data.activetab == "Product Shipping"){
      schemarules = ProductShippingSchema
    }
    else if(data.activetab == "Product Variation Price"){
      schemarules = ProductVariationPriceSchema
    }
    else if(data.activetab == "Product Additional Charges"){
      schemarules = ProductAdditionalChargesSchema
    }


    for(let i=0;i<data.newCSV.length;i++){
      for(key in data.newCSV[i]){
        for(let schema_key in schemarules){
          if(key == schema_key && schemarules[schema_key] == "string"){
            if(typeof(data.newCSV[i][key]) != "string"){
              data.newCSV[i][key] =  data.newCSV[i][key].toString()
            }
          }
        }
      }
    }




    var response = await (db.listCollections().toArray())
       let index = _.findIndex(response, function(o) { return o.name == collection_name; });
        if(index == -1){
          var response = await db.createCollection(collection_name)
          var result = await (db.collection(collection_name).insert(data.newCSV)).then(res => {
            return res
          }).catch(err => {
            return err
          })
          return result
      }
      else{
        var result = await (db.collection(collection_name).insert(data.newCSV).then(res => {
          return res
        }).catch(err => {
          return err
        }))
        return result
      }
}
