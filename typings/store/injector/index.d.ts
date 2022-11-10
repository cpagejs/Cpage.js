export default class Injector {
    /**
     * 模块注入函数
     * @param moduleNames 模块名称
     * @param strict 严格模式的判断，默认false
     */
    inject(moduleNames: Array<string>, strict?: Boolean): Object;
}
