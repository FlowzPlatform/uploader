<template>
<div class="uploader-header">
<nav class="navbar" style="background-color:#2d8cf0">
  <div class="container-fluid">
    <div class="navbar-header">
      <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
        <!-- <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span> -->
        <i class="fa fa-bars"></i>
      </button>
      <a class="navbar-brand" href="#"><img src="../assets/images/logo.png" class="img-responsive" alt="Responsive image"></img></a>
    </div>
    <div class="collapse navbar-collapse" id="myNavbar">
      <ul class="nav navbar-nav">
        <li class="active"><a href="/pdm"><Icon type="navicon-round" :size="14"></Icon>&nbsp PDM</a></li>
        <li><a href="/syncstatus"><Icon type="navicon-round" :size="14"></Icon>&nbsp Sync Status</a></li>
        <li><a href="/uploader-joblist"><Icon type="navicon-round" :size="14"></Icon>&nbsp Status</a></li>
        <li><a href="/uploader"><Icon type="cloud" :size="14"></Icon>&nbsp Uploader</a></li>
        <li><a href="/invite"><Icon type="cash" :size="14"></Icon>&nbsp Invite</a></li>
        <form class="navbar-form navbar-left" action="/action_page.php">
          <Select v-model="selected_user" style="width:200px; margin-top: 8px;">
            <Option v-for="item in $store.state.user_list" :value="item.label" :key="item.label">{{ item.label }}</Option>
          </Select>
          &nbsp
          <Select v-model="selected_subscription_name" style="width:200px; margin-top: 8px;">
            <Option v-for="item in $store.state.subscription_list" :value="item.label" :key="item.label">{{ item.label }}</Option>
          </Select>

        </form>
        </ul>
        <ul class="nav navbar-nav navbar-right">
        <li class="dropdown">
              <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                        <Icon type="grid" :size="20"></Icon>&nbsp
                        <span class="caret"></span>
              </a>
              <ul class="dropdown-menu">
                <li class="disabled"><span style="font-size:12px;color:silver;margin-left:15px;">Flowz Products</span></li>
                <li><a href="#"><span @click="gotoDashboard" style="font-size:12px;">Flowz Dashboard</span></a></li>
                <li><a href="#"><span @click="gotoWebsiteBuilder" style="font-size:12px;">Website Builder</span></a></li>
                <li><a href="#"><span @click="gotoCRM" style="font-size:12px;">CRM</span></a></li>
              </ul>
        </li>
        <li class="dropdown">
              <a href="#" class="dropdown-toggle" data-toggle="dropdown" >
                        <Icon type="person" :size="20"></Icon>&nbsp
                        {{$store.state.user === null ? 'Guest' : $store.state.user.email}}
                        <span class="caret"></span>
              </a>
              <ul class="dropdown-menu">
                <li><a @click="viewConfig"><Icon type="gear-b"></Icon>&nbsp ASI/SAGE Configuration</a></li>
                <li><a @click="handleLogout()"><Icon type="ios-locked-outline" :size="16"></Icon>&nbsp Logout</a></li>
              </ul>
        </li> 
        </ul>
    </div>&nbsp 
  </div>
</nav>
</div>
</template>
<script>
import psl from 'psl'
import lodash from 'lodash'
import config from '@/config'
// import $ from 'jquery'
// let domainkey = process.env.domainkey ? process.env.domainkey : 'flowzcluster.tk'

export default {
  name: 'uploader-header',
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
    viewConfig () {
      this.$router.push('/settings')
    },
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
      // console.log('cxalled.....')
      if (this.selected_user === '') {
        // console.log('%%%%%%')
        if (this.$store.state.user_list.length !== 0) {
          // console.log('########')
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
      // console.log('user....', user)
      if (user !== '') {
        this.$store.state.storedUsername = this.selected_user
        // console.log('this.$store.state.storedUsername', this.$store.state.storedUsername)
        this.$store.state.selectedUserName = user
      } else {
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
<style>
.navbar-nav>li>a {
  color: white !important;
}

.nav.navbar-nav {
  margin-left:50px;
}
.nav > li > a:hover{
    background-color:#1d77d6 !important;
}
.navbar {
    border-radius: 0 !important;
    height: 65px;
}
.navbar-brand > img {
      max-height: 100%;
      height: 100%;
      -o-object-fit: contain;
      object-fit: contain;
      margin-top: 5px;
}
.scrollable-menu {
    height: auto;
    max-height: 200px;
    overflow-x: hidden;
}
.navbar-nav>li>a {
    color: white !important;
    font-size: 14px;
}
.navbar-brand {
  padding: 5px 15px;
}

.nav .open>a, .nav .open>a:focus, .nav .open>a:hover{
  background-color: transparent;
}

.navbar-nav>li>a{
  padding-top: 20px !important;
  height: 63px;
}
.dropdown:hover .dropdown-menu {display: block;}
.dropdown-menu > li > a { color: #1d77d6}
.dropdown-menu > li > a:hover { color: #1d77d6}
</style>

