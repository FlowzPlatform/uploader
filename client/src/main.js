// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// https://github.com/misterGF/CoPilot/blob/master/src/main.js
import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import { sync } from 'vuex-router-sync'
import routes from './router'
import store from './store'
import config from '@/config'
import toastr from 'toastr'

// Include and set up feathers client
const Feathers = require('feathers/client')
const hooks = require('feathers-hooks')
  // const authentication = require('feathers-authentication/client')
const socketio = require('feathers-socketio/client')
const io = require('socket.io-client')
  // const socket = io(config.serverURI)
let socket = io(config.socketURI, {reconnection: true})
socket.on('connect', function (connect) {
  store.commit('SET_DISCONNECT', false)
})

socket.on('disconnect', function (disconnect) {
  store.commit('SET_DISCONNECT', true)
  socket.on('connect', function (connect) {
    store.commit('SET_DISCONNECT', false)
  })
})

socket.on('reconnect', function (reconnect) {
})

socket.on('error', function (error) {
  console.log('Socket.io ', error)
})

const feathers = Feathers()
  .configure(socketio(socket))
  .configure(hooks())
  // .configure(authentication({storage: window.localStorage}))
  // Include it as a CommonJS module
const vueFeathers = require('vue-feathers')
  // And plug it in
Vue.use(vueFeathers, feathers)
import ElementUI from 'element-ui'
import element from 'element-ui/src/locale/lang/en'
import 'element-ui/lib/theme-default/index.css'
Vue.use(ElementUI, { element })
  /* vueTinymce */
import vueTinymce from '@deveodk/vue-tinymce'

Vue.use(vueTinymce)
  /* vueTinymce */
  /* IView */
import iView from 'iview'
import locale from 'iview/dist/locale/en-US'
import 'iview/dist/styles/iview.css' // CSS
Vue.use(iView, { locale })
  /* jquery-ui */
  /* Animated css */
import 'animate.css/animate.css'

import VueParticles from 'vue-particles'
Vue.use(VueParticles)
  /* IView */
  // import 'bootstrap/dist/css/bootstrap.css'
  // import 'bootstrap-vue/dist/bootstrap-vue.css'
import AsyncComputed from 'vue-async-computed'
Vue.use(AsyncComputed)
Vue.config.productionTip = false
import VueCookie from 'vue-cookie'
Vue.use(VueCookie)
import VueSplit from 'vue-split-panel'
Vue.use(VueSplit)
  /* eslint-disable no-new */

import VueFormGenerator from 'vue-form-generator'
import 'vue-form-generator/dist/vfg.css'
Vue.use(VueFormGenerator)

  // Routing logic
Vue.use(VueRouter)
var router = new VueRouter({
  routes: routes,
  mode: 'history',
  scrollBehavior: function (to, from, savedPosition) {
    return savedPosition || { x: 0, y: 0 }
  }
})

import Vuebar from 'vuebar'
Vue.use(Vuebar)

import axios from 'axios'
import psl from 'psl'
// Some middleware to help us ensure the user is authenticated.
router.beforeEach((to, from, next) => {
  iView.LoadingBar.config({ color: '#0e406d' })
    // window.console.log('Transition', transition)
    // router.app.$store.state.token
  let obId = false
  let location = psl.parse(window.location.hostname) // get parent domain
  location = location.domain === null ? location.input : location.domain
  if (to.query.ob_id) {
    obId = to.query.ob_id
  }
  if (to.query.token) {
    router.app.$cookie.set('auth_token', to.query.token, { expires: 1, domain: location })
  }
  const token = router.app.$cookie.get('auth_token')
    // set token in axios
  if (token) {
    axios.defaults.headers.common['authorization'] = token
  } else {
    delete axios.defaults.headers.common['authorization']
  }
  if (to.matched.some(record => record.meta.requiresAuth) && obId) {
    next({
      path: '/email-verification',
      query: { ob_id: obId }
    })
  } else if (to.matched.some(record => record.meta.requiresAuth) && (!token || token === 'null')) {
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  } else {
    if (to.matched.some(record => record.meta.requiresAuth)) {
      store.dispatch('authenticate', token).then(response => {
        store.commit('SET_USER', response)
        next()
      })
      .catch(error => {
        if (error.response.status === 401) {
          router.app.$cookie.delete('auth_token', { domain: location })
          toastr.error('User authentication failed')
        } else if (error.response.data) {
          toastr.error(error.response.data.message)
        } else if (error.message === 'Network Error') {
          toastr.error('API Service unavailable')
        }
        // window.console.log('Not authenticated')
        next({
          path: '/login',
          query: { redirect: to.fullPath }
        })
      })
    } else {
      if (to.path === '/login' && token) {
        next({
          path: '/'
        })
      } else {
        next()
      }
    }
  }
})
sync(store, router)
new Vue({
  el: '#app',
  router,
  store: store,
  template: '<App/>',
  components: { App }
})
