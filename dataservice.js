const fs = require('fs');

// Load the data into memory
let data = JSON.parse(fs.readFileSync('data/new_transaction.json', 'utf8'));

let dataService = {
    // A function that returns the total transaction quantity and total revenue for each product type on each day of the week
    getDailyProductQtyAndRevenue: function() {
        let dailyProductQtyAndRevenue = {};
        let productTypePrices = {}; 

        data.forEach(function(transaction) {
            let productType = transaction.product_type;
            let unitPrice = parseFloat(transaction.unit_price);

            if (productTypePrices[productType]) {
                productTypePrices[productType].totalPrice += unitPrice;
                productTypePrices[productType].count += 1;
            } else {
                productTypePrices[productType] = {
                    totalPrice: unitPrice,
                    count: 1
                };
            }

            let dayOfWeek = new Date(transaction.transaction_date).toLocaleString('en-US', { weekday: 'long' });
            let monthOfYear = new Date(transaction.transaction_date).toLocaleString('en-US', { month: 'long' });
            let key = dayOfWeek + '|' + monthOfYear + '|' + transaction.product_category + '|' + transaction.product_type + '|' + transaction.store_location;
            if (dailyProductQtyAndRevenue[key]) {
                dailyProductQtyAndRevenue[key].totalQty += parseInt(transaction.transaction_qty);
                dailyProductQtyAndRevenue[key].totalRevenue += parseInt(transaction.transaction_qty) * parseFloat(transaction.unit_price);
            } else {
                dailyProductQtyAndRevenue[key] = {
                    totalQty: parseInt(transaction.transaction_qty),
                    totalRevenue: parseInt(transaction.transaction_qty) * parseFloat(transaction.unit_price)
                };
            }
        });

        // Convert the results to an array and sort by day of the week
        let dailyProductQtyAndRevenueArray = Object.entries(dailyProductQtyAndRevenue).map(function(entry) {
            let [dayOfWeek, monthOfYear, productCategory, productType, storeLocation] = entry[0].split('|');
            return {
                dayOfWeek: dayOfWeek,
                monthOfYear: monthOfYear,
                productCategory: productCategory,
                productType: productType,
                storeLocation: storeLocation,
                totalQty: entry[1].totalQty,
                totalRevenue: Math.round(entry[1].totalRevenue)  
                
            };
        });
        dailyProductQtyAndRevenueArray.sort(function(a, b) {
            let daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            return daysOfWeek.indexOf(a.dayOfWeek) - daysOfWeek.indexOf(b.dayOfWeek);
        });

        // Calculate the product variations
let productVariations = {};
data.forEach(function(transaction) {
    let productType = transaction.product_type;
    let productDetail = transaction.product_detail;
    if (!productVariations[productType]) {
        productVariations[productType] = new Set();
    }
    productVariations[productType].add(productDetail);
});

// Update the dailyProductQtyAndRevenueArray with product variations
dailyProductQtyAndRevenueArray = dailyProductQtyAndRevenueArray.map(function(item) {
    let productType = item.productType;
    let variations = productVariations[productType];
    let avgPrice = productTypePrices[productType].totalPrice / productTypePrices[productType].count; // Calculate the average price
    return {
        ...item,
        product_variations: variations.size,
        productTypePriceAvg: avgPrice.toFixed(2) // Add the average price to the result
    };
});


        return dailyProductQtyAndRevenueArray;
    },

    // Other functions for other queries...
};

// Get the processed data
const trendData = dataService.getDailyProductQtyAndRevenue();

// Convert data to JSON string
const trendDataJSON = JSON.stringify(trendData, null, 2);

// Write JSON string to a new file named trend_data.json in the data directory
fs.writeFile('data/trend_data.json', trendDataJSON, 'utf8', (err) => {
  if (err) {
    console.error('Error writing file:', err);
    return;
  }
  console.log('Trend data has been written to data/trend_data.json');
});

module.exports = dataService;
