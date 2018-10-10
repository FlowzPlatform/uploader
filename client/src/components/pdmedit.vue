<template>
<div>
  <!-- Foundation CSS framework (Bootstrap and jQueryUI also supported) -->
  <link rel='stylesheet' href='//cdn.jsdelivr.net/foundation/5.0.2/css/foundation.min.css'>
  <!-- Font Awesome icons (Bootstrap, Foundation, and jQueryUI also supported) -->
  <link rel='stylesheet' href='//cdnjs.cloudflare.com/ajax/libs/font-awesome/4.0.3/css/font-awesome.css'>
  
  <Tabs @on-click="generateForm" v-model="activetab">
    <TabPane label="Simple" v-if="tab0">
      <div class="pdmsimple">
        <Row type="flex" justify="end" align="middle">
          <Col span="1">
            <Tag v-if="simpleValidate" color="green">Valid</Tag>
            <Tag v-else color="red">
              Not Valid
            </Tag>
            <!-- <Poptip v-else trigger="hover" title="Error" placement="left">
              <div slot="content">
                <Col>
                  <div v-for="(value, key) in mObj" :key="key">
                    <div v-if="value.errmsg.length > 0" v-for="(val, ky) in value.errmsg" :key="ky">
                      <Span>{{val}}</Span>
                    </div>
                  </div>
                </Col>
              </div>
            </Poptip> -->
          </Col>
          <Col>
            <ButtonGroup shape="circle">
                <Button :loading="simpleSubmitLoading" :disabled="simpleSubmit" type="primary" @click="hanleSubmit">Submit</Button>
                <Button type="ghost" @click="hanleRestore">Restore</Button>
            </ButtonGroup>
          </Col>
        </Row>
          <Row type="flex" justify="space-around">
            <Col>
              <Spin v-if="simpleDataLoader" fix>
                <Icon type="load-c" size=22 class="demo-spin-icon-load"></Icon>
                <!-- <div>Loading</div> -->
              </Spin>
              <div id='editor_simple'></div>
            </Col>
            <Col style="padding-top:60px" v-if="!simpleValidate">
              <div v-for="(value, key) in mObj" :key="key">
                <div v-if="value.errmsg.length > 0" v-for="(val, ky) in value.errmsg" :key="ky">
                  <Tag type="border" color="red"> {{val}}</Tag>
                </div>
              </div>
            </Col>
          </Row>
      </div>
    </TabPane>
    <TabPane label="Advanced" v-if="tab1">
      <div class="pdmedit">
          <Row type="flex" justify="end" align="middle">
            <Col span="1">
              <Tag v-if="advancedValidate" color="green">Valid</Tag>
              <Tag v-else color="red">
                Not Valid
              </Tag>
              <!-- <Poptip trigger="hover" title="Error" placement="left">
                <div slot="content">
                  <Col>
                    <div v-for="(value, key) in mObj" :key="key">
                      <Span v-if="value.errmsg.length > 0"><Strong>{{key}}</Strong></Span>
                      <div v-if="value.errmsg.length > 0" v-for="(val, ky) in value.errmsg" :key="ky">
                        <Span>{{val}}</Span>
                      </div>
                    </div>
                  </Col>
                </div>
              </Poptip> -->
            </Col>
            <Col>
              <ButtonGroup shape="circle">
                <Button :loading="advancedSubmitLoading" :disabled="advancedSubmit" type="primary" @click="hanleSubmit">Submit</Button>
                <Button type="ghost" @click="hanleRestore">Restore</Button>
              </ButtonGroup>
            </Col>
          </Row>
        <Row type="flex" justify="space-around">
          <Col>
            <Spin v-if="advanceDataLoader" fix>
              <Icon type="load-c" size=22 class="demo-spin-icon-load"></Icon>
              <!-- <div>Loading</div> -->
            </Spin>
            <div id='editor_holder'></div>
          </Col>
          <Col style="padding-top:60px" v-if="!advancedValidate">
            <div v-for="(value, key) in mObj" :key="key">
              <Span v-if="value.errmsg.length > 0"><br><Tag color="red"><Strong>{{key}}</Strong></Tag></Span>
              <div v-if="value.errmsg.length > 0" v-for="(val, ky) in value.errmsg" :key="ky">
                <Tag type="border" color="red">{{val}}</Tag>
              </div>
            </div>
          </Col>
        </Row>
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
import config from '../config'
import ProductInformationSchema from '@/schema/product_information'
import ProductPricingSchema from '@/schema/product_price'
import ProductImagesSchema from '@/schema/product_images'
import ProductImprintDataSchema from '@/schema/product_imprint_data'
import ProductShippingSchema from '@/schema/product_shipping'
import WebsiteInventorySchema from '@/schema/website_inventory'

