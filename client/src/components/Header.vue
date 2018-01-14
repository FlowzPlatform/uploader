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
  export default {
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
      }
    }
  }
</script>>
