export default class HandelType {
    /**
   * 判断数据类型
   * @param str
   * @returns {any}
   */
    type(str: any): any;
    /**
   * 判断输入的内容是否在0~9之间
   * @param str
   * @returns {boolean}
   */
    isNumber(str: any): Boolean;
    /**
     * 判断是否符合指数特征
     * @param ch
     * @returns {boolean|Boolean}
     */
    isExponent(ch: any): Boolean;
    /**
     * 判断是否属于特定字符：字母，_, $
     * @param str
     * @returns {boolean}
     */
    isLetter(str: any): Boolean;
    /**
     * 判断字符是否属于空格
     * @param str
     * @returns {boolean}
     */
    isWhiteSpace(str: any): Boolean;
    /**
     * 判断被解析的字符串属于那种数据类型
     * @param str
     * @returns {any}
     */
    whichType(str: any): any;
}
