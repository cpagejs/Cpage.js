export default class Loader {
    modules: any;
    constructor();
    clear(): void;
    /**
     * 模块
     * @param name 模块名称
     * @param requires 模块的依赖项
     * @param configFn 配置函数
     */
    module(name: string, requires?: Array<any>, configFn?: any): any;
    /**
     * 生成module
     * @param name
     * @param requires
     * @param configFn
     */
    private $$set;
    /**
     * 根据name获取module
     * @param name
     * @param modules
     */
    private $$get;
}
