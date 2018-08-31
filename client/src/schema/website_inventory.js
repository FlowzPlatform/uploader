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
  product_name: {
    type: 'string',
    label: 'Product Name',
    optional: false,
    allowedValues: [],
    defaultValue: '',
    maxLength: '',
    regEx: ''
  },
  color: {
    type: 'string',
    label: 'Color',
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
