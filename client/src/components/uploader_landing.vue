<template>
  <div id="landingPageStatusReport" class="clearfix" style="overflow:auto;border: 3px solid #7c7e86;color: black;text-align: center;padding-top: 4px;margin: 50px;padding-bottom: 26px;" v-if="show_table">
    <h2 style="text-transform:uppercase;margin-top: 18px;" v-if="job[0].username">Welcome back, {{job[0].username}}</h2>
    <h2 style="text-transform:uppercase;margin-top: 18px;" v-else>Welcome back</h2>
    <p style="margin-top: 10px;margin-bottom: 10px;font-size: 15px;">Following is the latest status of your file upload process.You can continue with your current status or abort the whole process to start again</p>

      <div class="ivu-tabs-tabpane">
      <div class="ivu-table-wrapper upld_land">
      <div class="ivu-table">
      <div class="ivu-table-header">
        <table cellspacing="0" cellpadding="0" border='1' style="width:80%" >
          <colgroup>
            <col width="30">
            <col width="70">
          </colgroup>
            <tr>
              <td class="">
                <div class="ivu-table-cell upload">
                  <span style='font-weight:bold;font-size:16px !important'>uploadType</span>
                </div>
              </td>
              <td class="">
                <div class="ivu-table-cell">
                <div class="upload-type">
                  <span>
                      <i class="fa fa-dot-circle-o" v-if="job[0].uploadType == 'replace'"></i>
                      <i class="fa fa-circle-o" v-else></i>
                    Replace
                  </span>
                  <span>
                    <i class="fa fa-dot-circle-o" v-if="job[0].uploadType == 'append'"></i>
                    <i class="fa fa-circle-o" v-else></i>
                    Append
                  </span>
                  <span>
                    <i class="fa fa-dot-circle-o" v-if="job[0].uploadType == 'upsert'"></i>
                    <i class="fa fa-circle-o" v-else></i>
                    Upsert
                  </span>
                  <span>
                    <i class="fa fa-dot-circle-o" v-if="job[0].uploadType == 'update'"></i>
                    <i class="fa fa-circle-o" v-else></i>
                    Update
                  </span>
                </div>
              </div>
              </td>
            </tr>
            <tr>
              <td class="">
                <div class="ivu-table-cell upload">
                  <span style='font-weight:bold; font-size:16px !important'>Started Process at</span>
                </div>
              </td>
              <td class="">
                <div class="ivu-table-cell upload">
                  <span style='font-weight:500; font-size:16px !important'>{{moment(job[0].createdAt).fromNow()}}</span>
                </div>
              </td>
            </tr>
        </table>
      </div>
    </div>

    <div class="ivu-table" v-if="show">
    <div class="ivu-table-header">
      <table cellspacing="0" cellpadding="0" border='1' style="width:80%">
        <colgroup>
          <col width="25">
          <col width="25">
          <col width="25">
          <col width="25">
        </colgroup>
        <thead>
          <tr>
          <th class="">
            <div class="ivu-table-cell upload">
              <span style='font-weight:bold; font-size:16px !important'>File</span>
            </div>
          </th>
          <th class="">
            <div class="ivu-table-cell upload">
              <span style='font-weight:bold; font-size:16px !important'>Upload Status</span>
            </div>
          </th>
          <th class="">
            <div class="ivu-table-cell upload">
              <span style='font-weight:bold; font-size:16px !important'>Validation Status</span>
            </div>
          </th>
          <th class="">
            <div class="ivu-table-cell upload">
              <span style='font-weight:bold; font-size:16px !important'>Import Status</span>
            </div>
          </th>
         </tr>
       </thead>
       <tbody v-for="(item,index) in Object.keys(job[0])">
          <tr  v-if="item == 'ProductInformation' || item == 'ProductPrice' || item == 'ProductImprintData' || item == 'ProductImage' || item == 'ProductShipping' || item == 'ProductAdditionalCharges' || item == 'ProductVariationPrice'">
            <td class="">
              <div class="ivu-table-cell upload">
                <span style='font-weight:500px; font-size:16px !important'>{{convert(item)}}</span>
              </div>
            </td>
            <td style='text-transform:capitalize;'>
                <div class="ivu-table-cell upload">
                <span style='font-weight:500px; font-size:16px !important'>{{job[0][item].uploadStatus}}</span>
              </div>
            </td>
            <td style='text-transform:capitalize;'>
              <div class="ivu-table-cell upload">
               <span style='font-weight:500px; font-size:16px !important'>{{job[0][item].validateStatus}}</span>
             </div>
            </td>
            <td>
              <div class="ivu-table-cell upload">
                <span style='font-weight:500px; font-size:16px !important'>Pending</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  </div>
