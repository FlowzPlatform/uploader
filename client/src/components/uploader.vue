<template>
  <div>
    <Spin fix v-if="loading">
       <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
       <div>Loading</div>
   </Spin>
  <div class="right" v-if="showDiv">
    <Row>
      <h2 style="margin-top: 12px;">Choose a method to upload the data</h2>
    </Row>
    <Row>
      <Form>
        <Row class="uploaderRow" style="padding: 15px !important">
          <ul class="mySection">
            <div v-for="(method,mIndex) in methods1">
              <Col span="6" style="padding: 0px">
                <li class="btn" @click="methodChanged(mIndex)" @mouseover="display(method.name)" @mouseout="hide(method.name)" >
                    <img src="../assets/images/tick.png" class="selected_tick" v-if="method.selected == true">
                    <label class="dropbtn" :id="mIndex">
                   {{method.name}}
                   </label>
                </li>
              </Col>
            </div>
          </ul>
        </Row>
        <div class="landing_progress">
            <Button type="primary" size="large" class="custombtn" @click="Proceed()" :disabled="disabled" v-if="!loadingBtn">Proceed</Button>
            <Button type="primary" size="large" class="custombtn" v-if="loadingBtn">Loading...</Button>
        </div>
        <Row>
          <!-- <div   > -->
          <div id="dv" class="clearfix col-md-10 col-md-offset-1 col-sm-12 col-xs-12" style="display:none">
              <Button type="ghost" class="ghtbtn">×</Button>
              <img class="bulb" src="../assets/images/idea.png" />
              <p id="get"></p>
          </div>
        <!-- </div> -->
        </Row>

        <div id="display-error" style="display:none">Please choose a method of your choice.</div>
      </Form>
    </Row>
  </div>
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
import lodash from 'lodash'

