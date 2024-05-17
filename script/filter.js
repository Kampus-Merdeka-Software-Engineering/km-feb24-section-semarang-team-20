export function filterData(originalData) {
  return originalData.filter((item) => {
    const dayOfWeekChecked = document.querySelector(`input[value="${item.dayOfWeek}"]`).checked;
    const monthOfYearChecked = document.querySelector(`input[value="${item.monthOfYear}"]`).checked;
    const productCategoryChecked = document.querySelector(`input[value="${item.productCategory}"]`).checked;
    const storeLocationChecked = document.querySelector(`input[value="${item.storeLocation}"]`).checked;
    
    return dayOfWeekChecked && monthOfYearChecked && productCategoryChecked && storeLocationChecked;
  });
}

export function addCheckboxEventListeners(updateDataDisplay, originalData) {
  document
    .querySelectorAll('input[type="checkbox"]')
    .forEach((checkbox) => {
      checkbox.addEventListener("change", () => {
        const filteredData = filterData(originalData);
        updateDataDisplay(filteredData);
      });
    });
}
