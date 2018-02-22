<template>
    <Menu mode="horizontal" :theme="'primary'">
        <Row type="flex">
        <Col span="6">
            <div class="f-logo">
                <img src="../assets/images/logo.png" style="width:100%;vertical-align: inherit;">
            </div>
        </Col>
        <Col span="18">
            <Row type="flex" justify="end">
                <div class="layout-nav">
                    <router-link to="/uploader-joblist">
                        <Menu-item name="1">
                            <Icon type="navicon-round" :size="14"></Icon>
                            &nbsp;Upload Status
                        </Menu-item>
                    </router-link>
                    <router-link to="/uploader">
                      <Menu-item name="2">
                              <Icon type="cloud" :size="14"></Icon>
                              &nbsp;Uploader
                      </Menu-item>
                   </router-link>
                   <Menu-item name="3" >
                     <Select v-model="selected_user" style="width:200px" @on-change="setSelectedUser()" :disabled=$store.state.disableuser>
                        <Option v-for="item in user_list" :value="item.label" :key="item.label">{{ item.label }}</Option>
                    </Select>
                   </Menu-item>
                    <Menu-item name="4">
                      <Select v-model="selected_subscription_name" style="width:200px" @on-change="getSubscriptionId()" :disabled=$store.state.disablesubscription>
                         <Option v-for="item in subscription_list" :value="item.label" :key="item.label">{{ item.label }}</Option>
                     </Select>
                    </Menu-item>
                    <Menu-item name="5">
                      <Submenu name="1">
                        <template slot="title">
                          <Icon type="person" :size="16"></Icon>
                          {{$store.state.user === null ? 'Guest' : $store.state.user.email}}
                        </template>
                        <Menu-item name="1-1">
                            <a @click="handleLogout()">
                                <Icon type="ios-locked-outline" :size="16"></Icon>
                                Logout
                            </a>
                        </Menu-item>
                    </Submenu>
                    </Menu-item>
                </div>
              </Row>

        </Col>
        </Row>
    </Menu>
</template>
<script>
/*eslint-disable*/
import psl from 'psl'
import modelAuthentication from '@/api/authentication'
import lodash from 'lodash'
import axios from 'axios'
import config from '@/config'

  export default {
    data () {
        return {
          selected_subscription_name: '',
          selected_subscription_id: '',
          subscription_list: [{"value":"All","label":"All"}],
          selected_user: '',
          user_list: [{"value":"All","label":"All"}]
        }
    },
    computed: {
      user () {
          return {emailId: 'test'}
      }
    },
    methods:{
      handleLogout () {
        let location = psl.parse(window.location.hostname)
        location = location.domain === null ? location.input : location.domain
        this.$cookie.delete('auth_token', {domain: location});
        this.$store.commit('SET_TOKEN', null)
        this.$store.commit('SET_USER', null)
        this.$router.push('Login')
      },
      getSubscriptionId(){
        let self = this
        let subscription_obj
        self.$store.state.subscription_name = self.selected_subscription_name
        subscription_obj = lodash.filter(self.subscription_list, function(o) {
           if(o.label == self.$store.state.subscription_name){
             return o
           }
         });
         if(subscription_obj.length != 0){
           self.$store.state.subscription_id = subscription_obj[0].value
         }

      },
      setSelectedUser(){
        let self = this
        self.$store.state.selectedUserName = self.selected_user
      }
    },
    watch:{
      '$store.state.subscription_name': function (name) {
        let self = this
        let subscription_obj1
        self.selected_subscription_name =  name
        subscription_obj1 = lodash.filter(self.subscription_list, function(o) {
           if(o.label == self.selected_subscription_name ){
             return o
           }
         });
         if(subscription_obj1.length != 0){
           self.$store.state.subscription_id = subscription_obj1[0].value
         }
       },
       '$store.state.user_detail_list':function(list){
         if(list.length != 0){
           if(list[0].name != ""){
             for(let i=0;i<list.length;i++){
               let idx = lodash.findIndex(this.user_list, function(o) { return o.label == list[i]["name"]; })
               if(idx == -1){
                 this.user_list.push({"value":list[i].value,"label":list[i].name})
               }
             }
             this.selected_user = this.user_list[0].label
           }
         }
       },
       'selected_user':function(user){
         if(user != "All"){
          let self = this
         let sub_array = []
         let groupedlist = lodash.groupBy(this.$store.state.user_detail_list,"name");
         lodash.forEach(groupedlist,(value,key) => {
             if(key == user){
               for(let i=0;i<value.length;i++){
                 sub_array.push({"value":value[i].value})
               }
             }
         })

         for(let i=0;i<self.subscription_list.length;i++){
            let idx1 = lodash.findIndex(sub_array, function(o) { return o.value == self.subscription_list[i].value; })
            if(idx1 == -1 && self.subscription_list[i].value != "All"){
             self.subscription_list.splice(i,1)
            }
         }
       }
     }
    },
    mounted(){
      let self = this
        // if(this.$store.state.subscription_name != ''){
        //   self.selected_subscription_name =  this.$store.state.subscription_name
        // }
        for(let i=0 ;i<self.$store.state.subscription_detail_list.length;i++){
          self.subscription_list.push({"value":self.$store.state.subscription_detail_list[i].subscription_id,"label":self.$store.state.subscription_detail_list[i].name})
        }
        // self.subscription_list.push({"value":"All","label":"All"})
        if(self.$store.state.storedSubscriptionName != "" && self.$store.state.storedSubscriptionName != "All"){
          let sub_id = lodash.findIndex(self.subscription_list, function(o) { return o.label == self.$store.state.storedSubscriptionName; })
          if(sub_id != -1){
            self.selected_subscription_name = self.subscription_list[sub_id].label
          }
        }
        else{
          self.selected_subscription_name = self.subscription_list[0].label
        }

      // }


    }
  }
</script>
