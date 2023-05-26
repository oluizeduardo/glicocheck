const fieldMeasurementUnity = document.getElementById('field_MeasurementUnity');
const measurementUnityHypo = document.getElementById('measurement_unity_hypo');
const measurementUnityHyper = document.getElementById('measurement_unity_hyper');
const fieldValueHypo = document.getElementById('valueHypo');
const fieldValueHyper = document.getElementById('valueHyper');
const hypoRange = document.getElementById('hypoRange');
const hyperRange = document.getElementById('hyperRange');

const MG_DL = 'mg/dL';
const MMOL_L = 'mmol/L';

/**
 * Update the meaurement unity label.
 */
function updateGlycemiaValueLabel() {
  const unity = getMeasurementUnity();
  convertGlycemiaValues(unity);
  measurementUnityHypo.innerText = unity;
  measurementUnityHyper.innerText = unity;
}
/**
 * It converts the glycemia value depending on the measurement unity.
 * @param {string} unity The measurement unity to convert to.
 */
function convertGlycemiaValues(unity) {
  let valueHypo;
  let valueHyper;

  if (unity === MG_DL) {
    valueHypo = '70';
    valueHyper = '160';
    setRangePropertiesForMGDL();
  } else {
    valueHypo = '4';
    valueHyper = '9';
    setRangePropertiesForMMOL();
  }
  fieldValueHypo.innerText = valueHypo;
  fieldValueHyper.innerText = valueHyper;
}
/**
 * Returns the glycemia meaurement unity.
 * @return {string} A string informing the glycemia measurement unity.
 */
function getMeasurementUnity() {
  return fieldMeasurementUnity.value === '1' ? MG_DL : MMOL_L;
}
/**
 * Update range fields.
 */
function setRangePropertiesForMGDL() {
  hypoRange.min = '60';
  hypoRange.max = '80';
  hypoRange.value = '70';
  hyperRange.min = '150';
  hyperRange.max = '170';
  hyperRange.value = '160';
}
/**
 * Update range fields.
 */
function setRangePropertiesForMMOL() {
  hypoRange.min = '3';
  hypoRange.max = '4';
  hypoRange.value = '4';
  hyperRange.min = '8';
  hyperRange.max = '9';
  hyperRange.value = '9';
}
/**
 * Initialize tooltip.
 */
function initializeTooltip() {
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  const tooltipList = tooltipTriggerList.map(function(tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });
}
/**
 * Updates the time of the posprandial field
 * based on the preprandial value by adding two hours.
 *
 * @param {HTMLInputElement} preElement - The input element
 * containing the preprandial time value.
 * @param {HTMLInputElement} posElement - The input element
 * to update with the posprandial time value.
 * @return {void}
 */
function updatePosprandial(preElement, posElement) {
  const preValue = preElement.value;
  const [hour, minute] = preValue.split(':').map(Number);
  const plusTwoHours = (hour + 2) % 24;
  const posprandialHour = `${String(plusTwoHours).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;

  posElement.value = posprandialHour;
}

initializeTooltip();
