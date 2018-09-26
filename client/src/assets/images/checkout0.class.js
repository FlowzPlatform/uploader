/* eslint-disable no-unused-vars */
var axios = require('axios')
let async = require('asyncawait/async');
let await = require('asyncawait/await');
let rp = require('request-promise')
let config = require('config')
const config1 = require('../../../config/default.json');
var moment = require('moment');
moment().format();
let baseURL = 'http://' + config1.host + ':' + config1.port

if (process.env.x_api_token)
    config1.x_api_token = process.env.x_api_token
if (process.env.pay_url)
    config1.pay_url = process.env.pay_url
if (process.env.update_user_url)
    config1.update_user_url = process.env.update_user_url
if (process.env.user_detail_url)
    config1.user_detail_url = process.env.user_detail_url

class Service {
  constructor (options) {
    this.options = options || {};
  }

  find (params) {
    return Promise.resolve([]);
  }

  get (id, params) {
    return Promise.resolve({
      id, text: `A new message with ID: ${id}!`
    });
  }

  create (data, params) {
    var res = createFunction(data,params)
    return Promise.resolve(res);
  }

  update (id, data, params) {
    return Promise.resolve(data);
  }

  patch (id, data, params) {
    return Promise.resolve(data);
  }

  remove (id, params) {
    return Promise.resolve({ id });
  }
}

var payObj = async( function (data, price) {
  var sObj =  {
        gateway:'stripe',
        amount : parseInt(price),
        currency:'usd',
        cardNumber: data.payDetail.cardNumber,
        expMonth: data.payDetail.expiryMM,
        expYear: data.payDetail.expiryYY,
        cvc: data.payDetail.cvCode,
        description:'this is desc',
        isCustomer:false,
        metadata: {
          id: data.sub_id
        }
      }
    return sObj
})

var getThisSubscription = async(function (id) {
  var res = await (axios.get(baseURL + '/subscription-plans/' + id))
  return res.data
})

var createFunction = async (function(data,params) {
  // console.log("+++++++++++ params",params.query.authorization)
  var thisSubscription = await (getThisSubscription(data.sub_id))
  // console.log('thisSubscription', thisSubscription)
  var paymentObj = await (payObj(data, thisSubscription.price))
  var config = {
    headers:  {
    'Content-Type': 'application/json',
    'X-api-token':  config1.x_api_token,
    'authorization': params.query.authorization
    }
  }
  // console.log(paymentObj)
  var checkout_res = await (axios.post(config1.pay_url, paymentObj, config).then(res => {
        console.log('payment_response....', res.data)
        return res.data
      })
      .catch(err => {
        console.log('Error', err)
        return {error: err}
      }))
  if(checkout_res.hasOwnProperty('statusCode')) {
    return {error: res.data.message}
  } else {
    console.log('payment Successfully Done!')
    let userDetail = await (getUserPackage(config.headers.authorization))
    // console.log('userDetail', userDetail)
    if (userDetail != null) {
      // console.log('userDetail......', userDetail.data)
      if(userDetail.data.hasOwnProperty("package")){
        var packageObj = await (makePackageObj(thisSubscription, checkout_res.id))
        var u_id = userDetail.data._id
        if(userDetail.data.hasOwnProperty("package_history")){
          userDetail.data.package_history.push(userDetail.data.package)
          console.log('Valid Token! >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.')
          var _resConfirm = await (axios.put(config1.update_user_url + u_id, {package: packageObj,package_history:userDetail.data.package_history}, config))
        }
        else {
          let package_history = []
          package_history.push(userDetail.data.package)
          console.log('Valid Token! >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.')
          var _resConfirm = await (axios.put(config1.update_user_url + u_id, {package: packageObj,package_history:package_history}, config))
        }
      }
      else {
        console.log('Valid Token! >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.')
        var packageObj = await (makePackageObj(thisSubscription, checkout_res.id))
        var u_id = userDetail.data._id
        // console.log('.............', packageObj)
        var _resConfirm = await (axios.put(config1.update_user_url + u_id, {package: packageObj}, config))
      }

      // console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>..', _resConfirm.data)
    } else {
      console.log('Not Valid Token!')
    }
    return checkout_res
  }
})

let makePackageObj = async (function (subData, trans_id) {
  // console.log('....................', subData)
  var exdate = moment().add(subData.validity, 'days').format()
  // console.log("new Date().......",exdate)
  // var date2 =
  // console.log("date2......",date2)
  // console.log("subData.validity......",subData.validity)
  // exdate.setDate(exdate.getDate() + subData.validity)
  console.log("exdate...........",exdate)
  var detail = []
  for(let i=0;i<subData.details.length;i++){
    let obj = {}
    obj.module = subData.details[i].module
    obj.service = subData.details[i].service
    obj.method = subData.details[i].action
    obj.route = subData.details[i].url
    obj.value = subData.details[i].value
    // console.log("obj.........................",obj)
    detail.push(obj)
  }
  // for(let [inx, _service] of subData.services.entries()) {
  //   var obj = {}
  //   obj.service = _service.name
  //   for(let [i, _route] of _service.routes.entries()) {
  //     obj.routes = _route.name
  //     for(let [inxx, mobj] of _route.methods.entries()) {
  //       obj.method = mobj.name
  //       obj.value = mobj.value
  //     }
  //   }
  //   detail.push(obj)
  // }
  var package = {
    expiredOn : exdate,
    details : detail,
    sub_id : subData.id,
    trans_id: trans_id,
    name: subData.name,
    price: subData.price,
    time_unit: subData.time_unit,
    validity: subData.validity
  }
  return package
})

let getUserPackage = async function (authorization) {
  return new Promise((resolve, reject) => {
    var options = {
      uri: config1.user_detail_url,
      headers: {
        'authorization': authorization
      }
    }
    // console.log(options)
    rp(options)
    .then(function (userDetail) {
      resolve(JSON.parse(userDetail))
    })
    .catch(function (err) {
      if (err) {
      }
      resolve(null)
    })
  })
}


module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
