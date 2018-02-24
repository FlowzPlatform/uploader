/*eslint-disable*/
import axios from 'axios'
import config from '@/config'
import _ from 'lodash'
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
    state.user_detail_list = []
    let list1 = []
    for(let key in response.data.data.package){
      state.subscription_detail_list.push({"subscription_id":response.data.data.package[key].subscriptionId,"name":response.data.data.package[key].name,"role":response.data.data.package[key].role})
    }



    for(let key in state.subscription_detail_list){
      let response = await axios({
        method: 'get',
        url: config.subscriptionUri + '?id=' + state.subscription_detail_list[key].subscription_id,
        headers: {
          'authorization': authToken
        }
      })
      .then(response => {

        return response
      })
      list1.push({"value":state.subscription_detail_list[key].subscription_id,"label":response.data.data[0].userId})
    }


      let uniq_user_id = _.uniqBy(list1, 'label');

      let uniq_user_array = []
    // setTimeout(function(){
      for(let i=0;i<uniq_user_id.length;i++){
         let resp = await axios({
           method: 'get',
           url: config.getUserdetailUri + uniq_user_id[i].label,
           headers: {
             'authorization': authToken
           }
         })
         .then(resp => {
           return resp
         })
         if(resp.data.data[0].fullname){
          uniq_user_array.push({"user_id":uniq_user_id[i].label,"name":resp.data.data[0].fullname})
         }
         else if(resp.data.data[0].firstname && resp.data.data[0].lastname ){
          uniq_user_array.push({"user_id":uniq_user_id[i].label,"name":resp.data.data[0].firstname + " " + resp.data.data[0].lastname})
         }
         else{
          uniq_user_array.push({"user_id":uniq_user_id[i].label,"name":resp.data.data[0].email})
         }
     }


        for(let i=0;i<list1.length;i++){
          for(let j=0;j<uniq_user_array.length;j++){
            if(list1[i].label == uniq_user_array[j].user_id){
              list1[i]["name"] = uniq_user_array[j].name
            }
          }
        }

  //  },3000)

  //  setTimeout(function(){
     state.user_detail_list = list1
  //  },4500)




  },
  SET_TOKEN (state, token) {
    state.token = token
  },
  SET_STORED_SUB_NAME(state,name){

    state.storedSubscriptionName = name
  },
  SET_STORED_SUB_ID(state,id){

    state.storedSubscriptionId = id
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
