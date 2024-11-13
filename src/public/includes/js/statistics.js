/* eslint-disable no-unused-vars */
/* eslint-disable max-len */

/**
 * Calculate the average of an array of numbers, rounded to the nearest integer.
 * @param {Array<number>} values - An array of numeric values.
 * @return {number} The average of the values, rounded to the nearest integer.
 */
function calculateAverage(values) {
  const sum = values.reduce((acc, valor) => acc + valor, 0);
  const average = sum / values.length;
  return Math.round(average);
}

/**
 * The function calculates he standard deviation of a given array of numbers.
 * @param {Array} values An array of blood glucose numbers.
 * @return {Number} The standard deviation value.
 */
function calculateStandardDeviation(values) {
  const n = values.length;
  if (n > 1) {
    const mean = values.reduce((acc, val) => acc + val, 0) / n;
    const squaredDifferencesSum = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0);
    const standardDeviation = Math.sqrt(squaredDifferencesSum / (n - 1));
    return Math.round(standardDeviation);
  }
  return 0;
}

/**
 * Calculates the estimated Glycated Hemoglobin (HbA1c) from an array of glucose values.
 *
 * The HbA1c is calculated using the formula:
 * HbA1c = (Average Glucose (mg/dL) + 46.7) / 28.7
 *
 * @param {number[]} glucoseValues - An array of blood glucose values in mg/dL.
 * @return {string} The estimated HbA1c value rounded to two decimal places.
 * @throws {Error} Throws an error if the input is not an array or is an empty array.
 */
function calculateHbA1c(glucoseValues) {
  const averageGlucose = calculateAverage(glucoseValues);
  const hba1c = (averageGlucose + 46.7) / 28.7;
  return hba1c.toFixed(2);
}

/**
 * Calculate the number of hypoglycemic values in the array.
 * @param {Array<number>} values - An array of numeric glucose values.
 * @param {number} hypoglycemiaThreshold - The threshold value for hypoglycemia.
 * @return {number} The count of values less than or equal to the hypoglycemia threshold.
 */
function getHypoglycemiaCount(values, hypoglycemiaThreshold) {
  return values.filter((value) => value <= hypoglycemiaThreshold).length;
}

/**
 * Calculate the number of hyperglycemic values in the array.
 * @param {Array<number>} values - An array of numeric glucose values.
 * @param {number} hyperglycemiaThreshold - The threshold value for hyperglycemia.
 * @return {number} The count of values greater than or equal to the hyperglycemia threshold.
 */
function getHyperglycemiaCount(values, hyperglycemiaThreshold) {
  return values.filter((value) => value >= hyperglycemiaThreshold).length;
}

/**
 * Calculates the percentage of hypoglycemic readings in an array of glucose values.
 *
 * @param {Array<number>} glucoseValues - An array of glucose readings.
 * @param {number} hypoglycemiaThreshold - The threshold value for hypoglycemia.
 * @return {number} The percentage of readings below or equal to the hypoglycemia threshold.
 */
function calculateHypoglycemiaPercentage(glucoseValues, hypoglycemiaThreshold) {
  const hypoglycemiaCount = glucoseValues.filter((value) => value <= hypoglycemiaThreshold).length;
  return calculateRoundedUpPercentage(hypoglycemiaCount, glucoseValues.length);
}

/**
 * Calculates the percentage of hyperglycemic readings in an array of glucose values.
 *
 * @param {Array<number>} glucoseValues - An array of glucose readings.
 * @param {number} hyperglycemiaThreshold - The threshold value for hyperglycemia.
 * @return {number} The percentage of readings above or equal to the hyperglycemia threshold.
 */
function calculateHyperglycemiaPercentage(glucoseValues, hyperglycemiaThreshold) {
  const hyperglycemiaCount = glucoseValues.filter((value) => value >= hyperglycemiaThreshold).length;
  return calculateRoundedUpPercentage(hyperglycemiaCount, glucoseValues.length);
}

/**
 * Calculates the percentage of normal glucose readings in an array of glucose values.
 * A normal reading is defined as a value that falls between the hypoglycemia and hyperglycemia thresholds.
 *
 * @param {Array<number>} glucoseValues - An array of glucose readings.
 * @param {number} hypoglycemiaThreshold - The threshold value for hypoglycemia.
 * @param {number} hyperglycemiaThreshold - The threshold value for hyperglycemia.
 * @return {number} The percentage of readings that are within the normal range (greater than the hypoglycemia threshold and less than the hyperglycemia threshold).
 */
function calculateNormalGlycemiaPercentage(glucoseValues, hypoglycemiaThreshold, hyperglycemiaThreshold) {
  const normalCount = glucoseValues.filter((value) => value > hypoglycemiaThreshold && value < hyperglycemiaThreshold).length;
  return calculateRoundedUpPercentage(normalCount, glucoseValues.length);
}

/**
 * Calculates the percentage of values that meet a certain condition and rounds it up to the nearest integer.
 *
 * @param {number} count - The number of values that meet the condition.
 * @param {number} total - The total number of values.
 * @return {number} The percentage of values meeting the condition, rounded up to the nearest integer.
 */
function calculateRoundedUpPercentage(count, total) {
  if (total === 0) return 0; // Avoid division by zero
  const percentage = (count / total) * 100;
  return Math.ceil(percentage);
}
