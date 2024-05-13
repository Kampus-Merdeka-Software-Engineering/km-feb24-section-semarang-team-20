const fs = require('fs');

// Load the data into memory
let data = JSON.parse(fs.readFileSync('data/new_transaction.json', 'utf8'));

// The data service
let dataService = {
    // A function that returns the total transaction quantity for each product type on each day of the week
    getDailyProductQty: function() {
        let dailyProductQty = {};
        data.forEach(function(transaction) {
            let dayOfWeek = new Date(transaction.transaction_date).toLocaleString('en-US', { weekday: 'long' });
            let monthOfYear = new Date(transaction.transaction_date).toLocaleString('en-US', { month: 'long' });
            let key = dayOfWeek + '|' + monthOfYear + '|' + transaction.product_category + '|' + transaction.product_type;
            if (dailyProductQty[key]) {
                dailyProductQty[key] += parseInt(transaction.transaction_qty);
            } else {
                dailyProductQty[key] = parseInt(transaction.transaction_qty);
            }
        });

        // Convert the results to an array and sort by day of the week
        let dailyProductQtyArray = Object.entries(dailyProductQty).map(function(entry) {
            let [dayOfWeek, monthOfYear, productCategory, productType] = entry[0].split('|');
            return {
                dayOfWeek: dayOfWeek,
                monthOfYear: monthOfYear,
                productCategory: productCategory,
                productType: productType,
                totalQty: entry[1]
            };
        });
        dailyProductQtyArray.sort(function(a, b) {
            let daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            return daysOfWeek.indexOf(a.dayOfWeek) - daysOfWeek.indexOf(b.dayOfWeek);
        });

        return dailyProductQtyArray;
    },

    // Other functions for other queries...
};

// Get the processed data
const trendData = dataService.getDailyProductQty();

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
