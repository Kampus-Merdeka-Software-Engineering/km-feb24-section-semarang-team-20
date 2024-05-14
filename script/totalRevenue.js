import { filterData } from './filter.js';
import productColors from "../data/colors.js";

window.addEventListener('load', function() {
  let revenueChart; // Declare revenueChart variable outside the updateChart function

  // Fetch the data from the JSON file
  fetch("data/trend_data.json")
    .then((response) => response.json())
    .then((originalData) => {
      // Function to update the chart
      function updateChart(data) {
        // Create an object to store the total revenues for each product type
        let totalRevenues = {};

        // Iterate over the data
        for (let item of data) {
          // If the product type is not in the totalRevenues object, add it
          if (!(item.productType in totalRevenues)) {
            totalRevenues[item.productType] = 0;
          }

          // Add the total revenue for this item to the total for its product type
          totalRevenues[item.productType] += item.totalRevenue;
        }

        // Extract product types and total revenues from the totalRevenues object
        let productTypes = Object.keys(totalRevenues);
        let revenues = Object.values(totalRevenues);

        // Create an array of colors based on the product types
        let backgroundColors = productTypes.map(
          (type) => productColors[type]
        );

        // Destroy the old chart if it exists
        if (revenueChart) {
          revenueChart.destroy();
        }

        // Create the chart
        const ctx = document
          .getElementById("totalRevenue") // Make sure to change the canvas id to the id of the canvas for the revenue chart
          .getContext("2d");
        const chartData = {
          labels: productTypes,
          datasets: [
            {
              label: "Total Revenues",
              data: revenues,
              backgroundColor: backgroundColors,
              hoverOffset: 4,
            },
          ],
        };
        revenueChart = new Chart(ctx, {
          type: "pie",
          data: chartData,
          options: {
            plugins: {
              datalabels: {
                formatter: (value, ctx) => {
                  const label = ctx.chart.data.labels[ctx.dataIndex];
                  return `${label}: ${value}`;
                },
                color: "#fff",
            font: {
              weight: "bold",
            },
            anchor: 'end',
            align: 'end',
               },
              legend: {
                display: true,
                position: 'right',
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

            // Update the chart
            updateChart(filteredData);
          });
        });
    })
    .catch((error) => console.error("Error:", error));
});
