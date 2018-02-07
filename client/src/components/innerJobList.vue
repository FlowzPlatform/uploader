<template>
    <div>
      <div class="ivu-tabs-tabpane">
              <div class="ivu-table-wrapper">
                <div class="ivu-table ivu-table-small innertable">
                  <div class="ivu-table-header">
                    <table cellspacing="0" cellpadding="0" border="0" style="width:100%;">
                      <colgroup>
                        <col width="25">
                        <col width="25">
                        <col width="25">
                        <col width="25">
                      </colgroup>
                      <thead>
                        <tr>
                        <th class="">
                          <div class="ivu-table-cell">
                            <span>File Name</span>
                          </div>
                        </th>
                        <th class="">
                          <div class="ivu-table-cell">
                            <span>Total No of Records</span>
                          </div>
                        </th>
                        <th class="">
                          <div class="ivu-table-cell">
                            <span>Upload Status</span>
                          </div>
                        </th>
                        <th class="">
                          <div class="ivu-table-cell">
                            <span>Validate Status</span>
                          </div>
                        </th>
                       </tr>
                     </thead>
                     <tbody class="ivu-table-tbody">
                     <tr class="ivu-table-row" v-for="(item,index) in data3">
                       <td class="">
                         <div class="ivu-table-cell">
                           <span>{{convert(item.name)}}</span>
                         </div>
                       </td>
                       <td class="rightAlign">
                         <div class="ivu-table-cell">
                           <span>{{item.totalNoOfRecords}}</span>
                         </div>
                       </td>
                       <td class="">
                         <div class="ivu-table-cell">
                           <span>{{capitalize(item.uploadstatus)}}</span>
                         </div>
                       </td>
                       <td class="">
                         <div class="ivu-table-cell">
                           <span>{{capitalize(item.validatestatus)}}</span>
                         </div>
                       </td>
                     </tr>
                   </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        <!-- <Row class="expand-row" v-for="(item,index) in data3">
            <Col span="6">
                <span class="expand-key">File Name: </span>
                <span class="expand-value">{{convert(item.name)}}</span>
            </Col>
            <Col span="6">
                <span class="expand-key">Total No of Records: </span>
                <span class="expand-value">{{item.totalNoOfRecords}}</span>
            </Col>
            <Col span="6">
                <span class="expand-key">Upload Status: </span>
                <span class="expand-value">{{item.uploadstatus}}</span>
            </Col>
            <Col span="6">
                <span class="expand-key">Validate Status: </span>
                <span class="expand-value">{{item.validatestatus}}</span>
            </Col>
        </Row> -->
    </div>
</template>
<script>
/*eslint-disable*/
import lodash from 'lodash'
    export default {
        name: 'innerJoblist',
        props: {
            row: Object
        },
        data () {
            return {
                data3: []
            }
        },
        methods:{
          //converts into uppercase and trims space
          convert(item){
            item = item.replace(/([A-Z])/g, ' $1').trim()
            return item
          },
          capitalize(item){
            item = lodash.capitalize(item)
            return item
          }
        },
        mounted(){
          for(var key in this.row) {
              if (key == "ProductInformation" || key == "ProductPrice" || key == "ProductImprintData" || key == 'ProductImage' || key == 'ProductShipping' || key == 'ProductAdditionalCharges' || key == 'ProductVariationPrice') {
                  this.data3.push({"name":key,"totalNoOfRecords":this.row[key].totalNoOfRecords,"uploadstatus" : this.row[key].uploadStatus,"validatestatus": this.row[key].validateStatus})
              }
          }
        }
    };
</script>
<style scoped>
    .expand-row{
        margin-bottom: 16px;
    }
    .rightAlign{
      text-align:right !important;
      /*padding-right: 190px !important;*/
    }
    .innertable th{
      min-width: 0;
      height: 48px;
      box-sizing: border-box;
      text-align: center;
      text-overflow: ellipsis;
      vertical-align: middle;
      border-bottom: 1px solid #e9eaec;
      border-right: 1px solid #eee;
    }
    .innertable td{
      border-right: 1px solid #eee;
    }
</style>
