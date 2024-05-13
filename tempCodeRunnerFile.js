const fs = require('fs');
const Papa = require('papaparse');

fs.readFile('data/transaction.csv', 'utf8', function(err, data) {
    if (err) {
        return console.log(err);
    }
    Papa.parse(data, {
        header: true,
        complete: function(results) {
            console.log(results.data);
        }
    });
});
