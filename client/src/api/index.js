import axios from 'axios'
import config from '../config'
import store from '../store'

export default {
  request (method, uri, data = null, headers = {'subscriptionId': store.state.subscription_id}) {
    if (!method) {
      console.error('API function call requires method argument')
      return
    }

    if (!uri) {
      console.error('API function call requires uri argument')
      return
    }

    if (headers.subscriptionId === '') {
      console.error('API function call requires proper subscriptionId to be passed as a header')
      return
    }

    var url = config.serverURI + uri
    return axios({method, url, data, headers})
  }
}
