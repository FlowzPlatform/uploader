<template>
  <div id="landingPageStatusReport" class="clearfix" style="overflow:auto;border: 3px solid #7c7e86;color: black;text-align: center;padding-top: 4px;margin: 50px;padding-bottom: 26px;" v-if="show_table">
    <h2 style="text-transform:uppercase;margin-top: 18px;" v-if="job[0].username">Welcome back, {{job[0].username}}</h2>
    <h2 style="text-transform:uppercase;margin-top: 18px;" v-else>Welcome back</h2>
    <p style="margin-top: 10px;margin-bottom: 10px;font-size: 15px;">Following is the latest status of your file upload process.You can continue with your current status or abort the whole process to start again</p>

      <Spin fix v-if="loading">
         <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
         <div>Loading</div>
     </Spin>


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
                  <span>
                    <i class="fa fa-dot-circle-o" v-if="job[0].uploadType == 'inventory'"></i>
                    <i class="fa fa-circle-o" v-else></i>
                    Inventory
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
          <tr  v-if="item == 'ProductInformation' || item == 'ProductPrice' || item == 'ProductImprintData' || item == 'ProductImage' || item == 'ProductShipping' || item == 'ProductAdditionalCharges' || item == 'ProductVariationPrice' || item == 'WebsiteInventory'">
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

        <Button type="primary" class="landingContinuetBtn" @click="continue1()">Continue</Button>
        <Button type="error" class="landingAbortBtn" @click="modal1 = true">Abort</Button>
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
import api from '../api'
import config from '@/config'
import io from 'socket.io-client'
var moment = require('moment')
import lodash from 'lodash'

