import api from '../../api'
let model = 'asconfiguration'

export default {
  // get: (id, params = null) => {
  //   alert(123)
  //   if (id === undefined) {
  //     return api.request('get', '/' + model, params).then(res => {
  //       alert(456)
  //       return res.data
  //     })
  //   } else {
  //     return api.request('get', '/' + model + '/' + id, null, params).then(res => {
  //       return res.data
  //     })
  //   }
  // },
  get: (params = null) => {
    return api.request('get', '/' + model, null, params)
  },
  getThis: (id) => {
    return api.request('get', '/' + model + '/' + id)
  },
  post: (data) => {
    return api.request('post', '/' + model, data)
  },
  put: (id, data) => {
    return api.request('put', '/' + model + '/' + id, data)
  },
  delete: (id) => {
    return api.request('delete', '/' + model + '/' + id)
  }
}
