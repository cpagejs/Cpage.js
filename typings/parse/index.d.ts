declare class Parse {
    private pipes;
    constructor();
    /**
     * 注册管道
     * @param name
     * @param factory
     */
    register(name: any, factory?: Function): this;
    pipe(name: string): any;
    /**
     * 词法解析
     * @param str
     */
    parse(str: any): any;
    /**
     * 处理参数为常量的状况
     * @param state
     * @param listenerFn
     * @param valueEq
     * @param watchFn
     */
    private constantHandelWatch;
    /**
     * 处理单次检测问题
     * @param state
     * @param listenerFn
     * @param valueEq
     * @param watchFn
     */
    private oneTimeHandelWatch;
    /**
     * 处理数组或对象的变量问题
     * @param state
     * @param listenerFn
     * @param valueEq
     * @param watchFn
     */
    private oneTimeLiteralHandelWatch;
    private inputsHandelWatch;
}
declare const parse: Parse;
export default parse;