let socket
if (process.env.NODE_ENV !== 'development') {
  socket = io(config.socketURI, {reconnect: true})
} else {
  socket = io(config.socketURI, {reconnect: true})
}
moment().format()
export default {
  name: 'uploaderLanding',
  components: {},
  data () {
    return {
      job: [],
      modal1: false,
      keys: [],
      show: false,
      show_table: false,
      aborting: false,
      moment: moment,
      loading: true
    }
  },
  methods: {

      // to abort the current running job
    abort () {
      let self = this
      self.aborting = true
      self.$store.state.data = []

      let patchObj = {
        'masterJobStatus': 'rejected'
      }

      api.request('patch', '/uploader/' + this.$route.params.id, patchObj).then(res => {
        self.$Notice.error({
          title: 'Your files have been deleted'
        })
        self.$router.push('/uploader')
      })
          .catch(error => {
            if (error.response) {
              self.$Notice.error({
                title: error.response.data.name,
                desc: error.response.data.message,
                duration: 10
              })
            } else if (error.message === 'Network Error') {
              self.$Notice.error({
                title: 'API Service unavailable',
                duration: 10
              })
            }
            self.modal1 = false
          })
    },
      // converts into uppercase
    convert (item) {
      item = item.replace(/([A-Z])/g, ' $1').trim()
      return item
    },

      // closes the alert
    cancel () {
      this.modal1 = false
    },
      // takes to the main upload page
    continue1 () {
      this.$store.state.calledFromContinue = true
      this.$store.state.disableuser = true
      this.$store.state.disablesubscription = true
      this.$router.push('/upload/' + this.$route.params.id)
    },
    findData (subId) {
      if (this.$store.state.disconnect === false) {
        socket.emit('uploader::find', {'subscriptionId': subId, 'id': this.$route.params.id, 'masterJobStatus': 'running'}, (e, data) => {
          if (data.data.length !== 0) {
            this.$store.state.jobData = data.data[0]
            let tabArray = ['ProductInformation', 'ProductPrice', 'ProductImprintData', 'ProductImage', 'ProductShipping', 'WebsiteInventory', 'ProductAdditionalCharges', 'ProductVariationPrice']
            for (let i = 0; i < tabArray.length; i++) {
              for (let key in data.data[0]) {
                if (tabArray[i] === key) {
                  let prodData = data.data[0][key]
                  delete data.data[0][key]
                  data.data[0][tabArray[i]] = prodData
                }
              }
            }

            this.job.push(data.data[0])
            this.loading = false
            this.show_table = true
            this.keys = Object.keys(this.job[0])
            for (let i = 0; i < this.keys.length; i++) {
              if (this.keys[i] === 'ProductInformation' || this.keys[i] === 'ProductPrice' || this.keys[i] === 'ProductShipping' || this.keys[i] === 'ProductImage' || this.keys[i] === 'ProductImprintData' || this.keys[i] === 'WebsiteInventory' || this.keys[i] === 'ProductAdditionalCharges' ||
                this.keys[i] === 'ProductVariationPrice') {
                this.show = true
              }
            }
          } else {
            // this.$Notice.info({
            //   title: 'No Data Available'
            // })
            this.$router.push('/uploader')
          }
        })
      } else if (this.$store.state.disconnect === true) {
        this.loading = false
        this.$Notice.error({
          title: 'Service unavailable',
          duration: 10
        })
      }
    }
  },
  mounted () {
    this.loading = true
    this.$store.state.validationStatus = false

    if (this.$store.state.storedSubscriptionName !== '') {
      this.findData(this.$store.state.subscription_id)
      // let self = this
      // let subId = lodash.findIndex(self.$store.state.subscription_list, function (o) { return o.label === 'All' })
      // if (subId !== -1) {
      //   self.$store.state.subscription_list.splice(subId, 1)
      // }

      // let subscriptionObj1
      // subscriptionObj1 = lodash.filter(self.$store.state.subscription_list, function (o) {
      //   if (o.label === self.$store.state.storedSubscriptionName) {
      //     return o
      //   }
      // })
      // if (subscriptionObj1.length !== 0) {
      //   self.$store.state.subscription_id = subscriptionObj1[0].value
      // }

    // } else {
      // let self = this
      // let subId = lodash.findIndex(self.$store.state.subscription_list, function (o) { return o.label === 'All' })
      // if (subId !== -1) {
      //   self.$store.state.subscription_list.splice(subId, 1)
      // }
      // this.$store.state.subscription_id = this.$store.state.subscription_list[0].value
      // this.$store.state.subscription_name = this.$store.state.subscription_list[0].label
      // this.$store.state.storedSubscriptionName = this.$store.state.subscription_name
      // this.findData(this.$store.state.subscription_id)
    }
  },
  watch: {
    '$store.state.subscription_id': function (id) {
      let self = this
      // console.log('landing $store')
      if (id === 'All') {
        self.loading = false
        // self.$Notice.error({
        //   title: 'Please select a proper subscription id...'
        // })
      } else {
        if (self.show_table === true) {
          self.show_table = false
        }
        self.loading = true
        self.findData(id)
      }
    },
    '$store.state.user_list': function (list) {
      // console.log('landing list....', list)
      if (list.length !== 0) {
        if (this.$store.state.storedUsername !== '') {
          let userId = lodash.findIndex(list, function (o) { return o.label === 'All' })
          if (userId !== -1) {
            list.splice(userId, 1)
            let subId = lodash.findIndex(this.$store.state.subscription_list, function (o) { return o.label === 'All' })
            if (subId !== -1) {
              this.$store.state.subscription_list.splice(subId, 1)
              let self = this
              let filteredUser = lodash.filter(this.$store.state.user_detail_list, function (o) { return o.name === self.$store.state.storedUsername })
              // console.log('&&&&&', filteredUser)
              let subsArr = []

              if (filteredUser.length !== 0) {
                for (let userSubs in filteredUser) {
                  for (let subs in self.$store.state.fullSubscriptionList) {
                    if (filteredUser[userSubs].value === self.$store.state.fullSubscriptionList[subs].value) {
                      subsArr.push(self.$store.state.fullSubscriptionList[subs])
                    }
                  }
                }
                self.$store.state.subscription_list = []
                self.$store.state.subscription_list = subsArr
                self.$store.state.storedSubscriptionName = subsArr[0].label
                self.$store.state.subscription_id = subsArr[0].value
              }
            }
          }
        }
      }
    },
    '$store.state.storedUsername': function (selectedUser) {
      // console.log('called.....')
      let filteredUser = lodash.filter(this.$store.state.user_detail_list, function (o) { return o.name === selectedUser })
      let subsArr = []

      for (let userSubs in filteredUser) {
        for (let subs in this.$store.state.fullSubscriptionList) {
          if (filteredUser[userSubs].value === this.$store.state.fullSubscriptionList[subs].value) {
            subsArr.push(this.$store.state.fullSubscriptionList[subs])
          }
        }
      }
      this.$store.state.subscription_list = subsArr
      this.$store.state.storedSubscriptionName = subsArr[0].label
    }
  }
}
</script>
<style scoped>

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
