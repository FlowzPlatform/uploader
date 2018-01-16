/* eslint-disable no-unused-vars */
let errors = require('@feathersjs/errors');
let async = require('asyncawait/async');
let await = require('asyncawait/await');
var _ = require('lodash');
var cpath = '../DBConnection/'

class Service {
  constructor(options) {
    this.options = options || {};
  }
  find(params) {
    console.log('find schema..')
    return Promise.resolve([])
  }
  get(id, params) {
    console.log('get schema..')
    var data = getFunction(id, params)
    return Promise.resolve(data)
  }
  create(data, params) {
    console.log('create schema..')
    var data = createFunction(data, params)
    return Promise.resolve(data)
  }
  update(id, data, params) {
    console.log('update schema..')
    var data = updateFunction(id, params, data)
    return Promise.resolve(data)
  }
  patch(id, data, params) {
    console.log('patch schema..')
    return Promise.resolve(id)
  }
  remove(id, params) {
    console.log('remove schema..')
    var data = removeFunction(id, params)
    return Promise.resolve(data)
  }
}

var getFunction = async(function(id, params) {
  var api = require(cpath + params.data.selectedDb + 'api')
  if (params.query.schemaname != undefined) {
    var data = await (api.getSchemaRecord(params.data, params.query.schemaname).then(res => {
      // console.log('response', res)
      return res
    }).catch(err => {
      console.log('error', err)
      return {iserror: true, msg: err}
    }))
    // console.log('getFunction', data)
    return data
  } else {
    var data = await (api.getTables(params.data).then(res => {
      // console.log('response', res)
      return res
    }).catch(err => {
      console.log('error', err)
      return {iserror: true, msg: err}
    }))
    // console.log('getFunction', data)
    return data
  }
})

var updateFunction = async(function(id, params, data) {
  var api = require(cpath + params.data.selectedDb + 'api')
  if (params.query.schemaname != undefined && params.query.rid != undefined) {
    var cdata = {
      id: id,
      tname: params.query.schemaname,
      rid: params.query.rid,
      data: data
    }
    var data = await (api.putSchemaRecord(params.data, cdata))
    return data
  } else {
    throw new errors.BadRequest()
  }
})

var removeFunction = async(function(id, params) {
  var api = require(cpath + params.data.selectedDb + 'api')
  if (params.query.schemaname != undefined && params.query.rid != undefined) {
    var cdata = {
      id: id,
      tname: params.query.schemaname,
      rid: params.query.rid
    }
    var data = await (api.deleteSchemaRecord(params.data, cdata))
    if(data.hasOwnProperty('iserror')) {
      throw new errors.BadRequest(data)  
    } else {
      return data
    }
  } else {
    throw new errors.BadRequest()
  }
})

var createFunction = async(function(data, params) {
  // console.log('>>>>>>>>>>>', params.query.check)
  if (params.query.check != undefined && params.query.check == 'true') {
    // check the connection that already connected or not
    var api = require(cpath + data.selectedDb + 'api')
    var data = await (api.getTablewithColumns(data).then(res => {
      if(res.hasOwnProperty('iserror') && res.iserror) {
        throw new errors.GeneralError('Not Connected to Database', {errors: res.msg})
      } else {
        return res
      }
    }).catch(err => {
      throw new errors.GeneralError('Not Connected to Database', {errors: err})
      // return {iserror: true, msg: err}
    }))
    return data
  } else if (params.query.checkconn != undefined && params.query.checkconn == 'true') {
    // check the connection that already connected or not and if connected that get tabledata with columns
    var api = require(cpath + data.selectedDb + 'api')
    var data = await (api.checkConnection(data).then(res => {
      return res
    }).catch(err => {
      return {iserror: true, msg: err}
    }))
    return data
  } else if (params.conndata != undefined) {
    // for new connection request
    var api = require(cpath + params.conndata.selectedDb + 'api')
    if (params.query.schemaname != undefined) {
      var cdata = {
        id: data.id,
        tname: params.query.schemaname,
        data: data.data
      }
      var data = await (api.postSchemaRecord(params.conndata, cdata))
      return data
    } else {
      throw new errors.BadRequest()
    }
  } else {
    throw new errors.BadRequest()
  }
})

module.exports = function(options) {
  return new Service(options);
};
module.exports.Service = Service;