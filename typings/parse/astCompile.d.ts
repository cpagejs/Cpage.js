import { astCompileAction } from './astCompile_action';
export default class ASTCompile implements astCompileAction {
    private astBuilder;
    private state;
    private ast;
    constructor(astBuilder: any, pipes: any);
    /**
     * 词法树的最终解析执行函数
     * @param text
     * @returns {Function}
     */
    compile(text: any): any;
    /**
     * 递归解析词法树
     * @param ast 词法结构树
     * @param context 针对函数的上下文
     * @param createNewElement 布尔值，如果属性不存在就动态创建一个
     * @returns {any}
     */
    private handelTree;
    /**
     * 初始化词法编译器
     * @param ast
     */
    private initCompile;
    /**
     * 基础类数据编译
     * @param ast
     * @returns {any}
     */
    private metaCompile;
    /**
     * 数组类词法树编译
     * @param ast
     * @returns {string}
     */
    private arrayCompile;
    /**
     * 对象类词法树编译
     * @param ast
     * @returns {string}
     */
    private objectCompile;
    /**
     * 标识符词法树编译
     * @param ast
     * @param context
     * @param createNewElement
     * @returns {string}
     */
    private identifierCompile;
    /**
     * 含有this的编译
     * @returns {string}
     */
    private thisCompile;
    /**
     * 对象属性操作类词法树编译，如a.b, a["b"]
     * @param ast
     * @param context
     * @param createNewElement
     * @returns {string}
     */
    private memberCompile;
    /**
     * 函数类词法树编译
     * @param ast
     * @returns {string}
     */
    private functionCompile;
    /**
     *含有等号等符号类词法树编译
     * @param ast
     * @returns {any}
     */
    private assigmentCompile;
    /**
     * 含有一元运算符的编译
     * @param ast
     * @returns {string}
     */
    private unaryCompile;
    /**
     * 二元运算符编译
     * @param ast
     * @returns {string}
     */
    private binaryCompile;
    /**
     * 逻辑运算符编译
     * @param ast
     * @returns {string}
     */
    private logicalCompile;
    /**
     * 三元运算符编译
     * @param ast
     * @returns {string}
     */
    private ternaryCompile;
    /**
     * 管道编译
     * @param name
     */
    private pipeCompile;
    /**
     * 判断pipes是否存在
     */
    private pipePrefix;
    /**
     * compileId自增
     */
    private incrementId;
    /**
     * 字面量
     */
    private isLiteral;
    /**
     * 常量
     * @param ast
     */
    private constantExpr;
}
