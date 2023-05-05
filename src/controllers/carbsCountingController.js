const Messages = require('../utils/messages');
const axios = require('axios');

/**
 * CarbsCountingController.
 */
class CarbsCountingController {
  /**
   * This function sends a request to EDAMAM's API to calculate
   * the total of carbohydrate in a given food.
   * @param {Request} req
   * @param {Response} res
   */
  static calculatesTotalCarbohydrate = async (req, res) => {
    const food = req.params.food;

    if (!food) {
      res.status(404).json({message: Messages.NOTHING_FOUND});
    }

    const appId = process.env.EDAMAM_APP_ID;
    const appKey = process.env.EDAMAM_APP_KEY;
    const url = `https://api.edamam.com/api/nutrition-data?app_id=${appId}&app_key=${appKey}&ingr=${encodeURIComponent(food)}`;

    const response = await axios.get(url);
    const data = await response.data;

    if (data.totalNutrients.CHOCDF && data.totalNutrients.ENERC_KCAL) {
      const carbohydrate = data.totalNutrients.CHOCDF.quantity;
      const calories = data.totalNutrients.ENERC_KCAL.quantity;
      res.status(200).json({food, carbohydrate, calories});
    } else {
      res.status(404).json({message: Messages.NOTHING_FOUND});
    }
  };
}

module.exports = CarbsCountingController;
