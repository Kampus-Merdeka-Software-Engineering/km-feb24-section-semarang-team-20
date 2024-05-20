function updateCount() {
  const dropdowns = document.querySelectorAll('.dropdown');
  dropdowns.forEach(dropdown => {
    const checkboxes = dropdown.querySelectorAll('input[type="checkbox"]');
    const countSpan = dropdown.querySelector('.count');
    const checkedCount = Array.from(checkboxes).filter(checkbox => checkbox.checked).length;
    countSpan.textContent = `(${checkedCount} selected)`;
  });
}

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
        updateCount();
      });
    });

  // Call updateCount initially to set the counts
  updateCount();
}
