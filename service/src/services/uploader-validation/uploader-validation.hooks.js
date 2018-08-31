const ProductInformationRules = require('../../validation_rules/product_information');
const ProductPriceRules = require('../../validation_rules/product_price');
const ProductImprintDataRules = require('../../validation_rules/product_imprint_data');
const ProductShippingRules = require('../../validation_rules/product_shipping');
const ProductImagesRules = require('../../validation_rules/product_images');
const ProductAdditionalChargesRules = require('../../validation_rules/product_additional_charge');
const ProductVariationPriceRules = require('../../validation_rules/product_variation_pricing');
const WebsiteInventoryRules = require('../../validation_rules/website_inventory');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
const config1 = require('../../../config/default.json');
let errors = require('@feathersjs/errors') ;
let axios = require('axios');
config1.mongodb_host = process.env.mongodb_host ? process.env.mongodb_host : 'localhost'
config1.mongodb_port = process.env.mongodb_port ? process.env.mongodb_port : '27017'
config1.mongodb_database = process.env.mongodb_database ? process.env.mongodb_database : 'pdmuploader'
config1.username = process.env.username ? process.env.username : null
config1.password = process.env.password ? process.env.password : null

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      hook => beforeCreate(hook)
    ],
    update: [],
    patch: [
      hook => beforePatch(hook)
    ],
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

var beforeCreate = async function(hook){
  // var url = 'mongodb://' + config1.mongodb_host + ':' + config1.mongodb_port + '/pdmuploader';
  var url = 'mongodb://' + config1.username + ':' + config1.password + '@' + config1.mongodb_host + ':' + config1.mongodb_port + '/' + config1.mongodb_database;
  var cnn_with_mongo = await connectToMongo(hook,url).then(res => {
    return res
  })
  .catch(err => {
    throw err
  })
}

var connectToMongo = async function(hook,url){
  var db = await (MongoClient.connect(url).then(res => {
    return res
  })
  .catch(err => {
    throw new errors.GeneralError('Mongodb Service unavailable');
  }))

  let collection_name = hook.data.sheet_name.split(" ")
  let prod_name = collection_name[0]
  collection_name.splice(0,1)
  for(let i=0 ;i<collection_name.length;i++){
    name = collection_name[i].toLowerCase()
  }
  collection_name = "uploader" + prod_name + name
  let rules = []
  if(hook.data.sheet_name == "Product Information"){
    rules = ProductInformationRules
  }
  else if(hook.data.sheet_name == "Product Price"){
    rules = ProductPriceRules
  }
  else if(hook.data.sheet_name == "Product Imprint Data"){
    rules = ProductImprintDataRules
  }
  else if(hook.data.sheet_name == "Product Shipping"){
    rules = ProductShippingRules
  }
  else if(hook.data.sheet_name == "Product Image"){
    rules = ProductImagesRules
  }
  else if (hook.data.sheet_name == "Website Inventory") {
    rules = WebsiteInventoryRules
  } 
  else if(hook.data.sheet_name == "Product Additional Charges"){
    rules = ProductAdditionalChargesRules
  }
  else if(hook.data.sheet_name == "Product Variation Price"){
    rules = ProductVariationPriceRules
  }
  let errors_arr = []
  let flag = 0
  let err_obj = {"err_data":'',"err_fields":[]}
  let rule_value
  let uploader_obj = await(hook.app.service('/uploader').get(hook.data.id))
  if(uploader_obj[hook.data.key].hasOwnProperty("currentRuleIndex") && uploader_obj[hook.data.key]["currentRuleIndex"] != 0){
    rule_value = uploader_obj[hook.data.key]["currentRuleIndex"] - 1
  }
  else{
    rule_value = 0
  }


      for(let j=rule_value ;j<rules.length;j++){
          let query = rules[j].qryMongo
          query["import-tracker_id"] = hook.data.id
          var query_result = await (db.collection(collection_name).find(query).toArray().then(res => {
            return res
          })
          .catch(err => {
            console.log("error in finding data from collection =======>",err)
          }))

          if(hook.data.sheet_name == "Product Image"){
            if(query_result.length != 0 && j != 0){
              var cloud_res = await checkImage(query_result,rules[j].columnName).then(response => {
                return response
              })
              .catch(err => {
                console.log("err",err)
              })
              if(cloud_res == 'done'){
                query_result = []
              }
              else{
                query_result = cloud_res
              }
            }
          }
          // uploader_obj = await(hook.app.service('/uploader').get(hook.data.id))
          let obj = uploader_obj[hook.data.key]
          delete uploader_obj[hook.data.key]
          obj["ruleIndex"] = rules.length
          obj["currentRuleIndex"] = j + 1
          // obj["validate_flag"] = 'running'
          uploader_obj[hook.data.key] = obj
          uploader_obj["validate_flag"] = 'running'

          if(query_result.length > 0) {
            err_obj["err_data"] = query_result
            err_obj["err_fields"].push({"columnName":rules[j].columnName, "errorString": rules[j].errorString,"errCode":rules[j].errorCode })
            obj["currentRuleIndex"] = j
            var update_ruleindx = await(hook.app.service('/uploader').update(hook.data.id,uploader_obj))
            break;
          }
          var update_ruleindx = await(hook.app.service('/uploader').update(hook.data.id,uploader_obj))
    }
    errors_arr.push(err_obj)
    if(errors_arr[0].err_data.length != 0){
      let obj = uploader_obj[hook.data.key]
      delete uploader_obj[hook.data.key]
      // delete obj["validate_flag"]
      uploader_obj[hook.data.key] = obj
      delete uploader_obj["validate_flag"]
      var update_val_flag = await(hook.app.service('/uploader').update(hook.data.id,uploader_obj))
      hook.result = errors_arr
    }
    else{
      // let uploader_obj = await(hook.app.service('/uploader').get(hook.data.id))
      let obj = uploader_obj[hook.data.key]
      delete uploader_obj[hook.data.key]
      obj.validateStatus = "completed"
      uploader_obj[hook.data.key] = obj
      uploader_obj["validate_flag"] = "completed"
      var tdata = await(hook.app.service('/uploader').update(hook.data.id,uploader_obj))
      hook.result = tdata
    }

}

