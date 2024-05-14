// filter.js
export function filterData(originalData) {
    return originalData.filter((item) => {
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
  }
  