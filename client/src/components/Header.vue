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
                    <router-link to="/invite">
                        <Menu-item name="3">
                            <Icon type="cash" :size="14"></Icon>
                            &nbsp;Invite
                        </Menu-item>
                    </router-link>
                   <Menu-item name="4" >
                     <Select v-model="selected_user" style="width:200px" @on-change="setSelectedUser()" :disabled=$store.state.disableuser>
                        <Option v-for="item in $store.state.user_list" :value="item.label" :key="item.label">{{ item.label }}</Option>
                    </Select>
                   </Menu-item>
                    <Menu-item name="5">
                      <Select v-model="selected_subscription_name" style="width:200px" @on-change="getSubscriptionId()" :disabled=$store.state.disablesubscription>
                         <Option v-for="item in $store.state.subscription_list" :value="item.label" :key="item.label">{{ item.label }}</Option>
                     </Select>
                    </Menu-item>
                    <Submenu name="6">
           <template slot="title">
                <Icon type="grid" :size="20"></Icon>
           </template>
           <MenuGroup title="Flowz-Products" style="font-size:14px">
                      <MenuItem name="5-1"><span @click="gotoDashboard" style="font-size:12px;">Flowz Dashboard</span></MenuItem>
                      <MenuItem name="5-2"><span @click="gotoWebsiteBuilder" style="font-size:12px;">Website Builder</span></MenuItem>
                      <MenuItem name="5-3"><span @click="gotoCRM" style="font-size:12px;">CRM</span></MenuItem>
                  </MenuGroup>
                  </Submenu>
                    <Menu-item name="7">
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
import psl from 'psl'
import lodash from 'lodash'
import config from '@/config'
// let domainkey = process.env.domainkey ? process.env.domainkey : 'flowzcluster.tk'

