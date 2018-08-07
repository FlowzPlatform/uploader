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
  let rule_value = 0;

  if (Array.isArray(hook.data.data)) {
    hook.data.data.map(current => {
      validateObject(current)
    })
  } else {
    validateObject(hook.data.data)
  }

  function validateObject(data) {
    for(let j=rule_value ;j<rules.length;j++) {
      let query
      // console.log('hook.data.data:: ', hook.data.data , '  rules[j].columnName::: ', hook.data.data[rules[j].columnName])
      if (data != null && data[rules[j].columnName] != undefined) {
        if (rules[j].columnName == 'qty_1_max') {
          query = rules[j].qryObject(data.qty_1_min, data[rules[j].columnName], data.qty_2_min);
        } else if (rules[j].columnName ==  'qty_2_min') {
          query = rules[j].qryObject(data.qty_1_max, data[rules[j].columnName])
        } else if (rules[j].columnName == 'qty_2_max') {
          query = rules[j].qryObject(data.qty_2_min, data[rules[j].columnName])
        } else if (rules[j].columnName == 'qty_3_min') {
          query = rules[j].qryObject(data.qty_2_max, data[rules[j].columnName])
        } else if (rules[j].columnName == 'qty_3_max') {
          query = rules[j].qryObject(data.qty_3_min, data[rules[j].columnName])
        } else if (rules[j].columnName == 'qty_4_min') {
          query = rules[j].qryObject(data.qty_3_max, data[rules[j].columnName])
        } else if (rules[j].columnName == 'qty_4_max') {
          query = rules[j].qryObject(data.qty_4_min, data[rules[j].columnName])
        } else if (rules[j].columnName == 'qty_5_min') {
          query = rules[j].qryObject(data.qty_4_max, data[rules[j].columnName])
        } else if (rules[j].columnName == 'qty_5_max') {
          query = rules[j].qryObject(data.qty_5_min, data[rules[j].columnName])
        } else if (rules[j].columnName == 'qty_6_min') {
          query = rules[j].qryObject(data.qty_5_max, data[rules[j].columnName])
        } else if (rules[j].columnName == 'qty_6_max') {
          query = rules[j].qryObject(data.qty_6_min, data[rules[j].columnName])
        } else if (rules[j].columnName == 'qty_7_min') {
          query = rules[j].qryObject(data.qty_6_max, data[rules[j].columnName])
        } else if (rules[j].columnName == 'qty_7_max') {
          query = rules[j].qryObject(data.qty_7_min, data[rules[j].columnName])
        } else if (rules[j].columnName == 'qty_8_min') {
          query = rules[j].qryObject(data.qty_7_max, data[rules[j].columnName])
        } else if (rules[j].columnName == 'qty_8_max') {
          query = rules[j].qryObject(data.qty_8_min, data[rules[j].columnName])
        } else if (rules[j].columnName == 'qty_9_min') {
          query = rules[j].qryObject(data.qty_8_max, data[rules[j].columnName])
        } else if (rules[j].columnName == 'qty_9_max') {
          query = rules[j].qryObject(data.qty_9_min, data[rules[j].columnName])
        } else if (rules[j].columnName == 'qty_10_min') {
          query = rules[j].qryObject(data.qty_9_max, data[rules[j].columnName])
        } else if (rules[j].columnName == 'qty_10_max') {
          query = rules[j].qryObject(data.qty_10_min, data[rules[j].columnName])
        } else if (rules[j].columnName == 'qty_11_min') {
          query = rules[j].qryObject(data.qty_10_max, data[rules[j].columnName])
        } else if (rules[j].columnName == 'qty_11_max') {
          query = rules[j].qryObject(data.qty_11_min, data[rules[j].columnName])
        } else if (rules[j].columnName == 'qty_12_min') {
          query = rules[j].qryObject(data.qty_11_max, data[rules[j].columnName])
        } else if (rules[j].columnName == 'qty_12_max') {
          query = rules[j].qryObject(data.qty_12_min, data[rules[j].columnName])
        } else if (rules[j].columnName == 'qty_13_min') {
          query = rules[j].qryObject(data.qty_12_max, data[rules[j].columnName])
        } else if (rules[j].columnName == 'qty_13_max') {
          query = rules[j].qryObject(data.qty_13_min, data[rules[j].columnName])
        } else if (rules[j].columnName == 'qty_14_min') {
          query = rules[j].qryObject(data.qty_13_max, data[rules[j].columnName])
        } else if (rules[j].columnName == 'qty_14_max') {
          query = rules[j].qryObject(data.qty_14_min, data[rules[j].columnName])
        } else if (rules[j].columnName == 'qty_15_min') {
          query = rules[j].qryObject(data.qty_14_max, data[rules[j].columnName])
        } else if (rules[j].columnName == 'qty_15_max') {
          query = rules[j].qryObject(data.qty_15_min, data[rules[j].columnName])
        } else if (rules[j].columnName == 'price_1') {
          query = rules[j].qryObject(data.qty_1_min, data[rules[j].columnName])
        } else if (rules[j].columnName == 'product_weight') {
          query = rules[j].qryObject(data.carton_weight, data[rules[j].columnName])
        } else {
          query = rules[j].qryObject(data[rules[j].columnName]);
        }
      }
      // console.log('Field:', rules[j].columnName, 'value:', hook.data.data[rules[j].columnName], 'validate:', query);
      if (query == true) {
        if (hook.data.sheet_name == "Product Information") {
          err_fields.push(rules[j].qryErrStr);
        } else {
          err_fields.push(rules[j].errorString);
        }
      }
    }
  }
  hook.result = err_fields;
}
