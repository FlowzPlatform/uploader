<template>
<div>
  <Tabs type="card" closable @on-tab-remove="handleTabRemove" @on-click="generateForm" v-model="activetab">
    <TabPane label="Simple" v-if="tab0">
      <div class="pdmsimple">
        <Row type="flex" justify="end" align="middle">
          <Col span="1">
            <Tag v-if="simpleValidate" color="green">Valid</Tag>
            <Poptip v-else trigger="hover" title="Error" placement="bottom">
              <div slot="content">
                <Col>
                  <!-- <div v-for="(value, key) in mObj.errmsg" :key="key">
                    <Span>{{value}}</Span>
                  </div> -->
                  <div v-for="(value, key) in mObj" :key="key">
                    <div v-if="value.errmsg.length > 0" v-for="(val, ky) in value.errmsg" :key="ky">
                      <Span>{{val}}</Span>
                    </div>
                  </div>
                </Col>
              </div>
              <Tag color="red">
                Not Valid
              </Tag>
            </Poptip>
          </Col>
          <Col span="1">
            <Button :disabled="simpleSubmit" type="primary" @click="hanleSubmit">Submit</Button>
          </Col>
          <Col span="1">
            <Button type="ghost" @click="hanleRestore">Restore</Button>
          </Col>
             <!-- <span id='valid_indicator' class='label'>valid</span> -->
        </Row>
        <!-- <div class='row'> -->
          <Row type="flex" justify="center">
            <Col>
              <Spin v-if="simpleLoader" fix>
                <Icon type="load-c" size=22 class="demo-spin-icon-load"></Icon>
                <div>Loading</div>
              </Spin>
              <div id='editor_simple'></div>
            </Col>
          </Row>
        <!-- </div> -->
      </div>
    </TabPane>
    <TabPane label="Advanced" v-if="tab1">
      <div class="pdmedit">
        <Row type="flex" justify="end" align="middle">
          <Col span="1">
            <Tag v-if="advancedValidate" color="green">Valid</Tag>
            <Poptip v-else trigger="hover" title="Error" placement="bottom">
              <div slot="content">
                <Col>
                  <!-- <div v-for="(value, key) in mObj.advErrmsg" :key="key">
                    <Span>{{value}}</Span>
                  </div> -->
                  <div v-for="(value, key) in mObj" :key="key">
                    <Span v-if="value.errmsg.length > 0"><Strong>{{key}}</Strong></Span>
                    <div v-if="value.errmsg.length > 0" v-for="(val, ky) in value.errmsg" :key="ky">
                      <Span>{{val}}</Span>
                    </div>
                  </div>
                </Col>
              </div>
              <Tag color="red">
                Not Valid
              </Tag>
            </Poptip>
          </Col>
          <Col span="1">
            <Button type="primary" @click="hanleSubmit">Submit</Button>
          </Col>
          <Col span="1">
            <Button type="ghost" @click="hanleRestore">Restore</Button>
          </Col>
        </Row>
        <Row type="flex" justify="center">
          <Col v-if="advanceLoader">
            <Spin fix>
              <Icon type="load-c" size=22 class="demo-spin-icon-load"></Icon>
              <div>Loading</div>
            </Spin>
          </Col>
          <div id='editor_holder'></div>
        </Row>
        <!-- <div class='row'>
          <div id='editor_holder'></div>
        </div> -->
      </div>
    </TabPane>
  </Tabs>
</div>
</template>

<script>
/* eslint-disable */
import axios from 'axios'
import lodash from 'lodash'
import api from '../api'
import ProductInformationSchema from '@/schema/product_information'
import ProductPricingSchema from '@/schema/product_price'
import ProductImagesSchema from '@/schema/product_images'
import ProductImprintDataSchema from '@/schema/product_imprint_data'
import ProductShippingSchema from '@/schema/product_shipping'
// import VueFormGenerator from "vue-form-generator";
// import "vue-form-generator/dist/vfg.css";
const Schema = require('simpleschema')
let editor
JSONEditor.defaults.theme = 'foundation3'
JSONEditor.defaults.iconlib = 'fontawesome4'
// JSONEditor.defaults.format = 'grid'
// JSONEditor.defaults.editors.object.options.collapsed = true;
// var editor = new JSONEditor(document.getElementById('editor_holder'),{
//   // Enable fetching schemas via ajax
//   ajax: true,

//   // The schema for the editor
//   schema: {
//     $ref: "person.json",
//     format: "grid"
//   },

//   // Seed the form with a starting value
//   startval: starting_value
// });

//component javascript
// export default{
//   components:{
//     "vue-form-generator": VueFormGenerator.component
//   }
// }
// import _ from 'lodash'

