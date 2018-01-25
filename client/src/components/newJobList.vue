<template>
    <Table :columns="columns1" :data="data2" class="jobtable"></Table>
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
                    key: 'createdAt'
                },
                {
                    title: 'MasterJobStatus',
                    key: 'masterJobStatus'
                },
                {
                    title: 'StepStatus',
                    key: 'stepStatus'
                },
                {
                    title: 'Upload Type',
                    key: 'uploadType'
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
            if(message.user_id == self.$store.state.user._id){
              for(var i=0;i<self.data2.length;i++){
                if(self.data2[i].id == message.id){
                  index = i
                }
              }

              self.data2.splice(index, 1);
              for(var key in message){
                if(key == "createdAt"){
                  let created_at = moment(message[key]).fromNow()
                  delete message[key]
                  message["createdAt"] = created_at
                }
              }
              self.data2.push(message)
              self.data2 = _.sortBy(self.data2, 'createdAt');
            }


        },
        created (data) {
          let self = this
          if(data.user_id == self.$store.state.user._id){
            for(var key in data){
              if(key == "createdAt"){
                let created_at = moment(data[key]).fromNow()
                delete data[key]
                data["createdAt"] = created_at
              }
            }
            self.data2.push(data)
            self.data2 = _.sortBy(self.data2, 'createdAt');
          }
        },
        removed (data) {
          this.init()
        }
      }
    },
    mounted(){
      var self = this
      socket.emit('uploader::find', {user_id : this.$store.state.user._id}, (e, data) => {
        if(data.data.length != 0){
          for(var i=0;i<data.data.length;i++){
            for(var key in data.data[i]){
              if(key == "createdAt"){
                let created_at = moment(data.data[i][key]).fromNow()
                delete data.data[i][key]
                data.data[i]["createdAt"] = created_at
              }
              else if(key == "stepStatus"){
                let stepStatus = self.getStatus(data.data[i][key])
                delete data.data[i][key]
                data.data[i]["stepStatus"] = stepStatus
              }
            }
            self.data2.push(data.data[i])
          }
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
</style>
