/*eslint-disable*/
const ProductPriceRules = [
  {
        columnName : 'sku',
        errorString: "SKU field found blank",
        errorCode: 'SKUblankCheck400',
        qryMongo : {$or:[{"sku":null},{"sku":""}]},
        qryES : {},
        qryObject: (sku)=>{ return (sku == null || sku == "")}
    },
    {
        columnName : 'price_type',
        errorString: "Price Type field found blank",
        errorCode: 'Price_TypeblankCheck400',
        qryMongo : {$or:[{"price_type":null},{"price_type":""}]},
        qryES : {},
        qryObject: (price_type)=>{ return (price_type == null || price_type == "")}
    },
    {
        columnName : 'price_type',
        errorString: "price_type field invalid, cannot contain numeric value and special characters",
        errorCode: 'price_TypeRegEx400',
        qryMongo : {$and:
        [{ "price_type": { $exists: true, $ne: null}},
         { "price_type" :  /[^a-zA-Z_]$/}
     ]
     },
        qryES : {},
        qryObject: (price_type)=>{ let regExp = new RegExp(/[^a-zA-Z_]$/); if (price_type == undefined || price_type == "") { return true } else if(regExp.test(price_type)) { return true } else { return false } }
    },
    {
        columnName : 'type',
        errorString: "Type field found blank",
        errorCode: 'TypeblankCheck400',
        qryMongo : {$or:[{"type":null},{"type":""}]},
        qryES : {},
        qryObject: (type)=>{ return (type == null || type == "")}
    },
    {
        columnName : 'global_price_type',
        errorString: "global price type field found blank",
        errorCode: 'Global_Price_TypeblankCheck400',
        qryMongo : {$or:[{"global_price_type":null},{"global_price_type":""}]},
        qryES : {},
        qryObject: (global_price_type)=>{ return (global_price_type == null || global_price_type == "")}
    },
    {
        columnName : 'global_price_type',
        errorString: "global_price_type field invalid, cannot contain numeric value and special characters",
        errorCode: 'global_price_typeRegEx400',
        qryMongo : {$and:
        [{ "global_price_type": { $exists: true, $ne: null}},
         { "global_price_type" :  /[^a-zA-Z_]$/}
     ]
     },
        qryES : {},
        qryObject: (global_price_type)=>{ let regExp = new RegExp(/[^a-zA-Z_]$/); if (global_price_type == undefined || global_price_type == "") { return true } else if(regExp.test(global_price_type)) { return true } else { return false } }
    },
    {
        columnName : 'price_unit',
        errorString: "price unit field found blank",
        errorCode: 'Price_UnitblankCheck400',
        qryMongo : {$or:[{"price_unit":null},{"price_unit":""}]},
        qryES : {},
        qryObject: (price_unit)=>{ return (price_unit == null || price_unit == "")}
    },
    {
        columnName : 'price_unit',
        errorString: "price_unit field invalid, cannot contain numeric value and special characters",
        errorCode: 'price_unitRegEx400',
        qryMongo : {$and:
        [{ "price_unit": { $exists: true, $ne: null}},
         { "price_unit" :  /[^a-zA-Z]$/}
     ]
     },
        qryES : {},
        qryObject: (price_unit)=>{ let regExp = new RegExp(/[^a-zA-Z]$/); if (price_unit == undefined || price_unit == "") { return true } else if(regExp.test(price_unit)) { return true } else { return false } }
    },
    {
        columnName : 'qty_1_min',
        errorString: "Product qty field found blank",
        errorCode: 'Product_QtyblankCheck400',
        qryMongo : {$or:[{"qty_1_min":null},{"qty_1_min":""}]},
        qryES : {},
        qryObject: (qty_1_min)=>{ return (qty_1_min == null || qty_1_min == "")}
    },
    {
      columnName : 'qty_1_max',
      errorString: "qty_1_max field found blank",
      errorCode: 'qty_1_maxblankCheck400',
      qryMongo : {$and: [{"qty_2_min": {$exists: true,$ne:""}},
       {$or:[{"qty_1_max":null},{"qty_1_max":""}]}]},
      qryES : {},
      qryObject: (qty_1_min, qty_1_max, qty_2_min)=>{ if (qty_2_min == undefined || qty_2_min == "") { return true } else if (qty_1_max == null || qty_1_max == "") { return true} else { return false }}
    },
    {
      columnName : 'qty_1_max',
      errorString: "`qty_1_max` should be greater than `qty_1_min`",
      errorCode: 'qty_1_maxValueCheck400',
      qryMongo : {qty_1_max: {$exists: true,$ne:""},
        $where : "this.qty_1_min > this.qty_1_max"},
      qryES : {},
      qryObject: (qty_1_min, qty_1_max, qty_2_min)=>{ if (qty_1_max == undefined || qty_1_max == "") { return true } else if (qty_1_min > qty_1_max) { return true } else { return false }}
    },
    {
        columnName : 'qty_2_min',
        errorString: "`qty_2_min` should be greater than `qty_1_max`",
        errorCode: 'qty_2_minValueCheck400',
        qryMongo : {qty_2_min: {$exists: true,$ne:""},
                    qty_1_max: {$exists: true,$ne:""},
                   $where: "this.qty_1_max > this.qty_2_min"},
        qryES : {},
        qryObject: (qty_1_max, qty_2_min)=>{ if (qty_1_max == undefined || qty_1_max == "") { return true } else if (qty_2_min == undefined || qty_2_min == "") { return true } else if (qty_1_max > qty_2_min) { return true } else { return false }}
    },
    {
        columnName : 'qty_2_max',
        errorString: "`qty_2_max` should be greater than `qty_2_min`",
        errorCode: 'qty_2_maxValueCheck400',
        qryMongo : {qty_2_min: {$exists: true,$ne:""},
                    qty_2_max: {$exists: true,$ne:""},
                    $where : "this.qty_2_min > this.qty_2_max"},
        qryES : {},
        qryObject: (qty_2_min, qty_2_max)=>{ if (qty_2_min == undefined || qty_2_min == "") { return true } else if (qty_2_max == undefined || qty_2_max == "") { return true } else if (qty_2_min > qty_2_max) { return true } else { return false }}
    },
    {
        columnName : 'qty_3_min',
        errorString: "`qty_3_min` should be greater than `qty_2_max`",
        errorCode: 'qty_3_minValueCheck400',
        qryMongo : {qty_3_min: {$exists: true,$ne:""},
                    qty_2_max: {$exists: true,$ne:""},
                    $where : "this.qty_2_max > this.qty_3_min"},
        qryES : {},
        qryObject: (qty_2_max, qty_3_min)=>{ if (qty_2_max == undefined || qty_2_max == "") { return true } else if (qty_3_min == undefined || qty_3_min == "") { return true } else if (qty_2_max > qty_3_min) { return true; } else { return false; }}
    },
    {
        columnName : 'qty_3_max',
        errorString: "`qty_3_max` should be greater than `qty_3_min`",
        errorCode: 'qty_3_maxValueCheck400',
        qryMongo : {qty_3_min: {$exists: true,$ne:""},
                    qty_3_max: {$exists: true,$ne:""},
                    $where : "this.qty_3_min > this.qty_3_max"},
        qryES : {},
        qryObject: (qty_3_min, qty_3_max)=>{ if (qty_3_min == undefined || qty_3_min == "") { return true } else if (qty_3_max == undefined || qty_3_max == "") { return true } else if (qty_3_min > qty_3_max) { return true; } else { return false; }}
    },
    {
        columnName : 'qty_4_min',
        errorString: "`qty_4_min` should be greater than `qty_3_max`",
        errorCode: 'qty_4_minValueCheck400',
        qryMongo : {qty_4_min: {$exists: true,$ne:""},
                    qty_3_max: {$exists: true,$ne:""},
                    $where : "this.qty_3_max > this.qty_4_min"},
        qryES : {},
        qryObject: (qty_3_max, qty_4_min)=>{ if (qty_4_min == undefined || qty_4_min == "") { return true } else if (qty_3_max == undefined || qty_3_max == "") { return true } else if (qty_3_max > qty_4_min) { return true; } else { return false; }}
    },
    {
        columnName : 'qty_4_max',
        errorString: "`qty_4_max` should be greater than `qty_4_min`",
        errorCode: 'qty_4_maxValueCheck400',
        qryMongo : {qty_4_min: {$exists: true,$ne:""},
                    qty_4_max: {$exists: true,$ne:""},
                    $where : "this.qty_4_min > this.qty_4_max"},
        qryES : {},
        qryObject: (qty_4_min, qty_4_max)=>{ if (qty_4_max == undefined || qty_4_max == "") { return true } else if (qty_4_min == undefined || qty_4_min == "") { return true } else if (qty_4_min > qty_4_max) { return true; } else { return false; }}
    },
    {
        columnName : 'qty_5_min',
        errorString: "`qty_5_min` should be greater than `qty_4_max`",
        errorCode: 'qty_5_minValueCheck400',
        qryMongo : {qty_5_min: {$exists: true,$ne:""},
                    qty_4_max: {$exists: true,$ne:""},
                    $where : "this.qty_4_max > this.qty_5_min"},
        qryES : {},
        qryObject: (qty_4_max, qty_5_min)=>{ if (qty_4_max == undefined || qty_4_max == "") { return true } else if (qty_5_min == undefined || qty_5_min == "") { return true } else if (qty_4_max > qty_5_min) { return true; } else { return false; }}
    },
    {
        columnName : 'qty_5_max',
        errorString: "`qty_5_max` should be greater than `qty_5_min`",
        errorCode: 'qty_5_maxValueCheck400',
        qryMongo : {qty_5_min: {$exists: true,$ne:""},
                    qty_5_max: {$exists: true,$ne:""},
                    $where : "this.qty_5_min > this.qty_5_max"},
        qryES : {},
        qryObject: (qty_5_min, qty_5_max)=>{ if (qty_5_min == undefined || qty_5_min == "") { return true } else if (qty_5_max == undefined || qty_5_max == "") { return true } else if (qty_5_min > qty_5_max) { return true; } else { return false; }}
    },
    {
        columnName : 'qty_6_min',
        errorString: "`qty_6_min` should be greater than `qty_5_max`",
        errorCode: 'qty_6_minValueCheck400',
        qryMongo : {qty_6_min: {$exists: true,$ne:""},
                    qty_5_max: {$exists: true,$ne:""},
                    $where : "this.qty_5_max > this.qty_6_min"},
        qryES : {},
        qryObject: (qty_5_max, qty_6_min)=>{ if (qty_5_max == undefined || qty_5_max == "") { return true } else if (qty_6_min == undefined || qty_6_min == "") { return true } else if (qty_5_max > qty_6_min) { return true; } else { return false; }}
    },
    {
        columnName : 'qty_6_max',
        errorString: "`qty_6_max` should be greater than `qty_6_min`",
        errorCode: 'qty_6_maxValueCheck400',
        qryMongo : {qty_6_min: {$exists: true,$ne:""},
                    qty_6_max: {$exists: true,$ne:""},
                    $where : "this.qty_6_min > this.qty_6_max"},
        qryES : {},
        qryObject: (qty_6_min, qty_6_max)=>{ if (qty_6_max == undefined || qty_6_max == "") { return true } else if (qty_6_min == undefined || qty_6_min == "") { return true } else if (qty_6_min > qty_6_max) { return true; } else { return false; }}
    },
    {
        columnName : 'qty_7_min',
        errorString: "`qty_7_min` should be greater than `qty_6_max`",
        errorCode: 'qty_7_minValueCheck400',
        qryMongo : {qty_7_min: {$exists: true,$ne:""},
                    qty_6_max: {$exists: true,$ne:""},
                    $where : "this.qty_6_max > this.qty_7_min"},
        qryES : {},
        qryObject: (qty_6_max, qty_7_min)=>{ if (qty_6_max == undefined || qty_6_max == "") { return true } else if (qty_6_min == undefined || qty_6_min == "") { return true } else if (qty_6_max > qty_7_min) { return true; } else { return false; }}
    },
    {
        columnName : 'qty_7_max',
        errorString: "`qty_7_max` should be greater than `qty_7_min`",
        errorCode: 'qty_7_maxValueCheck400',
        qryMongo : {qty_7_min: {$exists: true,$ne:""},
                    qty_7_max: {$exists: true,$ne:""},
                    $where : "this.qty_7_min > this.qty_7_max"},
        qryES : {},
        qryObject: (qty_7_min, qty_7_max)=>{ if (qty_7_min == undefined || qty_7_min == "") { return true } else if (qty_7_max == undefined || qty_7_max == "") { return true } else if (qty_7_min > qty_7_max) { return true; } else { return false; }}
    },
    {
        columnName : 'qty_8_min',
        errorString: "`qty_8_min` should be greater than `qty_7_max`",
        errorCode: 'qty_8_minValueCheck400',
        qryMongo : {qty_8_min: {$exists: true,$ne:""},
                    qty_7_max: {$exists: true,$ne:""},
                    $where : "this.qty_7_max > this.qty_8_min"},
        qryES : {},
        qryObject: (qty_7_max, qty_8_min)=>{ if (qty_8_min == undefined || qty_8_min == "") { return true } else if (qty_7_max == undefined || qty_7_max == "") { return true } else if (qty_7_max > qty_8_min) { return true; } else { return false; }}
    },
    {
        columnName : 'qty_8_max',
        errorString: "`qty_8_max` should be greater than `qty_8_min`",
        errorCode: 'qty_8_maxValueCheck400',
        qryMongo : {qty_8_min: {$exists: true,$ne:""},
                    qty_8_max: {$exists: true,$ne:""},
                    $where : "this.qty_8_min > this.qty_8_max"},
        qryES : {},
        qryObject: (qty_8_min, qty_8_max)=>{ if (qty_8_min == undefined || qty_8_min == "") { return true } else if (qty_8_max == undefined || qty_8_max == "") { return true } else if (qty_8_min > qty_8_max) { return true; } else { return false; }}
    },
    {
        columnName : 'qty_9_min',
        errorString: "`qty_9_min` should be greater than `qty_8_max`",
        errorCode: 'qty_9_minValueCheck400',
        qryMongo : {qty_9_min: {$exists: true,$ne:""},
                    qty_8_max: {$exists: true,$ne:""},
                    $where : "this.qty_8_max > this.qty_9_min"},
        qryES : {},
        qryObject: (qty_8_max, qty_9_min)=>{ if (qty_8_max == undefined || qty_8_max == "") { return true } else if (qty_9_min == undefined || qty_9_min == "") { return true } else if (qty_8_max > qty_9_min) { return true; } else { return false; }}
    },
    {
        columnName : 'qty_9_max',
        errorString: "`qty_9_max` should be greater than `qty_9_min`",
        errorCode: 'qty_9_maxValueCheck400',
        qryMongo : {qty_9_min: {$exists: true,$ne:""},
                    qty_9_max: {$exists: true,$ne:""},
                    $where : "this.qty_9_min > this.qty_9_max"},
        qryES : {},
        qryObject: (qty_9_min, qty_9_max)=>{ if (qty_9_min == undefined || qty_9_min == "") { return true } else if (qty_9_max == undefined || qty_9_max == "") { return true } else if (qty_9_min > qty_9_max) { return true; } else { return false; }}
    },
    {
        columnName : 'qty_10_min',
        errorString: "`qty_10_min` should be greater than `qty_9_max`",
        errorCode: 'qty_10_minValueCheck400',
        qryMongo : {qty_10_min: {$exists: true,$ne:""},
                    qty_9_max: {$exists: true,$ne:""},
                    $where : "this.qty_9_max > this.qty_10_min"},
        qryES : {},
        qryObject: (qty_9_max, qty_10_min)=>{ if (qty_9_max == undefined || qty_9_max == "") { return true } else if (qty_10_min == undefined || qty_10_min == "") { return true } else if (qty_9_max > qty_10_min) { return true; } else { return false; }}
    },
    {
        columnName : 'qty_10_max',
        errorString: "`qty_10_max` should be greater than `qty_10_min`",
        errorCode: 'qty_10_maxValueCheck400',
        qryMongo : {qty_10_min: {$exists: true,$ne:""},
                    qty_10_max: {$exists: true,$ne:""},
                    $where : "this.qty_10_min > this.qty_10_max"},
        qryES : {},
        qryObject: (qty_10_min, qty_10_max)=>{ if (qty_10_min == undefined || qty_10_min == "") { return true } else if (qty_10_max == undefined || qty_10_max == "") { return true } else if (qty_10_min > qty_10_max) { return true; } else { return false; }}
    },
    {
        columnName : 'qty_11_min',
        errorString: "`qty_11_min` should be greater than `qty_10_max`",
        errorCode: 'qty_11_minValueCheck400',
        qryMongo : {qty_11_min: {$exists: true,$ne:""},
                    qty_10_max: {$exists: true,$ne:""},
                    $where : "this.qty_10_max > this.qty_11_min"},
        qryES : {},
        qryObject: (qty_10_max, qty_11_min)=>{ if (qty_10_max == undefined || qty_10_max == "") { return true } else if (qty_11_min == undefined || qty_11_min == "") { return true } else if (qty_10_max > qty_11_min) { return true; } else { return false; }}
    },
    {
        columnName : 'qty_11_max',
        errorString: "`qty_11_max` should be greater than `qty_11_min`",
        errorCode: 'qty_11_maxValueCheck400',
        qryMongo : {qty_11_min: {$exists: true,$ne:""},
                    qty_11_max: {$exists: true,$ne:""},
                    $where : "this.qty_11_min > this.qty_11_max"},
        qryES : {},
        qryObject: (qty_11_min, qty_11_max)=>{ if (qty_11_min == undefined || qty_11_min == "") { return true } else if (qty_11_max == undefined || qty_11_max == "") { return true } else if (qty_11_min > qty_11_max) { return true; } else { return false; }}
    },
    {
        columnName : 'qty_12_min',
        errorString: "`qty_12_min` should be greater than `qty_11_max`",
        errorCode: 'qty_12_minValueCheck400',
        qryMongo : {qty_12_min: {$exists: true,$ne:""},
                    qty_11_max: {$exists: true,$ne:""},
                    $where : "this.qty_11_max > this.qty_12_min"},
        qryES : {},
        qryObject: (qty_11_max, qty_12_min)=>{ if (qty_12_min == undefined || qty_12_min == "") { return true } else if (qty_11_max == undefined || qty_11_max == "") { return true } else if (qty_11_max > qty_12_min) { return true; } else { return false; }}
    },
    {
        columnName : 'qty_12_max',
        errorString: "`qty_12_max` should be greater than `qty_12_min`",
        errorCode: 'qty_12_maxValueCheck400',
        qryMongo : {qty_12_min: {$exists: true,$ne:""},
                    qty_12_max: {$exists: true,$ne:""},
                    $where : "this.qty_12_min > this.qty_12_max"},
        qryES : {},
        qryObject: (qty_12_min, qty_12_max)=>{ if (qty_12_min == undefined || qty_12_min == "") { return true } else if (qty_12_max == undefined || qty_12_max == "") { return true } else if (qty_12_min > qty_12_max) { return true; } else { return false; }}
    },
    {
        columnName : 'qty_13_min',
        errorString: "`qty_13_min` should be greater than `qty_12_max`",
        errorCode: 'qty_13_minValueCheck400',
        qryMongo : {qty_13_min: {$exists: true,$ne:""},
                    qty_12_max: {$exists: true,$ne:""},
                    $where : "this.qty_12_max > this.qty_13_min"},
        qryES : {},
        qryObject: (qty_12_max, qty_13_min)=>{ if (qty_12_max == undefined || qty_12_max == "") { return true } else if (qty_13_min == undefined || qty_13_min == "") { return true } else if (qty_12_max > qty_13_min) { return true; } else { return false; }}
    },
    {
        columnName : 'qty_13_max',
        errorString: "`qty_13_max` should be greater than `qty_13_min`",
        errorCode: 'qty_13_maxValueCheck400',
        qryMongo : {qty_13_min: {$exists: true,$ne:""},
                    qty_13_max: {$exists: true,$ne:""},
                    $where : "this.qty_13_min > this.qty_13_max"},
        qryES : {},
        qryObject: (qty_13_min, qty_13_max)=>{ if (qty_13_max == undefined || qty_13_max == "") { return true } else if (qty_13_min == undefined || qty_13_min == "") { return true } else if (qty_13_min > qty_13_max) { return true; } else { return false; }}
    },
    {
        columnName : 'qty_14_min',
        errorString: "`qty_14_min` should be greater than `qty_13_max`",
        errorCode: 'qty_14_minValueCheck400',
        qryMongo : {qty_14_min: {$exists: true,$ne:""},
                    qty_13_max: {$exists: true,$ne:""},
                    $where : "this.qty_13_max > this.qty_14_min"},
        qryES : {},
        qryObject: (qty_13_max, qty_14_min)=>{ if (qty_13_max == undefined || qty_13_max == "") { return true } else if (qty_14_min == undefined || qty_14_min == "") { return true } else if (qty_13_max > qty_14_min) { return true; } else { return false; }}
    },
    {
        columnName : 'qty_14_max',
        errorString: "`qty_14_max` should be greater than `qty_14_min`",
        errorCode: 'qty_14_maxValueCheck400',
        qryMongo : {qty_14_min: {$exists: true,$ne:""},
                    qty_14_max: {$exists: true,$ne:""},
                    $where : "this.qty_14_min > this.qty_14_max"},
        qryES : {},
        qryObject: (qty_14_min, qty_14_max)=>{ if (qty_14_max == undefined || qty_14_max == "") { return true } else if (qty_14_min == undefined || qty_14_min == "") { return true } else if (qty_14_min > qty_14_max) { return true; } else { return false; }}
    },
    {
        columnName : 'qty_15_min',
        errorString: "`qty_15_min` should be greater than `qty_14_max`",
        errorCode: 'qty_15_minValueCheck400',
        qryMongo : {qty_15_min: {$exists: true,$ne:""},
                    qty_14_max: {$exists: true,$ne:""},
                    $where : "this.qty_14_max > this.qty_15_min"},
        qryES : {},
        qryObject: (qty_14_max, qty_15_min)=>{ if (qty_14_max == undefined || qty_14_max == "") { return true } else if (qty_15_min == undefined || qty_15_min == "") { return true } else if (qty_14_max > qty_15_min) { return true; } else { return false; }}
    },
    {
        columnName : 'qty_15_max',
        errorString: "`qty_15_max` should be greater than `qty_15_min`",
        errorCode: 'qty_15_maxValueCheck400',
        qryMongo : {qty_15_min: {$exists: true,$ne:""},
                    qty_15_max: {$exists: true,$ne:""},
                    $where : "this.qty_15_min > this.qty_15_max"},
        qryES : {},
        qryObject: (qty_15_min, qty_15_max)=>{ if (qty_15_max == undefined || qty_15_max == "") { return true } else if (qty_15_min == undefined || qty_15_min == "") { return true } else if (qty_15_min > qty_15_max) { return true; } else { return false; }}
    },
    {
        columnName : 'price_1',
        errorString: "Price_1 field found blank",
        errorCode: 'price_1blankCheck400',
        qryMongo : {$and: [{"qty_1_min": {$exists: true,$ne:""}},
         {$or:[{"price_1":null},{"price_1":""}]}]},
        qryES : {},
        qryObject: (qty_1_min, price_1)=>{ if (qty_1_min == undefined || qty_1_min == "") { return true } else if (price_1 == null || price_1 == "") { return true } else { return false }}
    },
    {
        columnName : 'price_1',
        errorString: "price_1 field invalid, please input numeric value",
        errorCode: 'price_1RegEx400',
        qryMongo : {$and: [{ "price_1": { $exists: true, $ne: null,$type:2}},
         { "price_1" : /[^\d{0,8}(\.\d{0,4})?$]/}]},
        qryObject: (qty_1_min, price_1)=>{ let regExp = new RegExp(/[^\d{0,8}(\.\d{0,4})?$]/); if (price_1 == undefined || price_1 == '' || isNaN(price_1)) { return true; } else if (regExp.test(price_1)) { return true; } else { return false; }}
   },
   {
       columnName : 'price_2',
       errorString: "price_2 field invalid, please input numeric value",
       errorCode: 'price_2RegEx400',
       qryMongo : {$and: [{ "price_2": { $exists: true, $ne: null,$type:2}},
        { "price_2" : /[^\d{0,8}(\.\d{0,4})?$]/}]},
       qryObject: (price_2)=>{ let regExp = new RegExp(/[^\d{0,8}(\.\d{0,4})?$]/); if (price_2 == undefined || price_2 == '' || isNaN(price_2)) { return true; } else if (regExp.test(price_2)) { return true; } else { return false; }}
  },
  {
      columnName : 'price_3',
      errorString: "price_3 field invalid, please input numeric value",
      errorCode: 'price_3RegEx400',
      qryMongo : {$and: [{ "price_3": { $exists: true, $ne: null,$type:2}},
       { "price_3" : /[^\d{0,8}(\.\d{0,4})?$]/}]},
      qryObject: (price_3)=>{ let regExp = new RegExp(/[^\d{0,8}(\.\d{0,4})?$]/); if (price_3 == undefined || price_3 == '' || isNaN(price_3)) { return true; } else if (regExp.test(price_3)) { return true; } else { return false; }}
  },
  {
      columnName : 'price_4',
      errorString: "price_4 field invalid, please input numeric value",
      errorCode: 'price_4RegEx400',
      qryMongo : {$and: [{ "price_4": { $exists: true,$ne: null, $type:2}},
       { "price_4" : /[^\d{0,8}(\.\d{0,4})?$]/}]},
      qryObject: (price_4)=>{ let regExp = new RegExp(/[^\d{0,8}(\.\d{0,4})?$]/); if (price_4 == undefined || price_4 == '' || isNaN(price_4)) { return true; } else if (regExp.test(price_4)) { return true; } else { return false; }}  
  },
  {
      columnName : 'price_5',
      errorString: "price_5 field invalid, please input numeric value",
      errorCode: 'price_5RegEx400',
      qryMongo : {$and: [{ "price_5": { $exists: true, $ne: null,$type:2}},
       { "price_5" : /[^\d{0,8}(\.\d{0,4})?$]/}]},
      qryObject: (price_5)=>{ let regExp = new RegExp(/[^\d{0,8}(\.\d{0,4})?$]/); if (price_5 == undefined || price_5 == '' || isNaN(price_5)) { return true; } else if (regExp.test(price_5)) { return true; } else { return false; }}   
  },
  {
      columnName : 'price_6',
      errorString: "price_6 field invalid, please input numeric value",
      errorCode: 'price_6RegEx400',
      qryMongo : {$and: [{ "price_6": { $exists: true, $ne: null,$type:2}},
       { "price_6" : /[^\d{0,8}(\.\d{0,4})?$]/}]},
      qryObject: (price_6)=>{ let regExp = new RegExp(/[^\d{0,8}(\.\d{0,4})?$]/); if (price_6 == undefined || price_6 == '' || isNaN(price_6)) { return true; } else if (regExp.test(price_6)) { return true; } else { return false; }}   
  },
  {
      columnName : 'price_7',
      errorString: "price_7 field invalid, please input numeric value",
      errorCode: 'price_7RegEx400',
      qryMongo : {$and: [{ "price_7": { $exists: true, $ne: null,$type:2}},
       { "price_7" :  /[^\d{0,8}(\.\d{0,4})?$]/}]},
      qryObject: (price_7)=>{ let regExp = new RegExp(/[^\d{0,8}(\.\d{0,4})?$]/); if (price_7 == undefined || price_7 == '' || isNaN(price_7)) { return true; } else if (regExp.test(price_7)) { return true; } else { return false; }} 
  },
  {
      columnName : 'price_8',
      errorString: "price_8 field invalid, please input numeric value",
      errorCode: 'price_8RegEx400',
      qryMongo : {$and: [{ "price_8": { $exists: true, $ne: null,$type:2}},
       { "price_8" : /[^\d{0,8}(\.\d{0,4})?$]/}]},
      qryObject: (price_8)=>{ let regExp = new RegExp(/[^\d{0,8}(\.\d{0,4})?$]/); if (price_8 == undefined || price_8 == '' || isNaN(price_8)) { return true; } else if (regExp.test(price_8)) { return true; } else { return false; }} 
  },
  {
      columnName : 'price_9',
      errorString: "price_9 field invalid, please input numeric value",
      errorCode: 'price_9RegEx400',
      qryMongo : {$and: [{ "price_9": { $exists: true, $ne: null,$type:2}},
       { "price_9" : /[^\d{0,8}(\.\d{0,4})?$]/}]},
      qryObject: (price_9)=>{ let regExp = new RegExp(/[^\d{0,8}(\.\d{0,4})?$]/); if (price_9 == undefined || price_9 == '' || isNaN(price_9)) { return true; } else if (regExp.test(price_9)) { return true; } else { return false; }} 
  },
  {
      columnName : 'price_10',
      errorString: "price_10 field invalid, please input numeric value",
      errorCode: 'price_10RegEx400',
      qryMongo : {$and: [{ "price_10": { $exists: true, $ne: null ,$type:2}},
       { "price_10" : /[^\d{0,8}(\.\d{0,4})?$]/}]},
      qryObject: (price_10)=>{ let regExp = new RegExp(/[^\d{0,8}(\.\d{0,4})?$]/); if (price_10 == undefined || price_10 == '' || isNaN(price_10)) { return true; } else if (regExp.test(price_10)) { return true; } else { return false; }} 
  },
  {
      columnName : 'price_11',
      errorString: "price_11 field invalid, please input numeric value",
      errorCode: 'price_11RegEx400',
      qryMongo : {$and: [{ "price_11": { $exists: true,$ne: null,$type:2}},
       { "price_11" : /[^\d{0,8}(\.\d{0,4})?$]/}]},
      qryObject: (price_11)=>{ let regExp = new RegExp(/[^\d{0,8}(\.\d{0,4})?$]/); if (price_11 == undefined || price_11 == '' || isNaN(price_11)) { return true; } else if (regExp.test(price_11)) { return true; } else { return false; }} 
  },
  {
      columnName : 'price_12',
      errorString: "price_12 field invalid, please input numeric value",
      errorCode: 'price_12RegEx400',
      qryMongo : {$and: [{ "price_12": { $exists: true, $ne: null,$type:2}},
       { "price_12" : /[^\d{0,8}(\.\d{0,4})?$]/}]},
      qryObject: (price_12)=>{ let regExp = new RegExp(/[^\d{0,8}(\.\d{0,4})?$]/); if (price_12 == undefined || price_12 == '' || isNaN(price_12)) { return true; } else if (regExp.test(price_12)) { return true; } else { return false; }} 
  },
  {
      columnName : 'price_13',
      errorString: "price_13 field invalid, please input numeric value",
      errorCode: 'price_13RegEx400',
      qryMongo : {$and: [{ "price_13": { $exists: true, $ne: null,$type:2}},
       { "price_13" : /[^\d{0,8}(\.\d{0,4})?$]/}]},
      qryObject: (price_13)=>{ let regExp = new RegExp(/[^\d{0,8}(\.\d{0,4})?$]/); if (price_13 == undefined || price_13 == '' || isNaN(price_13)) { return true; } else if (regExp.test(price_13)) { return true; } else { return false; }}
  },
  {
      columnName : 'price_14',
      errorString: "price_14 field invalid, please input numeric value",
      errorCode: 'price_14RegEx400',
      qryMongo : {$and: [{ "price_14": { $exists: true, $ne: null,$type:2}},
       { "price_14" : /[^\d{0,8}(\.\d{0,4})?$]/}]},
      qryObject: (price_14)=>{ let regExp = new RegExp(/[^\d{0,8}(\.\d{0,4})?$]/); if (price_14 == undefined || price_14 == '' || isNaN(price_14)) { return true; } else if (regExp.test(price_14)) { return true; } else { return false; }}
  },
  {
      columnName : 'price_15',
      errorString: "price_15 field invalid, please input numeric value",
      errorCode: 'price_15RegEx400',
      qryMongo : {$and: [{ "price_15": { $exists: true, $ne: null,$type:2}},
       { "price_15" :  /[^\d{0,8}(\.\d{0,4})?$]/} ]},
      qryObject: (price_15)=>{ let regExp = new RegExp(/[^\d{0,8}(\.\d{0,4})?$]/); if (price_15 == undefined || price_15 == '' || isNaN(price_15)) { return true; } else if (regExp.test(price_15)) { return true; } else { return false; }}
  }
];
module.exports = ProductPriceRules;
