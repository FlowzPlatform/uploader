const WebsiteInventoryRules = [
    {
        columnName: 'sku',
        errorString: 'SKU field found blank',
        errorCode: 'SKUblankCheck400',
        qryMongo: {$or:[{"sku":null},{"sku":""}]},
        qryObject: (sku)=>{ return (sku == null || sku == "")}
    },
    {
        columnName: 'product_name',
        errorString: 'Product_Name field found blank',
        errorCode: 'Product_NameblankCheck400',
        qryMongo: {$or:[{"product_name":null},{"product_name":""}]},
        qryObject: (product_name)=>{ return (product_name == null || product_name == "")}
    },
    {
        columnName: 'color',
        errorString: 'color field found blank',
        errorCode: 'ColorblankCheck400',
        qryMongo: {$or:[{"color":null},{"color":""}]},
        qryObject: (color)=>{ return (color == null || color == "")}
    },
    {
        columnName: 'qty_on_hand',
        errorString: 'Qty_on_Hand field found blank',
        errorCode: 'Qty_on_HandblankCheck400',
        qryMongo: {$or:[{"qty_on_hand":null},{"qty_on_hand":""}]},
        qryObject: (qty_on_hand)=>{ return (qty_on_hand == null || qty_on_hand == "")}
    },
    {
        columnName: 'qty_on_po',
        errorString: 'Qty_on_PO field found blank',
        errorCode: 'Qty_on_POblankCheck400',
        qryMongo: {$or:[{"qty_on_po":null},{"qty_on_po":""}]},
        qryObject: (qty_on_po)=>{ return (qty_on_po == null || qty_on_po == "")}
    }
];

module.exports = WebsiteInventoryRules;