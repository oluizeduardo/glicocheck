/**
 * DateTimeUtil.
 */
class DateTimeUtil {
  /**
   * Returns a string with a language-sensitive representation
   * of the current date and time.
   * @return {string} with the current date and time.
   */
  static getCurrentDateTime = () => {
    return new Date().toLocaleString('pt-BR');
  };
  /**
   * This function calculates if has passed 60 minutes (1 hour)
   * from the initial datetime.
   * @param {Date} initialDateTime the initial date object.
   * @return {boolean} True if has passed 60 minutes from the initial date.
   * Returns false otherwise.
   */
  static isPassedOneHour = (initialDateTime) => {
    const initialTime = new Date(initialDateTime).getTime();
    const now = new Date().getTime();
    const seconds = (now - initialTime)/1000;
    const diffMinutes = Math.round(seconds/60);
    return (diffMinutes > 60);
  };
}

module.exports = DateTimeUtil;
