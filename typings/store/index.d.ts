/**
 * 数据存储解析服务
 */
export default class Store {
    private app;
    private ins;
    constructor(moduleName?: string);
    /**
     * 存储数据
     * @param key
     * @param val
     */
    data(key: string, val: any): void;
    /**
     * 是否有key这个变量
     * @param key
     */
    has(key: any): boolean;
    /**
     * 获取数据
     * @param key
     */
    get(key: any): any;
    /**
     * provider函数
     * @param key
     * @param obj { $get: function(){} }
     */
    provider(key: string, obj: object): void;
    /**
     * factory函数
     * @param key
     * @param fn 需要返回值
     */
    factory(key: string, fn: Function): void;
    /**
     * service 函数
     * @param key
     * @param fn
     */
    service(key: string, fn: Function): void;
}
