import { astBuilderAction } from './astBuilder_action';
/**
 * 抽象语法结构树
 [{ type: 'ASTBuilder.Program',
  body:
   { type: 'ASTBuilder.Binary',
     boolean_expression:
      { type: 'ASTBuilder.Binary',
        operator: '>',
        left: { type: 'ASTBuilder.Identifier', value: 'a' },
        right: { type: 'ASTBuilder.MetaData', value: 2 } },
     true_value: { type: 'ASTBuilder.MetaData', value: 1 },
     error_value: { type: 'ASTBuilder.MetaData', value: 0 } } }]
 */
export default class ASTBuilder implements astBuilderAction {
    lexer: any;
    tokens: any;
    constructor(lexer: any);
    /**
     * 生成抽象语法结构树
     * @param text
     * @returns {Object}
     */
    ast(text: String): Object;
    /**
     * 结构树形式, ';'看作是多个表达式的组合，故词法树的body有对象进化为对象数组Array<object>
     * @returns {{type: string, body: {}}}
     */
    private init;
    /**
     * 中介函数
     * @returns {any}
     */
    private agency;
    /**
     * 遍历'[]','{}','()'等对称标识符
     */
    private closingTags;
    /**
     * 结构树的常量部分
     * @returns {{type: string, value: {}}}
     */
    private constantBuilder;
    /**
    * 结构树的标识符部分
    * @returns {{type: string, value: {}}}
    */
    private identifierBuilder;
    /**
     * 结构树的数组部分
     * @returns {{type: string, value: {}}}
     */
    private arrayBuilder;
    /**
     * 结构树的对象部分
     * @returns {{type: string, value: {}}}
     */
    private objectBuilder;
    /**
     * 结构树的对象取值部分，a.b  a["b"]，a() 等
     * @param type
     * @param agency
     * @returns {{type: string, value: {}}}
     */
    private memberBuilder;
    /**
     * 含有‘=’等符号
     * @returns {any}
     */
    private assignmentBuilder;
    /**
     * 一元运算符
     * @returns {any}
     */
    private unaryBuilder;
    /**
     *乘法运算
     * @returns {Object}
     */
    private multiplicativeBuilder;
    /**
     * 加法运算
     * @returns {Object}
     */
    private additiveBuilder;
    /**
     * 关系运算符，‘>’
     * @returns {Object}
     */
    private relationalBuilder;
    /**
     * 等法运算符，‘==’
     * @returns {Object}
     */
    private equalityBuilder;
    /**
     * && 运算符， &&高于||
     * @returns {Object}
     */
    private andBuilder;
    /**
     * || 运算符， &&高于||
     * @returns {Object}
     */
    private orBuilder;
    /**
     * 三元运算符
     * @returns {Object}
     */
    private ternaryBuilder;
    /**
     * 管道处理
     */
    private pipeBuilder;
}
