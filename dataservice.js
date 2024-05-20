const fs = require('fs');

// Read the transaction data
let data = JSON.parse(fs.readFileSync('data/new_transaction.json', 'utf8'));

let dataService = {

    getDailyProductQtyAndRevenue: function() {
        let dailyProductQtyAndRevenue = {};
        let productTypePrices = {};
        let hourlyTransactions = {};

        data.forEach(function(transaction) {
            let productType = transaction.product_type;
            let unitPrice = parseFloat(transaction.unit_price);
            let transactionHour = new Date(transaction.transaction_date + 'T' + transaction.transaction_time).getHours();
            let transactionQty = parseInt(transaction.transaction_qty);

            if (productTypePrices[productType]) {
                productTypePrices[productType].totalPrice += unitPrice;
                productTypePrices[productType].count += 1;
            } else {
                productTypePrices[productType] = {
                    totalPrice: unitPrice,
                    count: 1
                };
            }

            let transactionDate = transaction.transaction_date;
            let dayOfWeek = new Date(transactionDate).toLocaleString('en-US', { weekday: 'long' });
            let monthOfYear = new Date(transactionDate).toLocaleString('en-US', { month: 'long' });
            let key = transactionDate + '|' + dayOfWeek + '|' + monthOfYear + '|' + transaction.product_category + '|' + transaction.product_type + '|' + transaction.store_location;
            if (dailyProductQtyAndRevenue[key]) {
                dailyProductQtyAndRevenue[key].totalQty += transactionQty;
                dailyProductQtyAndRevenue[key].totalRevenue += transactionQty * unitPrice;
            } else {
                dailyProductQtyAndRevenue[key] = {
                    transactionDate: transactionDate,
                    totalQty: transactionQty,
                    totalRevenue: transactionQty * unitPrice
                };
            }

            let hourlyKey = transactionDate + '|' + dayOfWeek + '|' + monthOfYear + '|' + transaction.product_category + '|' + transaction.product_type + '|' + transaction.store_location;

            if (!hourlyTransactions[hourlyKey]) {
                hourlyTransactions[hourlyKey] = {};
            }
            if (hourlyTransactions[hourlyKey][transactionHour]) {
                hourlyTransactions[hourlyKey][transactionHour] += transactionQty;
            } else {
                hourlyTransactions[hourlyKey][transactionHour] = transactionQty;
            }
        });

        let dailyProductQtyAndRevenueArray = Object.entries(dailyProductQtyAndRevenue).map(function(entry) {
            let [transactionDate, dayOfWeek, monthOfYear, productCategory, productType, storeLocation] = entry[0].split('|');
            return {
                transactionDate: transactionDate,
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

        let productVariations = {};
        data.forEach(function(transaction) {
            let productType = transaction.product_type;
            let productDetail = transaction.product_detail;
            if (!productVariations[productType]) {
                productVariations[productType] = new Set();
            }
            productVariations[productType].add(productDetail);
        });

        dailyProductQtyAndRevenueArray = dailyProductQtyAndRevenueArray.map(function(item) {
            let productType = item.productType;
            let variations = productVariations[productType];
            let avgPrice = productTypePrices[productType].totalPrice / productTypePrices[productType].count;
            let key = item.transactionDate + '|' + item.dayOfWeek + '|' + item.monthOfYear + '|' + item.productCategory + '|' + item.productType + '|' + item.storeLocation;
            item.hourlyTransactions = hourlyTransactions[key] || {};

            let totalTransactionsInRange = 0;
            for (let i = 6; i <= 20; i++) {
                if (!item.hourlyTransactions[i]) {
                    item.hourlyTransactions[i] = 0;
                }
                totalTransactionsInRange += item.hourlyTransactions[i];
            }

            let averageTransactionsPerHour = totalTransactionsInRange / 15;

            return {
                ...item,
                product_variations: variations.size,
                productTypePriceAvg: avgPrice.toFixed(2),
                averageTransactionsPerHour: averageTransactionsPerHour.toFixed(2)
            };
        });

        return dailyProductQtyAndRevenueArray;
    },

};

const trendData = dataService.getDailyProductQtyAndRevenue();

const trendDataJSON = JSON.stringify(trendData, null, 2);

fs.writeFile('data/trend_data.json', trendDataJSON, 'utf8', (err) => {
  if (err) {
    console.error('Error writing file:', err);
    return;
  }
  console.log('Trend data has been written to data/trend_data.json');
});

module.exports = dataService;
