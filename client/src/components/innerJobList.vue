<template>
    <div>
        <Row class="expand-row" v-for="(item,index) in data3">
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
        </Row>
    </div>
</template>
<script>
/*eslint-disable*/
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
</style>