// import VueFormGenerator from "vue-form-generator"
// Vue.use(VueFormGenerator)
// 'dca74bcc-e590-42ad-bd16-16f77d7dfc69'
let err_length = 0
export default {
  name: 'pdmedit',
  data () {
    return {
      pdmUrl: 'http://172.16.230.161:3038/pdm',
      tab0: true,
      tab1: true,
      vid: '1dee7d8d-d06a-475c-a4f5-e548a3709610',
      pdata: {},
      simpledata:{},
      realdata: {},
      activetab: 0,
      simpleValidate: true,
      advancedValidate: true,
      simpleLoader: false,
      advanceLoader: false,
      advancedSubmit: true,
      simpleSubmit: true,
      mObj: {
        'Product Information': {
          schema:ProductInformationSchema,
          mapping: [],
          errmsg: []
        },
        'Product Price': {
          schema:ProductPricingSchema,
          mapping: [],
          errmsg: []
        },
        'Product Imprint Data': {
          schema:ProductImprintDataSchema,
          mapping: [],
          errmsg: []
        },
        'Product Image': {
          schema:ProductImagesSchema,
          mapping: [],
          errmsg: []
        },
        'Product Shipping': {
          schema:ProductShippingSchema,
          mapping: [],
          errmsg: []
        }
      }
    }
  },
  created() {},
  methods: {
    async init (id) {
      console.log('calling')
      let url = this.pdmUrl + '?_id=' + id
      this.pdata = await axios.get(url, {
        headers: {
          vid: this.vid
        }
      }).then(res => {
        console.log(res.data.hits.hits[0]._source)
        let pdm = res.data.hits.hits[0]._source
        pdm._id = res.data.hits.hits[0]._id
        return pdm
      }).catch(err => {
        console.log(err)
        return {}
      })
      this.realdata = lodash.cloneDeep(this.pdata)
    },
    handleTabRemove (name) {
      this['tab' + name] = false;
    },
    mapData(data){
      console.log("mapdata")
      for(let item in data){
        this.realdata[item] = data[item]
      }
      return this.realdata
      // console.log("new data",this.realdata)
    },
    async hanleSubmit () {
      let data = editor.getValue()
      // console.log("self.activeTab",this.activetab)
      // this.mObj.errmsg = []
      _.forIn(this.mObj, (value, key) => {
        value.errmsg = []
      })
      let url = this.pdmUrl + '/' + data._id
      let productData = Object.assign({}, data)
      let keyToDelete = ['activeSummary', 'createdAt', 'import-tracker_id', 'max_price', 'min_price', 'username', 'supplier_info', 'vid', 'tags', 'non-available_regions', 'attributes', 'images', 'pricing', 'imprint_data', 'shipping', 'features']
      keyToDelete.forEach(e => { delete productData[e] });
      let productInfo = []
      productInfo.push(productData)
      console.log('after delete', productInfo)
      let srvVld = {
        data: productData,
        sheet_name: 'Product Information'
      }
      let serverValidation = await api.request('post', '/product-validation', srvVld)
      console.log('serverValidation:::', serverValidation)
      let pInfo_error = await this.proceedToValidate('Product Information', productInfo)
      if (data.pricing != undefined) {
        let pricingData = data.pricing
        keyToDelete = ['import-tracker_id', 'price_range']
        pricingData.map(item => {
          keyToDelete.forEach(e => {
            delete item[e]
          })
        })
        let pPrice_error = await this.proceedToValidate('Product Price', pricingData)
      }
      if (data.imprint_data != undefined) {
        let imprintData = data.imprint_data
        keyToDelete = ['import-tracker_id', 'imprint_data_range']
        imprintData.map(item => {
          keyToDelete.forEach(e => {
            delete item[e]
          })
        })
        let pImprint_error = await this.proceedToValidate('Product Imprint Data', imprintData)
      }
      if (data.images != undefined) {
        let imagesData = data.images
        keyToDelete = ['import-tracker_id', 'images']
        imagesData.map(item => {
          keyToDelete.forEach(e => {
            delete item[e]
          })
        })
        let pImage_error = await this.proceedToValidate('Product Image', imagesData)
      }
      if (data.shipping != undefined) {
        let shippingData = data.shipping
        keyToDelete = ['import-tracker_id', 'shipping_range']
        shippingData.map(item => {
          keyToDelete.forEach(e => {
            delete item[e]
          })
        })
        let pShipping = await this.proceedToValidate('Product Shipping', shippingData)
      }
      // if (self.activetab === 0) {
      //     _.forIn(self.mObj, (value, key) => {
      //       console.log(':: :: ', key, value.errmsg)
      //     })
          // if (self.mObj.errmsg.length > 0) {
          //   self.simpleValidate = false
          // } else {
          //   self.simpleValidate = true
          // }
        // } else {
          
          // if (self.mObj.advErrmsg.length > 0) {
          //   self.advancedValidate = false
          // } else {
          //   self.advancedValidate = true
          // }
        // }
      if(this.activetab === 0) {
        console.log('Simple Value:::', data)
        let result = this.mapData(data)
        // console.log("RES::::", data)
        _.forIn(this.mObj, (value, key) => {
          // console.log(':: :: ', key)
          if (value.errmsg.length > 0) {
            // console.log('Error found', value.errmsg)
            this.simpleValidate = false
            return false
          } else {
            this.simpleValidate = true
          }
        })
        if (this.simpleValidate) {
        // if (this.mObj.errmsg.length == 0) {
          console.log('No error, simple data is going to live')
          /* axios.patch(url, result, { headers: { vid: this.vid } }).then(res => {
            this.$Notice.success({
              title: 'Update Successfull',
              desc: 'Product details updated successfully.'
            })
          }).catch(err => {
            this.$Notice.error({
              title: 'Update Error',
              desc: 'Error while updating product details'
            })
          }) */
        }
      } else if (this.activetab === 1) {
        console.log('Advanced Value:::', data)
        _.forIn(this.mObj, (value, key) => {
          // console.log(':: :: ', key)
          if (value.errmsg.length > 0) {
            // console.log('Error found', value.errmsg)
            this.advancedValidate = false
            return false
          } else {
            this.advancedValidate = true
          }
        })
        if (this.advancedValidate) {
        // if (this.mObj.advErrmsg.length == 0) {
          console.log('No error, advanced data is going to live')
          axios.patch(url, data, {
            headers: {
              vid: this.vid
            }
          }).then(res => {
            this.$Notice.success({
              title: 'Update Successfull',
              desc: 'Product details updated successfully.'
            })
            console.log('Updated Data::', res)
          }).catch(err => {
            this.$Notice.error({
              title: 'Update Error',
              desc: 'Error while updating product details'
            })
            console.log('Error while updating data::', err)
          })
          // }
        }
      }
    },
    hanleRestore () {
       if(this.activetab === 0){
         editor.setValue(this.simpledata);
       }
       else if(this.activetab === 1){
        editor.setValue(this.pdata);
       }
    },
    getSimpleData(data) {
      console.log("data....",data)
      this.simpledata = {}
      for(let item in data){
        // console.log("key",item) || item == 'min_price' || item == 'max_price'
        if(item == 'sku' || item == 'price_1' || item == 'currency' ||
        item == 'product_name' || item == 'language' || item == '_id' || item == 'min_price' || item == 'max_price' || item == 'country' || item == 'description') {
          this.simpledata[item] = data[item]
        }
      }
      console.log("%%%%% obj",this.simpledata)
      return this.simpledata
    },
    async generateForm (name){
      let tabname = 'tab' + name
      _.forIn(this.mObj, (value, key) => {
        value.errmsg = []
      })
      if (tabname == 'tab1') {
        console.log("tab1")
        this.simpleValidate = true
        this.advanceLoader = true
        document.getElementById('editor_holder').innerHTML = ""
        await this.init(this.$route.params.id)
        editor = new JSONEditor(document.getElementById('editor_holder'),{
          // Enable fetching schemas via ajax
          ajax: true,
          // The schema for the editor
          schema: {
            title: "Product",
            type: "object",
            options: {
              disable_edit_json: true,
              disable_properties: true,
            },
            properties: {
              sku: {
                title: "SKU",
                optional: false,
                type: "string",
                propertyOrder: 2
              },
              feature_1: {
                title: "feature_1",
                type: "string",
                default: ""
              },
              _id: {
                type: "string",
                label: "_id",
                propertyOrder: 1
              },
              linename: {
                title: "Linename",
                optional: false,
                type: "string",
                propertyOrder: 3
              },
              product_name: {
                title: "Product Name",
                type: "string",
                propertyOrder: 4
              },
              product_id: {
                title: "Product id",
                type: "string",
                propertyOrder: 5
              },
              price_1: {
                title: "Price 1",
                type: "string",
                propertyOrder: 6
              },
              description: {
                title: "Description",
                type: "string",
                propertyOrder: 7
              },
              country: {
                title: "Country",
                type: "string",
                propertyOrder: 8
              },
              language: {
                title: "Language",
                type: "string",
                propertyOrder: 9
              },
              available_regions: {
                title: "Available Regions",
                type: "string",
                propertyOrder: 10
              },
              nonavailable_regions:{
                type: "string",
                title: "Non-Available Regions",
                propertyOrder: 11
              },
              activeSummary: {
                title: "Active Summary",
                type: "string",
                propertyOrder: 12
              },
              attr_imprint_color: {
                title: "Attribute Imprint Color",
                type: "string",
                propertyOrder: 13
              },
              attr_shape: {
                type: "string",
                title: "Attribute Shape",
                propertyOrder: 14
              },
              company: {
                title: "Company",
                type: "string",
                propertyOrder: 15
              },
              currency: {
                type: "string",
                title: "Currency",
                propertyOrder: 16
              },
              createdAt: {
                title: "Created At",
                type: "string",
                propertyOrder: 17
              },
              default_color:{
                type: "string",
                title: "Default Color",
                propertyOrder: 18
              },
              default_image: {
                type: "string",
                title: "Default Image",
                propertyOrder: 19
              },
              default_image_color_code: {
                type: "string",
                title: "Default Image Color Code",
                propertyOrder: 20
              },
              distributor_central_url: {
                type: "string",
                title: "Distributor Central URL",
                propertyOrder: 21
              },
              "import-tracker_id": {
                title: "Import Tracker Id",
                type: "string",
                propertyOrder: 22
              },
              matrix_frieght: {
                type: "string",
                title: "Matrix Frieght",
                propertyOrder: 23
              },
              matrix_price: {
                type: "string",
                title: "Matrix Price",
                propertyOrder: 24
              },
              max_price: {
                type: "string",
                title: "Max Price",
                propertyOrder: 25
              },
              min_price: {
                type: "string",
                title: "Min Price",
                propertyOrder: 26
              },
              packaging_charges: {
                type: "string",
                title: "Packaging Charges",
                propertyOrder: 27
              },
              packaging_code: {
                type: "string",
                title: "Packaging Code",
                propertyOrder: 28
              },
              packaging_type: {
                type: "string",
                title: "Packaging Type",
                propertyOrder: 29
              },
              private:{
                type: "string",
                title: "Private",
                propertyOrder: 30
              },
              special_price_valid_up_to: {
                type: "string",
                title: "Special Price Valid Up To",
                propertyOrder: 31
              },
              supplier: {
                type: "string",
                title: "Supplier",
                propertyOrder: 32
              },
              supplier_id: {
                type: "string",
                title: "Supplier Id",
                propertyOrder: 33
              },
              username: {
                type: "string",
                title: "Username",
                propertyOrder: 34
              },
              valid_up_to: {
                title: "Valid Upto",
                type: "string",
                propertyOrder: 35
              },
              vat_unit: {
                type: "string",
                title: "vat Unit",
                propertyOrder: 36
              },
              vat: {
                title: "Vat",
                type: "string",
                propertyOrder: 37
              },
              video_url: {
                type: "string",
                title: "Video URL",
                propertyOrder: 38
              },
              attr_decimal:{
                type: "string",
                title: "Attribute Decimal",
                propertyOrder: 39
              },
              supplier_info: {
                title: "Supplier",
                type: "object",
                format: "table",
                options: {
                  disable_properties: true
                },
                propertyOrder: 40
              },
              categories: {
                title: "Categories",
                type: "array",
                format: "table",
                propertyOrder: 41
              },
              vid: {
                type: "array",
                title: "vid",
                format: "table",
                propertyOrder: 42
              },
              tags: {
                type: "array",
                title: "Tags",
                propertyOrder: 43
              },
              'non-available_regions': {
                type: "array",
                title: 'Non Available Regions',
                format: "table"
              },
              available_currencies: {
                title: "Available Currencies",
                type: "array",
                format: "table"
              },
              attributes: {
                title: "Attributes",
                type: "object",
                options: {
                  disable_edit_json: true
                }
              },
              images: {
                title: "Images",
                type: "array"
              },
              pricing: {
                title: "Pricing",
                type: "array"
              },
              imprint_data: {
                title: "Imprint Data",
                type: "array"
              },
              shipping: {
                title: "Shipping",
                type: "array"
              },
              search_keyword: {
                title: "Search Keywords",
                type: "array"
              },
              features: {
                title: "Feature",
                type: "array",
                propertyOrder: 1001
              },
              feature_1: {
                type: "string",
                title: "feature_1",
                default: null
              },
              feature_2: {
                type: "string",
                title: "feature_2"
              },
              feature_3: {
                type: "string",
                title: "feature_3"
              },
              feature_4: {
                type: "string",
                title: "feature_4"
              },
              feature_5: {
                type: "string",
                title: "feature_5"
              },
              feature_6: {
                type: "string",
                title: "feature_6"
              },
              feature_7: {
                type: "string",
                title: "feature_7"
              },
              feature_8: {
                type: "string",
                title: "feature_8"
              },
              feature_9: {
                type: "string",
                title: "feature_9"
              },
              feature_10: {
                type: "string",
                title: "feature_10"
              },
              feature_11: {
                type: "string",
                title: "feature_11"
              },
              feature_12: {
                type: "string",
                title: "feature_12"
              },
              feature_13: {
                type: "string",
                title: "feature_13"
              },
              feature_14: {
                type: "string",
                title: "feature_14"
              },
              feature_15: {
                type: "string",
                title: "feature_15"
              },
              feature_16: {
                type: "string",
                title: "feature_16"
              },
              feature_17: {
                type: "string",
                title: "feature_17"
              },
              feature_18: {
                type: "string",
                title: "feature_18"
              },
              feature_19: {
                type: "string",
                title: "feature_19"
              },
              feature_20: {
                type: "string",
                title: "feature_20"
              },
              feature_21: {
                type: "string",
                title: "feature_21"
              },
              feature_22: {
                type: "string",
                title: "feature_22"
              },
              feature_23: {
                type: "string",
                title: "feature_23"
              },
              feature_24: {
                type: "string",
                title: "feature_24"
              },
              feature_25: {
                type: "string",
                title: "feature_25"
              },
              feature_26: {
                type: "string",
                title: "feature_26"
              },
              feature_27: {
                type: "string",
                title: "feature_27"
              },
              feature_28: {
                type: "string",
                title: "feature_28"
              },
              feature_29: {
                type: "string",
                title: "feature_29"
              },
              feature_30: {
                type: "string",
                title: "feature_30"
              },
              feature_31: {
                type: "string",
                title: "feature_31"
              },
              feature_32: {
                type: "string",
                title: "feature_32"
              },
              feature_33: {
                type: "string",
                title: "feature_33"
              },
              feature_34: {
                type: "string",
                title: "feature_34"
              }
            },
            format: "grid"
            /* "product": {
              "title": "Product",
              "type": "object",
              "additionalProperties": false,
              "properties": {
                "activeSummary": {
                  "type": "text",
                  "fields": {
                    "keyword": {
                      "type": "keyword",
                      "ignore_above": 256
                    }
                  }
                },
                "additional_charge": {
                  "type": "nested",
                  "properties": {
                    "charge_name": {
                      "type": "text"
                    },
                    "moq": {
                      "type": "text"
                    },
                    "option_name": {
                      "type": "text"
                    },
                    "price_range": {
                      "type": "nested",
                      "properties": {
                        "net_price": {
                          "type": "double"
                        },
                        "price": {
                          "type": "double"
                        },
                        "qty": {
                          "type": "integer_range"
                        }
                      }
                    }
                  }
                },
                "attr_colors": {
                  "type": "text",
                  "fields": {
                    "keyword": {
                      "type": "keyword",
                      "ignore_above": 256
                    }
                  }
                },
                "attr_decimal": {
                  "type": "long"
                },
                "attr_imprint_color": {
                  "type": "text",
                  "fields": {
                    "keyword": {
                      "type": "keyword",
                      "ignore_above": 256
                    }
                  }
                },
                "attr_shape": {
                  "type": "text",
                  "fields": {
                    "keyword": {
                      "type": "keyword",
                      "ignore_above": 256
                    }
                  }
                },
                "attributes": {
                  "properties": {
                    "colors": {
                      "type": "text",
                      "fields": {
                        "english": {
                          "type": "text",
                          "analyzer": "english"
                        },
                        "raw": {
                          "type": "keyword"
                        }
                      }
                    },
                    "decimal": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "shape": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "size": {
                      "type": "text",
                      "fields": {
                        "raw": {
                          "type": "keyword"
                        }
                      }
                    }
                  }
                },
                "available_currencies": {
                  "type": "array",
                  "title": "Available Currencies",
                  "options": {
                    "collapsed": true
                  }
                },
                "available_regions": {
                  "type": "text",
                  "fields": {
                    "keyword": {
                      "type": "keyword",
                      "ignore_above": 256
                    }
                  }
                },
                "categories": {
                  "type": "text",
                  "fields": {
                    "english": {
                      "type": "text",
                      "analyzer": "english"
                    },
                    "raw": {
                      "type": "keyword"
                    }
                  },
                  "fielddata": true
                },
                "company": {
                  "type": "text",
                  "fields": {
                    "keyword": {
                      "type": "keyword",
                      "ignore_above": 256
                    }
                  }
                },
                "country": {
                  "type": "text"
                },
                "currency": {
                  "type": "text"
                },
                "default_color": {
                  "type": "text"
                },
                "default_image": {
                  "type": "text"
                },
                "default_image_color_code": {
                  "type": "text"
                },
                "description": {
                  "type": "text",
                  "fields": {
                    "english": {
                      "type": "text",
                      "analyzer": "english"
                    }
                  }
                },
                "distributor_central_url": {
                  "type": "text"
                },
                "feature_10": {
                  "type": "text",
                  "fields": {
                    "keyword": {
                      "type": "keyword",
                      "ignore_above": 256
                    }
                  }
                },
                "feature_11": {
                  "type": "text",
                  "fields": {
                    "keyword": {
                      "type": "keyword",
                      "ignore_above": 256
                    }
                  }
                },
                "feature_12": {
                  "type": "text",
                  "fields": {
                    "keyword": {
                      "type": "keyword",
                      "ignore_above": 256
                    }
                  }
                },
                "feature_13": {
                  "type": "text",
                  "fields": {
                    "keyword": {
                      "type": "keyword",
                      "ignore_above": 256
                    }
                  }
                },
                "feature_14": {
                  "type": "text",
                  "fields": {
                    "keyword": {
                      "type": "keyword",
                      "ignore_above": 256
                    }
                  }
                },
                "feature_15": {
                  "type": "text",
                  "fields": {
                    "keyword": {
                      "type": "keyword",
                      "ignore_above": 256
                    }
                  }
                },
                "feature_16": {
                  "type": "text",
                  "fields": {
                    "keyword": {
                      "type": "keyword",
                      "ignore_above": 256
                    }
                  }
                },
                "feature_17": {
                  "type": "text",
                  "fields": {
                    "keyword": {
                      "type": "keyword",
                      "ignore_above": 256
                    }
                  }
                },
                "feature_18": {
                  "type": "text",
                  "fields": {
                    "keyword": {
                      "type": "keyword",
                      "ignore_above": 256
                    }
                  }
                },
                "feature_19": {
                  "type": "text",
                  "fields": {
                    "keyword": {
                      "type": "keyword",
                      "ignore_above": 256
                    }
                  }
                },
                "feature_20": {
                  "type": "text",
                  "fields": {
                    "keyword": {
                      "type": "keyword",
                      "ignore_above": 256
                    }
                  }
                },
                "feature_21": {
                  "type": "text",
                  "fields": {
                    "keyword": {
                      "type": "keyword",
                      "ignore_above": 256
                    }
                  }
                },
                "feature_22": {
                  "type": "text",
                  "fields": {
                    "keyword": {
                      "type": "keyword",
                      "ignore_above": 256
                    }
                  }
                },
                "feature_23": {
                  "type": "text",
                  "fields": {
                    "keyword": {
                      "type": "keyword",
                      "ignore_above": 256
                    }
                  }
                },
                "feature_24": {
                  "type": "text",
                  "fields": {
                    "keyword": {
                      "type": "keyword",
                      "ignore_above": 256
                    }
                  }
                },
                "feature_25": {
                  "type": "text",
                  "fields": {
                    "keyword": {
                      "type": "keyword",
                      "ignore_above": 256
                    }
                  }
                },
                "feature_26": {
                  "type": "text",
                  "fields": {
                    "keyword": {
                      "type": "keyword",
                      "ignore_above": 256
                    }
                  }
                },
                "feature_27": {
                  "type": "text",
                  "fields": {
                    "keyword": {
                      "type": "keyword",
                      "ignore_above": 256
                    }
                  }
                },
                "feature_28": {
                  "type": "text",
                  "fields": {
                    "keyword": {
                      "type": "keyword",
                      "ignore_above": 256
                    }
                  }
                },
                "feature_29": {
                  "type": "text",
                  "fields": {
                    "keyword": {
                      "type": "keyword",
                      "ignore_above": 256
                    }
                  }
                },
                "feature_30": {
                  "type": "text",
                  "fields": {
                    "keyword": {
                      "type": "keyword",
                      "ignore_above": 256
                    }
                  }
                },
                "feature_31": {
                  "type": "text",
                  "fields": {
                    "keyword": {
                      "type": "keyword",
                      "ignore_above": 256
                    }
                  }
                },
                "feature_32": {
                  "type": "text",
                  "fields": {
                    "keyword": {
                      "type": "keyword",
                      "ignore_above": 256
                    }
                  }
                },
                "feature_33": {
                  "type": "text",
                  "fields": {
                    "keyword": {
                      "type": "keyword",
                      "ignore_above": 256
                    }
                  }
                },
                "feature_34": {
                  "type": "text",
                  "fields": {
                    "keyword": {
                      "type": "keyword",
                      "ignore_above": 256
                    }
                  }
                },
                "feature_5": {
                  "type": "text",
                  "fields": {
                    "keyword": {
                      "type": "keyword",
                      "ignore_above": 256
                    }
                  }
                },
                "feature_6": {
                  "type": "text",
                  "fields": {
                    "keyword": {
                      "type": "keyword",
                      "ignore_above": 256
                    }
                  }
                },
                "feature_7": {
                  "type": "text",
                  "fields": {
                    "keyword": {
                      "type": "keyword",
                      "ignore_above": 256
                    }
                  }
                },
                "feature_8": {
                  "type": "text",
                  "fields": {
                    "keyword": {
                      "type": "keyword",
                      "ignore_above": 256
                    }
                  }
                },
                "feature_9": {
                  "type": "text",
                  "fields": {
                    "keyword": {
                      "type": "keyword",
                      "ignore_above": 256
                    }
                  }
                },
                "features": {
                  "properties": {
                    "key": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "label": {
                      "type": "text"
                    },
                    "value": {
                      "type": "text",
                      "fields": {
                        "english": {
                          "type": "text",
                          "analyzer": "english"
                        }
                      }
                    }
                  }
                },
                "images": {
                  "properties": {
                    "Web_image_3": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "_id": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "color": {
                      "type": "text"
                    },
                    "image_color_code_1": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "image_color_code_10": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "image_color_code_11": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "image_color_code_12": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "image_color_code_13": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "image_color_code_14": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "image_color_code_15": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "image_color_code_16": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "image_color_code_17": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "image_color_code_18": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "image_color_code_2": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "image_color_code_3": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "image_color_code_4": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "image_color_code_5": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "image_color_code_6": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "image_color_code_7": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "image_color_code_8": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "image_color_code_9": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "images": {
                      "properties": {
                        "color": {
                          "type": "text",
                          "fields": {
                            "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                            }
                          }
                        },
                        "image_color_code": {
                          "type": "text",
                          "fields": {
                            "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                            }
                          }
                        },
                        "web_image": {
                          "type": "text",
                          "fields": {
                            "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                            }
                          }
                        }
                      }
                    },
                    "import-tracker_id": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "product_id": {
                      "type": "long"
                    },
                    "sku": {
                      "type": "long"
                    },
                    "web_image": {
                      "type": "text"
                    }
                  }
                },
                "import-tracker_id": {
                  "type": "text",
                  "fields": {
                    "keyword": {
                      "type": "keyword",
                      "ignore_above": 256
                    }
                  }
                },
                "imprint_data": {
                  "type": "nested",
                  "properties": {
                    "_id": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "additional_color_charge": {
                      "type": "text"
                    },
                    "additional_location_charge": {
                      "type": "text"
                    },
                    "code_1": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "code_10": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "code_2": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "code_3": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "code_4": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "code_5": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "code_6": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "code_7": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "code_8": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "code_9": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "full_color": {
                      "type": "text"
                    },
                    "import-tracker_id": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "imprint_area": {
                      "type": "text"
                    },
                    "imprint_method": {
                      "type": "text"
                    },
                    "imprint_position": {
                      "type": "text"
                    },
                    "is_pms_color_allow": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "location_price_included": {
                      "type": "integer"
                    },
                    "ltm_charge": {
                      "type": "text"
                    },
                    "matrix": {
                      "type": "text"
                    },
                    "max_imprint_color_allowed": {
                      "type": "integer"
                    },
                    "max_location_allowed": {
                      "type": "integer"
                    },
                    "pms_charge": {
                      "type": "text"
                    },
                    "price_1": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "price_10": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "price_2": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "price_3": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "price_4": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "price_5": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "price_6": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "price_7": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "price_8": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "price_9": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "price_included": {
                      "type": "integer"
                    },
                    "price_range": {
                      "type": "nested",
                      "properties": {
                        "price": {
                          "type": "double"
                        },
                        "qty": {
                          "type": "long_range"
                        }
                      }
                    },
                    "product_id": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "production_days": {
                      "type": "text"
                    },
                    "production_unit": {
                      "type": "text"
                    },
                    "qty_10_max": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "qty_10_min": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "qty_1_max": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "qty_1_min": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "qty_2_max": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "qty_2_min": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "qty_3_max": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "qty_3_min": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "qty_4_max": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "qty_4_min": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "qty_5_max": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "qty_5_min": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "qty_6_max": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "qty_6_min": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "qty_7_max": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "qty_7_min": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "qty_8_max": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "qty_8_min": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "qty_9_max": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "qty_9_min": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "rush_charge": {
                      "type": "text"
                    },
                    "setup_charge": {
                      "type": "text"
                    },
                    "sku": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "type_of_charge": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    }
                  }
                },
                "is_vmc": {
                  "type": "boolean"
                },
                "language": {
                  "type": "text"
                },
                "linename": {
                  "type": "text",
                  "fields": {
                    "english": {
                      "type": "text",
                      "analyzer": "english"
                    },
                    "raw": {
                      "type": "keyword"
                    }
                  }
                },
                "matrix_frieght": {
                  "type": "double"
                },
                "matrix_price": {
                  "type": "double"
                },
                "max_price": {
                  "type": "float"
                },
                "min_price": {
                  "type": "float"
                },
                "nonavailable_regions": {
                  "type": "text",
                  "fields": {
                    "keyword": {
                      "type": "keyword",
                      "ignore_above": 256
                    }
                  }
                },
                "packaging_charges": {
                  "type": "double"
                },
                "packaging_code": {
                  "type": "text",
                  "fields": {
                    "keyword": {
                      "type": "keyword",
                      "ignore_above": 256
                    }
                  }
                },
                "packaging_type": {
                  "type": "text",
                  "fields": {
                    "keyword": {
                      "type": "keyword",
                      "ignore_above": 256
                    }
                  }
                },
                "price": {
                  "type": "double"
                },
                "price_1": {
                  "type": "text",
                  "fields": {
                    "keyword": {
                      "type": "keyword",
                      "ignore_above": 256
                    }
                  },
                  "fielddata": true
                },
                "pricing": {
                  "properties": {
                    "_id": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "code_2": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "code_3": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "code_4": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "code_5": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "code_6": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "code_7": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "code_8": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "currency": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "global_price_type": {
                      "type": "text",
                      "fields": {
                        "english": {
                          "type": "text",
                          "analyzer": "english"
                        },
                        "raw": {
                          "type": "keyword"
                        }
                      }
                    },
                    "import-tracker_id": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "price_2": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "price_3": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "price_4": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "price_5": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "price_6": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "price_7": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "price_8": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "price_range": {
                      "type": "nested",
                      "properties": {
                        "code": {
                          "type": "text",
                          "fields": {
                            "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                            }
                          }
                        },
                        "price": {
                          "type": "double"
                        },
                        "qty": {
                          "type": "integer_range"
                        }
                      }
                    },
                    "price_type": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "price_unit": {
                      "type": "text",
                      "fields": {
                        "english": {
                          "type": "text",
                          "analyzer": "english"
                        },
                        "raw": {
                          "type": "keyword"
                        }
                      }
                    },
                    "product_id": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "qty_2_max": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "qty_2_min": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "qty_3_max": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "qty_3_min": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "qty_4_max": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "qty_4_min": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "qty_5_max": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "qty_5_min": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "qty_6_max": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "qty_6_min": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "qty_7_max": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "qty_7_min": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "qty_8_max": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "qty_8_min": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "sku": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "type": {
                      "type": "text",
                      "fields": {
                        "english": {
                          "type": "text",
                          "analyzer": "english"
                        },
                        "raw": {
                          "type": "keyword"
                        }
                      }
                    }
                  }
                },
                "private": {
                  "type": "text",
                  "fields": {
                    "keyword": {
                      "type": "keyword",
                      "ignore_above": 256
                    }
                  }
                },
                "product_id": {
                  "type": "long"
                },
                "product_name": {
                  "type": "text",
                  "similarity": "BM25"
                },
                "search_keyword": {
                  "type": "text",
                  "fields": {
                    "english": {
                      "type": "text",
                      "analyzer": "english"
                    },
                    "raw": {
                      "type": "text",
                      "analyzer": "keyword_lowercase_analyzer"
                    }
                  }
                },
                "shipping": {
                  "properties": {
                    "_id": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "carton_height": {
                      "type": "text"
                    },
                    "carton_length": {
                      "type": "double"
                    },
                    "carton_size_unit": {
                      "type": "text"
                    },
                    "carton_weight": {
                      "type": "text"
                    },
                    "carton_weight_unit": {
                      "type": "text"
                    },
                    "carton_width": {
                      "type": "text"
                    },
                    "fob_city": {
                      "type": "text"
                    },
                    "fob_country_code": {
                      "type": "text"
                    },
                    "fob_state_code": {
                      "type": "text"
                    },
                    "fob_zip_code": {
                      "type": "text"
                    },
                    "free_on_board": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "import-tracker_id": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "product_height": {
                      "type": "text"
                    },
                    "product_id": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "product_length": {
                      "type": "text"
                    },
                    "product_size_unit": {
                      "type": "text"
                    },
                    "product_weight": {
                      "type": "text"
                    },
                    "product_weight_unit": {
                      "type": "text"
                    },
                    "product_width": {
                      "type": "text"
                    },
                    "qty_10_max": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "qty_10_min": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "qty_1_max": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "qty_1_min": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "qty_2_max": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "qty_2_min": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "qty_3_max": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "qty_3_min": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "qty_4_max": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "qty_4_min": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "qty_5_max": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "qty_5_min": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "qty_6_max": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "qty_6_min": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "qty_7_max": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "qty_7_min": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "qty_8_max": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "qty_8_min": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "qty_9_max": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "qty_9_min": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "shipping_qty_per_carton": {
                      "type": "double"
                    },
                    "shipping_range": {
                      "properties": {
                        "qty": {
                          "properties": {
                            "gte": {
                              "type": "long"
                            },
                            "lte": {
                              "type": "long"
                            }
                          }
                        }
                      }
                    },
                    "sku": {
                      "type": "long"
                    }
                  }
                },
                "sku": {
                  "type": "number",
                  "fields": {
                    "english": {
                      "type": "text",
                      "analyzer": "english"
                    },
                    "raw": {
                      "type": "text",
                      "analyzer": "keyword_lowercase_analyzer"
                    }
                  },
                  "fielddata": true
                },
                "special_price_valid_up_to": {
                  "type": "date"
                },
                "status": {
                  "type": "boolean"
                },
                "supplier": {
                  "type": "text",
                  "fields": {
                    "keyword": {
                      "type": "keyword",
                      "ignore_above": 256
                    }
                  }
                },
                "supplier_id": {
                  "type": "text"
                },
                "supplier_info": {
                  "type": "object",
                  "title": "supplier info",
                  "options":{
                    "collapsed": true
                  },
                  "properties": {
                    "company": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "email": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "supplier_name": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    },
                    "username": {
                      "type": "text",
                      "fields": {
                        "keyword": {
                          "type": "keyword",
                          "ignore_above": 256
                        }
                      }
                    }
                  }
                },
                "username": {
                  "type": "text",
                  "fields": {
                    "keyword": {
                      "type": "keyword",
                      "ignore_above": 256
                    }
                  }
                },
                "valid_up_to": {
                  "type": "date"
                },
                "vat": {
                  "type": "double"
                },
                "vat_unit": {
                  "type": "text"
                },
                "vid": {
                  "type": "text",
                  "fields": {
                    "raw": {
                      "type": "keyword"
                    }
                  }
                },
                "video_url": {
                  "type": "text"
                }
              }
            } */
          },
          // Seed the form with a starting value
          startval: this.pdata
        });
        editor.getEditor('root.sku').disable()
        editor.getEditor('root._id').disable()
        editor.getEditor('root.vid').disable()
        editor.getEditor('root.username').disable()
        editor.getEditor('root.supplier_id').disable()
        editor.getEditor('root.product_id').disable()
        editor.getEditor('root.supplier_info').disable()
        editor.getEditor('root.import-tracker_id').disable()
        this.advanceLoader = false
      } else if (tabname == 'tab0') {
        console.log("tab0")
        this.advancedValidate = true
        this.simpleLoader = true
        document.getElementById('editor_simple').innerHTML = ""
        await this.init(this.$route.params.id)
        let data = await this.getSimpleData(this.pdata)
        // data.min_price = null
        // data.max_price = null
        console.log('data::', data)
        
        editor = new JSONEditor(document.getElementById('editor_simple'), {
          // Enable fetching schemas via ajax
          ajax: true,
          // The schema for the editor
          schema: {
            "title": "Product",
            "type": "object",
            options: {
              disable_edit_json: true,
              disable_properties: true
            },
            properties: {
              sku: {
                title: "SKU",
                type: "string",
                propertyOrder: 2
              },
              product_name: {
                title: "Product Name",
                type: "string",
                propertyOrder: 4
              },
              price_1: {
                title: "Price 1",
                type: "string",
                propertyOrder: 3
              },
              min_price: {
                title: "Min Price",
                type: "string",
                propertyOrder: 5
              },
              max_price: {
                  title: "Max Price",
                  type: "string",
                  propertyOrder: 6
              },
              currency: {
                title: "Currency",
                type: "string",
                propertyOrder: 7
              },
              country: {
                type: "string",
                title: "Country"
              },
              description: {
                type: "string",
                title: "Description"
              },
              language: {
                title: "Language",
                type: "string",
                propertyOrder: 8
              },
              _id: {
                title: "Id",
                type: "string",
                propertyOrder: 1
              }
            },
            format: "grid"
            // "product": {
              // "type": "object",
              // "properties": {
              //   "attributes": {
              //     "properties": {
              //       "colors": {
              //         "type": "text",
              //         "fields": {
              //           "english": {
              //             "type": "text",
              //             "analyzer": "english"
              //           },
              //           "raw": {
              //             "type": "keyword"
              //           }
              //         }
              //       }
              //     }
              //   },
              //   "currency": {
              //     "type": "text"
              //   },
              //   "description": {
              //     "type": "text",
              //     "fields": {
              //       "english": {
              //         "type": "text",
              //         "analyzer": "english"
              //       }
              //     }
              //   },
              //   "import-tracker_id": {
              //     "type": "text",
              //     "fields": {
              //       "keyword": {
              //         "type": "keyword",
              //         "ignore_above": 256
              //       }
              //     }
              //   },
              //   "imprint_data": {
              //     "type": "nested",
              //     "properties": {
              //       "imprint_method": {
              //         "type": "text"
              //       }
              //     }
              //   },
              //   "language": {
              //     "type": "text"
              //   },
              //   "max_price": {
              //     "type": "float"
              //   },
              //   "min_price": {
              //     "type": "float"
              //   },
              //   "price_1": {
              //     "type": "text",
              //     "fields": {
              //       "keyword": {
              //         "type": "keyword",
              //         "ignore_above": 256
              //       }
              //     },
              //     "fielddata": true
              //   },
              //   "product_id": {
              //     "type": "long"
              //   },
              //   "product_name": {
              //     "type": "text",
              //     "similarity": "BM25"
              //   },
              //   "sku": {
              //     "type": "string",
              //     "description": "Enter SKU",
              //     "minLength": 4
              //   },
              //   "supplier": {
              //     "type": "text",
              //     "fields": {
              //       "keyword": {
              //         "type": "keyword",
              //         "ignore_above": 256
              //       }
              //     }
              //   },
              //   "supplier_id": {
              //     "type": "text"
              //   },
              //   "username": {
              //     "type": "text",
              //     "fields": {
              //       "keyword": {
              //         "type": "keyword",
              //         "ignore_above": 256
              //       }
              //     }
              //   }
              // }
            // }
          },
          // Seed the form with a starting value
          startval: data
        });
        editor.getEditor('root.sku').disable();
        editor.getEditor('root._id').disable();
        this.simpleLoader = false
        this.simpleSubmit = false
      }
    },
    proceedToValidate(tab, dataToValidate) {
      let self = this

      for(let key in self.mObj[tab].schema.structure) {
        self.mObj[tab].mapping.push({'sysHeader':key,"schemaObj": self.mObj[tab].schema.structure[key],"csvHeader":"","transform":"","transformMethod":""})
      }
      return new Promise(async (resolve,reject)=> {
        /* let globalValidateResolveFlag = true
        if (globalValidateResolve === null) {
          globalValidateResolveFlag = false
          globalValidateResolve = resolve;
        } 
        map_flag = false 

        continue_flag = false
        self.showContinue = false
        let errcols = []*/
        let dateValidatorFunc = function (obj, value, fieldName) {
                if(value != "" || value != undefined){
                let date = moment(value)
                let isValid = date.isValid()
                if (isValid != true) return 'Invalid date. Please provide date in y-m-d format'
                date._d = moment(new Date(date._d)).format('YYYY/MM/DD')
                return
              }
        }
        let urlValidatorFunc = function (obj, value, fieldName) {

                  if (value != "" || value != undefined) {
                    let re = /^((http[s]?|ftp):\/)?\/?([^:\/\s]+)((\/\w+)*\/)([\w\-\.]+[^#?\s]+)(.*)?(#[\w\-]+)?$/
                    if(re.test(value) !== true)
                    return 'Invalid url'
                    else
                    return
                  }
                }

        let emailValidatorFunc = function (obj, value, fieldName) {
          if(value !== undefined || value !== ""){
            let re = /\S+@\S+\.\S+/
            if(re.test(value) !== true)
            return  'Invalid email address'
            else
            return
          }
        }

        let optionalValidatorFunc = function (obj, value, fieldName) {
          if(value == '')
            return  fieldName + ' cannot be left blank'
            else
            return

        }

        let phoneValidatorFunc = function (obj, value, fieldName) {
          let re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im // eslint-disable-line
          if (value !== undefined || value !== "") {
            if(re.test(value) !== true)
            return 'Invalid phone number'
            else
            return
          }
        }

        let pincodeValidatorFunc = function (obj, value, fieldName) {
          let re = /^[0-9]{1,6}$/ // eslint-disable-line
          if (value !== undefined || value !== "") {
            if(re.test(value) !== true)
            return 'Invalid pin-code'
            else
            return
          }
        }

        let getFunctionDate = function (obj, value, fieldName) {
          var func1 = allowedValueValidatorFunc(obj, value, fieldName)
          var func2 = regExValidatorFunc(obj, value, fieldName)
          var func3 = dateValidatorFunc(obj, value, fieldName)
          var func4 =  defaultValidatorFunc(obj, value, fieldName)
          var func5 = optionalValidatorFunc(obj,value,fieldName)
          if (func1 !== undefined) {
            return func1
          } else if (func2 !== undefined) {
            return func2
          } else if (func3 !== undefined) {
            return func3
          } else if(func4 !== undefined){
            return func4
          }else if(func5 !== undefined){
            return func5
          }else {
            return
          }
        }

        let getFunctionUrl = function (obj, value, fieldName) {
          var func1 = allowedValueValidatorFunc(obj, value, fieldName)
          var func2 = regExValidatorFunc(obj, value, fieldName)
          var func3 = urlValidatorFunc(obj, value, fieldName)
          var func4 = defaultValidatorFunc(obj, value, fieldName)
          var func5 = optionalValidatorFunc(obj,value,fieldName)
          if (func1 !== undefined) {
            return func1
          } else if (func2 !== undefined) {
            return func2
          } else if (func3 !== undefined) {
            return func3
          } else if(func4 !== undefined){
            return func4
          }else if(func5 !== undefined){
            return func5
          }else {
            return
          }
        }

        let getFunctionEmail = function (obj, value, fieldName) {
          var func1 = allowedValueValidatorFunc(obj, value, fieldName)
          var func2 = regExValidatorFunc(obj, value, fieldName)
          var func3 = emailValidatorFunc(obj, value, fieldName)
          var func4 = defaultValidatorFunc(obj, value, fieldName)
          var func5 = optionalValidatorFunc(obj,value,fieldName)
          if (func1 !== undefined) {
            return func1
          } else if (func2 !== undefined) {
            return func2
          } else if (func3 !== undefined) {
            return func3
          } else if(func4 !== undefined){
            return func4
          }else if(func5 !== undefined){
            return func5
          }else {
            return
          }
        }

        let getFunctionPhone = function (obj, value, fieldName) {
          var func1 = allowedValueValidatorFunc(obj, value, fieldName)
          var func2 = regExValidatorFunc(obj, value, fieldName)
          var func3 = phoneValidatorFunc(obj, value, fieldName)
          var func4 = defaultValidatorFunc(obj, value, fieldName)
          var func5 = optionalValidatorFunc(obj,value,fieldName)
          if (func1 !== undefined) {
            return func1
          } else if (func2 !== undefined) {
            return func2
          } else if (func3 !== undefined) {
            return func3
          } else if(func4 !== undefined){
            return func4
          }else if(func5 !== undefined){
            return func5
          }else {
            return
          }
        }

        let getFunctionPincode = function (obj, value, fieldName) {
          var func1 = allowedValueValidatorFunc(obj, value, fieldName)
          var func2 = regExValidatorFunc(obj, value, fieldName)
          var func3 = getFunctionPincode(obj, value, fieldName)
          var func4 = defaultValidatorFunc(obj, value, fieldName)
          var func5 = optionalValidatorFunc(obj,value,fieldName)
          if (func1 !== undefined) {
            return func1
          } else if (func2 !== undefined) {
            return func2
          } else if (func3 !== undefined) {
            return func3
          } else if(func4 !== undefined){
            return func4
          }else if(func5 !== undefined){
            return func5
          }else {
            return
          }
        }

        let getFunctionText = function (obj, value, fieldName) {
          var func1 = allowedValueValidatorFunc(obj, value, fieldName)
          var func2 = regExValidatorFunc(obj, value, fieldName)
          var func3 = defaultValidatorFunc(obj, value, fieldName)
          var func4 = maxLengthValidatorFunc(obj, value, fieldName)
          var func5 = optionalValidatorFunc(obj,value,fieldName)
          if (func1 !== undefined) {
            return func1
          } else if (func2 !== undefined) {
            return func2
          } else if (func3 !== undefined){
              return func3
          } else if(func4 !== undefined){
            return func4
          }else if(func5 !== undefined){
            return func5
          }else {
            return
          }
        }

        let allowedValueValidatorFunc = function (obj, value, fieldName) {
          var i
          _.forEach(Object.keys(self.mObj[tab].schema.structure), function (value, key) {
            if (fieldName === value) {
              i = key
            }
          })
          if (self.mObj[tab].mapping[i].schemaObj.allowedValues.length > 0) {
            if (value !== undefined) {
              let check = _.includes(self.mObj[tab].mapping[i].schemaObj.allowedValues, value)
              if(check != true)
              return  'System allowedvalues are ' + self.mObj[tab].mapping[i].schemaObj.allowedValues
              else {
                return
              }
            }
          }
        }

        let defaultValidatorFunc = function (obj, value, fieldName) {
          var i
          _.forEach(Object.keys(self.mObj[tab].schema.structure), function (value, key) {
            if (fieldName === value) {
              i = key
            }
          })
          if (self.mObj[tab].mapping[i].schemaObj.defaultValue !== '' && self.mObj[tab].mapping[i].schemaObj.defaultValue !== undefined ) {
            if (value == "")
              return  'default value should be ' + self.mObj[tab].mapping[i].schemaObj.defaultValue
            else
              return
          }
        }

        let maxLengthValidatorFunc = function (obj, value, fieldName) {
          var i
          _.forEach(Object.keys(self.mObj[tab].schema.structure), function (value, key) {
            if (fieldName === value) {
              i = key
            }
          })
          if (self.mObj[tab].mapping[i].schemaObj.maxLength !== '') {
            if (value !== undefined && typeof(value) == "string") {
              let check = value.length
              if(check != self.mObj[tab].mapping[i].schemaObj.maxLength)
              return  'maxLength value should be' + self.mObj[tab].mapping[i].schemaObj.maxLength
              else {
                return
              }
            }
          }
        }

        let regExValidatorFunc = function (obj, value, fieldName) {
          var i
          _.forEach(Object.keys(self.mObj[tab].schema.structure), function (value, key) {
            if (fieldName === value) {
              i = key
            }
          })
          if (self.mObj[tab].mapping[i].schemaObj.regEx !== '') {
            if (value !== undefined) {
              let pttrn = new RegExp(self.mObj[tab].mapping[i].schemaObj.regEx)
              if (pttrn.test(value) === false && fieldName == 'max_imprint_color_allowed'){
                return 'Decimal value not allowed'
              }
              else if(pttrn.test(value) === false && fieldName != 'max_imprint_color_allowed'){
                return  'Value does not match with the regex'
              }
            }
          }
        }
      
        let schema_Obj = {}
        _.forEach(self.mObj[tab].mapping, function (value, key) {
          if(value.schemaObj.optional == true){
              if(value.schemaObj.type == 'date'){
                schema_Obj[value.sysHeader] = {type: "string",label: value.schemaObj.type,validator: dateValidatorFunc,optional:value.schemaObj.optional,allowedValues:value.schemaObj.allowedValues,defaultValue:value.schemaObj.defaultValues,maxLength: value.schemaObj.maxLength}
              }
              else if(value.schemaObj.type == 'url'){
                schema_Obj[value.sysHeader] = {type: "string",label: value.schemaObj.type,validator: urlValidatorFunc,optional:value.schemaObj.optional,allowedValues:value.schemaObj.allowedValues,defaultValue:value.schemaObj.defaultValues,maxLength: value.schemaObj.maxLength}
              }
              else if (value.schemaObj.type == 'email') {
                schema_Obj[value.sysHeader] = {type: "string",label: value.schemaObj.type,validator: emailValidatorFunc,optional:value.schemaObj.optional,allowedValues:value.schemaObj.allowedValues,defaultValue:value.schemaObj.defaultValues,maxLength: value.schemaObj.maxLength}
              }
              else if (value.schemaObj.type == 'phone') {
                schema_Obj[value.sysHeader] = {type: "string",label: value.schemaObj.type,validator: phoneValidatorFunc,optional:value.schemaObj.optional,allowedValues:value.schemaObj.allowedValues,defaultValue:value.schemaObj.defaultValues,maxLength: value.schemaObj.maxLength}
              }
              else if (value.schemaObj.type == 'pin-code') {
                schema_Obj[value.sysHeader] = {type: "string",label: value.schemaObj.type,validator: pincodeValidatorFunc,optional:value.schemaObj.optional,allowedValues:value.schemaObj.allowedValues,defaultValue:value.schemaObj.defaultValues,maxLength: value.schemaObj.maxLength}
              }
              else{
                schema_Obj[value.sysHeader] = {type: value.schemaObj.type,validator:regExValidatorFunc,label: value.schemaObj.type,optional:value.schemaObj.optional,allowedValues:value.schemaObj.allowedValues,defaultValue:value.schemaObj.defaultValues,maxLength: value.schemaObj.maxLength}
              }
          } else if (value.schemaObj.optional == false) {
            if(value.schemaObj.type == 'date'){
              schema_Obj[value.sysHeader] = {type: "string",label: value.schemaObj.type,validator: getFunctionDate,optional:value.schemaObj.optional,allowedValues:value.schemaObj.allowedValues,defaultValue:value.schemaObj.defaultValues,maxLength: value.schemaObj.maxLength}
            }
            else if(value.schemaObj.type == 'url'){
              schema_Obj[value.sysHeader] = {type: "string",label: value.schemaObj.type,validator: getFunctionUrl,optional:value.schemaObj.optional,allowedValues:value.schemaObj.allowedValues,defaultValue:value.schemaObj.defaultValues,maxLength: value.schemaObj.maxLength}
            }
            else if (value.schemaObj.type == 'email') {
              schema_Obj[value.sysHeader] = {type: "string",label: value.schemaObj.type,validator: getFunctionEmail,optional:value.schemaObj.optional,allowedValues:value.schemaObj.allowedValues,defaultValue:value.schemaObj.defaultValues,maxLength: value.schemaObj.maxLength}
            }
            else if (value.schemaObj.type == 'phone') {
              schema_Obj[value.sysHeader] = {type: "string",label: value.schemaObj.type,validator: getFunctionPhone,optional:value.schemaObj.optional,allowedValues:value.schemaObj.allowedValues,defaultValue:value.schemaObj.defaultValues,maxLength: value.schemaObj.maxLength}
            }
            else if (value.schemaObj.type == 'pin-code') {
              schema_Obj[value.sysHeader] = {type: "string",label: value.schemaObj.type,validator: getFunctionPincode,optional:value.schemaObj.optional,allowedValues:value.schemaObj.allowedValues,defaultValue:value.schemaObj.defaultValues,maxLength: value.schemaObj.maxLength}
            }
            else{
              schema_Obj[value.sysHeader] = {type: value.schemaObj.type,label: value.schemaObj.type,validator: getFunctionText,optional:value.schemaObj.optional,allowedValues:value.schemaObj.allowedValues,defaultValue:value.schemaObj.defaultValues,maxLength: value.schemaObj.maxLength}
            }
          }
        })
        console.log('schema_obj::', schema_Obj, tab)
        self.mObj[tab].schema = new Schema(schema_Obj)
        let check_err = await self.generateError(dataToValidate,self.mObj[tab].schema,schema_Obj,tab)
        console.log('Ckeck::: ', check_err, self.mObj[tab].errmsg)
        // if (self.activetab === 0) {
        //   _.forIn(self.mObj, (value, key) => {
        //     console.log(':: :: ', key, value.errmsg)
        //   })
        //   // if (self.mObj.errmsg.length > 0) {
        //   //   self.simpleValidate = false
        //   // } else {
        //   //   self.simpleValidate = true
        //   // }
        // } else {
        //   _.forIn(self.mObj, (value, key) => {
        //     console.log(':: :: ', key)
        //     if (value.errmsg.length > 0) {
        //       console.log('Error found', value.errmsg)
        //       self.advancedValidate = false
        //     } else {
        //       self.advancedValidate = true
        //     }
        //   })
        //   // if (self.mObj.advErrmsg.length > 0) {
        //   //   self.advancedValidate = false
        //   // } else {
        //   //   self.advancedValidate = true
        //   // }
        // }
        resolve(check_err)
        /* if(self.mObj[tab].selected_schema == '--Add new--'){
          self.proceedBtn = true
          self.$Notice.error({title: 'Please enter a valid mapping name',duration: 5})
        } else {
          _.forEach(self.mObj[tab].newUploadCSV, function (value, key) {
              if(err_length > 0) {
                return false
              }
            self.mObj[tab].schema.validate(value, function (err, newP, errors) {
          
              if (err) {
                throw err
              } else {
                if (errors.length) {
                  err_length = errors.length
                  let err_type = ''
                  if (!_.isEqual(Object.values(value), [""])) {
          
                    self.mObj[tab].data1.push(Object.values(value))
                    self.mObj[tab].headers1.push(Object.keys(value))
                    let oldHeaders = _.keys(self.mObj[tab].newUploadCSV)
                    _.forEach(errors, (item) => {
                      errcols.push({
                        cols: _.indexOf(self.mObj[tab].headers1[0], item.field),
                        rows: key
                      })
          
                      for(let key in schema_Obj){
                        if(key == item.field){
                          err_type = schema_Obj[key].type
                        }
                      }
          
                      if(item.message == "Error during casting"){
                        if(err_type == 'number'){
                          self.mObj[tab].errmsg.push('* Enter numeric value' + ' at column : ' + item.field)
                        }
                        else if(err_type == 'string'){
                          self.mObj[tab].errmsg.push('* Invalid value' + ' at column : ' + item.field)
                        }
                      }
                      else {
                        self.mObj[tab].errmsg.push('* ' + item.message + ' at column : ' + item.field)
                      }
                    })
          
                    self.mObj[tab].headerDisplay = false
                    self.mObj[tab].newSchemaDisplay = false
                    self.mObj[tab].previewDisplay = false
                    self.mObj[tab].uploadDisplay = false
                    self.mObj[tab].showHandson = true
                    self.mObj[tab].errDisplay = true
                    if(self.mObj[tab].load == true){
                      self.mObj[tab].load = false
                    }
                    console.log("err_length")
                    self.showerrmsg(errcols,tab)
                    // return
                  }
                } else {
                    // return
                }
              }
            })
          }) 
          if(err_length == 0){
            self.mObj[tab].headerDisplay = false
            self.mObj[tab].newSchemaDisplay = false
            self.mObj[tab].previewDisplay = false
            self.mObj[tab].uploadDisplay = false
            self.mObj[tab].showHandson = false
            $(".f-layout-copy").css("position","fixed");
            globalValidateResolve("done")
          } else {
            if(globalValidateResolveFlag === true) {
              resolve('done')
            }
          }
        } */
      })
    },
    generateError(data,schema,schema_Obj,tab) {
      return new Promise(async (resolve,reject)=> {
        let self = this
        _.forEach(data, function (value, key) {
          schema.validate(value, function (err, newP, errors) {
            if (err) {
              throw err
            } else {
              if (errors.length) {
                err_length = errors.length
                let err_type = ''
                let err_obj = self.activetab == 0 ? 'errmsg' : 'advErrmsg'
                _.forEach(errors, (item) => {
                  for (let key in schema_Obj) {
                    if (key == item.field) {
                      err_type = schema_Obj[key].type
                    }
                  }
                  if (item.message == "Error during casting") {
                    if (err_type == 'number') {
                      self.mObj[tab].errmsg.push('Enter numeric value' + ' at field ' + item.field)
                      // self.mObj[err_obj].push('* Enter numeric value' + ' at field ' + item.field)
                    } else if (err_type == 'string') {
                      self.mObj[tab].errmsg.push('Invalid value' + ' at field ' + item.field)
                      // self.mObj[err_obj].push('* Invalid value' + ' at field ' + item.field)
                    }
                  } else {
                    self.mObj[tab].errmsg.push(item.message + ' at field ' + item.field)
                    // self.mObj[err_obj][tab].push('* ' + item.message + ' at field ' + item.field)
                  }
                })
                resolve(err_length)
              } else {
                resolve(err_length)
              }
            }
          })
        })
      })
    }
  },
  async mounted () {
    await this.generateForm(0)
    let self = this
    // editor.on("change",  function() {
    //   // Get an array of errors from the validator
    //   let errors = editor.validate();
    //   if(self.activetab === 0) {
    //     if (errors.length) {
    //       self.simpleValidate = false
    //       self.simpleSubmit = true
    //     } else {
    //       self.simpleSubmit = false
    //     }
    //   } else if (self.activetab === 1) {
    //     if (errors.length) {
    //       self.advancedValidate = false
    //       self.advancedSubmit = true
    //     } else {
    //       self.advancedSubmit = false
    //     }
    //   }
    // });
  }
}
</script>

<style scoped>
.pdmedit {
  padding: 40px;
}
.demo-spin-icon-load{
  animation: ani-demo-spin 1s linear infinite;
  margin-top: 80px;
}
.row {
  width: 100% !important;
}
/*html {
  font-family: Tahoma;
  font-size: 14px;
}

body {
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 14px;
  line-height: 1.42857143;
  color: #333;
}*/

pre {
  overflow: auto;
}
  pre .string { color: #885800; }
  pre .number { color: blue; }
  pre .boolean { color: magenta; }
  pre .null { color: red; }
  pre .key { color: green; }

h1 {
  text-align: center;
  font-size: 36px;
  margin-top: 20px;
  margin-bottom: 10px;
  font-weight: 500;
}
/*
fieldset {
  border: 0;
}
*/
.panel {
  margin-bottom: 20px;
  background-color: #fff;
  border: 1px solid transparent;
  border-radius: 4px;
  -webkit-box-shadow: 0 1px 1px rgba(0, 0, 0, .05);
  box-shadow: 0 1px 1px rgba(0, 0, 0, .05);
  border-color: #ddd;
}

.panel-heading {
  color: #333;
  background-color: #f5f5f5;
  border-color: #ddd;

  padding: 10px 15px;
  border-bottom: 1px solid transparent;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
}

.panel-body {
  padding: 15px;
}

.field-checklist .wrapper {
  width: 100%;
}

fieldset {
  border: 1px solid white;
}
</style>
