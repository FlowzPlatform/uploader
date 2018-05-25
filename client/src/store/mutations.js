import axios from 'axios'
import config from '@/config'
import _ from 'lodash'
import toastr from 'toastr'
// import $ from 'jquery';

export default {
  TOGGLE_LOADING (state) {
    state.callingAPI = !state.callingAPI
  },
  SET_USER (state, user) {
    state.user = user
  },
  async SET_SUBSCRIPTION_DETAIL (state, response) {
    let authToken = response.config.headers.authorization
    state.userid = response.data.data._id
    state.subscription_detail_list = []
    state.subscription_list = [{'value': 'All', 'label': 'All'}]
    state.user_detail_list = []
    state.user_list = []
    let list1 = []
    for (let key in response.data.data.package) {
      state.subscription_list.push({'value': response.data.data.package[key].subscriptionId, 'label': response.data.data.package[key].name})
    }

    for (let key in state.subscription_list) {
      if (state.subscription_list[key].value !== undefined) {
        let response = await axios({
          method: 'get',
          url: config.subscriptionUri + '?id=' + state.subscription_list[key].value,
          headers: {
            'authorization': authToken
          }
        })
      .then(response => {
        return response
      })
      .catch(err => {
        if (err.message === 'Network Error') {
          toastr.error('API Service unavailable')
        } else if (err.response !== undefined) {
          toastr.error(err.response.data.message)
        }
      })
        if (response.data.data.length !== 0) {
          list1.push({'value': state.subscription_list[key].value, 'label': response.data.data[0].userId})
        }
      }
    }

    let uniqUserId = _.uniqBy(list1, 'label')
    let uniqUserArray = []
    // setTimeout(function(){
    for (let i = 0; i < uniqUserId.length; i++) {
      let resp = await axios({
        method: 'get',
        url: config.getUserdetailUri + uniqUserId[i].label,
        headers: {
          'authorization': authToken
        }
      })
         .then(resp => {
           return resp
         })
         .catch(error => {
           console.log('error', error)
         })
      if (resp.data.data[0].fullname) {
        uniqUserArray.push({'user_id': uniqUserId[i].label, 'name': resp.data.data[0].fullname})
      } else if (resp.data.data[0].firstname && resp.data.data[0].lastname) {
        uniqUserArray.push({'user_id': uniqUserId[i].label, 'name': resp.data.data[0].firstname + ' ' + resp.data.data[0].lastname})
      } else {
        uniqUserArray.push({'user_id': uniqUserId[i].label, 'name': resp.data.data[0].email})
      }
    }

    for (let i = 0; i < list1.length; i++) {
      for (let j = 0; j < uniqUserArray.length; j++) {
        if (list1[i].label === uniqUserArray[j].user_id) {
          list1[i]['name'] = uniqUserArray[j].name
        }
      }
    }

  //  },3000)

  //  setTimeout(function(){
    state.user_detail_list = list1
  //  },4500)
  },
  SET_DISCONNECT (state, value) {
    state.disconnect = value
  },
  SET_TOKEN (state, token) {
    state.token = token
  },
  SET_STORED_SUB_NAME (state, name) {
    state.storedSubscriptionName = name
  },
  SET_STORED_SUB_ID (state, id) {
    state.storedSubscriptionId = id
  },
  SET_STOREDUSERNAME (state, username) {
    state.storedUsername = username
  },
  SET_SCHEMA (state, schema) {
    state.schema = schema
  },
  SET_SETTINGS (state, settings) {
    state.settings = settings
  },
  SET_TABDATA (state, tabdata) {
    state.tabdata.push(tabdata)
  },
  DEL_TABINDEX (state, data) {
    state.tabdata.splice(data.index, 1)
  }
}
