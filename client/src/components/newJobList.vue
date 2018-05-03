<template>
  <div>
    <h2 class="listUpld">List of Uploads</h2><br>
    <Table :columns="columns1" :data="chunkData[cpage-1]" class="jobtable"></Table>
    <div class="pagination">
      <Page :total="data2.length" :current="cpage" @on-change="changePage" :page-size=10 show-total></Page>
    </div>
    <Spin fix v-if="loading">
       <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
       <div>Loading</div>
   </Spin>
  </div>
</template>
<script>
import innerJoblist from './innerJobList.vue'
let axios = require('axios')
import io from 'socket.io-client'
import Emitter from '@/mixins/emitter'
import config from '@/config'
import Cookies from 'js-cookie'
var lodash = require('lodash')
var moment = require('moment')
moment().format()
let socket
if (process.env.NODE_ENV !== 'development') {
  socket = io(config.socketURI, {reconnect: true})
} else {
  socket = io(config.socketURI, {reconnect: true})
}
let index
let id1
export default {
  name: 'newJoblist',
  components: {innerJoblist},
  mixins: [Emitter],
  data () {
    return {
      columns1: [
        {
          type: 'expand',
          width: 50,
          render: (h, params) => {
            return h(innerJoblist, {
              props: {
                row: params.row
              }
            })
          }
        },
        {
          title: 'Import-tracker Id',
          width: 330,
          key: 'id'
        },
        {
          title: 'Created At',
          key: 'createdAt',
          width: 200,
          render: (h, params) => {
            let mydate = moment(params.row.createdAt).fromNow()
            return h('div', mydate)
          }
        },
        {
          title: 'MasterJobStatus',
          key: 'masterJobStatus',
          render: (h, params) => {
            let masterJobStatus = params.row.masterJobStatus
            if (masterJobStatus === 'rejected') {
              return h('div', 'User cancelled')
            } else if (masterJobStatus === 'completed') {
              return h('div', 'Live')
            } else {
              let masterJobStatus = lodash.capitalize(params.row.masterJobStatus)
              return h('div', masterJobStatus)
            }
          }

        },
        {
          title: 'StepStatus',
          key: 'stepStatus',
          render: (h, params) => {
            let StepStatus = this.getStatus(params.row.stepStatus)
            if (StepStatus === 'Import completed') {
              return h('div', 'Imported')
            } else {
              return h('div', StepStatus)
            }
          }
        },
        {
          title: 'Upload Type',
          key: 'uploadType',
          render: (h, params) => {
            let uploadType = lodash.capitalize(params.row.uploadType)
            return h('div', uploadType)
          }
        },
        {
          title: 'Name',
          key: 'username',
          width: 200,
          render: (h, params) => {
            return h('div', params.row.username)
          }
        }
      ],
      data2: [],
      chunkData: [],
      loading: true,
      cpage: 1,
      uniq_users: []
    }
  },
  methods: {
    getStatus (status) {
      if (status !== '') {
        var res = lodash.capitalize(status.replace(/_/g, ' '))
        return res
      }
    },
    changePage (page) {
      this.cpage = page
    },
    async renderData (data) {
      let self = this
      let uniqUserIds = lodash.uniqBy(data, 'user_id')
      for (let i = 0; i < uniqUserIds.length; i++) {
        let response = await (axios({
          method: 'get',
          url: config.getUserdetailUri + uniqUserIds[i].user_id,
          headers: {
            'authorization': Cookies.get('auth_token')
          }
        }))
        if (response.data.data[0].firstname !== undefined && response.data.data[0].lastname !== undefined) {
          let name = response.data.data[0].firstname + ' ' + response.data.data[0].lastname
          name = lodash.capitalize(name)
          self.uniq_users.push({'id': uniqUserIds[i].user_id, 'username': name})
        } else {
          let name = '-'
          self.uniq_users.push({'id': uniqUserIds[i].user_id, 'username': name})
        }
      }
      for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < self.uniq_users.length; j++) {
          if (data[i].user_id === self.uniq_users[j].id) {
            data[i]['username'] = self.uniq_users[j]['username']
          }
        }
      }
      self.loading = false
      self.data2 = lodash.orderBy(data, ['createdAt'], ['desc'])
      self.chunkData = lodash.chunk(self.data2, 10)
    },
    getJobDetails () {
      let self = this
      self.data2 = []
      self.chunkData = []
      let filteredRecords

      if (this.$store.state.disconnect === false) {
        if (this.$store.state.selectedUserName !== 'All') {
          if (self.$store.state.user_detail_list.length !== 0) {
            filteredRecords = lodash.filter(self.$store.state.user_detail_list, function (o) {
              if (o.name === self.$store.state.selectedUserName) {
                return o.label
              }
            })
            id1 = filteredRecords[0].label
          }
        }

        if (this.$store.state.selectedUserName !== 'All' && this.$store.state.subscription_id !== 'All') {
          socket.emit('uploader::find', {'user_id': id1, 'subscriptionId': this.$store.state.subscription_id}, async (e, data) => {
            self.cpage = 1
            console.log('data...', data)
            if (data) {
              if (data.data.length !== 0) {
                await self.renderData(data.data)
              } else {
                self.loading = false
              }
            }
          })
        } else if (this.$store.state.selectedUserName !== 'All' && this.$store.state.subscription_id === 'All') {
          socket.emit('uploader::find', {'user_id': id1, 'role': 'other'}, async (e, data) => {
            self.cpage = 1
            console.log('data...', data)
            if (data) {
              if (data.data.length !== 0) {
                await self.renderData(data.data)
              } else {
                self.loading = false
              }
            }
          })
        } else {
          socket.emit('uploader::find', {'user_id': this.$store.state.userid, 'role': 'other'}, async (e, data) => {
            self.cpage = 1
            console.log('data...', data)
            if (data) {
              if (data.data.length !== 0) {
                await self.renderData(data.data)
              } else {
                self.loading = false
              }
            }
          })
        }
      } else if (this.$store.state.disconnect === true) {
        self.loading = false
        self.$Notice.error({
          title: 'Service unavailable',
          duration: 10
        })
      }
    }
  },
  feathers: {
    'uploader': {
      updated (message) {
        let self = this
        if (message.user_id === self.$store.state.userId) {
          for (var i = 0; i < self.data2.length; i++) {
            if (self.data2[i].id === message.id) {
              index = i
            }
          }

          self.data2.splice(index, 1)
          self.data2.splice(index, 0, message)
        }
      },
      created (data) {
        let self = this
        if (data.user_id === self.$store.state.userId) {
          self.data2.splice(0, 0, data)
        }
      },
      removed (data) {
        this.init()
      }
    }
  },
  watch: {
    '$store.state.subscription_id': function (id) {
      let self = this
      self.loading = true
      self.$store.commit('SET_STORED_SUB_ID', id)
      self.data2 = []
      self.chunkData = []
      self.getJobDetails()
    },
    '$store.state.selectedUserName': function (name) {
      if (name != null) {
        let self = this
        self.loading = true
        self.data2 = []
        self.chunkData = []
        self.getJobDetails()
      }
    },
    '$store.state.subscription_name': function (name) {
      // let self = this
    }
  },
  mounted () {
    var self = this
    this.loading = true
    if (this.$store.state.disableuser === true) {
      this.$store.state.disableuser = false
    }
    if (this.$store.state.disablesubscription === true) {
      this.$store.state.disablesubscription = false
    }
    let userId = lodash.findIndex(this.$store.state.user_list, function (o) { return o.label === 'All' })
    if (userId === -1) {
      this.$store.state.user_list.splice(0, 0, {'value': 'All', 'label': 'All'})
    }
    if (this.$store.state.storedUsername !== '') {
      let subId = lodash.findIndex(self.$store.state.user_detail_list, function (o) { return o.name === self.$store.state.storedUsername })
      if (subId !== -1) {
        self.selected_user = self.$store.state.user_detail_list[subId].name
      }
    }
    self.data2 = []
    self.chunkData = []
    self.getJobDetails()
  }
}
</script>
<style scoped>
.jobtable{
  text-align: center !important;
  /*overflow: inherit !important;*/
}
.jobtable th{
  text-align: center !important;
}
.listUpld{
  text-align: center !important;
}
.ivu-table-body {
  overflow: inherit !important;
}
.demo-spin-icon-load{
       animation: ani-demo-spin 1s linear infinite;
   }
@keyframes ani-demo-spin {
   from { transform: rotate(0deg);}
   50%  { transform: rotate(180deg);}
   to   { transform: rotate(360deg);}
}
.demo-spin-col{
   height: 100px;
   position: relative;
   border: 1px solid #eee;
}
.pagination{
  margin-top: 10px;
  float:right;
  position:relative;
}
</style>
<style>
.jobtable .ivu-table-body table {width: 100% !important;}
.jobtable .ivu-table-body table td .ivu-table-cell-expand {width: 100%; text-align: center;}
.jobtable .ivu-table .ivu-table-tip {overflow-x: hidden;}
.pagination .ivu-page-total {
    display: inline-block;
    height: 32px;
    line-height: 32px;
    margin-right: 10px;
    font-size: 13px !important;
    font-weight: 500 !important;
}

</style>
