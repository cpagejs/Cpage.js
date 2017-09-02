import * as $log from '../log';
import Util from '../util';

/**
 * 执行管道过滤操作
 */
export default class Pipe {
    public pipes;

    constructor(){
        this.pipes = {};
    }

    /**
     * 注册管道函数
     * @param name 字符串或者对象
     * @param factory 
     */
    public register(name, factory?:Function):any{
        // this.pipes = {};

        //允许对象方式注册多个pipe
        if(Util.type(name) == 'object'){
            for(let i in name){
                return this.register(i, name[i]);
            }
        }

        if(Util.type(name) == 'string'){
            if(Util.type(factory) != 'function') $log.error('注册的管道函数类型为function');
            const pipe = factory();
            this.pipes[name] = pipe;
            return pipe;
        }
    }

    /**
     * 管道执行函数
     * @param name 
     */
    public pipe(name:string):any{
        return this.pipes[name];
    }

    public returnPipes(){
        return this.pipes;
    }
}

// const pipe = new Pipe();

export function $pipeProvider($provider):any{
    let pipes = {};

    this.register = function(name, factory){
        //允许对象方式注册多个pipe
        if(Util.type(name) == 'object'){
            for(let i in name){
                return this.register(i, name[i]);
            }
        }

        if(Util.type(name) == 'string'){
            if(Util.type(factory) != 'function') $log.error('注册的管道函数类型为function');
            return $provider.factory(name+'Pipe', factory);
        }
    }

    this.$get = ['$injector', function($injector){
        return function(name){
            return $injector.get(name + 'Pipe');
        }
    }]
}
(<any>$pipeProvider).$inject = ['$provider'];