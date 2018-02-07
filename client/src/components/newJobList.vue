<template>
  <div>
    <h2 class="listUpld">List of Uploads</h2><br>
    <Table :columns="columns1" :data="data2" class="jobtable"></Table>
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
export default {
    name: 'newJoblist',
    components: { innerJoblist},
    mixins: [Emitter],
    data () {
        return {
            columns1: [
                {
                    type: 'expand',
                    width: 20,
                    render: (h, params) => {
                        return h(innerJoblist, {
                            props: {
                                row: params.row
                            }
                        })
                    }
                },
                {
                    title: 'Id',
                    key: 'id'
                },
                {
                    title: 'Created At',
                    key: 'createdAt',
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
                    key: 'username'
                }
            ],
            data2: []
        }
    },
    methods:{
      getStatus(status){
        var res = lodash.capitalize(status.replace(/_/g," "))
        return res
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
    mounted(){
      var self = this
      self.data2 = []
      socket.emit('uploader::find', {user_id : this.$store.state.userId , $sort: {createdAt: -1}}, (e, data) => {
        if(data.data.length != 0){
          self.data2 = data.data
        }
        else{
          self.$Notice.info({
                   title: 'No Data Available',
           });
        }
      })

    }
}
</script>
<style scoped>
.jobtable{
  text-align: center !important;
}
.jobtable th{
  text-align: center !important;
}
.listUpld{
  text-align: center !important;
}
</style>
