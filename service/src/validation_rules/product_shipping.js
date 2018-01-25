/*eslint-disable*/
 const ProductShippingRules = [
  {
    columnName : 'sku',
    errorString: "SKU field found blank",
    errorCode: 'SKUblankCheck400',
    qryMongo : {$or:[{"sku":null},{"sku":""}]},
    qryES : {}
  },
  {
    columnName : 'fob_city',
    errorString: "Free_On_Board_City field found blank",
    errorCode: 'Free_On_Board_CityblankCheck400',
    qryMongo : {$or:[{"fob_city":null},{"fob_city":""}]},
    qryES : {}
  },
  {
    columnName : 'fob_state_code',
    errorString: "Free_On_Board_State_Code field found blank",
    errorCode: 'Free_On_Board_State_CodeblankCheck400',
    qryMongo : {$or:[{"fob_state_code":null},{"fob_state_code":""}]},
    qryES : {}
  },
  {
    columnName : 'fob_country_code',
    errorString: "Free_On_Board_Country_Code field found blank",
    errorCode: 'Free_On_Board_Country_CodeblankCheck400',
    qryMongo : {$or:[{"fob_country_code":null},{"fob_country_code":""}]},
    qryES : {}
  },
  {
    columnName : 'fob_zip_code',
    errorString: "Free_On_Board_Zip_Code field found blank",
    errorCode: 'Free_On_Board_Zip_CodeblankCheck400',
    qryMongo : {$or:[{"fob_zip_code":null},{"fob_zip_code":""}]},
    qryES : {}
  },
  {
    columnName : 'shipping_qty_per_carton',
    errorString: "Shipping_Qty_Per_Carton field found blank",
    errorCode: 'Shipping_Qty_Per_CartonblankCheck400',
    qryMongo : {$or:[{"shipping_qty_per_carton":null},{"shipping_qty_per_carton":""}]},
    qryES : {}
  },
  {
      columnName : 'shipping_qty_per_carton',
      errorString: "shipping_qty_per_carton field invalid, please input numeric value",
      errorCode: 'shipping_qty_per_cartonRegEx400',
      qryMongo : {$and:
      [{ "shipping_qty_per_carton": { $exists: true, $ne: null,$type:2 } },
       { "shipping_qty_per_carton" : /[^\d{0,8}(\.\d{0,4})?$]/}
   ]
   }
 },
  {
      columnName : 'carton_length',
      errorString: "carton_length field invalid, please input numeric value",
      errorCode: 'carton_lengthRegEx400',
      qryMongo : {$and:
      [{ "carton_length": { $exists: true, $ne: null,$type:2 } },
       { "carton_length" : /[^\d{0,8}(\.\d{0,4})?$]/}
   ]
   }
 },
 {
   columnName : 'carton_weight_unit',
   errorString: "carton_weight_unit field found blank",
   errorCode: 'Carton_Weight_UnitblankCheck400',
   qryMongo : {$or:[{"carton_weight_unit":null},{"carton_weight_unit":""}]},
   qryES : {}
 },
 {
   columnName : 'product_weight',
   errorString: "product_weight or carton_weight field found blank",
   errorCode: 'Product_WeightOrCarton_WeightblankCheck400',
   qryMongo : {$and:[{$or:[{"carton_weight": null},{"carton_weight": ""}]},{$or:[{"product_weight": null},{"product_weight": ""}]}]}
 },
 {
     columnName : 'qty_1_max',
     errorString: "`qty_1_max` should be greater than `qty_1_min`",
     errorCode: 'qty_1_maxValueCheck400',
     qryMongo : {qty_1_max: {$exists: true,$ne:""},
                 qty_1_min: {$exists: true,$ne:""},
                $where: "this.qty_1_min > this.qty_1_max"},
     qryES : {}
 },
 {
     columnName : 'qty_2_min',
     errorString: "`qty_2_min` should be greater than `qty_1_max`",
     errorCode: 'qty_2_minValueCheck400',
     qryMongo : {qty_2_min: {$exists: true,$ne:""},
                 qty_1_max: {$exists: true,$ne:""},
                $where: "this.qty_1_max > this.qty_2_min"},
     qryES : {}
 },
 {
     columnName : 'qty_2_max',
     errorString: "`qty_2_max` should be greater than `qty_2_min`",
     errorCode: 'qty_2_maxValueCheck400',
     qryMongo : {qty_2_min: {$exists: true,$ne:""},
                 qty_2_max: {$exists: true,$ne:""},
                 $where : "this.qty_2_min > this.qty_2_max"},
     qryES : {}
 },
 {
     columnName : 'qty_3_min',
     errorString: "`qty_3_min` should be greater than `qty_2_max`",
     errorCode: 'qty_3_minValueCheck400',
     qryMongo : {qty_3_min: {$exists: true,$ne:""},
                 qty_2_max: {$exists: true,$ne:""},
                 $where : "this.qty_2_max > this.qty_3_min"},
     qryES : {}
 },
 {
     columnName : 'qty_3_max',
     errorString: "`qty_3_max` should be greater than `qty_3_min`",
     errorCode: 'qty_3_maxValueCheck400',
     qryMongo : {qty_3_min: {$exists: true,$ne:""},
                 qty_3_max: {$exists: true,$ne:""},
                 $where : "this.qty_3_min > this.qty_3_max"},
     qryES : {}
 },
 {
     columnName : 'qty_4_min',
     errorString: "`qty_4_min` should be greater than `qty_3_max`",
     errorCode: 'qty_4_minValueCheck400',
     qryMongo : {qty_4_min: {$exists: true,$ne:""},
                 qty_3_max: {$exists: true,$ne:""},
                 $where : "this.qty_3_max > this.qty_4_min"},
     qryES : {}
 },
 {
     columnName : 'qty_4_max',
     errorString: "`qty_4_max` should be greater than `qty_4_min`",
     errorCode: 'qty_4_maxValueCheck400',
     qryMongo : {qty_4_min: {$exists: true,$ne:""},
                 qty_4_max: {$exists: true,$ne:""},
                 $where : "this.qty_4_min > this.qty_4_max"},
     qryES : {}
 },
 {
     columnName : 'qty_5_min',
     errorString: "`qty_5_min` should be greater than `qty_4_max`",
     errorCode: 'qty_5_minValueCheck400',
     qryMongo : {qty_5_min: {$exists: true,$ne:""},
                 qty_4_max: {$exists: true,$ne:""},
                 $where : "this.qty_4_max > this.qty_5_min"},
     qryES : {}
 },
 {
     columnName : 'qty_5_max',
     errorString: "`qty_5_max` should be greater than `qty_5_min`",
     errorCode: 'qty_5_maxValueCheck400',
     qryMongo : {qty_5_min: {$exists: true,$ne:""},
                 qty_5_max: {$exists: true,$ne:""},
                 $where : "this.qty_5_min > this.qty_5_max"},
     qryES : {}
 },
 {
     columnName : 'qty_6_min',
     errorString: "`qty_6_min` should be greater than `qty_5_max`",
     errorCode: 'qty_6_minValueCheck400',
     qryMongo : {qty_6_min: {$exists: true,$ne:""},
                 qty_5_max: {$exists: true,$ne:""},
                 $where : "this.qty_5_max > this.qty_6_min"},
     qryES : {}
 },
 {
     columnName : 'qty_6_max',
     errorString: "`qty_6_max` should be greater than `qty_6_min`",
     errorCode: 'qty_6_maxValueCheck400',
     qryMongo : {qty_6_min: {$exists: true,$ne:""},
                 qty_6_max: {$exists: true,$ne:""},
                 $where : "this.qty_6_min > this.qty_6_max"},
     qryES : {}
 },
 {
     columnName : 'qty_7_min',
     errorString: "`qty_7_min` should be greater than `qty_6_max`",
     errorCode: 'qty_7_minValueCheck400',
     qryMongo : {qty_7_min: {$exists: true,$ne:""},
                 qty_6_max: {$exists: true,$ne:""},
                 $where : "this.qty_6_max > this.qty_7_min"},
     qryES : {}
 },
 {
     columnName : 'qty_7_max',
     errorString: "`qty_7_max` should be greater than `qty_7_min`",
     errorCode: 'qty_7_maxValueCheck400',
     qryMongo : {qty_7_min: {$exists: true,$ne:""},
                 qty_7_max: {$exists: true,$ne:""},
                 $where : "this.qty_7_min > this.qty_7_max"},
     qryES : {}
 },
 {
     columnName : 'qty_8_min',
     errorString: "`qty_8_min` should be greater than `qty_7_max`",
     errorCode: 'qty_8_minValueCheck400',
     qryMongo : {qty_8_min: {$exists: true,$ne:""},
                 qty_7_max: {$exists: true,$ne:""},
                 $where : "this.qty_7_max > this.qty_8_min"},
     qryES : {}
 },
 {
     columnName : 'qty_8_max',
     errorString: "`qty_8_max` should be greater than `qty_8_min`",
     errorCode: 'qty_8_maxValueCheck400',
     qryMongo : {qty_8_min: {$exists: true,$ne:""},
                 qty_8_max: {$exists: true,$ne:""},
                 $where : "this.qty_8_min > this.qty_8_max"},
     qryES : {}
 },
 {
     columnName : 'qty_9_min',
     errorString: "`qty_9_min` should be greater than `qty_8_max`",
     errorCode: 'qty_9_minValueCheck400',
     qryMongo : {qty_9_min: {$exists: true,$ne:""},
                 qty_8_max: {$exists: true,$ne:""},
                 $where : "this.qty_8_max > this.qty_9_min"},
     qryES : {}
 },
 {
     columnName : 'qty_9_max',
     errorString: "`qty_9_max` should be greater than `qty_9_min`",
     errorCode: 'qty_9_maxValueCheck400',
     qryMongo : {qty_9_min: {$exists: true,$ne:""},
                 qty_9_max: {$exists: true,$ne:""},
                 $where : "this.qty_9_min > this.qty_9_max"},
     qryES : {}
 },
 {
     columnName : 'qty_10_min',
     errorString: "`qty_10_min` should be greater than `qty_9_max`",
     errorCode: 'qty_10_minValueCheck400',
     qryMongo : {qty_10_min: {$exists: true,$ne:""},
                 qty_9_max: {$exists: true,$ne:""},
                 $where : "this.qty_9_max > this.qty_10_min"},
     qryES : {}
 },
 {
     columnName : 'qty_10_max',
     errorString: "`qty_10_max` should be greater than `qty_10_min`",
     errorCode: 'qty_10_maxValueCheck400',
     qryMongo : {qty_10_min: {$exists: true,$ne:""},
                 qty_10_max: {$exists: true,$ne:""},
                 $where : "this.qty_10_min > this.qty_10_max"},
     qryES : {}
 }
];

module.exports = ProductShippingRules;
