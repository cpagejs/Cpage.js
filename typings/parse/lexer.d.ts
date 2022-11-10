/**
 * 此法解析器，用于解析{{a + b}} 之类的插值运算
 */
export default class Lexer {
    private index;
    private now;
    private tokens;
    private text;
    constructor();
    /**
     * 词法解析函数
     * @param text
     * @returns {Array<any>}
     */
    lex(text: string): Array<any>;
    /**
     * 添加词法解析对象
     */
    private pushObj;
    /**
     * 获取下一个字符
     * @param n
     * @returns {string|boolean}
     */
    private nextStr;
    /**
     * 遍历数字类
     */
    private loopNumber;
    /**
     * 遍历字符串类，'"abc"'
     */
    private loopString;
    /**
     * 字符类, 'abc_$'
     */
    private loopLetter;
    /**
     * 操作符，+- ！==
     */
    private loopOperator;
}
