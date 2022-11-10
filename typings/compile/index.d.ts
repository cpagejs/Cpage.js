export default class CPage {
    CList: any[];
    id: number;
    static version: string;
    constructor();
    /**
     * es6模式，渲染组件
     * @param selector id选择符，如果是class，则取第一个节点
     * @param fn 根组件函数
     */
    static bootstrap(selector: any, fn: any): void;
    /**
     * 路由
     * @param config 路由配置
     */
    static router(config: Array<object>): void;
    directive(name: any, fn: any): any;
    /**
     * es5模式获取组建信息
     * @param obj
     */
    component(obj: any): object;
    /**
     * es5模式，将组件渲染到dom
     * @param selector id选择符，如果是class，则取第一个节点
     * @param root 根组件信息
     */
    bootstrap(selector: string, root: any): void;
}
/**
 * es6模式构建组件
 */
export declare class Component {
    components: Array<any>;
    name: string;
    template: string;
    templateUrl: string;
    style: string;
    styleUrl: string;
    data: object;
    props: object;
    constructor();
    render(): void;
}