let socket
if (process.env.NODE_ENV !== 'development') {
  socket = io(config.socketURI,{reconnect: true})
} else {
  socket = io(config.socketURI,{reconnect: true})
}
const app = feathers().configure(socketio(socket))
let id
export default {
    name: 'uploader',
    components: {},
    data () {
        return {
          methods1: [
           { name: 'REPLACE',selected:false},
           { name: 'APPEND',selected:false},
           { name: 'UPSERT',selected:false},
           { name: 'UPDATE',selected:false}
         ],
         selectedMethod:'',
         disabled: true,
         showDiv: false,
         loadingBtn: false,
         loading: true
        }
    },
    methods:{
      //to display the tick on the click of any method
       methodChanged(index){
         this.methods1[index].selected = true
         this.selectedMethod = this.methods1[index].name
         this.disabled = false
         let me = $("ul.mySection").find("#"+index)
         me.css("background-color", "#1fb58f","color","fff");

         for(let i=0;i<this.methods1.length;i++){
           if(i != index){
             this.methods1[i].selected = false
             let me1 = $("ul.mySection").find("#"+i)
             me1.css("background-color", "#494e6b","color","fff");
           }
         }
       },
       //to display the method hints(showHintsDiv)
       display(name){
         document.getElementById("dv").style.display="block";
         this.showHintsDiv(name)
       },
       //to hide the method hints(showHintsDiv)
       hide(){
         // document.getElementById("dv").style.display="none";
       },
       //to display proper hint according to method
       showHintsDiv(data){
        if(data == "REPLACE") {
            $( "#get" ).html( "<p> By choosing <b>Replace</b> method you can remove all your old data and add the new one.Replace all the old products with new one.</p><table border=1 style='position:absolute;left:34%;width:37%;'><tr><th colspan='2' style='background-color:#494e6b;color:#fff;text-align:center'>Example</th></tr><tr><td> Old records </td><td> A, B, C </td></tr> <tr><td>New records </td><td> <span style='color:blue;font-weight:bold'>C'</span>, D, E</td></tr><tr><td style='background-color:#e2e2e2'> Result </td><td style='background-color:#e2e2e2'> <span style='color:blue;font-weight:bold'>C'</span>, D, E</td></tr></table>");
        }
        else if(data == "APPEND") {
            $( "#get" ).html( "<p> By choosing <b>Append</b> method you can Keep all the old products and add the new one . No old records will be updated .</p><p><table border=1 style='position:absolute;left:34%;width:37%'><tr><th colspan='2' style='background-color:#494e6b;color:#fff;text-align:center'>Example</th></tr><tr><td> Old records </td><td> A, B, C </td></tr> <tr><td>New records </td><td> <span style='color:blue;font-weight:bold'>C'</span>, D, E</td></tr><tr><td style='background-color:#e2e2e2'> Result </td><td style='background-color:#e2e2e2'> A, B, C, D, E</td></tr></table>" );
        }
        else if(data == "UPSERT") {
            $( "#get" ).html( " <p> By choosing <b>Upsert</b> method you can Keep all the old products , update old records and add the new one .</p><p><table border=1 style='position:absolute;left:37%;width:34%'><tr><th colspan='2' style='background-color:#494e6b;color:#fff;text-align:center'>Example</th></tr><tr><td> Old records </td><td> A, B, C </td></tr> <tr><td>New records </td><td> <span style='color:blue;font-weight:bold'>C'</span>, D, E</td></tr><tr><td style='background-color:#e2e2e2'> Result </td><td style='background-color:#e2e2e2'>A, B, <span style='color:blue;font-weight:bold'>C'</span>, D, E</td></tr></table>" );
        }
        else if(data == "UPDATE") {
            $( "#get" ).html( "<p> By choosing <b>Update</b> method you can Keep all the old products and update old records . No new products can be added in this method</p><p>  <table border=1 style='position:absolute;left:34%;width:37%'><tr><th colspan='2' style='background-color:#494e6b;color:#fff;text-align:center'>Example</th></tr><tr><td> Old records </td><td> A, B, C </td></tr> <tr><td>New records </td><td> <span style='color:blue;font-weight:bold'>C'</span>, D, E</td></tr><tr><td style='background-color:#e2e2e2'> Result </td><td style='background-color:#e2e2e2'>A, B, <span style='color:blue;font-weight:bold'>C'</span> </td></tr></table>" );
        }
     },
     // creates a job in uploader service
     Proceed(){
       if(this.$store.state.subscription_name == '' || this.$store.state.subscription_name == 'All'){
         this.loadingBtn = false
         this.$Notice.error({
            title: "Please select a subscription to proceed"
         });
       }
       else{
          this.loadingBtn = true
          if(this.selectedMethod == ''){
            $('#display-error').fadeIn().delay(4000).fadeOut();
          }
          else{
            var obj = {
              createdAt: new Date(),
              stepStatus: 'upload_pending',
              uploadType:this.selectedMethod.toLowerCase(),
              key:'pdm_uploader',
              masterJobStatus: "running",
              subscriptionId: this.$store.state.subscription_id
            }

            api.request('post', '/uploader', obj).then(res => {
              id = res.data.id
              this.$store.state.disableuser = true
              this.$store.state.disablesubscription = true
              this.$router.push('/upload/' + id)
            })
            .catch(error =>{
              this.loadingBtn = false
              if(error.response){
                this.$Notice.error({
                  title: error.response.data.name,
                  desc: error.response.data.message,
                  duration: 10
                })
              }
              else if(error.message == 'Network Error'){
                this.$Notice.error({
                  title: 'API Service unavailable',
                  duration: 10
                })
              }

            })
          }
       }
     },
     getData(id){
      if(this.$store.state.disconnect == false){
        socket.emit('uploader::find', {"subscriptionId":id,"masterJobStatus":"running","key":"pdm_uploader"}, (e, data) => {

          if(data){
            if (data.data.length !== 0) {
              this.showDiv = false
              this.loading = false
              this.$router.push('/landing/' + data.data[0].id)
            }
            else {
              this.showDiv = true
              this.loading = false
              this.$store.state.jobData = {}
            }
          }
        })
      }
      else if(this.$store.state.disconnect == true){
        this.loading = false
        this.$Notice.error({
          title: 'Service unavailable',
          duration: 10
        })
      }
     }
    },
    mounted(){
      this.loading = true
      this.$store.state.validationStatus = false
      if(this.$store.state.disableuser == true){
        this.$store.state.disableuser = false
      }
      if(this.$store.state.disablesubscription == true){
        this.$store.state.disablesubscription = false
      }

      if(this.$store.state.storedSubscriptionName != ""){
        let self = this
        let sub_id = lodash.findIndex(self.$store.state.subscription_list, function(o) { return o.label == "All"; })
        if(sub_id != -1){
            self.$store.state.subscription_list.splice(sub_id,1)
        }

        let subscription_obj1
        subscription_obj1 = lodash.filter(self.$store.state.subscription_list, function(o) {
           if(o.label == self.$store.state.storedSubscriptionName){
             return o
           }
         });
         if(subscription_obj1.length != 0){
           self.$store.state.subscription_id = subscription_obj1[0].value
         }
        this.getData(this.$store.state.subscription_id)
      }
      else{
        let self = this
        let sub_id = lodash.findIndex(self.$store.state.subscription_list, function(o) { return o.label == "All"; })
        if(sub_id != -1){
            self.$store.state.subscription_list.splice(sub_id,1)
        }
        this.$store.state.subscription_id = this.$store.state.subscription_list[0].value
        this.$store.state.subscription_name = this.$store.state.subscription_list[0].label
        this.$store.state.storedSubscriptionName =  this.$store.state.subscription_name
        // this.loading = false
        this.getData(this.$store.state.subscription_id)
      }
    },
    watch:{
    '$store.state.subscription_id': function (id) {
      if(id == 'All'){
        this.loading = false
        this.$Notice.error({
         title: 'Please select a proper subscription id...'
       });
      }
      else {
        if(this.showDiv == true){
          this.showDiv = false
        }
        this.loading = true
        this.getData(id)
      }
    },
    '$store.state.user_list': function(list){
      if(list.length != 0){
        if(this.$store.state.storedUsername != ""){
          let self = this
          let userId = lodash.findIndex(list, function(o) { return o.label == "All"; })
          if(userId != -1){
              list.splice(userId,1)
          }
        }
      }
    }
  }
}
</script>
<style scoped>
/** { box-sizing: border-box; margin: 0; padding: 0; }*/
.uploaderRow {
  padding: 12px !important;
}
ul.mySection { margin: 16px; list-style: none; }
ul.mySection li { margin: 0px 0px; display: inline-block;}
ul.mySection input[type=radio] { display: none; }
ul.mySection label {
    display: table-cell; cursor: pointer;
    width: 160px !important;
    height: 105px !important;
    vertical-align: middle; text-align: center;
    background-color: #494e6b;
    color:#fff
}
ul.mySection label:hover {
    background-color: #7c7e86; color: aquamarine; transition: all 0.25s;
}
.dropbtn {
    background-color: #4CAF50;
    color: white;
    padding: 16px;
    font-size: 16px;
    border: none;
    cursor: pointer;
}
#myform {
    text-align: center;
  }
  #dv {
  height: 185px;
  width: 74%;
  margin-top: 2px;
  margin-bottom:20px !important;
  overflow: auto;
  border: 3px solid #7c7e86;
  color: black;
  text-align: center;
  padding-top: 4px;
  margin-left: auto;
  margin-right: auto;
}

