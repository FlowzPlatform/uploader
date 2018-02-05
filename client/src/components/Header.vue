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
                      <Select v-model="selected_subscription_id" style="width:250px" @on-change="getSubscriptionId()">
                         <Option v-for="item in subscription_list" :value="item.value" :key="item.value" >{{ item.label }}</Option>
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
        this.$store.state.subscription_id = this.selected_subscription_id
      }
    },
    watch:{
      '$store.state.subscription_id': function (id) {
        this.selected_subscription_id =  id
       }
    },
    mounted(){
      let self = this
      if(this.$store.state.subscription_id != ''){
        self.selected_subscription_id =  this.$store.state.subscription_id
      }
       modelAuthentication.userdetail().then(function (response){
         for(let key in response.data.package){
           self.subscription_list.push({"value":key,"label":key})
         }
       })
       .catch(function(error){
        console.log(error);
      })
    }
  }
</script>
