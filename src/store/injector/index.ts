import * as $log from '../../log';
import Util from '../../util';
import Loader from '../loader';
const loader = new Loader();

// 处理函数
const FN_REG = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;
// 处理空格
const SPACE_REG = /^\s*(\S+)\s*$/;
// 处理注释
const COMMENTS_REG = /(\/\*.*?\*\/)|(\/\/$)/mg;

export default class Injector {

    /**
     * 模块注入函数
     * @param moduleNames 模块名称
     * @param strict 严格模式的判断，默认false
     */
    public inject(moduleNames: Array<string>, strict?: Boolean):Object {
        if (Util.type(moduleNames) != 'array')
            $log.error('模块的名称的参数为数组');

        // 缓存data数据
        let providerCache:any = {$injector: undefined, $provider: {data: undefined, provider: undefined}};
        let providerInjecter:any = providerCache.$injector = injectAgency(providerCache, ()=>{
            // $log.error('未知的provider'+JSON.stringify(depPath));
        });

        let dataCache:any = {$injector: undefined};
        let dataInjecter:any = dataCache.$injector = injectAgency(dataCache, (name)=>{
            let provider:any = providerInjecter.get(name + 'Provider');
            return dataInjecter.invoke(provider.$get, provider)
        });
        
        // 已经加载的模块
        let loadedModules = new Map();
        let cricle = false;
        // provider依赖数组,[['数组名',['依赖项']]] [['a',['b']]]
        let depPath = [];
        // run 函数队列
        let runQueue = [];

        /**
         * 处理函数的返回值
         * @param fn 
         */
        function handelReturn(fn){
            return function(){
                const val = dataInjecter.invoke(fn);
                if(Util.type(val) == 'undefined'){
                    $log.error('factory函数必须有返回值');
                }
                return val;
            }
        }

        providerCache.$provider = {
            data: (key, val) => {
                if (key == 'hasOwnProperty' || key == '$injector' || key == '$provider')
                    $log.error(key + '不能用于标识符');

                dataCache[key] = val;
                providerCache[key] = val;
            },
            provider: (key, val) => {
                if (key == 'hasOwnProperty' || key == '$injector' || key == '$provider')
                    $log.error(key + '不能用于标识符');

                if (Util.type(val) == 'function') {
                    // val = instantiate(val);
                    val = providerInjecter.instantiate(val);
                }
                providerCache[key + 'Provider'] = val;
            },
            factory: function(key, fn){
                this.provider(key, {$get: handelReturn(fn)});
            },
            value: function(key, val){
                this.factory(key, function(){ return val })
            },
            service: function(key, fn){
                this.factory(key, function(){
                    return dataInjecter.instantiate(fn)
                });
            }
        };

        const listQueue = (queues)=>{
            queues.forEach((inq) => {
                let service = providerInjecter.get(inq[0]);
                const method = inq[1];
                const args = inq[2];
                // const arr = [args[0], args[1]];
                // providerCache.$provider[method].apply(providerCache.$provider, args);
                service[method].apply(service, args);
            });
        }

        moduleNames.forEach(function loadMobule(val) {
            if(!loadedModules.get(val)){
                loadedModules.set(val, true);
                if(Util.type(val) == 'string'){
                    let module = loader.module(val);
                    module.requires.forEach(loadMobule); // 递归其他的依赖模块
                    
                    listQueue(module._invokeQueue);
                    listQueue(module._configQueue);
                    runQueue = runQueue.concat(module._runQueue);
                }
                if(Util.type(val) == 'function' || Util.type(val) == 'array'){
                    runQueue.push(providerInjecter.invoke(val));
                }
            }
        });

        //执行run函数队列
        Util.arrayCompact(runQueue).forEach((run)=>{
            dataInjecter.invoke(run);
        });

        function injectAgency(cache, fn) {
            /**
             * 处理缓存
             * @param name data或者provideer名称
             */
            function handelCache(name) {
                handeldepPath(depPath);
                
                if (cache.hasOwnProperty(name)) {
                    return cache[name];
                } else {
                    try {
                        return (cache[name] = fn(name));
                    } finally {
                        if (cricle)
                            delete cache[name];
                    }
                }
            }

            /**
             * $inject内部的调用函数
             * @param fn 注入的函数或数组
             * @param obj 对象，fn为其属性
             * @param local 用于覆盖$inject数组的item项 
             * @param name data或provider名称
             */
            function invoke(fn, obj?, local?, name?: string) {
                if (arguments.length == 1) {
                    obj = null;
                }
                
                const args = annotate(fn, name).map((v) => {
                    if (Util.type(v) == 'string')
                        return (local && local.hasOwnProperty(v)) ? local[v] : handelCache(v);
                    else
                        $log.error('无效的标识符' + v + '，标识符应为字符串');
                });

                if (Util.type(fn) == 'array') {
                    fn = fn.slice(-1)[0];
                }
                
                return fn.apply(obj, args);
            }

            /**
             * 实例化
             * @param fn 
             * @param local 
             */
            function instantiate(fn, local?) {
                let fn2 = Util.type(fn) == 'array' ? fn.slice(-1)[0] : fn;
                let instance = Object.create(fn2.prototype);
                invoke(fn, instance, local);
                return instance;
            }

            function hasKey(key){
                return dataCache.hasOwnProperty(key) || providerCache.hasOwnProperty(key + 'Provider');
            }
            
            return {
                has: hasKey,
                get: handelCache,
                invoke: invoke,
                annotate: annotate,
                instantiate: instantiate
            };

        }

        function handeldepPath(arr: Array<any>) {
            if (arr.length) {
                if (arr[arr.length - 1][1].includes(arr[0][0])) {
                    let path = arr.map((v) => {
                        return v[0];
                    });
                    path.push(arr[0][0]);
                    cricle = true;
                    $log.error('发现循环依赖' + path.join('->'));
                }
            }
        }

        /**
         * 装饰器函数
         * @param fn 注入的函数
         */
        function annotate(fn:any, name?: string) {
            let arr = [];

            if(Util.type(fn) == 'array'){
                if(fn.length)
                    arr = fn.slice(0, fn.length - 1);
                else 
                    arr =  [];
            }
            
            if(Util.type(fn) == 'function'){
                if (strict) {
                    $log.error('函数没有$inject属性，不能再严格模式下使用');
                }
                else if (fn.$inject) { //普通函数，有$inject属性
                    arr = fn.$inject;
                }
                else {
                    let fns = (fn.toString().replace(COMMENTS_REG, '')).match(FN_REG);

                    arr = Util.arrayCompact(fns[1].split(',')).map((a) => {
                        return a.match(SPACE_REG)[1];
                    });

                    if(name != null){
                        depPath.push([name, arr]);
                    }
                }
            }
            // console.log(arr)
            return arr;
        }
        
        return dataInjecter;
    }
}