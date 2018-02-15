/*eslint-disable*/
export default {
  TOGGLE_LOADING (state) {
    state.callingAPI = !state.callingAPI
  },
  SET_USER (state, user) {
    state.user = user
  },
  SET_USER_DETAIL (state, response) {
    state.subscription_list = []
    for(let key in response.data.data.package){
      state.subscription_list.push({"value":response.data.data.package[key].subscriptionId,"label":response.data.data.package[key].name})
    }
  },
  SET_TOKEN (state, token) {
    state.token = token
  },
  SET_SCHEMA (state, schema) {
    state.schema = schema
  },
  SET_SETTINGS (state, settings) {
    state.settings = settings
  },
  SET_TABDATA (state, tabdata) {
    // console.log('SET_TABDATA', tabdata)
    state.tabdata.push(tabdata)
  },
  DEL_TABINDEX (state, data) {
    // console.log(data)
    state.tabdata.splice(data.index, 1)
  }
}
