import Loader from './loader';
import Injector from './injector';
const loader = new Loader();
const inject = new Injector();

/**
 * 数据存储解析服务
 */
export default class Store {
    private app;
    private ins;

    constructor(moduleName='Cpage'){
        this.app = loader.module(moduleName, []);
        this.ins = function():any{
            return inject.inject([moduleName]);
        }
    }

    /**
     * 存储数据
     * @param key 
     * @param val 
     */
    data(key:string, val:any):void{
        this.app.data(key, val);
    }

    /**
     * 是否有key这个变量
     * @param key 
     */
    has(key):boolean{
        return this.ins().has(key);
    }

    /**
     * 获取数据
     * @param key 
     */
    get(key):any{
        return this.ins().get(key);
    }

    /**
     * provider函数
     * @param key 
     * @param obj { $get: function(){} }
     */
    provider(key:string, obj:object):void{
        this.app.provider(key, obj);
    }

    /**
     * factory函数
     * @param key 
     * @param fn 需要返回值
     */
    factory(key:string, fn:Function):void{
        this.app.factory(key, fn);
    }

    /**
     * service 函数
     * @param key 
     * @param fn 
     */
    service(key:string, fn:Function):void{
        this.app.service(key, fn);
    }

}
