let errors = require('@feathersjs/errors');
const ProductInformationRules = require('../../validation_rules/product_information');
const ProductPriceRules = require('../../validation_rules/product_price');
const ProductImprintDataRules = require('../../validation_rules/product_imprint_data');
const ProductShippingRules = require('../../validation_rules/product_shipping');
const ProductImagesRules = require('../../validation_rules/product_images');

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      hook => beforeCreate(hook)
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

var beforeCreate = async function(hook) {
  /* var db = await (MongoClient.connect(url).then(res => {
    return res
  })
  .catch(err => {
    throw new errors.GeneralError('Mongodb Service unavailable');
  })) */

  /* let collection_name = hook.data.sheet_name.split(" ")
  let prod_name = collection_name[0]
  collection_name.splice(0,1)
  for(let i=0 ;i<collection_name.length;i++){
    name = collection_name[i].toLowerCase()
  }
  collection_name = "uploader" + prod_name + name; */
  // console.log('HOOOK', hook)
  let rules = [];
  
  if (hook.data.sheet_name == "Product Information") {
    rules = ProductInformationRules;
  } else if (hook.data.sheet_name == "Product Price") {
    rules = ProductPriceRules;
  } else if (hook.data.sheet_name == "Product Imprint Data") {
    rules = ProductImprintDataRules;
  } else if (hook.data.sheet_name == "Product Shipping") {
    rules = ProductShippingRules;
  } else if (hook.data.sheet_name == "Product Image") {
    rules = ProductImagesRules;
  } /* else if (hook.data.sheet_name == "Product Additional Charges") {
    rules = ProductAdditionalChargesRules;
  } else if (hook.data.sheet_name == "Product Variation Price") {
    rules = ProductVariationPriceRules;
  } */
  let errors_arr = [];
  let flag = 0;
  let err_fields = [];
  // let err_obj = { "err_data":'',"err_fields":[] };
  let rule_value = 0;
  /*let uploader_obj = await(hook.app.service('/uploader').get(hook.data.id));

   if (uploader_obj[hook.data.key].hasOwnProperty("currentRuleIndex")) {
    rule_value = uploader_obj[hook.data.key]["currentRuleIndex"] - 1
  } else {
    rule_value = 0
  } */
  console.log('RULES:::::', rules)
  for(let j=rule_value ;j<rules.length;j++) {
    let query
    if (rules[j].columnName == 'qty_1_max') {
      query = rules[j].qryObject(hook.data.data.qty_1_min, hook.data.data[rules[j].columnName], hook.data.data.qty_2_min);
    } else if (rules[j].columnName ==  'qty_2_min') {
      query = rules[j].qryObject(hook.data.data.qty_1_max, hook.data.data[rules[j].columnName])
    } else if (rules[j].columnName == 'qty_2_max') {
      query = rules[j].qryObject(hook.data.data.qty_2_min, hook.data.data[rules[j].columnName])
    } else if (rules[j].columnName == 'qty_3_min') {
      query = rules[j].qryObject(hook.data.data.qty_2_max, hook.data.data[rules[j].columnName])
    } else if (rules[j].columnName == 'qty_3_max') {
      query = rules[j].qryObject(hook.data.data.qty_3_min, hook.data.data[rules[j].columnName])
    } else if (rules[j].columnName == 'qty_4_min') {
      query = rules[j].qryObject(hook.data.data.qty_3_max, hook.data.data[rules[j].columnName])
    } else if (rules[j].columnName == 'qty_4_max') {
      query = rules[j].qryObject(hook.data.data.qty_4_min, hook.data.data[rules[j].columnName])
    } else if (rules[j].columnName == 'qty_5_min') {
      query = rules[j].qryObject(hook.data.data.qty_4_max, hook.data.data[rules[j].columnName])
    } else if (rules[j].columnName == 'qty_5_max') {
      query = rules[j].qryObject(hook.data.data.qty_5_min, hook.data.data[rules[j].columnName])
    } else if (rules[j].columnName == 'qty_6_min') {
      query = rules[j].qryObject(hook.data.data.qty_5_max, hook.data.data[rules[j].columnName])
    } else if (rules[j].columnName == 'qty_6_max') {
      query = rules[j].qryObject(hook.data.data.qty_6_min, hook.data.data[rules[j].columnName])
    } else if (rules[j].columnName == 'qty_7_min') {
      query = rules[j].qryObject(hook.data.data.qty_6_max, hook.data.data[rules[j].columnName])
    } else if (rules[j].columnName == 'qty_7_max') {
      query = rules[j].qryObject(hook.data.data.qty_7_min, hook.data.data[rules[j].columnName])
    } else if (rules[j].columnName == 'qty_8_min') {
      query = rules[j].qryObject(hook.data.data.qty_7_max, hook.data.data[rules[j].columnName])
    } else if (rules[j].columnName == 'qty_8_max') {
      query = rules[j].qryObject(hook.data.data.qty_8_min, hook.data.data[rules[j].columnName])
    } else if (rules[j].columnName == 'qty_9_min') {
      query = rules[j].qryObject(hook.data.data.qty_8_max, hook.data.data[rules[j].columnName])
    } else if (rules[j].columnName == 'qty_9_max') {
      query = rules[j].qryObject(hook.data.data.qty_9_min, hook.data.data[rules[j].columnName])
    } else if (rules[j].columnName == 'qty_10_min') {
      query = rules[j].qryObject(hook.data.data.qty_9_max, hook.data.data[rules[j].columnName])
    } else if (rules[j].columnName == 'qty_10_max') {
      query = rules[j].qryObject(hook.data.data.qty_10_min, hook.data.data[rules[j].columnName])
    } else if (rules[j].columnName == 'qty_11_min') {
      query = rules[j].qryObject(hook.data.data.qty_10_max, hook.data.data[rules[j].columnName])
    } else if (rules[j].columnName == 'qty_11_max') {
      query = rules[j].qryObject(hook.data.data.qty_11_min, hook.data.data[rules[j].columnName])
    } else if (rules[j].columnName == 'qty_12_min') {
      query = rules[j].qryObject(hook.data.data.qty_11_max, hook.data.data[rules[j].columnName])
    } else if (rules[j].columnName == 'qty_12_max') {
      query = rules[j].qryObject(hook.data.data.qty_12_min, hook.data.data[rules[j].columnName])
    } else if (rules[j].columnName == 'qty_13_min') {
      query = rules[j].qryObject(hook.data.data.qty_12_max, hook.data.data[rules[j].columnName])
    } else if (rules[j].columnName == 'qty_13_max') {
      query = rules[j].qryObject(hook.data.data.qty_13_min, hook.data.data[rules[j].columnName])
    } else if (rules[j].columnName == 'qty_14_min') {
      query = rules[j].qryObject(hook.data.data.qty_13_max, hook.data.data[rules[j].columnName])
    } else if (rules[j].columnName == 'qty_14_max') {
      query = rules[j].qryObject(hook.data.data.qty_14_min, hook.data.data[rules[j].columnName])
    } else if (rules[j].columnName == 'qty_15_min') {
      query = rules[j].qryObject(hook.data.data.qty_14_max, hook.data.data[rules[j].columnName])
    } else if (rules[j].columnName == 'qty_15_max') {
      query = rules[j].qryObject(hook.data.data.qty_15_min, hook.data.data[rules[j].columnName])
    } else if (rules[j].columnName == 'price_1') {
      query = rules[j].qryObject(hook.data.data.qty_1_min, hook.data.data[rules[j].columnName])
    } else if (rules[j].columnName == 'product_weight') {
      query = rules[j].qryObject(hook.data.data.carton_weight, hook.data.data[rules[j].columnName])
    } else {
      query = rules[j].qryObject(hook.data.data[rules[j].columnName]);
    }
    /* query["import-tracker_id"] = hook.data.id
    var query_result = await (db.collection(collection_name).find(query).toArray().then(res => {
      return res
    }).catch(err => {
      console.log("error in finding data from collection =======>",err)
    }))
    let obj = uploader_obj[hook.data.key]
    delete uploader_obj[hook.data.key]
    obj["ruleIndex"] = rules.length
    obj["currentRuleIndex"] = j + 1
    // obj["validate_flag"] = 'running'
    uploader_obj[hook.data.key] = obj
    uploader_obj["validate_flag"] = 'running' */
    console.log('Field:', rules[j].columnName, 'value:', hook.data.data[rules[j].columnName], 'validate:', query);
    if (query == true) {
      err_fields.push(rules[j].errorString);
      // err_obj["err_data"] = query_result;
      // err_obj["err_fields"].push({"columnName":rules[j].columnName, "errorString": rules[j].errorString,"errCode":rules[j].errorCode });
      // obj["currentRuleIndex"] = j;
      // var update_ruleindx = await(hook.app.service('/uploader').update(hook.data.id,uploader_obj))
      // break;
    }
    // var update_ruleindx = await(hook.app.service('/uploader').update(hook.data.id,uploader_obj))
  }
    // errors_arr.push(err_obj);
    hook.result = err_fields;
    /* if(errors_arr[0].err_data.length != 0) {
      let obj = uploader_obj[hook.data.key]
      delete uploader_obj[hook.data.key]
      // delete obj["validate_flag"]
      uploader_obj[hook.data.key] = obj
      delete uploader_obj["validate_flag"]
      var update_val_flag = await(hook.app.service('/uploader').update(hook.data.id,uploader_obj))
      hook.result = errors_arr
    } else {
      // let uploader_obj = await(hook.app.service('/uploader').get(hook.data.id))
      let obj = uploader_obj[hook.data.key]
      delete uploader_obj[hook.data.key]
      obj.validateStatus = "completed"
      uploader_obj[hook.data.key] = obj
      uploader_obj["validate_flag"] = "completed"
      var tdata = await(hook.app.service('/uploader').update(hook.data.id,uploader_obj))
      hook.result = tdata
    } */
}
