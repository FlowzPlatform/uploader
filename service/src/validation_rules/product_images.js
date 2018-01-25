/*eslint-disable*/

const ProductImageRules = [
  {
    columnName : 'sku',
    errorString: "SKU field found blank",
    errorCode: 'SKUblankCheck400',
    qryMongo : {$or:[{"sku":null},{"sku":""}]},
    qryES : {}
  }
];

module.exports = ProductImageRules;
