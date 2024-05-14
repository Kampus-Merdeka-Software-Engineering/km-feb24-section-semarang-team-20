import { filterData } from './filter.js';
import productColors from "../data/colors.js";

window.addEventListener('load', function() {
  let pieChart; // Declare pieChart variable outside the updateChart function

  // Fetch the data from the JSON file
  fetch("data/trend_data.json")
    .then((response) => response.json())
    .then((originalData) => {
      // Function to update the chart
      function updateChart(data) {
        // Create an object to store the total quantities for each product type
        let totalQuantities = {};

        // Iterate over the data
        for (let item of data) {
          // If the product type is not in the totalQuantities object, add it
          if (!(item.productType in totalQuantities)) {
            totalQuantities[item.productType] = 0;
          }

          // Add the total quantity for this item to the total for its product type
          totalQuantities[item.productType] += item.totalQty;
        }

        // Extract product types and total quantities from the totalQuantities object
        let productTypes = Object.keys(totalQuantities);
        let quantities = Object.values(totalQuantities);

        // Create an array of colors based on the product types
        let backgroundColors = productTypes.map(
          (type) => productColors[type]
        );

        // Destroy the old chart if it exists
        if (pieChart) {
          pieChart.destroy();
        }

        // Create the chart
        const ctx = document
          .getElementById("totalTransaction")
          .getContext("2d");
        const chartData = {
          labels: productTypes,
          datasets: [
            {
              label: "Total Transactions",
              data: quantities,
              backgroundColor: backgroundColors,
              hoverOffset: 4,
            },
          ],
        };
        pieChart = new Chart(ctx, {
          type: "pie",
          data: chartData,
          options: {
            plugins: {
              legend: {
                labels: {
                  usePointStyle: true,
                  pointStyle: 'circle',
                },
              }
            }
          },
        });
      }

      // Initial chart creation
      updateChart(originalData);

      // Add event listener to each checkbox
      document
        .querySelectorAll('input[type="checkbox"]')
        .forEach((checkbox) => {
          checkbox.addEventListener("change", () => {
            // Filter out the data that matches the unchecked property
            const filteredData = filterData(originalData);

            updateChart(filteredData);
          });
        });
    })
    .catch((error) => console.error("Error:", error));
});
