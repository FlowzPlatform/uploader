<template>
    <Menu mode="horizontal" :theme="'primary'">
        <Row type="flex">
        <Col span="4">
            <div class="f-logo">
                <img src="../assets/images/logo.png" style="width:100%;vertical-align: inherit;">
            </div>
        </Col>
        <Col span="20">
            <Row type="flex" justify="end">
                <div class="layout-nav">
                  <router-link to="/pdm">
                        <Menu-item name="1">
                            <Icon type="navicon-round" :size="14"></Icon>
                            &nbsp;PDM
                        </Menu-item>
                    </router-link>
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
                        <Option v-for="item in $store.state.user_list" :value="item.label" :key="item.label">{{ item.label }}</Option>
                    </Select>
                   </Menu-item>
                    <Menu-item name="4">
                      <Select v-model="selected_subscription_name" style="width:200px" @on-change="getSubscriptionId()" :disabled=$store.state.disablesubscription>
                         <Option v-for="item in $store.state.subscription_list" :value="item.label" :key="item.label">{{ item.label }}</Option>
                     </Select>
                    </Menu-item>
                    <Submenu name="5">
           <template slot="title">
                <Icon type="grid" :size="20"></Icon>
           </template>
           <MenuGroup title="Flowz-Products" style="font-size:14px">
                      <MenuItem name="5-1"><span @click="gotoDashboard" style="font-size:12px;">Flowz Dashboard</span></MenuItem>
                      <MenuItem name="5-2"><span @click="gotoWebsiteBuilder" style="font-size:12px;">Website Builder</span></MenuItem>
                      <MenuItem name="5-3"><span @click="gotoCRM" style="font-size:12px;">CRM</span></MenuItem>
                  </MenuGroup>
                  </Submenu>
                    <Menu-item name="6">
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
// let domainkey = process.env.domainkey ? process.env.domainkey : 'flowzcluster.tk'

  export default {
    data () {
        return {
          selected_subscription_name: '',
          selected_subscription_id: '',
          subscription_list: [{"value":"All","label":"All"}],
          selected_user: '',
          user_list: [{"value":"All","label":"All"}],
          flowzDashboardUrl: '',
          crmUrl: '',
          websiteBuilderUrl: ''
        }
    },
    computed: {
      user () {
          return {emailId: 'test'}
      }
    },
    methods:{
      gotoDashboard(){
         window.open(this.flowzDashboardUrl, '_blank');
      },
      gotoWebsiteBuilder(){
         window.open(this.websiteBuilderUrl, '_blank');
      },
      gotoCRM(){
         window.open(this.crmUrl, '_blank');
      },
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
        if(this.selected_user == ""){
          if(this.$store.state.user_list.length != 0){
            this.selected_user = this.$store.state.user_list[0].label
          }
        }
        this.$store.state.selectedUserName = this.selected_user
        if(this.$store.state.storedUsername != ""){
          self.$store.commit('SET_STOREDUSERNAME', this.$store.state.storedUsername)
        }
      }
    },
    watch:{
      '$store.state.subscription_name': function (name) {
        let self = this
        let subscription_obj1
        self.selected_subscription_name =  name
        self.$store.state.storedSubscriptionName = name
        subscription_obj1 = lodash.filter(self.$store.state.subscription_list, function(o) {
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
                 let idx = lodash.findIndex(this.$store.state.user_list, function(o) { return o.label == list[i]["name"]; })
                 if(idx == -1){
                   this.$store.state.user_list.push({"value":list[i].value,"label":list[i].name})
                 }
               }
               let indx2 = lodash.findIndex(this.$store.state.user_list, function(o) { return o.label == "All"; })
               if(indx2 == -1){
                 this.$store.state.user_list.splice(0,0,{"value":"All","label":"All"})
               }
               if(this.$store.state.storedUsername != ""){
                  this.selected_user = this.$store.state.storedUsername
                  this.$store.state.storedUsername = this.selected_user
                  this.$store.commit('SET_STOREDUSERNAME', this.selected_user)
               }
               else{
                  this.selected_user = this.$store.state.user_list[0].label
                  this.$store.state.storedUsername = this.selected_user
                  this.$store.commit('SET_STOREDUSERNAME', this.selected_user)
               }
             }
           }
          //  else if(list.length == 0){
          //     console.log("else called")
          //    if(this.$store.state.user_list.length != 0){
          //      if(this.$store.state.storedUsername != ""){
          //        console.log("++++++++++ 153",this.$store.state.user_list)
          //        this.selected_user = this.$store.state.storedUsername
          //        this.$store.state.storedUsername = this.selected_user
          //        this.$store.commit('SET_STOREDUSERNAME', this.selected_user)
          //      }
          //      else{
          //        console.log("++++++++++ 158",this.$store.state.user_list)
          //        this.selected_user = this.$store.state.user_list[0].label
          //        this.$store.state.storedUsername = this.selected_user
          //        this.$store.commit('SET_STOREDUSERNAME', this.selected_user)
          //      }
          //    }
          //  }
       },
       'selected_user':function(user){
         if(user != ""){
           this.$store.commit('SET_STOREDUSERNAME', user)
           this.$store.state.selectedUserName = user
         }
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

         for(let i=0;i<self.$store.state.subscription_list.length;i++){
           if(sub_array.length != 0){
             let idx1 = lodash.findIndex(sub_array, function(o) { return o.value == self.$store.state.subscription_list[i].value; })

             if(idx1 == -1 && self.$store.state.subscription_list[i].value != "All"){
               self.$store.state.subscription_list.splice(i,1)
             }
           }
         }
       }
       else {
         if(this.selected_subscription_name == ""){
           this.selected_subscription_name = this.$store.state.subscription_list[0].label
         }
       }
     },
     '$store.state.subscription_list':function(list){

       let self = this
       if(list.length != 0){
         if(self.$store.state.storedSubscriptionName != "" && self.$store.state.storedSubscriptionName != "All"){
           let sub_id = lodash.findIndex(list, function(o) { return o.label == self.$store.state.storedSubscriptionName; })
           if(sub_id != -1 && list[sub_id].label){
             self.selected_subscription_name = list[sub_id].label
             self.$store.state.subscription_name = self.selected_subscription_name
           }
         }
         else{
           self.selected_subscription_name = list[0].label
           self.$store.state.subscription_name = self.selected_subscription_name
         }
       }

     }
    //  '$store.state.storedUsername': function(name){
    //    console.log("header storedusername called...",name)
    //    this.selected_user = name
    //  }
    },
    mounted(){
      let self = this
      self.flowzDashboardUrl = config.flowzDashboardUrl
      self.crmUrl = config.crmUrl
      self.websiteBuilderUrl = config.websiteBuilderUrl
        // for(let i=0 ;i<self.$store.state.subscription_detail_list.length;i++){
        //   self.subscription_list.push({"value":self.$store.state.subscription_detail_list[i].subscription_id,"label":self.$store.state.subscription_detail_list[i].name})
        // }

        // self.$store.state.subscription_list
        if(self.$store.state.storedSubscriptionName != "" && self.$store.state.storedSubscriptionName != "All"){
          let sub_id = lodash.findIndex(self.$store.state.subscription_list, function(o) { return o.label == self.$store.state.storedSubscriptionName; })
          if(sub_id != -1){
            self.selected_subscription_name = self.$store.state.subscription_list[sub_id].label
             self.$store.state.subscription_name = self.selected_subscription_name
          }
          // self.selected_user = self.$store.state.user_list[0].label
        }
        else{
          self.selected_subscription_name = self.$store.state.subscription_list[0].label
           self.$store.state.subscription_name = self.selected_subscription_name
        }

      // }


    }
  }
</script>
