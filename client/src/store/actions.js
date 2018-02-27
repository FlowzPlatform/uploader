import api from '../api'
import _ from 'lodash'
import axios from 'axios'
import config from '@/config'
// import state from './state'
/*eslint-disable*/
export default {
  getSchema ({ commit }) {
    commit('SET_SCHEMA', [])
    api.request('get', '/schema')
      .then(response => {
        commit('SET_SCHEMA', _.reject(response.data, { 'isdeleted': true }))
      })
      .catch(error => {
        commit('SET_SCHEMA', [])
      })
  },
  getSettings ({ commit }) {
    commit('SET_SETTINGS', [])
    api.request('get', '/settings')
      .then(response => {
        commit('SET_SETTINGS', response.data)
      })
      .catch(error => {
        // commit('SET_SETTINGS', [])
      })
  },
  getTabdata ({commit}, text) {
    commit('SET_TABDATA', text)
  },
  delTabIndex ({commit}, text) {
    commit('DEL_TABINDEX', text)
  },
  setUser ({ commit }, authToken) {
    commit('SET_USER', authToken)
  },
  authenticate ({ commit }, authToken) {

    return axios({
      method: 'get',
      url: config.microURI + '/userdetails',
      headers: {
        'authorization': authToken
      }
    })
    .then(response => {
      if (response) {
        commit('SET_SUBSCRIPTION_DETAIL', response)
        return response.data.data
      } else {
        return
      }
    })
  }
}
