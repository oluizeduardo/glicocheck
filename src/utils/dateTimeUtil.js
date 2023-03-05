class DateTimeUtil{
    
    /**
     * Returns a string with a language-sensitive representation 
     * of the current date and time. 
     * @returns string with the current date and time.
     */
    static getCurrentDateTime = () => {
        return new Date().toLocaleString('pt-BR');
    }
}

module.exports = DateTimeUtil;