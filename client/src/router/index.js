import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/components/Layout'
// import Login from '@/components/Login'
import Dashboard from '@/components/Dashboard'
// import Schema from '@/components/Schema'
// import SchemaInstance from '@/components/SchemaInstance'
// import InstanceList from '@/components/InstanceList'
// import SchemaMapping from '@/components/SchemaMapping'
// import SchemaMappingList from '@/components/SchemaMappingList'
// import Settings from '@/components/Settings'
// import Import from '@/components/Import'
// import Db from '@/components/Db'
import Login from '@/components/Login'
import Register from '@/components/Register'
// import JobList from '@/components/JobList'
// import schemaList from '@/components/schemaList'
// import recordList from '@/components/recordList'
// import instancejoblist from '@/components/instancejoblist'
// import createRecord from '@/components/createRecord'
import EmailVerification from '@/components/EmailVerification'
import Uploader from '@/components/uploader'
import uploaderLanding from '@/components/uploader_landing'
import mainUpload from '@/components/mainUpload'
import newJoblist from '@/components/newJobList'

// import FlowzList from '@/components/FlowList'
// import Instance from '@/components/instance'
Vue.use(Router)
const routes = [{
  path: '/',
  name: 'Layout',
  component: Layout,
  meta: { description: 'Overview of environment', requiresAuth: true },
  children: [{
    path: 'dashboard',
    alias: '',
    component: Dashboard,
    name: 'Dashboard',
    meta: { description: 'Overview of environment', requiresAuth: true }
  }, {
    path: '/uploader',
    name: 'Uploader',
    component: Uploader
  }, {
    path: '/landing/:id',
    name: 'uploaderLanding',
    component: uploaderLanding,
    props: {
      id: Text,
      required: false
    }
  }, {
    path: '/upload/:id',
    name: 'mainUpload',
    component: mainUpload,
    props: {
      id: Text,
      required: false
    }
  },
  {
    path: '/uploader-joblist',
    name: 'newJoblist',
    component: newJoblist
  }]
}, {
  path: '/Login',
  name: 'Login',
  component: Login
}, {
  path: '/email-verification',
  name: 'email-verification',
  component: EmailVerification
}, {
  path: '/Register',
  name: 'Register',
  component: Register
}]
export default routes
