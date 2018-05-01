/*eslint-disable*/

const ProductImageRules = [
  {
    columnName : 'sku',
    errorString: "SKU field found blank",
    errorCode: 'SKUblankCheck400',
    qryMongo : {$or:[{"sku":null},{"sku":""}]},
    qryES : {}
  },
  {
    columnName : 'secure_url_1',
    errorString: "Web_Image_1 not found...Please upload this image or remove it from the CSV",
    errorCode: 'Secure_url_1blankCheck400',
    qryMongo : {"secure_url_1": { $exists: true, $ne: "" }},
    qryES : {}
  },
  {
    columnName : 'secure_url_2',
    errorString: "Web_Image_2 not found...Please upload this image or remove it from the CSV",
    errorCode: 'Secure_url_2blankCheck400',
    qryMongo : {"secure_url_2": { $exists: true, $ne: "" }},
    qryES : {}
  },
  {
    columnName : 'secure_url_3',
    errorString: "Web_Image_3 not found...Please upload this image or remove it from the CSV",
    errorCode: 'Secure_url_3blankCheck400',
    qryMongo : {"secure_url_3": { $exists: true, $ne: "" }},
    qryES : {}
  },
  {
    columnName : 'secure_url_4',
    errorString: "Web_Image_4 not found...Please upload this image or remove it from the CSV",
    errorCode: 'Secure_url_4blankCheck400',
    qryMongo : {"secure_url_4": { $exists: true, $ne: "" }},
    qryES : {}
  },
  {
    columnName : 'secure_url_5',
    errorString: "Web_Image_5 not found...Please upload this image or remove it from the CSV",
    errorCode: 'Secure_url_5blankCheck400',
    qryMongo : {"secure_url_5": { $exists: true, $ne: "" }},
    qryES : {}
  },
  {
    columnName : 'secure_url_6',
    errorString: "Web_Image_6 not found...Please upload this image or remove it from the CSV",
    errorCode: 'Secure_url_6blankCheck400',
    qryMongo : {"secure_url_6": { $exists: true, $ne: "" }},
    qryES : {}
  },
  {
    columnName : 'secure_url_7',
    errorString: "Web_Image_7 not found...Please upload this image or remove it from the CSV",
    errorCode: 'Secure_url_7blankCheck400',
    qryMongo : {"secure_url_7": { $exists: true, $ne: "" }},
    qryES : {}
  },
  {
    columnName : 'secure_url_8',
    errorString: "Web_Image_8 not found...Please upload this image or remove it from the CSV",
    errorCode: 'Secure_url_8blankCheck400',
    qryMongo : {"secure_url_8": { $exists: true, $ne: "" }},
    qryES : {}
  },
  {
    columnName : 'secure_url_9',
    errorString: "Web_Image_9 not found...Please upload this image or remove it from the CSV",
    errorCode: 'Secure_url_9blankCheck400',
    qryMongo : {"secure_url_9": { $exists: true, $ne: "" }},
    qryES : {}
  },
  {
    columnName : 'secure_url_10',
    errorString: "Web_Image_10 not found...Please upload this image or remove it from the CSV",
    errorCode: 'Secure_url_10blankCheck400',
    qryMongo : {"secure_url_10": { $exists: true, $ne: "" }},
    qryES : {}
  },
  {
    columnName : 'secure_url_11',
    errorString: "Web_Image_11 not found...Please upload this image or remove it from the CSV",
    errorCode: 'Secure_url_11blankCheck400',
    qryMongo : {"secure_url_11": { $exists: true, $ne: "" }},
    qryES : {}
  },
  {
    columnName : 'secure_url_12',
    errorString: "Web_Image_12 not found...Please upload this image or remove it from the CSV",
    errorCode: 'Secure_url_12blankCheck400',
    qryMongo : {"secure_url_12": { $exists: true, $ne: "" }},
    qryES : {}
  },
  {
    columnName : 'secure_url_13',
    errorString: "Web_Image_13 not found...Please upload this image or remove it from the CSV",
    errorCode: 'Secure_url_13blankCheck400',
    qryMongo : {"secure_url_13": { $exists: true, $ne: "" }},
    qryES : {}
  },
  {
    columnName : 'secure_url_14',
    errorString: "Web_Image_14 not found...Please upload this image or remove it from the CSV",
    errorCode: 'Secure_url_14blankCheck400',
    qryMongo : {"secure_url_14": { $exists: true, $ne: "" }},
    qryES : {}
  },
  {
    columnName : 'secure_url_15',
    errorString: "Web_Image_15 not found...Please upload this image or remove it from the CSV",
    errorCode: 'Secure_url_15blankCheck400',
    qryMongo : {"secure_url_15": { $exists: true, $ne: "" }},
    qryES : {}
  },
  {
    columnName : 'secure_url_16',
    errorString: "Web_Image_16 not found...Please upload this image or remove it from the CSV",
    errorCode: 'Secure_url_16blankCheck400',
    qryMongo : {"secure_url_16": { $exists: true, $ne: "" }},
    qryES : {}
  },
  {
    columnName : 'secure_url_17',
    errorString: "Web_Image_17 not found...Please upload this image or remove it from the CSV",
    errorCode: 'Secure_url_17blankCheck400',
    qryMongo : {"secure_url_17": { $exists: true, $ne: "" }},
    qryES : {}
  },
  {
    columnName : 'secure_url_18',
    errorString: "Web_Image_18 not found...Please upload this image or remove it from the CSV",
    errorCode: 'Secure_url_18blankCheck400',
    qryMongo : {"secure_url_18": { $exists: true, $ne: "" }},
    qryES : {}
  }
];

module.exports = ProductImageRules;