@media(max-width: 480px){
  #dv{
    margin-left: 5px;
    width: 100%;
  }
}

.right {
    margin-top: 100px !important;
    margin-left: auto;
    margin-right: auto;
    text-align: center !important;
    border: 2px #7c7e86 dashed;
    width: 60%;
    margin-top:10px;
}
.bulb {
    float: left;
    padding: 10px;
    width:8%;
}

.selected_tick {
      margin-left: -65px;
      position: absolute;
}

#display-error {
    display:none;
    background-color: #f2dede;
    border-color: #eed3d7;
    color: #b94a48;
    padding: 4px;
    margin-top: 9px;
}

.ghtbtn {
  padding: 0px 9px !important;
  float: right;
  border: 0;
}
.custombtn {
  position: relative;
  display: inline-block;
  padding: 0 25px;
  outline: none;
  border: none;
  background: #1fb58f !important;
  color: #fff !important;
  letter-spacing: 1px;
  font-size: 1em;
  line-height: 3;
  margin-bottom:10px;
}
.custombtn:hover {
  position: relative;
  display: inline-block;
  padding: 0 25px;
  outline: none;
  border: none;
  background: #1fb58f !important;
  color: #fff !important;
  letter-spacing: 1px;
  font-size: 1em;
  line-height: 3;
  margin-bottom:10px;
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
</style>
