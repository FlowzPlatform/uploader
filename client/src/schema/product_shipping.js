var Schema = require('simpleschema')
export const ProductShippingSchema = new Schema({
  product_id: {
    type: 'string',
    label: 'Product Id',
    optional: true,
    allowedValues: [],
    defaultValue: '',
    maxLength: '',
    regEx: ''
  },
  sku: {
    type: 'string',
    label: 'SKU',
    max: 200,
    optional: false,
    allowedValues: [],
    defaultValue: '',
    maxLength: '',
    regEx: ''
  },
  free_on_board: {
    type: 'string',
    label: 'Free on Board',
    optional: true,
    allowedValues: [],
    defaultValue: '',
    maxLength: '',
    regEx: ''
  },
  fob_city: {
    type: 'string',
    label: 'Free On Board City',
    optional: false,
    allowedValues: [],
    defaultValue: '',
    maxLength: '',
    regEx: ''
  },
  fob_state_code: {
    type: 'string',
    label: 'Free On Board State Code',
    optional: false,
    allowedValues: [],
    defaultValue: '',
    maxLength: '',
    regEx: ''
  },
  fob_country_code: {
    type: 'string',
    label: 'Free On Board Country Code',
    optional: false,
    allowedValues: [],
    defaultValue: '',
    maxLength: '',
    regEx: ''
  },
  fob_zip_code: {
    type: 'string',
    label: 'Free On Board zipcode',
    optional: false,
    allowedValues: [],
    defaultValue: '',
    maxLength: '',
    regEx: ''
  },
  shipping_qty_per_carton: {
    type: 'number',
    label: 'Shipping Qty Per Carton',
    optional: false,
    allowedValues: [],
    defaultValue: 1,
    maxLength: '',
    regEx: ''
  },
  carton_length: {
    type: 'number',
    label: 'Carton Length',
    optional: true,
    allowedValues: [],
    defaultValue: '',
    maxLength: '',
    regEx: ''
  },
  carton_width: {
    type: 'string',
    label: 'Carton Width',
    optional: true,
    allowedValues: [],
    defaultValue: '',
    maxLength: '',
    regEx: ''
  },
  carton_height: {
    type: 'string',
    label: 'Carton Height',
    optional: true,
    allowedValues: [],
    defaultValue: '',
    maxLength: '',
    regEx: ''
  },
  carton_weight: {
    type: 'string',
    label: 'Carton Weight',
    optional: true,
    allowedValues: [],
    defaultValue: '',
    maxLength: '',
    regEx: ''
  },
  product_length: {
    type: 'string',
    label: 'Product Length',
    optional: true,
    allowedValues: [],
    defaultValue: '',
    maxLength: '',
    regEx: ''
  },
  product_width: {
    type: 'string',
    label: 'Product Width',
    max: 200,
    optional: true,
    allowedValues: [],
    defaultValue: '',
    maxLength: '',
    regEx: ''
  },
  product_height: {
    type: 'string',
    label: 'Product Height',
    optional: true,
    allowedValues: [],
    defaultValue: '',
    maxLength: '',
    regEx: ''
  },
  product_weight: {
    type: 'string',
    label: 'Product Weight',
    optional: false,
    allowedValues: [],
    defaultValue: '',
    maxLength: '',
    regEx: ''
  },
  carton_size_unit: {
    type: 'string',
    label: 'Carton Size Unit',
    optional: true,
    allowedValues: [],
    defaultValue: '',
    maxLength: '',
    regEx: ''
  },
  carton_weight_unit: {
    type: 'string',
    label: 'Carton Weight Unit',
    max: 200,
    optional: false,
    allowedValues: [],
    defaultValue: '',
    maxLength: '',
    regEx: ''
  },
  product_size_unit: {
    type: 'string',
    label: 'Product Size Unit',
    optional: true,
    allowedValues: [],
    defaultValue: '',
    maxLength: '',
    regEx: ''
  },
  product_weight_unit: {
    type: 'string',
    label: 'Product weight Unit',
    optional: true,
    allowedValues: [],
    defaultValue: '',
    maxLength: '',
    regEx: ''
  },
  qty_1_min: {
    type: 'number',
    label: 'Qty_1_Min',
    optional: true,
    allowedValues: [],
    defaultValue: '',
    maxLength: '',
    regEx: ''
  },
  qty_1_max: {
    type: 'number',
    label: 'Qty_1_Max',
    optional: true,
    allowedValues: [],
    defaultValue: '',
    maxLength: '',
    regEx: ''
  },
  qty_2_min: {
    type: 'number',
    label: 'Qty_2_Min',
    optional: true,
    allowedValues: [],
    defaultValue: '',
    maxLength: '',
    regEx: ''
  },
  qty_2_max: {
    type: 'number',
    label: 'Qty_2_Max',
    optional: true,
    allowedValues: [],
    defaultValue: '',
    maxLength: '',
    regEx: ''
  },
  qty_3_min: {
    type: 'number',
    label: 'Qty_3_Min',
    optional: true,
    allowedValues: [],
    defaultValue: '',
    maxLength: '',
    regEx: ''
  },
  qty_3_max: {
    type: 'number',
    label: 'Qty_3_Max',
    optional: true,
    allowedValues: [],
    defaultValue: '',
    maxLength: '',
    regEx: ''
  },
  qty_4_min: {
    type: 'number',
    label: 'Qty_4_Min',
    optional: true,
    allowedValues: [],
    defaultValue: '',
    maxLength: '',
    regEx: ''
  },
  qty_4_max: {
    type: 'number',
    label: 'Qty_4_Max',
    optional: true,
    allowedValues: [],
    defaultValue: '',
    maxLength: '',
    regEx: ''
  },
  qty_5_min: {
    type: 'number',
    label: 'Qty_5_Min',
    optional: true,
    allowedValues: [],
    defaultValue: '',
    maxLength: '',
    regEx: ''
  },
  qty_5_max: {
    type: 'number',
    label: 'Qty_5_Max',
    optional: true,
    allowedValues: [],
    defaultValue: '',
    maxLength: '',
    regEx: ''
  },
  qty_6_min: {
    type: 'number',
    label: 'Qty_6_Min',
    optional: true,
    allowedValues: [],
    defaultValue: '',
    maxLength: '',
    regEx: ''
  },
  qty_6_max: {
    type: 'number',
    label: 'Qty_6_Max',
    optional: true,
    allowedValues: [],
    defaultValue: '',
    maxLength: '',
    regEx: ''
  },
  qty_7_min: {
    type: 'number',
    label: 'Qty_7_Min',
    optional: true,
    allowedValues: [],
    defaultValue: '',
    maxLength: '',
    regEx: ''
  },
  qty_7_max: {
    type: 'number',
    label: 'Qty_7_Max',
    optional: true,
    allowedValues: [],
    defaultValue: '',
    maxLength: '',
    regEx: ''
  },
  qty_8_min: {
    type: 'number',
    label: 'Qty_8_Min',
    optional: true,
    allowedValues: [],
    defaultValue: '',
    maxLength: '',
    regEx: ''
  },
  qty_8_max: {
    type: 'number',
    label: 'Qty_8_Max',
    optional: true,
    allowedValues: [],
    defaultValue: '',
    maxLength: '',
    regEx: ''
  },
  qty_9_min: {
    type: 'number',
    label: 'Qty_9_Min',
    optional: true,
    allowedValues: [],
    defaultValue: '',
    maxLength: '',
    regEx: ''
  },
  qty_9_max: {
    type: 'number',
    label: 'Qty_9_Max',
    optional: true,
    allowedValues: [],
    defaultValue: '',
    maxLength: '',
    regEx: ''
  },
  qty_10_min: {
    type: 'number',
    label: 'Qty_10_Min',
    optional: true,
    allowedValues: [],
    defaultValue: '',
    maxLength: '',
    regEx: ''
  },
  qty_10_max: {
    type: 'number',
    label: 'Qty_10_Max',
    optional: true,
    allowedValues: [],
    defaultValue: '',
    maxLength: '',
    regEx: ''
  },
    // fileID: {
    //     type: "string",
    //     label: "file ID",
    //     optional: true,
    //     allowedValues: [],
    //     defaultValue: '',
    //     maxLength : '',
    //     regEx:''
    // },
    // owner: {
    //     type: "string",
    //     label: "owner",
    //     optional: true,
    //     allowedValues: [],
    //     defaultValue: '',
    //     maxLength : '',
    //     regEx:''
    // },
    // username: {
    //     type: "string",
    //     label: "username",
    //     optional: true,
    //     allowedValues: [],
    //     defaultValue: '',
    //     maxLength : '',
    //     regEx:''
    // },
  _id: {
    type: 'string',
    label: '_id',
    optional: true,
    allowedValues: [],
    defaultValue: '',
    maxLength: '',
    regEx: ''
  }
})
export default ProductShippingSchema
