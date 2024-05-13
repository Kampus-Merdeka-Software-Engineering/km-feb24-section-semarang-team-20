import productColors from '../data/colors.js';

window.onload = function () {
    const ctx = document.getElementById("trendDay").getContext("2d");
    
    fetch("data/trend_data.json")
      .then((response) => response.json())
      .then((originalData) => {
        // Function to update the chart
        function updateChart(data) {
          // Get unique product types
          const productTypes = [
            ...new Set(data.map((item) => item.productType)),
          ];
  
          // Prepare the datasets
          const datasets = productTypes.map((productType) => {
            // Filter data for this product type
            const productData = data.filter(
              (item) => item.productType === productType
            );
  
            // Sum up totalQty for each dayOfWeek
            const totalQtyByDay = [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ].map((dayOfWeek) => {
              const dayData = productData.filter(
                (item) => item.dayOfWeek === dayOfWeek
              );
              const totalQty = dayData.reduce(
                (sum, item) => sum + item.totalQty,
                0
              );
              return totalQty;
            });
  
            return {
              label: productType,
              data: totalQtyByDay,
              backgroundColor: productColors[productType],
              borderColor: productColors[productType],
              borderWidth: 1,
            };
          });
  
          // Create or update the chart
          if (window.chart) {
            window.chart.data.datasets = datasets;
            window.chart.update();
          } else {
            window.chart = new Chart(ctx, {
              type: "bar",
              data: {
                labels: [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday",
                ], // Use days of week as labels
                datasets: datasets,
              },
              options: {
                indexAxis: "y", // Make y-axis represent the categories
                scales: {
                  x: {
                    stacked: true,
                  },
                  y: {
                    stacked: true,
                  },
                },
                responsive: true,
                maintainAspectRatio: false,
              },
            });
          }
        }
  
        // Initial chart creation
        updateChart(originalData);
  
        // Add event listener to each checkbox
        document
          .querySelectorAll('input[type="checkbox"]')
          .forEach((checkbox) => {
            checkbox.addEventListener("change", () => {
              // Filter out the data that matches the unchecked property
              const filteredData = originalData.filter((item) => {
                if (!document.querySelector(`input[value="${item.dayOfWeek}"]`).checked) {
                  return false;
                }
                if (!document.querySelector(`input[value="${item.monthOfYear}"]`).checked) {
                  return false;
                }
                if (!document.querySelector(`input[value="${item.productCategory}"]`).checked) {
                  return false;
                }
                if (!document.querySelector(`input[value="${item.storeLocation}"]`).checked) {
                  return false;
                }
                return true;
              });
  
              // Update the chart
              updateChart(filteredData);
            });
          });
      })
      .catch((error) => console.error("Error:", error));
  
    // Resize function
    window.addEventListener('resize', () => {
        let chartElement = document.getElementById('trendDay');
        let parent = chartElement.parentElement;

        chartElement.width = parent.offsetWidth;
        chartElement.height = parent.offsetHeight;

        window.chart.resize();
    });
};
