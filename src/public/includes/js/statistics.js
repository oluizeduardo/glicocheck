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