const Schema = require('simpleschema')
let editor
JSONEditor.defaults.theme = 'foundation5'
JSONEditor.defaults.iconlib = 'fontawesome4'

let err_length = 0
export default {
  name: 'pdmedit',
  data () {
    return {
      tab0: true,
      tab1: true,
      vid: this.$cookie.get('vid'),
      pdata: {},
      simpledata:{},
      advanceddata: {},
      realdata: {},
      activetab: 0,
      simpleValidate: true,
      advancedValidate: true,
      simpleDataLoader: false,
      advanceDataLoader: false,
      simpleSubmitLoading: false,
      advancedSubmitLoading: false,
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
        },
        'Website Inventory': {
          schema: WebsiteInventorySchema,
          mapping: [],
          errmsg: []
        }
      }
    }
  },
  created() {},
  methods: {
    async init (id) {
      let url = config.pdmUrl + '/pdm?_id=' + id
      this.pdata = await axios.get(url, {
        headers: {
          vid: this.vid
        }
      }).then(res => {
        let pdm = res.data.hits.hits[0]._source
        pdm._id = res.data.hits.hits[0]._id
        return pdm
      }).catch(err => {
        this.$Notice.error({
          title: 'Getting product data',
          desc: 'Please refresh page and try again.'
        })
        // console.log(err)
        return {}
      })
      this.realdata = lodash.cloneDeep(this.pdata)
    },
    mapData(data){
      for(let item in data){
        this.realdata[item] = data[item]
      }
      return this.realdata
    },
    async hanleSubmit () {
      let data = editor.getValue()
      _.forIn(this.mObj, (value, key) => {
        value.errmsg = []
      })
      let url = config.pdmUrl + '/pdm/' + this.realdata._id
      let result = null
      let productData = Object.assign({}, data)
      let pricingData = null
      let imprintData = null
      let imagesData = null
      let shippingData = null
      let inventoryData = null
      
      let keyToDelete = ['activeSummary', 'createdAt', 'import-tracker_id', 'max_price', 'min_price', 'username', 'supplier_info', 'vid', 'tags', 'attributes', 'images', 'inventory', 'pricing', 'imprint_data', 'shipping', 'features']
      keyToDelete.forEach(e => { delete productData[e] });

      if (this.activetab === 1) {
        productData.categories = data.categories.join('|')
        productData.search_keyword = data.search_keyword.join('|')
        productData.available_regions = data.available_regions.join(',')
        productData['non-available_regions'] = data['non-available_regions'].join(',')
        productData.available_currencies = data.available_currencies.join('|')
      }

      let productInfo = []
      productInfo.push(productData)

      // console.log('productInfo:::', productInfo)
      let pInfo_error = await this.proceedToValidate('Product Information', productInfo)
      if (data.pricing != undefined) {
        pricingData = lodash.cloneDeep(data.pricing)
        keyToDelete = ['import-tracker_id', 'price_range']
        pricingData.map(item => {
          keyToDelete.forEach(e => {
            delete item[e]
          })
        })
        let pPrice_error = await this.proceedToValidate('Product Price', pricingData)
      }
      if (data.imprint_data != undefined) {
        imprintData = lodash.cloneDeep(data.imprint_data)
        keyToDelete = ['import-tracker_id', 'imprint_data_range']
        imprintData.map(item => {
          keyToDelete.forEach(e => {
            delete item[e]
          })
        })
        let pImprint_error = await this.proceedToValidate('Product Imprint Data', imprintData)
      }
      if (data.images != undefined) {
        imagesData = lodash.cloneDeep(data.images)
        keyToDelete = ['import-tracker_id', 'images']
        imagesData.map(item => {
          keyToDelete.forEach(e => {
            delete item[e]
          })
        })
        let pImage_error = await this.proceedToValidate('Product Image', imagesData)
      }
      if (data.shipping != undefined) {
        shippingData = lodash.cloneDeep(data.shipping)
        keyToDelete = ['import-tracker_id', 'shipping_range']
        shippingData.map(item => {
          keyToDelete.forEach(e => {
            delete item[e]
          })
        })
        let pShipping = await this.proceedToValidate('Product Shipping', shippingData)
      }
      if (data.inventory != undefined) {
        inventoryData = lodash.cloneDeep(data.inventory)
        keyToDelete = ['import-tracker_id', '_id', 'attr_style', 'attr_size', 'attr_colors', 'attributes']
        inventoryData.map(item => {
          keyToDelete.forEach(e => {
            delete item[e]
          })
        })
        let pInventory = await this.proceedToValidate('Website Inventory', inventoryData)
      }
      if(this.activetab === 0) {
        this.simpleSubmitLoading = true
        let srvVld = {
          data: productData,
          sheet_name: 'Product Information'
        }
        api.request('post', '/product-validation', srvVld).then(async res => {
          this.mObj['Product Information'].errmsg = this.mObj['Product Information'].errmsg.concat(res.data)
        }).catch(err => {
          this.$Notice.error({
            title: "Validation not complete",
            desc: "Can't perform server side validation"
          })
          // console.log('Error while doing server side validation', err)
        })
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
        result = this.mapData(data)
        if (this.simpleValidate) {
          // console.log('No error, simple data is going to live')
          axios.patch(url, result, { headers: { vid: this.vid } }).then(res => {
            if (res.data.code && res.data.code == 406) {
              this.$Notice.error({
                title: 'Update Error',
                desc: res.data.message
              })
            } else {
              this.$Notice.success({
                title: 'Update Successfull',
                desc: 'Product details updated successfully.'
              })
            }
            this.simpleSubmitLoading = false
          }).catch(err => {
            this.$Notice.error({
              title: 'Update Error',
              desc: 'Error while updating product details'
            })
            this.simpleSubmitLoading = false
          })
        } else {
          this.simpleSubmitLoading = false
        }
      } else if (this.activetab === 1) {
        this.advancedSubmitLoading = true
        // console.log('Advanced Value:::', data)

        let validateServerside  = await this.validateAtServer(data, productData, pricingData, imagesData, imprintData, shippingData, inventoryData)
        for(let key in this.mObj) {
          if (this.mObj[key].errmsg.length > 0) {
            // console.log('Error', key, this.mObj[key].errmsg)
            this.advancedValidate = false
            this.advancedSubmitLoading = false
            return false
          } else {
            this.advancedValidate = true
          }
        }
        result = this.mapData(data)
        // console.log('RESULT::::', result)
        if (this.advancedValidate) {
          // console.log('No error, advanced data is going to live')
          axios.patch(url, result, {
            headers: {
              vid: this.vid
            }
          }).then(res => {
            if (res.data.code && res.data.code == 406) {
              this.$Notice.error({
                title: 'Update Error',
                desc: res.data.message
              })
            } else {
              this.$Notice.success({
                title: 'Update Successfull',
                desc: 'Product details updated successfully.'
              })
            }
            this.advancedSubmitLoading = false
          }).catch(err => {
            this.$Notice.error({
              title: 'Update Error',
              desc: 'Error while updating product details'
            })
            this.advancedSubmitLoading = false
          })
        } else {
          this.advancedSubmitLoading = false
        }
      }
    },
    validateAtServer(data, productData, pricingData, imagesData, imprintData, shippingData, inventoryData) {
      let srvVld = {
        data: data,
        sheet_name: null
      }
      return new Promise(async (resolve, reject) => {
        for(let key in this.mObj) {
          srvVld.sheet_name = key
          if (key == 'Product Information') {
            srvVld.data = productData
          } else if (key == 'Product Price') {
            srvVld.data = pricingData
          } else if (key == 'Product Image') {
            srvVld.data = imagesData
          } else if (key == 'Product Imprint Data') {
            srvVld.data = imprintData
          } else if (key == 'Product Shipping') {
            srvVld.data = shippingData
          } else if (key == 'Website Inventory') {
            srvVld.data = inventoryData
          }
          await api.request('post', '/product-validation', srvVld).then(res => {
            // console.log('Validation Res.', key, res.data)
            this.mObj[key].errmsg = this.mObj[key].errmsg.concat(res.data)
            // if(this.mObj[key].errmsg.length > 0) {
            //   this.advancedValidate = false
            // }
          }).catch(err => {
            this.$Notice.error({
              title: "Validation not complete",
              desc: "Can't perform server side validation"
            })
            // console.log('Error while doing server side validation', err)
          })
        }
        resolve()
      });
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
      this.simpledata = {}
      for(let item in data){
        // console.log("key",item) || item == 'min_price' || item == 'max_price' || item == '_id'
        if(item == 'sku' || item == 'price_1' || item == 'currency' ||
        item == 'product_name' || item == 'language' || item == 'country' || item == 'description') {
          this.simpledata[item] = data[item]
        }
      }
      return this.simpledata
    },
    async getAdvancedData(data) {
      let keyToDelete = ['_id', 'createdAt', 'import-tracker_id', 'max_price', 'min_price', 'supplier_id', 'supplier', 'username', 'supplier_info', 'vid', 'nonavailable_regions']
      keyToDelete.forEach(e => { delete data[e] })
      return data
    },
    async generateForm (name){
      let tabname = 'tab' + name
      this.advancedSubmit = true
      this.simpleSubmit = true
      _.forIn(this.mObj, (value, key) => {
        value.errmsg = []
      })
      if (tabname == 'tab1') {
        this.simpleValidate = true
        this.advanceDataLoader = true
        document.getElementById('editor_holder').innerHTML = ""
        await this.init(this.$route.params.id)
        let advData = await this.getAdvancedData(this.pdata)

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
                type: "string",
                propertyOrder: 2
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
                type: "number",
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
                type: "array",
                items: {
                  type: 'string'
                },
                options: {
                  disable_array_reorder: true
                },
                propertyOrder: 40
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
                options: {
                  disable_properties: true
                }
              },
              categories: {
                title: "Categories",
                type: "array",
                items: {
                  type: 'string'
                },
                options: {
                  disable_array_reorder: true
                },
                propertyOrder: 42
              },
              vid: {
                type: "array",
                title: "vid"
              },
              tags: {
                type: "array",
                title: "Tags",
                items: {
                  type: 'string'
                },
                options: {
                  disable_array_reorder: true
                },
                propertyOrder: 43
              },
              'non-available_regions': {
                type: "array",
                title: 'Non-Available Regions',
                options: {
                  disable_array_reorder: true
                },
                items: {
                  type: 'string'
                },
                propertyOrder: 41,
              },
              available_currencies: {
                title: "Available Currencies",
                type: "array",
                options: {
                  disable_array_reorder: true
                },
                items: {
                  type: 'string'
                }
              },
              attributes: {
                title: "Attributes",
                type: "object",
                format: "grid",
                properties: {
                  colors: {
                    title: "Colors",
                    type: "array",
                    items: {
                      type: "string"
                    },
                    options: {
                      disable_array_reorder: true
                    }
                  }
                },
                options: {
                  disable_edit_json: true
                },
                propertyOrder: 44
              },
              inventory: {
                title: "Inventory",
                type: "array",
                options: {
                  disable_array_reorder: true
                },
                items: {
                  title: " ",
                  type: "object",
                  format: "grid",
                  options: {
                    disable_edit_json: true,
                    disable_properties: true
                  },
                  properties: {
                    qty_on_hand: {
                      title: "Qty on Hand",
                      type: "string"
                    },
                    qty_on_po: {
                      title: "Qty on PO",
                      type: "string"
                    },
                    min_qty: {
                      title: "Min Qty",
                      type: "string"
                    },
                    related_sku: {
                      title: "Related SKU",
                      type: "string"
                    },
                    expected_qty: {
                      title: "Expected Qty",
                      type: "string"
                    },
                    arrival_date: {
                      title: "Arrival Date",
                      type: "string"
                    },
                    sku: {
                      options: {
                        hidden: true
                      }
                    },
                    attributes: {
                      title: "attributes",
                      type: "object",
                      options: {
                        disable_edit_json: true,
                        disable_properties: true
                      },
                      properties: {
                        colors: {
                          type: "array",
                          items: {
                            type: "string"
                          },
                          options: {
                            disable_array_reorder: true
                          }
                        },
                        actual_colors: {
                          title: "Actual Colors",
                          type: "array",
                          items: {
                            type: "string"
                          },
                          options: {
                            disable_array_reorder: true
                          }
                        }
                      }
                    },
                    _id: {
                      options: {
                        hidden: true
                      }
                    },
                    "import-tracker_id": {
                      options: {
                        hidden: true
                      }
                    },
                    attr_style: {
                      options: {
                        hidden: true
                      }
                    },
                    attr_size: {
                      options: {
                        hidden: true
                      }
                    },
                    attr_color: {
                      options: {
                        hidden: true
                      }
                    }
                  }
                }
              },
              images: {
                title: "Images",
                type: "array",
                options: {
                  disable_array_reorder: true
                },
                items: {
                  title: " ",
                  type: "object",
                  properties: {
                    images: {
                      type: "array",
                      items: {
                        format: "grid",
                        properties: {
                          type: "object",
                          secure_url: {
                            title: "Secure URL",
                            type: "string",
                            links: [
                              { 
                                rel: "👁 Image",
                                href: "{{self}}"
                                // mediaType: "image"
                              }
                            ]
                          },
                          web_image:{
                            title: "Web image",
                            type: "string"
                          },
                          color: {
                            title: "Color",
                            type: "string"
                          },
                          image_color_code: {
                            title: "Image color code",
                            type: "string"
                          }
                        },
                        options: {
                          disable_edit_json: true,
                          disable_properties: true
                        }
                      },
                      options: {
                        disable_array_reorder: true
                      }
                    },
                    _id: {
                      options: {
                        hidden: true
                      }
                    },
                    product_id: {
                      options: {
                        hidden: true
                      }
                    },
                    sku: {
                      options: {
                        hidden: true
                      }
                    },
                    "import-tracker_id": {
                      options: {
                        hidden: true
                      }
                    }
                  },
                  options: {
                    disable_properties: true,
                    disable_edit_json: true
                  }
                }
              },
              pricing: {
                title: "Pricing",
                type: "array",
                options: {
                  disable_array_reorder: true
                },
                items: {
                  title: " ",
                  type: "object",
                  format: "grid",
                  options: {
                    disable_properties: true,
                    disable_edit_json: true
                  },
                  properties: {
                    _id: {
                      options: {
                        hidden: true
                      }
                    },
                    product_id: {
                      options: {
                        hidden: true
                      }
                    },
                    sku: {
                      options: {
                        hidden: true
                      }
                    },
                    price_type: {
                      title: "Price Type",
                      type: "string"
                    },
                    type: {
                      title: "Type",
                      type: "string"
                    },
                    global_price_type: {
                      title: "Global Price Type",
                      type: "string"
                    },
                    currency: {
                      title: "Currency",
                      type: "string"
                    },
                    price_unit: {
                      title: "Price Unit",
                      type: "string"
                    },
                    "import-tracker_id": {
                      options: {
                        hidden: true
                      }
                    },
                    price_range: {
                      title: "Price Range",
                      type: "array",
                      items: {
                        title: " ",
                        type: "object",
                        format: "grid",
                        options: {
                          disable_edit_json: true,
                          disable_properties: true
                        },
                        properties: {
                          qty: {
                            title: "Quantity",
                            type: "object",
                            format: "grid",
                            options: {
                              disable_edit_json: true,
                              disable_properties: true
                            },
                            properties: {
                              gte: {
                                title: "Min",
                                type: "number"
                              },
                              lte: {
                                title: "Max",
                                type: "number"
                              }
                            }
                          },
                          price: {
                            title: "Price",
                            type: "number"
                          },
                          code: {
                            title: "Code",
                            type: "string"
                          }
                        }
                      },
                      options: {
                        disable_array_reorder: true
                      }
                    }
                  }
                }
              },
              imprint_data: {
                title: "Imprint Data",
                type: "array",
                options: {
                  disable_array_reorder: true
                },
                items: {
                  title: " ",
                  type: "object",
                  format: "grid",
                  properties: {
                    production_unit: {
                      title: "Production Unit",
                      type: "string",
                      propertyOrder: 1
                    },
                    imprint_position: {
                      title: "Imprint Position",
                      type: "string",
                      propertyOrder: 2
                    },
                    imprint_area: {
                      title: "Imprint Area",
                      type: "string",
                      propertyOrder: 4
                    },
                    matrix: {
                      title: "Matrix",
                      type: "string",
                      propertyOrder: 3
                    },
                    max_imprint_color_allowed: {
                      title: "Max Imprint Color Allowed",
                      type: "number"
                    },
                    price_included: {
                      title: "Price Included",
                      type: "number",
                      propertyOrder: 5
                    },
                    max_location_allowed: {
                      title: "Max Location Allowed",
                      type: "number",
                      propertyOrder: 15
                    },
                    location_price_included: {
                      title: "Location Price Included",
                      type: "number"
                    },
                    production_days: {
                      title: "Production Days",
                      type: "string",
                      propertyOrder: 6
                    },
                    setup_charge: {
                      title: "Setup Charge",
                      type: "string",
                      propertyOrder: 7
                    },
                    rush_charge: {
                      title: "Rush Charge",
                      type: "string",
                      propertyOrder: 8
                    },
                    additional_location_charge: {
                      title: "Additional Location Charge",
                      type: "string"
                    },
                    additional_color_charge: {
                      title: "Additional Color Charge",
                      type: "string",
                      propertyOrder: 16
                    },
                    ltm_charge: {
                      title: "LTM Charge",
                      type: "string",
                      propertyOrder: 9
                    },
                    pms_charge: {
                      title: "PMS Charge",
                      type: "string",
                      propertyOrder: 10
                    },
                    type_of_charge: {
                      title: "Type of Charge",
                      type: "string",
                      propertyOrder: 14
                    },
                    imprint_method: {
                      title: "Imprint Method",
                      type: "string",
                      propertyOrder: 11
                    },
                    is_pms_color_allow: {
                      title: "is PMS Color Allow",
                      type: "string",
                      propertyOrder: 13
                    },
                    full_color: {
                      title: "Full Color",
                      type: "string",
                      propertyOrder: 12
                    },
                    imprint_data_range: {
                      title: "Imprint Data Range",
                      type: "array",
                      items: {
                        title: " ",
                        type: "object",
                        format: "grid",
                        options: {
                          disable_edit_json: true,
                          disable_properties: true
                        },
                      },
                      options: {
                        disable_array_reorder: true
                      }
                    },
                    _id: {
                      options: {
                        hidden: true
                      }
                    },
                    sku: {
                      options: {
                        hidden: true
                      }
                    },
                    product_id: {
                      options: {
                        hidden: true
                      }
                    },
                    "import-tracker_id": {
                      options: {
                        hidden: true
                      }
                    }
                  },
                  options: {
                    disable_edit_json: true,
                    disable_properties: true
                  }
                }
              },
              shipping: {
                title: "Shipping",
                type: "array",
                options: {
                  disable_array_reorder: true
                },
                items: {
                  tite: " ",
                  type: "object",
                  format: "grid",
                  properties: {
                    _id: {
                      options: {
                        hidden: true
                      }
                    },
                    "import-tracker_id": {
                      options: {
                        hidden: true
                      }
                    },
                    sku: {
                      options: {
                        hidden: true
                      }
                    },
                    product_id: {
                      options: {
                        hidden: true
                      }
                    },
                    carton_height: {
                      title: "Carton Height",
                      type: "string",
                      propertyOrder: 7
                    },
                    free_on_board: {
                      title: "Free on Board",
                      type: "string",
                      propertyOrder: 16
                    },
                    fob_city: {
                      title: "Fob City",
                      type: "string",
                      propertyOrder: 3
                    },
                    fob_state_code: {
                      title: "Fob State Code",
                      type: "string",
                      propertyOrder: 6
                    },
                    fob_country_code: {
                      title: "Fob Country Code",
                      type: "string",
                      propertyOrder: 9
                    },
                    fob_zip_code: {
                      title: "Fob Zip Code",
                      type: "string",
                      propertyOrder: 12
                    },
                    shipping_qty_per_carton: {
                      title: "Shipping Qty Per Carton",
                      type: "number"
                    },
                    carton_length: {
                      title: "Carton Length",
                      type: "number",
                      propertyOrder: 11
                    },
                    carton_width: {
                      title: "Carton Width",
                      type: "string",
                      propertyOrder: 8
                    },
                    carton_weight: {
                      title: "Carton Weight",
                      type: "string",
                      propertyOrder: 10
                    },
                    product_length: {
                      title: "Product Length",
                      type: "string",
                      propertyOrder: 5
                    },
                    product_width: {
                      title: "Product Width",
                      type: "string",
                      propertyOrder: 2
                    },
                    product_height: {
                      title: "Product Height",
                      type: "string",
                      propertyOrder: 1
                    },
                    product_weight: {
                      title: "Product Weight",
                      type: "string",
                      propertyOrder: 4
                    },
                    carton_size_unit: {
                      title: "Carton Size Unit",
                      type: "string",
                      propertyOrder: 13
                    },
                    carton_weight_unit: {
                      title: "Carton Weight Unit",
                      type: "string",
                      propertyOrder: 14
                    },
                    product_size_unit: {
                      title: "Product Size Unit",
                      type: "string",
                      propertyOrder: 15
                    },
                    product_weight_unit: {
                      title: "Product Weight Unit",
                      type: "string"
                    },
                    shipping_range: {
                      title: "Shipping Range",
                      type:"array",
                      options: {
                        disable_array_reorder: true
                      },
                      items: {
                        title: " ",
                        type: "object",
                        format: "grid",
                        options: {
                          disable_edit_json: true,
                          disable_properties: true
                        }
                      }
                    }
                  },
                  options: {
                    disable_edit_json: true,
                    disable_properties: true
                  }
                }
              },
              search_keyword: {
                title: "Search Keywords",
                type: "array",
                options: {
                  disable_array_reorder: true
                },
                items: {
                  type: "string"
                }
              },
              features: {
                title: "Features",
                type: "array",
                options: {
                  disable_array_reorder: true
                },
                items: {
                  title: " ",
                  type: "object",
                  format: "grid",
                  options: {
                    disable_edit_json: true,
                    disable_properties: true
                  },
                  properties: {
                    key: {
                      type: 'string'
                    },
                    value: {
                      type: 'string'
                    }
                  }
                },
                propertyOrder: 1001
              },
              feature_1: {
                type: "string",
                title: "feature_1"
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
          },
          // Seed the form with a starting value
          startval: advData
        });
        editor.getEditor('root.sku').disable()
        // editor.getEditor('root._id').disable()
        // editor.getEditor('root.vid').disable()
        // editor.getEditor('root.username').disable()
        // editor.getEditor('root.supplier_id').disable()
        editor.getEditor('root.product_id').disable()
        // editor.getEditor('root.supplier_info').disable()
        // editor.getEditor('root.import-tracker_id').disable()
        this.advanceDataLoader = false
        this.advancedSubmit = false
      } else if (tabname == 'tab0') {
        this.advancedValidate = true
        this.simpleDataLoader = true
        document.getElementById('editor_simple').innerHTML = ""
        await this.init(this.$route.params.id)
        let data = await this.getSimpleData(this.pdata)
        
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
                title: "Description",
                format: "html",
                options: {
                  wysiwyg: true
                }
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
          },
          // Seed the form with a starting value
          startval: data
        });
        editor.getEditor('root.sku').disable();
        // editor.getEditor('root._id').disable();
        this.simpleDataLoader = false
        this.simpleSubmit = false
      }
    },
    proceedToValidate(tab, dataToValidate) {
      let self = this

      for(let key in self.mObj[tab].schema.structure) {
        self.mObj[tab].mapping.push({'sysHeader':key,"schemaObj": self.mObj[tab].schema.structure[key],"csvHeader":"","transform":"","transformMethod":""})
      }
      return new Promise(async (resolve,reject)=> {
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
          let func1 = allowedValueValidatorFunc(obj, value, fieldName)
          let func2 = regExValidatorFunc(obj, value, fieldName)
          let func3 = dateValidatorFunc(obj, value, fieldName)
          let func4 =  defaultValidatorFunc(obj, value, fieldName)
          let func5 = optionalValidatorFunc(obj,value,fieldName)
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
          let func1 = allowedValueValidatorFunc(obj, value, fieldName)
          let func2 = regExValidatorFunc(obj, value, fieldName)
          let func3 = urlValidatorFunc(obj, value, fieldName)
          let func4 = defaultValidatorFunc(obj, value, fieldName)
          let func5 = optionalValidatorFunc(obj,value,fieldName)
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
          let func1 = allowedValueValidatorFunc(obj, value, fieldName)
          let func2 = regExValidatorFunc(obj, value, fieldName)
          let func3 = emailValidatorFunc(obj, value, fieldName)
          let func4 = defaultValidatorFunc(obj, value, fieldName)
          let func5 = optionalValidatorFunc(obj,value,fieldName)
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
          let func1 = allowedValueValidatorFunc(obj, value, fieldName)
          let func2 = regExValidatorFunc(obj, value, fieldName)
          let func3 = phoneValidatorFunc(obj, value, fieldName)
          let func4 = defaultValidatorFunc(obj, value, fieldName)
          let func5 = optionalValidatorFunc(obj,value,fieldName)
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
          let func1 = allowedValueValidatorFunc(obj, value, fieldName)
          let func2 = regExValidatorFunc(obj, value, fieldName)
          let func3 = getFunctionPincode(obj, value, fieldName)
          let func4 = defaultValidatorFunc(obj, value, fieldName)
          let func5 = optionalValidatorFunc(obj,value,fieldName)
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
          let func1 = allowedValueValidatorFunc(obj, value, fieldName)
          let func2 = regExValidatorFunc(obj, value, fieldName)
          let func3 = defaultValidatorFunc(obj, value, fieldName)
          let func4 = maxLengthValidatorFunc(obj, value, fieldName)
          let func5 = optionalValidatorFunc(obj,value,fieldName)
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

        // let allowedValueValidatorFunc = function (obj, value, fieldName) {
        //   let i
        //   _.forEach(Object.keys(self.mObj[tab].schema.structure), function (value, key) {
        //     if (fieldName === value) {
        //       i = key
        //     }
        //   })
        //   if (self.mObj[tab].mapping[i].schemaObj.allowedValues.length > 0) {
        //     if (value !== undefined) {
        //       let check = _.includes(self.mObj[tab].mapping[i].schemaObj.allowedValues, value)
        //       if(check != true)
        //       return  'System allowedvalues are ' + self.mObj[tab].mapping[i].schemaObj.allowedValues
        //       else {
        //         return
        //       }
        //     }
        //   }
        // }

        let allowedValueValidatorFunc = function (obj, value, fieldName) {
          let i
          _.forEach(Object.keys(self.mObj[tab].schema.structure), function (value, key) {
            if (fieldName === value) {
              i = key
            }
          })
          if (self.mObj[tab].mapping[i].schemaObj.allowedValues.length > 0) {
            if (fieldName === 'available_currencies' && obj['available_currencies'] !== undefined) {
              let value = obj['available_currencies'].split('|')
              let arr = lodash.cloneDeep(self.mObj[tab].mapping[i].schemaObj.allowedValues)
              for (let i = 0; i < value.length; i++) {
                let check = _.includes(arr, value[i])
                if (check !== true) {
                  return 'System allowedvalues are USD, CAD, AUD, EUR, INR...'
                  // return 'System allowedvalues are ' + arr
                } else {
                }
              }
              return
            } else {
              if (value !== undefined) {
                let check = _.includes(self.mObj[tab].mapping[i].schemaObj.allowedValues, value)
                if (check !== true) { return 'System allowedvalues are ' + self.mObj[tab].mapping[i].schemaObj.allowedValues } else {
                  return
                }
              }
            }
          }
        }

        let defaultValidatorFunc = function (obj, value, fieldName) {
          let i
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
          let i
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
          let i
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
        // console.log('schema_obj::', schema_Obj, tab)
        self.mObj[tab].schema = new Schema(schema_Obj)
        let check_err = await self.generateError(dataToValidate,self.mObj[tab].schema,schema_Obj,tab)
        // console.log('Ckeck::: ', check_err, self.mObj[tab].errmsg)
        resolve(check_err)
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
  }
}
</script>

<style scoped>
/* @import url('https://cdn.jsdelivr.net/foundation/5.0.2/css/foundation.min.css'); */
/* @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.0.3/css/font-awesome.css'); */

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