export default {
  data () {
    return {
      selected_subscription_name: '',
      selected_subscription_id: '',
      subscription_list: [{'value': 'All', 'label': 'All'}],
      selected_user: '',
      user_list: [{'value': 'All', 'label': 'All'}],
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
  methods: {
    gotoDashboard () {
      window.open(this.flowzDashboardUrl, '_blank')
    },
    gotoWebsiteBuilder () {
      window.open(this.websiteBuilderUrl, '_blank')
    },
    gotoCRM () {
      window.open(this.crmUrl, '_blank')
    },
    handleLogout () {
      let location = psl.parse(window.location.hostname)
      location = location.domain === null ? location.input : location.domain
      this.$cookie.delete('auth_token', {domain: location})
      this.$store.commit('SET_TOKEN', null)
      this.$store.commit('SET_USER', null)
      this.$router.push('Login')
    },
    getSubscriptionId () {
      let self = this
      let subscriptionObj
      self.$store.state.subscription_name = self.selected_subscription_name
      subscriptionObj = lodash.filter(self.subscription_list, function (o) {
        if (o.label === self.$store.state.subscription_name) {
          return o
        }
      })
      if (subscriptionObj.length !== 0) {
        self.$store.state.subscription_id = subscriptionObj[0].value
      }
    },
    setSelectedUser () {
      // let self = this
      console.log('cxalled.....')
      if (this.selected_user === '') {
        console.log('%%%%%%')
        if (this.$store.state.user_list.length !== 0) {
          console.log('########')
          this.selected_user = this.$store.state.user_list[0].label
        }
      }
      this.$store.state.selectedUserName = this.selected_user
    }
  },
  watch: {
    '$store.state.subscription_name': function (name) {
      let self = this
      let subscriptionObj1
      self.selected_subscription_name = name
      self.$store.state.storedSubscriptionName = name
      subscriptionObj1 = lodash.filter(self.$store.state.subscription_list, function (o) {
        if (o.label === self.selected_subscription_name) {
          return o
        }
      })
      if (subscriptionObj1.length !== 0) {
        self.$store.state.subscription_id = subscriptionObj1[0].value
      }
    },
    '$store.state.user_detail_list': function (list) {
      if (list.length !== 0) {
        if (list[0].name !== '') {
          for (let i = 0; i < list.length; i++) {
            let idx = lodash.findIndex(this.$store.state.user_list, function (o) { return o.label === list[i]['name'] })
            if (idx === -1) {
              this.$store.state.user_list.push({'value': list[i].value, 'label': list[i].name})
            }
          }
          let indx2 = lodash.findIndex(this.$store.state.user_list, function (o) { return o.label === 'All' })
          if (indx2 === -1) {
            this.$store.state.user_list.splice(0, 0, {'value': 'All', 'label': 'All'})
          }
          if (this.$store.state.storedUsername !== '') {
            this.selected_user = this.$store.state.storedUsername
            this.$store.state.storedUsername = this.selected_user
            this.$store.commit('SET_STOREDUSERNAME', this.selected_user)
          } else {
            this.selected_user = this.$store.state.user_list[0].label
            this.$store.state.storedUsername = this.selected_user
            this.$store.commit('SET_STOREDUSERNAME', this.selected_user)
          }
        }
      }
    },
    'selected_user': function (user) {
      console.log('user....', user)
      if (user !== '') {
        this.$store.state.storedUsername = this.selected_user
        console.log('this.$store.state.storedUsername', this.$store.state.storedUsername)
        this.$store.state.selectedUserName = user

        // let filteredUser = lodash.filter(this.$store.state.user_detail_list, function (o) { return o.name === user })
        // let subsArr = []

        // for (let userSubs in filteredUser) {
        //   for (let subs in this.$store.state.fullSubscriptionList) {
        //     if (filteredUser[userSubs].value === this.$store.state.fullSubscriptionList[subs].value) {
        //       subsArr.push(this.$store.state.fullSubscriptionList[subs])
        //     }
        //   }
        // }
        // this.$store.state.subscription_list = []
        // this.$store.state.subscription_list = subsArr
        // this.$store.state.storedSubscriptionName = subsArr[0].label
      } else {
        // this.$store.state.subscription_list = []
        // this.$store.state.subscription_list = this.$store.state.fullSubscriptionList
        // this.$store.state.storedSubscriptionName = this.$store.state.fullSubscriptionList[0].label
      }
    },
    '$store.state.subscription_list': function (list) {
      let self = this
      if (list.length !== 0) {
        if (self.$store.state.storedSubscriptionName !== '' && self.$store.state.storedSubscriptionName !== 'All') {
          let subId = lodash.findIndex(list, function (o) { return o.label === self.$store.state.storedSubscriptionName })
          if (subId !== -1 && list[subId].label) {
            self.selected_subscription_name = list[subId].label
            self.$store.state.subscription_name = self.selected_subscription_name
          }
        } else {
          self.selected_subscription_name = list[0].label
          self.$store.state.subscription_name = self.selected_subscription_name
        }
      }
    }
    // '$store.state.storedUsername': function (selectedUser) {
    //   console.log('called.....')
    //   if (selectedUser !== 'All') {
    //     let filteredUser = lodash.filter(this.$store.state.user_detail_list, function (o) { return o.name === selectedUser })
    //     let subsArr = []

    //     for (let userSubs in filteredUser) {
    //       for (let subs in this.$store.state.fullSubscriptionList) {
    //         if (filteredUser[userSubs].value === this.$store.state.fullSubscriptionList[subs].value) {
    //           subsArr.push(this.$store.state.fullSubscriptionList[subs])
    //         }
    //       }
    //     }
    //     this.$store.state.subscription_list = []
    //     this.$store.state.subscription_list = subsArr
    //     this.$store.state.storedSubscriptionName = subsArr[0].label
    //   } else {
    //     console.log('else called')
    //     this.$store.state.subscription_list = []
    //     this.$store.state.subscription_list = this.$store.state.fullSubscriptionList
    //     this.$store.state.storedSubscriptionName = this.$store.state.fullSubscriptionList[0].label
    //   }
    // }

  },
  mounted () {
    let self = this
    self.flowzDashboardUrl = config.flowzDashboardUrl
    self.crmUrl = config.crmUrl
    self.websiteBuilderUrl = config.websiteBuilderUrl
        // for(let i=0 ;i<self.$store.state.subscription_detail_list.length;i++){
        //   self.subscription_list.push({"value":self.$store.state.subscription_detail_list[i].subscription_id,"label":self.$store.state.subscription_detail_list[i].name})
        // }

        // self.$store.state.subscription_list
    if (self.$store.state.storedSubscriptionName !== '' && self.$store.state.storedSubscriptionName !== 'All') {
      let subId = lodash.findIndex(self.$store.state.subscription_list, function (o) { return o.label === self.$store.state.storedSubscriptionName })
      if (subId !== -1) {
        self.selected_subscription_name = self.$store.state.subscription_list[subId].label
        self.$store.state.subscription_name = self.selected_subscription_name
      }
          // self.selected_user = self.$store.state.user_list[0].label
    } else {
      self.selected_subscription_name = self.$store.state.subscription_list[0].label
      self.$store.state.subscription_name = self.selected_subscription_name
    }

      // }
  }
}
</script>
