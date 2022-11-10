/**
 * 执行管道过滤操作
 */
export default class Pipe {
    pipes: any;
    constructor();
    /**
     * 注册管道函数
     * @param name 字符串或者对象
     * @param factory
     */
    register(name: any, factory?: Function): any;
    /**
     * 管道执行函数
     * @param name
     */
    pipe(name: string): any;
    returnPipes(): any;
}
export declare function $pipeProvider($provider: any): any;
