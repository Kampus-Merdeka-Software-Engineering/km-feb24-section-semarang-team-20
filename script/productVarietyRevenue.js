import { filterData } from './filter.js';
import productColors from "../colors.js";

window.addEventListener('load', function() {
  let scatterChart; 

  fetch("data/trend_data.json")
    .then((response) => response.json())
    .then((originalData) => {
      function updateChart(data) {
        const groupedData = data.reduce((acc, curr) => {
          const { productType, totalRevenue, product_variations } = curr;

          if (!acc[productType]) {
            acc[productType] = {
              totalRevenue: 0,
              product_variations: [],
            };
          }

          acc[productType].totalRevenue += totalRevenue;
          acc[productType].product_variations.push(product_variations);

          return acc;
        }, {});

        const datasets = Object.entries(groupedData).map(
          ([productType, { totalRevenue, product_variations }]) => {
            const uniqueDataPoints = new Map();

            product_variations.forEach((variation) => {
              const key = `${totalRevenue},${variation}`;
              uniqueDataPoints.set(key, { x: totalRevenue, y: variation });
            });

            return {
              label: productType,
              data: Array.from(uniqueDataPoints.values()).map((point) => ({
                ...point,
                totalRevenue,
              })),
              backgroundColor: productColors[productType],
            };
          }
        );

        if (scatterChart) {
          scatterChart.destroy();
        }

        const ctx = document
          .getElementById("product-variety-revenue")
          .getContext("2d");
        scatterChart = new Chart(ctx, {
          type: "scatter",
          data: {
            datasets,
          },
          options: {
            scales: {
              x: {
                type: "linear",
                position: "bottom",
                title: {
                  display: true,
                  text: "Total Revenue",
                },
              },
              y: {
                type: "linear",
                position: "left",
                title: {
                  display: true,
                  text: "Product Variations",
                },
              },
            },
            plugins: {
              tooltip: {
                callbacks: {
                  label: (context) => {
                    const dataPoint = context.dataset.data[context.dataIndex];
                    return `${context.dataset.label}: ${dataPoint.x}`;
                  },
                },
              },
                legend: {
                    display: false,
                    position:"bottom",
                    labels: {
                    usePointStyle: true,
                    pointStyle: 'circle',
                    },
                    onClick: null
                },
            },
          },
        });

        var legendContainer = document.getElementById('js-legend-revenue');
        legendContainer.innerHTML = ''; // Clear the current legend
        scatterChart.data.datasets.forEach((dataset, i) => {
          var legendItem = document.createElement('li');
          var colorBox = document.createElement('span');
          colorBox.style.backgroundColor = dataset.backgroundColor;
          colorBox.style.display = 'inline-block';
          colorBox.style.width = '10px'; /* Adjust this to change the width of the color box */
          colorBox.style.height = '10px'; /* Adjust this to change the height of the color box */
          colorBox.style.marginRight = '5px';
          legendItem.appendChild(colorBox);
          legendItem.appendChild(document.createTextNode(dataset.label));
          legendContainer.appendChild(legendItem);
        });
      }

      updateChart(originalData);

      document
        .querySelectorAll('input[type="checkbox"]')
        .forEach((checkbox) => {
          checkbox.addEventListener("change", () => {
            const filteredData = filterData(originalData);

            updateChart(filteredData);
          });
        });
    })
    .catch((error) => console.error("Error:", error));

    
});
