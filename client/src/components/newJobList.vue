<template>
  <div>
    <h2 class="listUpld">List of Uploads</h2><br>
    <Table :columns="columns1" :data="chunkData[cpage-1]" class="jobtable"></Table>
    <div class="pagination">
      <Page :total="data2.length" :current="cpage" @on-change="changePage" :page-size=10></Page>
    </div>
    <Spin fix v-if="loading">
       <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
       <div>Loading</div>
   </Spin>
  </div>
</template>
<script>
/*eslint-disable*/
import innerJoblist from './innerJobList.vue';
let axios = require("axios")
import api from '../api'
import schema from '../api/schema'
import io from 'socket.io-client';
import feathers from 'feathers/client';
import socketio from 'feathers-socketio/client';
import Emitter from '@/mixins/emitter'
import config from '@/config'
var lodash = require('lodash');
var _ = require("underscore");
let socket
if (process.env.NODE_ENV !== 'development') {
  socket = io(config.socketURI)
} else {
  socket = io(config.socketURI)
}

const app = feathers().configure(socketio(socket))
let index
let id1
export default {
    name: 'newJoblist',
    components: { innerJoblist},
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
                    key: 'id',
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
                      if(masterJobStatus == 'rejected'){
                        return h('div', 'User cancelled')
                      }
                      else{
                        let masterJobStatus = lodash.capitalize( params.row.masterJobStatus)
                        return h('div', masterJobStatus)
                      }

                    }

                },
                {
                    title: 'StepStatus',
                    key: 'stepStatus',
                    render: (h, params) => {
                      let StepStatus = this.getStatus(params.row.stepStatus)
                      return h('div', StepStatus)
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
                    title: 'Username',
                    key: 'username',
                    width: 200,
                    render: (h,params) => {
                      if(params.row.username == null || params.row.username == undefined){
                        let username = '-'
                        return h('div', username)
                      }
                      else{
                        let username = lodash.capitalize(params.row.username)
                        return h('div', username)
                      }
                    }
                }
            ],
            data2: [],
            chunkData: [],
            loading: true,
            cpage: 1
        }
    },
    methods:{
      getStatus(status){
        if(status != ""){
          var res = lodash.capitalize(status.replace(/_/g," "))
          return res
        }
      },
      changePage(page) {
        this.cpage = page
      },
      getJobDetails(){
        let self = this
        self.data2 = []
        self.chunkData = []
        let filtered_records

        if(this.$store.state.selectedUserName != "All"){
          if(self.$store.state.user_detail_list.length != 0){
            filtered_records = lodash.filter(self.$store.state.user_detail_list, function(o) { if(o.name == self.$store.state.selectedUserName){
              return o.label
            } });
            id1 = filtered_records[0].label
          }

        }

        if(this.$store.state.selectedUserName != "All" && this.$store.state.subscription_id != "All"){
          socket.emit('uploader::find', {"user_id":id1,"subscriptionId":this.$store.state.subscription_id}, (e, data) => {

            self.cpage = 1
            if(data.data.length != 0){
              self.loading = false
              self.data2 =  lodash.orderBy(data.data, ['createdAt'],['desc']);
              // self.data2 = self.data2.reverse()
              self.chunkData = lodash.chunk(self.data2, 10);

            }
            else{
              self.loading = false
            }
          })
        }
        else if(this.$store.state.selectedUserName != "All" && this.$store.state.subscription_id == "All"){
          socket.emit('uploader::find', {"user_id":id1,"role":"other"}, (e, data) => {

            self.cpage = 1
              if(data.data.length != 0){
                self.loading = false
                self.data2 =  lodash.orderBy(data.data, ['createdAt'],['desc']);
                // self.data2 = self.data2.reverse()
                self.chunkData = lodash.chunk(self.data2, 10);

              }
              else{
                self.loading = false
              }
            })
        }
        else {

          socket.emit('uploader::find', {"user_id":this.$store.state.userid,"role":"other"}, (e, data) => {

            self.cpage = 1
              if(data.data.length != 0){
                self.loading = false
                self.data2 =  lodash.orderBy(data.data, ['createdAt'],['desc']);
                console.log("data2......",self.data2)
                // self.data2 = self.data2.reverse()
                self.chunkData = lodash.chunk(self.data2, 10);

              }
              else{
                self.loading = false
              }
            })
        }


      }
    },
    feathers: {
      'uploader': {
        updated (message) {
            let self = this
            if(message.user_id == self.$store.state.userId){
              for(var i=0;i<self.data2.length;i++){
                if(self.data2[i].id == message.id){
                  index = i
                }
              }

              self.data2.splice(index, 1);
              self.data2.splice( index,0,message );
            }


        },
        created (data) {
          let self = this
          if(data.user_id == self.$store.state.userId){
            self.data2.splice( 0,0,data );

          }
        },
        removed (data) {
          this.init()
        }
      }
    },
    watch:{
      '$store.state.subscription_id': function (id) {

        let self = this
        self.loading = true
        self.$store.commit('SET_STORED_SUB_ID',id)
        self.data2 = []
        self.chunkData = []
          self.getJobDetails()
      },
      '$store.state.selectedUserName': function(name) {
        if(name != null){
          let self = this
          self.loading = true
          self.data2 = []
          self.chunkData = []
          self.getJobDetails()
        }
      },
      '$store.state.subscription_name':function(name){

        let self = this
        // self.$store.commit('SET_STORED_SUB_NAME',name)

      },
      '$store.state.storedUsername':function(name1){
        console.log("storedusername")
        if(name1 != ""){
          if(this.$store.state.user_list.length != 0){
            let userId = lodash.findIndex(this.$store.state.user_list, function(o) { return o.label == "All"; })
            console.log("userId....",userId)
            if(userId == -1){
              this.$store.state.user_list.splice(0,0,{"value":"All","label":"All"})
            }
          }
        }
      }
    },
    mounted(){
      var self = this
      this.loading = true
      console.log("joblist called...")
      if(this.$store.state.disableuser == true){
        this.$store.state.disableuser = false
      }
      if(this.$store.state.disablesubscription == true){
        this.$store.state.disablesubscription = false
      }
      // this.$store.commit('SET_STOREDUSERNAME', "")
      let userId = lodash.findIndex(this.$store.state.user_list, function(o) { return o.label == "All"; })
      console.log(userId)
      if(userId == -1){
          this.$store.state.user_list.splice(0,0,{"value":"All","label":"All"})
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
</style>