</div>


      <div class="landingBtnDiv">
        <Button type="error" class="landingAbortBtn" @click="modal1 = true">Abort</Button>
        <Button type="primary" class="landingContinuetBtn" @click="continue1()">Continue</Button>
      </div>
      <Modal v-model="modal1" width="450">
       <p slot="header" style="color:#f60;text-align:center;font-size:20px">
           <Icon type="information-circled"></Icon>
           <span>Are you sure?</span>
       </p>
       <div style="text-align:center">
           <p style="font-size:15px">All your existing uploaded file will be deleted and you have to upload the files again</p>
       </div>
       <div slot="footer">
           <Button @click="cancel" style="background-color:#ddd">Cancel</Button>
           <Button type="error"  @click="abort" v-if="!aborting">Abort</Button>
           <Button type="error" v-if="aborting">Aborting...</Button>
       </div>
   </Modal>

  </div>
</template>
<script>
/*eslint-disable*/
let axios = require("axios")
import api from '../api'
import schema from '../api/schema'
import config from '@/config'
import io from 'socket.io-client'
import feathers from 'feathers/client'
import socketio from 'feathers-socketio/client'
var moment = require('moment');

let socket
if (process.env.NODE_ENV !== 'development') {
  socket = io(config.socketURI)
} else {
  socket = io(config.socketURI)
}
const app = feathers().configure(socketio(socket))
moment().format();
let id
export default {
    name: 'uploaderLanding',
    components: {},
    data () {
        return {
            job: [],
            modal1:false,
            keys: [],
            show: false,
            show_table: false,
            aborting: false,
            moment : moment
        }
    },
    methods:{

      //to abort the current running job
      abort(){
        let self = this
        self.aborting = true
        self.$store.state.data = []

        let patch_obj = {
           "masterJobStatus": "rejected",
        }

          api.request('patch', '/uploader/' + this.$route.params.id,patch_obj).then(res => {
            self.$Notice.error({
              title: 'Your files have been deleted'
            });
            self.$router.push('/uploader')
          })
          .catch(error => {
            self.$Notice.error({
              title: 'Something bad happened.Please try again later'
            });
          })
      },
      //converts into uppercase
      convert(item){
        item = item.replace(/([A-Z])/g, ' $1').trim()
        return item
      },

      //closes the alert
      cancel(){
        this.modal1 = false
      },
      //takes to the main upload page
      continue1(){
        this.$router.push('/upload/' + this.$route.params.id)
      }

    },

    mounted(){
      socket.emit('uploader::find', {id: this.$route.params.id}, (e, data) => {
        if(data.data.length != 0){
          this.$store.state.jobData = data.data[0]
          this.job.push(data.data[0])
          this.show_table = true
          this.keys = Object.keys(this.job[0])
          for(let i=0 ;i<this.keys.length;i++){
            if(this.keys[i] == 'ProductInformation' || this.keys[i] == 'ProductPrice' || this.keys[i] == 'ProductShipping' || this.keys[i] == 'ProductImage' || this.keys[i] == 'ProductImprintData' || this.keys[i] == 'ProductAdditionalCharges' ||
            this.keys[i] == 'ProductVariationPrice'){
              this.show = true
            }
          }
        }
        else{
          this.$Notice.info({
                   title: 'No Data Available',
           });
        }
      })
    }
}
</script>
<style>

.upload-type > span{
  padding-right: 35px;
  font-weight: 500 !important;
  font-size: 16px !important;
  color : #888383;
}
.upload{
  font-size: 16px !important;
  padding:5px;
  word-break: break-all;
  text-align:center !important;
}
.landingBtnDiv{
    padding: 15px;
}
.landingAbortBtn{
  width: 160px !important;
  border: none !important;
  background: #b51f1f !important;
  color: #fff  !important;
  letter-spacing: 1px  !important;
  line-height: 2.5 !important;
  font-size:14px !important;
}
.landingAbortBtn:hover{
  width: 160px !important;
  border: none !important;
  background: #f16543 !important;
  color: #fff  !important;
  letter-spacing: 1px  !important;
  line-height: 2.5 !important;
  font-size:14px !important;
}
.landingContinuetBtn{
  width: 160px  !important;
  border: none  !important;
  background: #1fb58f  !important;
  color: #fff  !important;
  letter-spacing: 1px  !important;
  line-height: 2.5  !important;
  font-size:14px !important;
}
.landingContinuetBtn:hover{
  width: 160px  !important;
  border: none  !important;
  background: #41e0c5 !important;
  color: #fff  !important;
  letter-spacing: 1px  !important;
  line-height: 2.5  !important;
  font-size:14px !important;
}

button, html input[type="button"], input[type="reset"], input[type="submit"] {
    -webkit-appearance: button;
    cursor: pointer;
    font-size: 14px;
}

.ivu-table table{
    margin:auto;
    border:solid 1px #ccc;
    border-collapse: collapse;
}


.ivu-table table > th > tr{
  color:#4e4e4e;
  background-color: #fff;
}
.ivu-table table >  tr{
  color:#4e4e4e;
  background-color: #fff;
}

.ivu-table th {
    height: 47px;
    white-space: nowrap;
    overflow: hidden;
    text-align:center;
    background-color: #fff;
}

.ivu-modal {
    width: auto;
    margin: 0 45%;
    position: relative;
    outline: 0;
    top: 284px;
}
/*.ivu-table-wrapper {

}*/

.upld_land{
  position: relative !important;
  border: 0px !important;
}

</style>