var beforePatch= async function(hook){
  // var url = 'mongodb://' + config1.mongodb_host + ':' + config1.mongodb_port + '/pdmuploader';
  var url = 'mongodb://' + config1.username + ':' + config1.password + '@' + config1.mongodb_host + ':' + config1.mongodb_port + '/' + config1.mongodb_database;
  var cnn_with_mongo = await UpdateInMongo(hook,url).then(res => {
    return res
  })
  .catch(err => {
    throw err
  })
}

var UpdateInMongo = async function(hook,url){
  var db = await (MongoClient.connect(url).then(res => {
    return res
  })
  .catch(err => {
    throw new errors.GeneralError('Mongodb Service unavailable');
  }))
  let collection_name = hook.data.sheet_name.split(" ")
  let prod_name = collection_name[0]
  collection_name.splice(0,1)
  for(let i=0 ;i<collection_name.length;i++){
    name = collection_name[i].toLowerCase()
  }
  collection_name = "uploader" + prod_name + name
  let columnName = hook.data.columnname
  let newValue = hook.data.newValue
  var query = {
        "$set": {
            [columnName]: newValue
        }
    };
  var query_result = await (db.collection(collection_name).update({_id:hook.data._id},query).then(res => {
    return res
  }).catch(err => {
    throw new errors.GeneralError('Unable to update data');
  }))

   hook.result = query_result
}

var checkImage = async function(imagedata,colname){
  return new Promise(async(resolve,reject) => {
      let img_err_data = []
      for(let i=0;i<imagedata.length;i++){
        let secure_url = imagedata[i][colname]
        await(axios.get(secure_url)
        .catch(err => {
          img_err_data.push(imagedata[i])
        })
        )
      }

      if(img_err_data.length > 0){
        resolve(img_err_data)
      }
      else {
        resolve('done')
      }
  })
}
