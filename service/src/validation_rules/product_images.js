/*eslint-disable*/

const ProductImageRules = [
  {
    columnName : 'sku',
    errorString: "SKU field found blank",
    errorCode: 'SKUblankCheck400',
    qryMongo : {$or:[{"sku":null},{"sku":""}]},
    qryES : {},
    qryObject: (sku)=>{ return (sku == null || sku == "")}
  },
  {
    columnName : 'secure_url_1',
    errorString: "Secure_Url_1 not found...Please give correct path or remove it from the CSV",
    errorCode: 'Secure_url_1blankCheck400',
    qryMongo : {"secure_url_1": { $exists: true, $ne: "" }},
    qryES : {},
    qryObject: (secure_url_1)=>{ return (secure_url_1 == undefined || secure_url_1 == "")}
  },
  {
    columnName : 'secure_url_2',
    errorString: "Secure_Url_2 not found...Please give correct path or remove it from the CSV",
    errorCode: 'Secure_url_2blankCheck400',
    qryMongo : {"secure_url_2": { $exists: true, $ne: "" }},
    qryES : {},
    qryObject: (secure_url_2)=>{ return (secure_url_2 == undefined || secure_url_2 == "")}
  },
  {
    columnName : 'secure_url_3',
    errorString: "Secure_Url_3 not found...Please give correct path or remove it from the CSV",
    errorCode: 'Secure_url_3blankCheck400',
    qryMongo : {"secure_url_3": { $exists: true, $ne: "" }},
    qryES : {},
    qryObject: (secure_url_3)=>{ return (secure_url_3 == undefined || secure_url_3 == "")}
  },
  {
    columnName : 'secure_url_4',
    errorString: "Secure_Url_4 not found...Please give correct path or remove it from the CSV",
    errorCode: 'Secure_url_4blankCheck400',
    qryMongo : {"secure_url_4": { $exists: true, $ne: "" }},
    qryES : {},
    qryObject: (secure_url_4)=>{ return (secure_url_4 == undefined || secure_url_4 == "")}
  },
  {
    columnName : 'secure_url_5',
    errorString: "Secure_Url_5 not found...Please give correct path or remove it from the CSV",
    errorCode: 'Secure_url_5blankCheck400',
    qryMongo : {"secure_url_5": { $exists: true, $ne: "" }},
    qryES : {},
    qryObject: (secure_url_5)=>{ return (secure_url_5 == undefined || secure_url_5 == "")}
  },
  {
    columnName : 'secure_url_6',
    errorString: "Secure_Url_6 not found...Please give correct path or remove it from the CSV",
    errorCode: 'Secure_url_6blankCheck400',
    qryMongo : {"secure_url_6": { $exists: true, $ne: "" }},
    qryES : {},
    qryObject: (secure_url_6)=>{ return (secure_url_6 == undefined || secure_url_6 == "")}
  },
  {
    columnName : 'secure_url_7',
    errorString: "Secure_Url_7 not found...Please give correct path or remove it from the CSV",
    errorCode: 'Secure_url_7blankCheck400',
    qryMongo : {"secure_url_7": { $exists: true, $ne: "" }},
    qryES : {},
    qryObject: (secure_url_7)=>{ return (secure_url_7 == undefined || secure_url_7 == "")}
  },
  {
    columnName : 'secure_url_8',
    errorString: "Secure_Url_8 not found...Please give correct path or remove it from the CSV",
    errorCode: 'Secure_url_8blankCheck400',
    qryMongo : {"secure_url_8": { $exists: true, $ne: "" }},
    qryES : {},
    qryObject: (secure_url_8)=>{ return (secure_url_8 == undefined || secure_url_8 == "")}
  },
  {
    columnName : 'secure_url_9',
    errorString: "Secure_Url_9 not found...Please give correct path or remove it from the CSV",
    errorCode: 'Secure_url_9blankCheck400',
    qryMongo : {"secure_url_9": { $exists: true, $ne: "" }},
    qryES : {},
    qryObject: (secure_url_9)=>{ return (secure_url_9 == undefined || secure_url_9 == "")}
  },
  {
    columnName : 'secure_url_10',
    errorString: "Secure_Url_10 not found...Please give correct path or remove it from the CSV",
    errorCode: 'Secure_url_10blankCheck400',
    qryMongo : {"secure_url_10": { $exists: true, $ne: "" }},
    qryES : {},
    qryObject: (secure_url_10)=>{ return (secure_url_10 == undefined || secure_url_10 == "")}
  },
  {
    columnName : 'secure_url_11',
    errorString: "Secure_Url_11 not found...Please give correct path or remove it from the CSV",
    errorCode: 'Secure_url_11blankCheck400',
    qryMongo : {"secure_url_11": { $exists: true, $ne: "" }},
    qryES : {},
    qryObject: (secure_url_11)=>{ return (secure_url_11 == undefined || secure_url_11 == "")}
  },
  {
    columnName : 'secure_url_12',
    errorString: "Secure_Url_12 not found...Please give correct path or remove it from the CSV",
    errorCode: 'Secure_url_12blankCheck400',
    qryMongo : {"secure_url_12": { $exists: true, $ne: "" }},
    qryES : {},
    qryObject: (secure_url_12)=>{ return (secure_url_12 == undefined || secure_url_12 == "")}
  },
  {
    columnName : 'secure_url_13',
    errorString: "Secure_Url_13 not found...Please give correct path or remove it from the CSV",
    errorCode: 'Secure_url_13blankCheck400',
    qryMongo : {"secure_url_13": { $exists: true, $ne: "" }},
    qryES : {},
    qryObject: (secure_url_13)=>{ return (secure_url_13 == undefined || secure_url_13 == "")}
  },
  {
    columnName : 'secure_url_14',
    errorString: "Secure_Url_14 not found...Please give correct path or remove it from the CSV",
    errorCode: 'Secure_url_14blankCheck400',
    qryMongo : {"secure_url_14": { $exists: true, $ne: "" }},
    qryES : {},
    qryObject: (secure_url_14)=>{ return (secure_url_14 == undefined || secure_url_14 == "")}
  },
  {
    columnName : 'secure_url_15',
    errorString: "Secure_Url_15 not found...Please give correct path or remove it from the CSV",
    errorCode: 'Secure_url_15blankCheck400',
    qryMongo : {"secure_url_15": { $exists: true, $ne: "" }},
    qryES : {},
    qryObject: (secure_url_15)=>{ return (secure_url_15 == undefined || secure_url_15 == "")}
  },
  {
    columnName : 'secure_url_16',
    errorString: "Secure_Url_16 not found...Please give correct path or remove it from the CSV",
    errorCode: 'Secure_url_16blankCheck400',
    qryMongo : {"secure_url_16": { $exists: true, $ne: "" }},
    qryES : {},
    qryObject: (secure_url_16)=>{ return (secure_url_16 == undefined || secure_url_16 == "")}
  },
  {
    columnName : 'secure_url_17',
    errorString: "Secure_Url_17 not found...Please give correct path or remove it from the CSV",
    errorCode: 'Secure_url_17blankCheck400',
    qryMongo : {"secure_url_17": { $exists: true, $ne: "" }},
    qryES : {},
    qryObject: (secure_url_17)=>{ return (secure_url_17 == undefined || secure_url_17 == "")}
  },
  {
    columnName: 'secure_url_18',
    errorString: "Secure_Url_18 not found...Please give correct path or remove it from the CSV",
    errorCode: 'Secure_url_18blankCheck400',
    qryMongo: {"secure_url_18": { $exists: true, $ne: "" }},
    qryES : {},
    qryObject: (secure_url_18)=>{ return (secure_url_18 == undefined || secure_url_18 == "")}
  }
];

module.exports = ProductImageRules;
