<template>
    <Table :columns="columns1" :data="data2"></Table>
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
      getData(value){
        // console.log("dataa cameeeeeeeeeeeeeeee...",value)
        // this.broadcast("Settings","data",value)
      }
    },
    feathers: {
      'uploader': {
        updated (message) {
            let self = this
            // console.log("messages....",message)
            for(var i=0;i<self.data2.length;i++){
                if(self.data2[i].id == message.id){
                    index = i
                }
            }
            // console.log("index",index)

            self.data2.splice(index, 1);
            // console.log("message after splicing...",self.data2)
            self.data2.push(message)
            self.data2 = _.sortBy(self.data2, 'createdAt');
            // self.data2 = desc.reverse()


        },
        created (data) {
          let self = this
          // console.log('connectiondata created..', data)
          // console.log("data.....",data)
           self.data2.push(data)
           self.data2 = _.sortBy(self.data2, 'createdAt');
        //  self.data2 = desc.reverse()
        },
        removed (data) {
          // console.log('connectiondata removed..', data)
          this.init()
        }
      }
    },
    mounted(){
      var self = this
      socket.emit('uploader::find', {user_id : this.$store.state.user._id}, (e, data) => {
        // console.log("response",data.data)
        for(var i=0;i<data.data.length;i++){
          self.data2.push(data.data[i])
        }
        // console.log("------------>",self.data2)
      })

    }
}
</script>
<style scoped>
</style>
