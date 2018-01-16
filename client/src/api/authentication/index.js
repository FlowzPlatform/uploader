import axios from 'axios'
import config from '../../config'

export default {
  login: (params) => {
    return axios({
      method: 'post',
      url: config.microURI + '/login',
      data: params
    }).then(response => {
      if (response) {
        return response.data
      } else {
        throw new Error('Network error!')
      }
    }).catch(error => {
      throw error
    })
  },
  social: (params) => {
    return axios({
      method: 'post',
      url: config.microURI + '/verifyemail',
      data: params
    }).then(response => {
      if (response) {
        return response.data
      } else {
        throw new Error('Network error!')
      }
    }).catch(error => {
      throw error
    })
  },
  register: (params) => {
    return axios({
      method: 'post',
      url: config.microURI + '/setup',
      data: params
    }).then(response => {
      if (response) {
        return response.data
      } else {
        throw new Error('Network error!')
      }
    }).catch(error => {
      throw error
    })
  }
}
