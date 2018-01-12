import api from '../../api'
let model = 'instance'
  // let model = 'instance-test'
export default {

  // let gets = async function (id) {
  //     return true;
  //   },
  get: () => {
    return api.request('get', '/' + model)
  },
  getThis: (id, Schemaid) => {
    return api.request('get', '/' + model + '/' + id + '?schemaid=' + Schemaid)
  },
  post: (data) => {
    return api.request('post', '/' + model, data)
  },
  put: (id, data) => {
    return api.request('put', '/' + model + '/' + id, data)
  },
  delThis: (id, Schemaid) => {
    return api.request('delete', '/' + model + '/' + id + '?schemaid=' + Schemaid)
  }
}
