import { routerAction } from './router_action';
export default class Router implements routerAction {
    private url;
    routers: Array<object>;
    nowRouter: any;
    params: object;
    constructor(url: any, routers: any);
    /**
     * 获取当前路由
     * @param url 浏览器pathname
     * @param routers 路由集合
     */
    _getNowRouter(url: any, routers: any): any;
    _parseRouters(routers: any): any;
    /**
     * 转换路径为正则
     * @param path 路径
     */
    _pathToReg(path: any): {
        originalPath: any;
        regexp: any;
    };
    /**
     * 跳转到已存在的路由页面
     * @param path 需要跳转的路径
     */
    go({ path, params }: {
        path?: string;
        params?: {};
    }): void;
    /**
     * url的hash
     * @param path
     */
    hash(path?: string): any;
    /**
     * 刷新当前路由
     */
    reflesh(): void;
    /**
     * 返回
     */
    back(): void;
}
