<template>
  <div>
    <Row>
        <Col span="12"><h2 class="listUpld" style="font-size:24px;float:left">List of Uploads</h2><br></Col>
        <Col span="12"><Button type="primary"  :loading="bloading" @click="exportdata" style="float:right">Export Live</Button></Col>
    </Row>
    <br>
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
import io from 'socket.io-client'
import Emitter from '@/mixins/emitter'
import config from '@/config'
import Cookies from 'js-cookie'
import Papa from 'papaparse'
let JSZip = require('jszip')
let FileSaver = require('file-saver')
let zip = new JSZip()

let axios = require('axios')
let lodash = require('lodash')
let moment = require('moment')
let flatten = require('flat')
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
      csv: '',
      shipping: [],
      data2: [],
      chunkData: [],
      loading: true,
      cpage: 1,
      uniq_users: [],
      bloading: false
    }
  },
  methods: {
    getStatus (status) {
      if (status !== '') {
        let res = lodash.capitalize(status.replace(/_/g, ' '))
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
    },
    exportdata: async function () {
      // console.log('hello export')
      this.bloading = true
      await axios
        .get(config.vshopUrl, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;',
            authorization: Cookies.get('auth_token')
          }
        })
        .then(async response => {
          // console.log('response', response.data)
          await axios
            .get(config.pdmnew, {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded;',
                vid: response.data[0].id
              }
            })
            .then(async response => {
              // console.log('response ------- ', response.data.hits.hits)
              let productdata = response.data.hits.hits

              let shippingData = []
              let imprintData = []
              let pricingData = []
              let imageData = []
              let productInfo = []
              let csvdata = []

              lodash.forEach(productdata, async function (item) {
                let shipping = lodash.forEach(item._source.shipping, async function (pship) {
                  delete pship._id
                })
                let impData = lodash.forEach(item._source.imprint_data, async function (pimp) {
                  delete pimp._id
                })
                let pricing = lodash.forEach(item._source.pricing, async function (pprice) {
                  delete pprice._id
                })
                let images = lodash.forEach(item._source.images, async function (pimages) {
                  delete pimages._id
                })

                shippingData.push(shipping)
                imprintData.push(impData)
                pricingData.push(pricing)
                imageData.push(images)

                delete item._source.pricing
                delete item._source.imprint_data
                delete item._source.shipping
                delete item._source.images

                productInfo.push(item._source)
              })

              csvdata.push(
                shippingData,
                imprintData,
                pricingData,
                imageData,
                productInfo
              )
              // console.log('csvdata', csvdata)
              let mergedShipping = [].concat.apply([], csvdata[0])
              let mergedImprint = [].concat.apply([], csvdata[1])
              let mergedPricing = [].concat.apply([], csvdata[2])
              let mergedImage = [].concat.apply([], csvdata[3])
              let mergedProduct = [].concat.apply([], csvdata[4])

              let filteredShipping = lodash.reject(mergedShipping, lodash.isUndefined)
              let filteredImprint = lodash.reject(mergedImprint, lodash.isUndefined)
              let filteredPricing = lodash.reject(mergedPricing, lodash.isUndefined)
              let filteredImage = lodash.reject(mergedImage, lodash.isUndefined)
              let filteredProduct = lodash.reject(mergedProduct, lodash.isUndefined)

              /* filtered & delete unnecessary key */
              filteredShipping.map(async (item, index) => {
                await delete item['import-tracker_id']
              })

              filteredImprint.map(async (item, index) => {
                await delete item['import-tracker_id']
              })

              filteredPricing.map(async (item, index) => {
                await delete item['import-tracker_id']
              })

              filteredImage.map(async (item, index) => {
                await delete item['import-tracker_id']
              })

              filteredProduct = filteredProduct.map((item, index) => {
                if (item.attributes.imprint_color !== undefined && item.attributes.hasOwnProperty('imprint_color')) {
                  item.attr_imprint_color = item.attributes.imprint_color.join('|')
                }
                if (item.attributes.colors !== undefined && item.attributes.hasOwnProperty('colors')) {
                  item.attr_colors = item.attributes.colors.join('|')
                }
                if (item.attributes.decimal !== undefined && item.attributes.hasOwnProperty('decimal')) {
                  item.attr_decimal = item.attributes.decimal.join(',')
                }
                if (item.attributes.shape !== undefined && item.attributes.hasOwnProperty('shape')) {
                  item.attr_shape = item.attributes.shape.join('|')
                }

                /* SEPARATE DATA BY (, | opeartor) */
                item.available_currencies = item.available_currencies.join('|')
                item.available_regions = item.available_regions.join(',')
                item['non-available_regions'] = item['non-available_regions'].join(',')
                item.categories = item.categories.join('|')
                item.search_keyword = item.search_keyword.join('|')
                item.vid = item.vid.join(',')

                /* DELETE KEYS */
                delete item.supplier_info
                delete item.attributes
                delete item.username
                delete item.supplier_id
                delete item.vid
                delete item.valid_up_to
                delete item['import-tracker_id']
                Promise.resolve(item.available_currencies)
                return item
              })

              let pricingFlatten = filteredPricing.map(flatten)
              let imprintFlatten = filteredImprint.map(flatten)
              let shippingFlatten = filteredShipping.map(flatten)
              let productinfoFlatten = filteredProduct.map(flatten)
              let imageFlatten = filteredImage.map(flatten)

              /* pricingFlatten replace keys of gte & lte,code,price  */
              for (let [index, item] of pricingFlatten.entries()) {
                pricingFlatten[index] = this.changeGTEValue(item, 0)
                pricingFlatten[index] = this.changeLTEValue(item, 0)
                pricingFlatten[index] = this.changeCodeValue(item, 0)
                pricingFlatten[index] = this.changePriceValue(item, 0)
              }

              /* shippingFlatten replace keys of gte & lte */
              for (let [index, item] of shippingFlatten.entries()) {
                shippingFlatten[index] = this.changeGTEValueShipping(item, 0)
                shippingFlatten[index] = this.changeLTEValueShipping(item, 0)
              }

              /* imprintFlatten replace keys of gte & lte */
              for (let [index, item] of imprintFlatten.entries()) {
                imprintFlatten[index] = this.changeGTEValueImprint(item, 0)
                imprintFlatten[index] = this.changeLTEValueImprint(item, 0)
              }

              /* imageFlatten changeWebImageValue */
              for (let [index, item] of imageFlatten.entries()) {
                imageFlatten[index] = this.changeWebImageValue(item, 0)
                imageFlatten[index] = this.changeColorValue(item, 0)
                imageFlatten[index] = this.changeImageColorCodeValue(item, 0)
                imageFlatten[index] = this.changeSecureUrlValue(item, 0)
              }
              /* productinfoFlatten feature separate */
              for (let a = 0; a < productinfoFlatten.length; a++) {
                let c = 0
                let z = -1
                while (c <= 33 || z < 33) {
                  c++
                  z++
                  productinfoFlatten[a]['feature_' + c] = productinfoFlatten[a]['features.' + z + '.key'] + '|' + productinfoFlatten[a]['features.' + z + '.value']
                  delete productinfoFlatten[a]['features.' + z + '.key']
                  delete productinfoFlatten[a]['features.' + z + '.value']

                  if (productinfoFlatten[a]['feature_' + c] === 'undefined|undefined') {
                    productinfoFlatten[a]['feature_' + c] = ''
                  }
                }
              }
              // console.log('productinfoFlatten *********', productinfoFlatten)
              /* unparse flatten data */
              const csvShipping = Papa.unparse(shippingFlatten)
              const csvImprint = Papa.unparse(imprintFlatten)
              const csvPricing = Papa.unparse(pricingFlatten)
              const csvImage = Papa.unparse(imageFlatten)
              const csvProduct = Papa.unparse(productinfoFlatten)

              /* making zip file of csv */
              zip.file('shipping.csv', csvShipping)
              zip.file('imprint_charges.csv', csvImprint)
              zip.file('pricing.csv', csvPricing)
              zip.file('images.csv', csvImage)
              zip.file('productInfo.csv', csvProduct)
              zip.generateAsync({ type: 'blob' }).then(function (content) {
                // see FileSaver.js
                FileSaver.saveAs(content, 'product-data.zip')
              })
            }).catch(err => {
              // console.log(err)
              this.$Notice.error({
                title: err.message,
                // desc: err.message,
                duration: 5
              })
              this.bloading = false
            })
        })
        .catch(err => {
          // console.log(err)
          this.$Notice.error({
            title: err.message,
            // desc: err.message,
            duration: 5
          })
          this.bloading = false
        })
      this.bloading = false
    },
    changeGTEValue (item, value) {
      let key = 'price_range.' + value + '.qty.gte'
      if (item.hasOwnProperty(key)) {
        item['Qty_' + (value + 1) + '_Max'] = item[key]
        delete item[key]
        item = this.changeGTEValue(item, value + 1)
        return item
      } else {
        return item
      }
    },
    changeLTEValue (item, value) {
      let key = 'price_range.' + value + '.qty.lte'
      if (item.hasOwnProperty(key)) {
        item['Qty_' + (value + 1) + '_Min'] = item[key]
        delete item[key]
        item = this.changeLTEValue(item, value + 1)
        return item
      } else {
        return item
      }
    },
    changeGTEValueShipping (item, value) {
      let key = 'shipping_range.' + value + '.qty.gte'
      if (item.hasOwnProperty(key)) {
        item['Qty_' + (value + 1) + '_Max'] = item[key]
        delete item[key]
        item = this.changeGTEValueShipping(item, value + 1)
        return item
      } else {
        return item
      }
    },
    changeLTEValueShipping (item, value) {
      let key = 'shipping_range.' + value + '.qty.lte'
      if (item.hasOwnProperty(key)) {
        item['Qty_' + (value + 1) + '_Min'] = item[key]
        delete item[key]
        item = this.changeLTEValueShipping(item, value + 1)
        return item
      } else {
        return item
      }
    },
    changeGTEValueImprint (item, value) {
      let key = 'imprint_data_range.' + value + '.qty.gte'
      if (item.hasOwnProperty(key)) {
        item['Qty_' + (value + 1) + '_Max'] = item[key]
        delete item[key]
        item = this.changeGTEValueImprint(item, value + 1)
        return item
      } else {
        return item
      }
    },
    changeLTEValueImprint (item, value) {
      let key = 'imprint_data_range.' + value + '.qty.lte'
      if (item.hasOwnProperty(key)) {
        item['Qty_' + (value + 1) + '_Min'] = item[key]
        delete item[key]
        item = this.changeLTEValueImprint(item, value + 1)
        return item
      } else {
        return item
      }
    },
    changeCodeValue (item, value) {
      let key = 'price_range.' + value + '.code'
      if (item.hasOwnProperty(key)) {
        item['code_' + (value + 1)] = item[key]
        delete item[key]
        item = this.changeCodeValue(item, value + 1)
        return item
      } else {
        return item
      }
    },
    changePriceValue (item, value) {
      let key = 'price_range.' + value + '.price'
      if (item.hasOwnProperty(key)) {
        item['price_' + (value + 1)] = item[key]
        delete item[key]
        item = this.changePriceValue(item, value + 1)
        return item
      } else {
        return item
      }
    },
    changeWebImageValue (item, value) {
      let key = 'images.' + value + '.web_image'
      if (item.hasOwnProperty(key)) {
        item['web_image_' + (value + 1)] = item[key]
        delete item[key]
        item = this.changeWebImageValue(item, value + 1)
        return item
      } else {
        return item
      }
    },
    changeColorValue (item, value) {
      let key = 'images.' + value + '.color'
      if (item.hasOwnProperty(key)) {
        item['color_' + (value + 1)] = item[key]
        delete item[key]
        item = this.changeColorValue(item, value + 1)
        return item
      } else {
        return item
      }
    },
    changeImageColorCodeValue (item, value) {
      let key = 'images.' + value + '.image_color_code'
      if (item.hasOwnProperty(key)) {
        item['image_color_code_' + (value + 1)] = item[key]
        delete item[key]
        item = this.changeImageColorCodeValue(item, value + 1)
        return item
      } else {
        return item
      }
    },
    changeSecureUrlValue (item, value) {
      let key = 'images.' + value + '.secure_url'
      if (item.hasOwnProperty(key)) {
        item['secure_url_' + (value + 1)] = item[key]
        delete item[key]
        item = this.changeSecureUrlValue(item, value + 1)
        return item
      } else {
        return item
      }
    }
  },
  feathers: {
    'uploader': {
      updated (message) {
        let self = this
        if (message.user_id === self.$store.state.userId) {
          for (let i = 0; i < self.data2.length; i++) {
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
    },
    '$store.state.storedUsername': function (selectedUser) {
      // console.log('called.....', selectedUser)
      if (selectedUser !== 'All') {
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
      } else {
        // console.log('^^^^^^^^', this.$store.state.fullSubscriptionList)
        this.$store.state.subscription_list = []
        this.$store.state.subscription_list = this.$store.state.fullSubscriptionList
        this.$store.state.storedSubscriptionName = this.$store.state.fullSubscriptionList[0].label
      }
    }
  },
  mounted () {
    let self = this
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
