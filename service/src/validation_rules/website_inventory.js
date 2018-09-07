const WebsiteInventoryRules = [
    {
        columnName: 'sku',
        errorString: 'SKU field found blank',
        errorCode: 'SKUblankCheck400',
        qryMongo: {$or:[{"sku":null},{"sku":""}]},
        qryObject: (sku)=>{ return (sku == null || sku == "")}
    },
    {
        columnName: 'qty_on_hand',
        errorString: 'Qty_on_Hand field found blank',
        errorCode: 'Qty_on_HandblankCheck400',
        qryMongo: {$or:[{"qty_on_hand":null},{"qty_on_hand":""}]},
        qryObject: (qty_on_hand)=>{ return (qty_on_hand == null || qty_on_hand == "")}
    }
];

module.exports = WebsiteInventoryRules;