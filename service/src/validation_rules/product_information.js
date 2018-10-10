/*eslint-disable*/
let currentDate = new Date().toISOString().slice(0,10);
 const ProductInformationRules = [
  {
        columnName: 'sku',
        errorString: "SKU field found blank , please provide valid data at row number",
        errorCode: 'SKUblankCheck400',
        qryMongo: {$or:[{"sku":null},{"sku":""}]},
        qryObject: (sku)=>{ return (sku == null || sku == "")},
        qryErrStr: "SKU field found blank"
    },
    {
        columnName: 'country',
        errorString: "Country field found blank , please provide valid data at row number",
        errorCode: 'CountryblankCheck400',
        qryMongo: {$or:[{"country":null},{"country":""}]},
        qryObject: (country)=>{ return (country == null || country == "")},
        qryErrStr: "Country field found blank"
    },
    {
        columnName: 'language',
        errorString: "Language field found blank , please provide valid data at row number",
        errorCode: 'LanguageblankCheck400',
        qryMongo: {$or:[{"language":null},{"language":""}]},
        qryObject: (language)=>{ return (language == null || language == "")},
        qryErrStr: "Language field found blank"
    },
    {
        columnName: 'currency',
        errorString: "Currency field found blank , please provide valid data at row number",
        errorCode: 'CurrencyblankCheck400',
        qryMongo: {$or:[{"currency":null},{"currency":""}]},
        qryObject: (currency)=>{ return (currency == null || currency == "")},
        qryErrStr: "Currency field found blank"
    },
    {
        columnName: 'product_name',
        errorString: "Product_Name field found blank , please provide valid data at row number",
        errorCode: 'Product_NameblankCheck400',
        qryMongo: {$or:[{"product_name":null},{"product_name":""}]},
        qryObject: (product_name)=>{ return (product_name == null || product_name == "")},
        qryErrStr: "Product_Name field found blank"
    },
    {
        columnName: 'description',
        errorString: "Description field found blank , please provide valid data at row number",
        errorCode: 'DescriptionBlankCheck400',
        qryMongo: {$or:[{"description":null},{"description":""}]},
        qryObject: (description)=>{ return (description == null || description == "")},
        qryErrStr: "Description field found blank"
    },
    {
        columnName: 'linename',
        errorString: "Linename field found blank , please provide valid data at row number",
        errorCode: 'LinenameBlankCheck400',
        qryMongo: {$or:[{"linename":null},{"linename":""}]},
        qryObject: (linename)=>{ return (linename == null || linename == "")},
        qryErrStr: "Linename field found blank"
    },
    {
        columnName: 'categories',
        errorString: "Categories field found blank , please provide valid data at row number",
        errorCode: 'CategoriesBlankCheck400',
        qryMongo: {$or:[{"categories":null},{"categories":""}]},
        qryObject: (categories)=>{ return (categories == null || categories == "")},
        qryErrStr: "Categories field found blank"
    },
    {

        columnName: 'search_keyword',
        errorString: "Search_Keyword field found blank , please provide valid data at row number",
        errorCode: 'Search_KeywordBlankCheck400',
        qryMongo: {$or:[{"search_keyword":null},{"search_keyword":""}]},
        qryObject: (search_keyword)=>{ return (search_keyword == null || search_keyword == "")},
        qryErrStr: "Search_Keyword field found blank"
    },
    {
        columnName: 'attr_colors',
        errorString: "Attribute Colors field found blank , please provide valid data at row number",
        errorCode: 'Attribute_ColorsBlankCheck400',
        qryMongo: {$or:[{"attr_colors":null},{"attr_colors":""}]},
        qryObject: (attr_colors)=>{ return (attr_colors == null || attr_colors == "")},
        qryErrStr: "Attribute Colors field found blank"
    },
    {
        columnName: 'default_image',
        errorString: "Default_Image field found blank , please provide valid data at row number",
        errorCode: 'Default_ImageBlankCheck400',
        qryMongo: {$or:[{"default_image":null},{"default_image":""}]},
        qryObject: (default_image)=>{ return (default_image == null || default_image == "")},
        qryErrStr: "Default_Image field found blank"
    },
    {
        columnName : 'matrix_price',
        errorString: "Matrix_Price field invalid, please input numeric value",
        errorCode: 'Matrix_PriceRegEx400',
        qryMongo : {$and:[{ "matrix_price": { $exists: true, $ne: "" } },{ "matrix_price" : {$not: /^\d{0,8}(\.\d{0,4})?$/ }}]},
        qryObject: (matrix_price)=>{ let regExp = new RegExp(/^\d{0,8}(\.\d{0,4})?$/); if (matrix_price == undefined) { return true } else if(!regExp.test(matrix_price)) { return true } else { return false } },
        qryErrStr: "Matrix_Price field invalid, please input numeric value"
    },
    {
        columnName : 'valid_up_to',
        errorString: "Valid upto field invalid, please input proper date",
        errorCode: 'Valid_Up_ToRegEx400',
        qryMongo : {$and: [{ "valid_up_to": { $exists: true, $ne: "" } },
         {"valid_up_to" : { "$lt" : currentDate}}]},
        qryObject: (valid_up_to)=>{ if (valid_up_to == undefined || valid_up_to == "") { return true } else if (valid_up_to < currentDate) { return true } else { return false } },
        qryErrStr: "Valid upto field invalid, please input proper date"
    },
    {
        columnName : 'special_price_valid_up_to',
        errorString: "Special Price Valid Upto field invalid, please input proper date",
        errorCode: 'Special_Price_Valid_Up_ToRegEx400',
        qryMongo : {$and: [{ "special_price_valid_up_to": { $exists: true, $ne: "" } },
         {"special_price_valid_up_to" : { "$lt" :  currentDate}}]},
        qryObject: (special_price_valid_up_to)=>{ if (special_price_valid_up_to == undefined || special_price_valid_up_to == "") { return true } else if (special_price_valid_up_to < currentDate) { return true } else { return false } },
        qryErrStr: "Special Price Valid Upto field invalid, please input proper date"
   },
    {
        columnName : 'matrix_frieght',
        errorString: "Matrix_Freight field invalid, please input numeric value",
        errorCode: 'Matrix_FreightRegEx400',
        qryMongo : {$and: [{ "matrix_frieght": { $exists: true, $ne: "" } },
         { "matrix_frieght" : {$not: /^\d{0,8}(\.\d{0,4})?$/ }}]},
        qryObject: (matrix_frieght)=>{ let regExp = new RegExp(/^\d{0,8}(\.\d{0,4})?$/); if (matrix_frieght == undefined) { return true; } else if(!regExp.test(matrix_frieght)) { return true; } else { return false; } },
        qryErrStr: "Matrix_Freight field invalid, please input numeric value"
   },
    {
        columnName : 'vat',
        errorString: "vat field invalid, please input numeric value",
        errorCode: 'VatRegEx400',
        qryMongo : {$and: [{ "vat": { $exists: true, $ne: "" } },
         { "vat" : {$not: /^\d{0,8}(\.\d{0,4})?$/ }}]},
        qryObject: (vat)=>{ let regExp = new RegExp(/^\d{0,8}(\.\d{0,4})?$/); if (vat == undefined) { return true } else if(!regExp.test(vat)) { return true; } else { return false; } },
        qryErrStr: "vat field invalid, please input numeric value"
   },
   {
       columnName : 'packaging_charges',
       errorString: "Packaging_Charges field invalid, please input numeric value",
       errorCode: 'packaging_chargesRegEx400',
       qryMongo : {$and: [{ "packaging_charges": { $exists: true, $ne: "" } },
        { "packaging_charges" : {$not: /^\d{0,8}(\.\d{0,4})?$/ }}]},
       qryObject: (packaging_charges)=>{ let regExp = new RegExp(/^\d{0,8}(\.\d{0,4})?$/); if (packaging_charges == undefined) { return true; } else if(!regExp.test(packaging_charges)) { return true; } else { return false; } },
       qryErrStr: "Packaging_Charges field invalid, please input numeric value"
  },
  {
    columnName : 'video_url',
    errorString: "Video_URL field invalid, please input a valid URL",
    errorCode: 'Video_URLRegEx400',
    qryMongo : {$and:
    [{ "video_url": { $exists: true, $ne: "" } },
     { "video_url" : {$not: /https?:\/\/w{0,3}\w*?\.(\w*?\.)?\w{2,3}\S*|www\.(\w*?\.)?\w*?\.\w{2,3}\S*|(\w*?\.)?\w*?\.\w{2,3}[\/\?]\S*/ }}]},
    qryObject: (video_url)=>{ let regExp = new RegExp(/https?:\/\/w{0,3}\w*?\.(\w*?\.)?\w{2,3}\S*|www\.(\w*?\.)?\w*?\.\w{2,3}\S*|(\w*?\.)?\w*?\.\w{2,3}[\/\?]\S*$?/); if (video_url == undefined) { return true; } else if(!regExp.test(video_url)) { return true; } else { return false; } },
    qryErrStr: "Video_URL field invalid, please input a valid URL"
},
{
    columnName : 'distributor_central_url',
    errorString: "Distributor_Central_URL field invalid, please input a valid URL",
    errorCode: 'Distributor_Central_URLRegEx400',
    qryMongo : {$and:
    [{ "distributor_central_url": { $exists: true, $ne: "" } },
     { "distributor_central_url" : {$not: /https?:\/\/w{0,3}\w*?\.(\w*?\.)?\w{2,3}\S*|www\.(\w*?\.)?\w*?\.\w{2,3}\S*|(\w*?\.)?\w*?\.\w{2,3}[\/\?]\S*/ }}]},
    qryObject: (distributor_central_url)=>{ let regExp = new RegExp(/https?:\/\/w{0,3}\w*?\.(\w*?\.)?\w{2,3}\S*|www\.(\w*?\.)?\w*?\.\w{2,3}\S*|(\w*?\.)?\w*?\.\w{2,3}[\/\?]\S*/); if (distributor_central_url == undefined) { return true; } else if(!regExp.test(distributor_central_url)) { return true; } else { return false; } },
    qryErrStr: "Distributor_Central_URL field invalid, please input a valid URL"
}
];

module.exports = ProductInformationRules;
