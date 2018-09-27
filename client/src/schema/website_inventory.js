let Schema = require('simpleschema')

export const websiteInventorySchema = new Schema({
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
  attr_colors: {
    type: 'string',
    label: 'Color',
    optional: true,
    allowedValues: [],
    defaultValue: '',
    maxLength: '',
    regEx: ''
  },
  attr_style: {
    type: 'string',
    label: 'Style',
    optional: true,
    allowedValues: [],
    defaultValue: '',
    maxLength: '',
    regEx: ''
  },
  attr_size: {
    type: 'string',
    label: 'Size',
    optional: true,
    allowedValues: [],
    defaultValue: '',
    maxLength: '',
    regEx: ''
  },
  min_qty: {
    type: 'string',
    label: 'Min Qty',
    optional: true,
    allowedValues: [],
    defaultValue: '',
    maxLength: '',
    regEx: ''
  },
  qty_on_hand: {
    type: 'string',
    label: 'Qty on Hand',
    optional: false,
    allowedValues: [],
    defaultValue: '',
    maxLength: '',
    regEx: ''
  },
  qty_on_po: {
    type: 'string',
    label: 'Qty on PO',
    optional: true,
    allowedValues: [],
    defaultValue: '',
    maxLength: '',
    regEx: ''
  },
  expected_qty: {
    type: 'string',
    label: 'Expected',
    optional: true,
    allowedValues: [],
    defaultValue: '',
    maxLength: '',
    regEx: ''
  },
  arrival_date: {
    type: 'string',
    label: 'Arrival Date',
    optional: true,
    allowedValues: [],
    defaultValue: '',
    maxLength: '',
    regEx: ''
  },
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

export default websiteInventorySchema
