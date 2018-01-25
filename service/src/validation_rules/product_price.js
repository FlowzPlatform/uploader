/*eslint-disable*/
const ProductPriceRules = [
  {
        columnName : 'sku',
        errorString: "SKU field found blank",
        errorCode: 'SKUblankCheck400',
        qryMongo : {$or:[{"sku":null},{"sku":""}]},
        qryES : {}
    },
    {
        columnName : 'price_type',
        errorString: "Price Type field found blank",
        errorCode: 'Price_TypeblankCheck400',
        qryMongo : {$or:[{"price_type":null},{"price_type":""}]},
        qryES : {}
    },
    {
        columnName : 'type',
        errorString: "Type field found blank",
        errorCode: 'TypeblankCheck400',
        qryMongo : {$or:[{"type":null},{"type":""}]},
        qryES : {}
    },
    {
        columnName : 'global_price_type',
        errorString: "global price type field found blank",
        errorCode: 'Global_Price_TypeblankCheck400',
        qryMongo : {$or:[{"global_price_type":null},{"global_price_type":""}]},
        qryES : {}
    },
    {
        columnName : 'price_unit',
        errorString: "price unit field found blank",
        errorCode: 'Price_UnitblankCheck400',
        qryMongo : {$or:[{"price_unit":null},{"price_unit":""}]},
        qryES : {}
    },
    {
        columnName : 'qty_1_min',
        errorString: "Product qty field found blank",
        errorCode: 'Product_QtyblankCheck400',
        qryMongo : {$or:[{"qty_1_min":null},{"qty_1_min":""}]},
        qryES : {}
    },
    {
      columnName : 'qty_1_max',
      errorString: "qty_1_max field found blank",
      errorCode: 'qty_1_maxblankCheck400',
      qryMongo : {$or:[{"qty_1_max":null},{"qty_1_max":""}]},
      qryES : {}
    },
    {
      columnName : 'qty_1_max',
      errorString: "`qty_1_max` should be greater than `qty_1_min`",
      errorCode: 'qty_1_maxValueCheck400',
      qryMongo : {$where : "this.qty_1_min > this.qty_1_max"},
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
    },
    {
        columnName : 'qty_11_min',
        errorString: "`qty_11_min` should be greater than `qty_10_max`",
        errorCode: 'qty_11_minValueCheck400',
        qryMongo : {qty_11_min: {$exists: true,$ne:""},
                    qty_10_max: {$exists: true,$ne:""},
                    $where : "this.qty_10_max > this.qty_11_min"},
        qryES : {}
    },
    {
        columnName : 'qty_11_max',
        errorString: "`qty_11_max` should be greater than `qty_11_min`",
        errorCode: 'qty_11_maxValueCheck400',
        qryMongo : {qty_11_min: {$exists: true,$ne:""},
                    qty_11_max: {$exists: true,$ne:""},
                    $where : "this.qty_11_min > this.qty_11_max"},
        qryES : {}
    },
    {
        columnName : 'qty_12_min',
        errorString: "`qty_12_min` should be greater than `qty_11_max`",
        errorCode: 'qty_12_minValueCheck400',
        qryMongo : {qty_12_min: {$exists: true,$ne:""},
                    qty_11_max: {$exists: true,$ne:""},
                    $where : "this.qty_11_max > this.qty_12_min"},
        qryES : {}
    },
    {
        columnName : 'qty_12_max',
        errorString: "`qty_12_max` should be greater than `qty_12_min`",
        errorCode: 'qty_12_maxValueCheck400',
        qryMongo : {qty_12_min: {$exists: true,$ne:""},
                    qty_12_max: {$exists: true,$ne:""},
                    $where : "this.qty_12_min > this.qty_12_max"},
        qryES : {}
    },
    {
        columnName : 'qty_13_min',
        errorString: "`qty_13_min` should be greater than `qty_12_max`",
        errorCode: 'qty_13_minValueCheck400',
        qryMongo : {qty_13_min: {$exists: true,$ne:""},
                    qty_12_max: {$exists: true,$ne:""},
                    $where : "this.qty_12_max > this.qty_13_min"},
        qryES : {}
    },
    {
        columnName : 'qty_13_max',
        errorString: "`qty_13_max` should be greater than `qty_13_min`",
        errorCode: 'qty_13_maxValueCheck400',
        qryMongo : {qty_13_min: {$exists: true,$ne:""},
                    qty_13_max: {$exists: true,$ne:""},
                    $where : "this.qty_13_min > this.qty_13_max"},
        qryES : {}
    },
    {
        columnName : 'qty_14_min',
        errorString: "`qty_14_min` should be greater than `qty_13_max`",
        errorCode: 'qty_14_minValueCheck400',
        qryMongo : {qty_14_min: {$exists: true,$ne:""},
                    qty_13_max: {$exists: true,$ne:""},
                    $where : "this.qty_13_max > this.qty_14_min"},
        qryES : {}
    },
    {
        columnName : 'qty_14_max',
        errorString: "`qty_14_max` should be greater than `qty_14_min`",
        errorCode: 'qty_14_maxValueCheck400',
        qryMongo : {qty_14_min: {$exists: true,$ne:""},
                    qty_14_max: {$exists: true,$ne:""},
                    $where : "this.qty_14_min > this.qty_14_max"},
        qryES : {}
    },
    {
        columnName : 'qty_15_min',
        errorString: "`qty_15_min` should be greater than `qty_14_max`",
        errorCode: 'qty_15_minValueCheck400',
        qryMongo : {qty_15_min: {$exists: true,$ne:""},
                    qty_14_max: {$exists: true,$ne:""},
                    $where : "this.qty_14_max > this.qty_15_min"},
        qryES : {}
    },
    {
        columnName : 'qty_15_max',
        errorString: "`qty_15_max` should be greater than `qty_15_min`",
        errorCode: 'qty_15_maxValueCheck400',
        qryMongo : {qty_15_min: {$exists: true,$ne:""},
                    qty_15_max: {$exists: true,$ne:""},
                    $where : "this.qty_15_min > this.qty_15_max"},
        qryES : {}
    },
    {
        columnName : 'price_1',
        errorString: "Price_1 field found blank",
        errorCode: 'price_1blankCheck400',
        qryMongo : {$or:[{"price_1":null},{"price_1":""}]},
        qryES : {}
    },
    {
        columnName : 'price_1',
        errorString: "price_1 field invalid, please input numeric value",
        errorCode: 'price_1RegEx400',
        qryMongo : {$and:
        [{ "price_1": { $exists: true, $ne: null,$type:2}},
         { "price_1" : /[^\d{0,8}(\.\d{0,4})?$]/}
     ]
     }
   },
   {
       columnName : 'price_2',
       errorString: "price_2 field invalid, please input numeric value",
       errorCode: 'price_2RegEx400',
       qryMongo : {$and:
       [{ "price_2": { $exists: true, $ne: null,$type:2}},
        { "price_2" : /[^\d{0,8}(\.\d{0,4})?$]/}
    ]
    }
  },
  {
      columnName : 'price_3',
      errorString: "price_3 field invalid, please input numeric value",
      errorCode: 'price_3RegEx400',
      qryMongo : {$and:
      [{ "price_3": { $exists: true, $ne: null,$type:2}},
       { "price_3" : /[^\d{0,8}(\.\d{0,4})?$]/}
   ]
   }
  },
  {
      columnName : 'price_4',
      errorString: "price_4 field invalid, please input numeric value",
      errorCode: 'price_4RegEx400',
      qryMongo : {$and:
      [{ "price_4": { $exists: true,$ne: null, $type:2}},
       { "price_4" : /[^\d{0,8}(\.\d{0,4})?$]/}
   ]
   }
  },
  {
      columnName : 'price_5',
      errorString: "price_5 field invalid, please input numeric value",
      errorCode: 'price_5RegEx400',
      qryMongo : {$and:
      [{ "price_5": { $exists: true, $ne: null,$type:2}},
       { "price_5" : /[^\d{0,8}(\.\d{0,4})?$]/}
   ]
   }
  },
  {
      columnName : 'price_6',
      errorString: "price_6 field invalid, please input numeric value",
      errorCode: 'price_6RegEx400',
      qryMongo : {$and:
      [{ "price_6": { $exists: true, $ne: null,$type:2}},
       { "price_6" : /[^\d{0,8}(\.\d{0,4})?$]/}
   ]
   }
  },
  {
      columnName : 'price_7',
      errorString: "price_7 field invalid, please input numeric value",
      errorCode: 'price_7RegEx400',
      qryMongo : {$and:
      [{ "price_7": { $exists: true, $ne: null,$type:2}},
       { "price_7" :  /[^\d{0,8}(\.\d{0,4})?$]/}
   ]
   }
  },
  {
      columnName : 'price_8',
      errorString: "price_8 field invalid, please input numeric value",
      errorCode: 'price_8RegEx400',
      qryMongo : {$and:
      [{ "price_8": { $exists: true, $ne: null,$type:2}},
       { "price_8" : /[^\d{0,8}(\.\d{0,4})?$]/}
   ]
   }
  },
  {
      columnName : 'price_9',
      errorString: "price_9 field invalid, please input numeric value",
      errorCode: 'price_9RegEx400',
      qryMongo : {$and:
      [{ "price_9": { $exists: true, $ne: null,$type:2}},
       { "price_9" : /[^\d{0,8}(\.\d{0,4})?$]/}
   ]
   }
  },
  {
      columnName : 'price_10',
      errorString: "price_10 field invalid, please input numeric value",
      errorCode: 'price_10RegEx400',
      qryMongo : {$and:
      [{ "price_10": { $exists: true, $ne: null ,$type:2}},
       { "price_10" : /[^\d{0,8}(\.\d{0,4})?$]/}
   ]
   }
  },
  {
      columnName : 'price_11',
      errorString: "price_11 field invalid, please input numeric value",
      errorCode: 'price_11RegEx400',
      qryMongo : {$and:
      [{ "price_11": { $exists: true,$ne: null,$type:2}},
       { "price_11" : /[^\d{0,8}(\.\d{0,4})?$]/}
   ]
   }
  },
  {
      columnName : 'price_12',
      errorString: "price_12 field invalid, please input numeric value",
      errorCode: 'price_12RegEx400',
      qryMongo : {$and:
      [{ "price_12": { $exists: true, $ne: null,$type:2}},
       { "price_12" : /[^\d{0,8}(\.\d{0,4})?$]/}
   ]
   }
  },
  {
      columnName : 'price_13',
      errorString: "price_13 field invalid, please input numeric value",
      errorCode: 'price_13RegEx400',
      qryMongo : {$and:
      [{ "price_13": { $exists: true, $ne: null,$type:2}},
       { "price_13" : /[^\d{0,8}(\.\d{0,4})?$]/}
   ]
   }
  },
  {
      columnName : 'price_14',
      errorString: "price_14 field invalid, please input numeric value",
      errorCode: 'price_14RegEx400',
      qryMongo : {$and:
      [{ "price_14": { $exists: true, $ne: null,$type:2}},
       { "price_14" : /[^\d{0,8}(\.\d{0,4})?$]/}
   ]
   }
  },
  {
      columnName : 'price_15',
      errorString: "price_15 field invalid, please input numeric value",
      errorCode: 'price_15RegEx400',
      qryMongo : {$and:
      [{ "price_15": { $exists: true, $ne: null,$type:2}},
       { "price_15" :  /[^\d{0,8}(\.\d{0,4})?$]/}
   ]
   }
  }
];
module.exports = ProductPriceRules;
