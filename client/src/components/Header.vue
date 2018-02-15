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
                    <Menu-item name="1">
                        <router-link to="/uploader-joblist">
                            <Icon type="navicon-round" :size="14"></Icon>
                            &nbsp;Joblist
                        </router-link>
                    </Menu-item>
                    <Menu-item name="2">
                        <router-link to="/uploader">
                            <Icon type="cloud" :size="14"></Icon>
                            &nbsp;Uploader
                        </router-link>
                    </Menu-item>
                    <Menu-item name="3">
                      <Select v-model="selected_subscription_name" style="width:250px" @on-change="getSubscriptionId()">
                         <Option v-for="item in subscription_list" :value="item.label" :key="item.label" >{{ item.label }}</Option>
                     </Select>
                    </Menu-item>
                    <Menu-item name="4">
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
  export default {
    data () {
        return {
          selected_subscription_name: '',
          selected_subscription_id: '',
          subscription_list: []
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
        modelAuthentication.subscriptionUser(self.$store.state.subscription_id).then(function (response){
          self.$store.state.userId = response.data.userId
        })
        .catch(function(error){
         console.log(error);
       })
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
       }
    },
    mounted(){
      let self = this
      if(this.$store.state.subscription_name != ''){
        self.selected_subscription_name =  this.$store.state.subscription_name
      }

      self.subscription_list = self.$store.state.subscription_list
      self.selected_subscription_name = self.subscription_list[0].label
    }
  }
</script>
