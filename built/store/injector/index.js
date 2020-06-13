"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var $log = require("../../log");
var util_1 = require("../../util");
var loader_1 = require("../loader");
var loader = new loader_1.default();
// 处理函数
var FN_REG = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;
// 处理空格
var SPACE_REG = /^\s*(\S+)\s*$/;
// 处理注释
var COMMENTS_REG = /(\/\*.*?\*\/)|(\/\/$)/mg;
var Injector = /** @class */ (function () {
    function Injector() {
    }
    /**
     * 模块注入函数
     * @param moduleNames 模块名称
     * @param strict 严格模式的判断，默认false
     */
    Injector.prototype.inject = function (moduleNames, strict) {
        if (util_1.default.type(moduleNames) != 'array')
            $log.error('模块的名称的参数为数组');
        // 缓存data数据
        var providerCache = { $injector: undefined, $provider: { data: undefined, provider: undefined } };
        var providerInjecter = providerCache.$injector = injectAgency(providerCache, function () {
            // $log.error('未知的provider'+JSON.stringify(depPath));
        });
        var dataCache = { $injector: undefined };
        var dataInjecter = dataCache.$injector = injectAgency(dataCache, function (name) {
            var provider = providerInjecter.get(name + 'Provider');
            return dataInjecter.invoke(provider.$get, provider);
        });
        // 已经加载的模块
        var loadedModules = new Map();
        var cricle = false;
        // provider依赖数组,[['数组名',['依赖项']]] [['a',['b']]]
        var depPath = [];
        // run 函数队列
        var runQueue = [];
        /**
         * 处理函数的返回值
         * @param fn
         */
        function handelReturn(fn) {
            return function () {
                var val = dataInjecter.invoke(fn);
                if (util_1.default.type(val) == 'undefined') {
                    $log.error('factory函数必须有返回值');
                }
                return val;
            };
        }
        providerCache.$provider = {
            data: function (key, val) {
                if (key == 'hasOwnProperty' || key == '$injector' || key == '$provider')
                    $log.error(key + '不能用于标识符');
                dataCache[key] = val;
                providerCache[key] = val;
            },
            provider: function (key, val) {
                if (key == 'hasOwnProperty' || key == '$injector' || key == '$provider')
                    $log.error(key + '不能用于标识符');
                if (util_1.default.type(val) == 'function') {
                    // val = instantiate(val);
                    val = providerInjecter.instantiate(val);
                }
                providerCache[key + 'Provider'] = val;
            },
            factory: function (key, fn) {
                this.provider(key, { $get: handelReturn(fn) });
            },
            value: function (key, val) {
                this.factory(key, function () { return val; });
            },
            service: function (key, fn) {
                this.factory(key, function () {
                    return dataInjecter.instantiate(fn);
                });
            }
        };
        var listQueue = function (queues) {
            queues.forEach(function (inq) {
                var service = providerInjecter.get(inq[0]);
                var method = inq[1];
                var args = inq[2];
                // const arr = [args[0], args[1]];
                // providerCache.$provider[method].apply(providerCache.$provider, args);
                service[method].apply(service, args);
            });
        };
        moduleNames.forEach(function loadMobule(val) {
            if (!loadedModules.get(val)) {
                loadedModules.set(val, true);
                if (util_1.default.type(val) == 'string') {
                    var module_1 = loader.module(val);
                    module_1.requires.forEach(loadMobule); // 递归其他的依赖模块
                    listQueue(module_1._invokeQueue);
                    listQueue(module_1._configQueue);
                    runQueue = runQueue.concat(module_1._runQueue);
                }
                if (util_1.default.type(val) == 'function' || util_1.default.type(val) == 'array') {
                    runQueue.push(providerInjecter.invoke(val));
                }
            }
        });
        //执行run函数队列
        util_1.default.arrayCompact(runQueue).forEach(function (run) {
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
                }
                else {
                    try {
                        return (cache[name] = fn(name));
                    }
                    finally {
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
            function invoke(fn, obj, local, name) {
                if (arguments.length == 1) {
                    obj = null;
                }
                var args = annotate(fn, name).map(function (v) {
                    if (util_1.default.type(v) == 'string')
                        return (local && local.hasOwnProperty(v)) ? local[v] : handelCache(v);
                    else
                        $log.error('无效的标识符' + v + '，标识符应为字符串');
                });
                if (util_1.default.type(fn) == 'array') {
                    fn = fn.slice(-1)[0];
                }
                return fn.apply(obj, args);
            }
            /**
             * 实例化
             * @param fn
             * @param local
             */
            function instantiate(fn, local) {
                var fn2 = util_1.default.type(fn) == 'array' ? fn.slice(-1)[0] : fn;
                var instance = Object.create(fn2.prototype);
                invoke(fn, instance, local);
                return instance;
            }
            function hasKey(key) {
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
        function handeldepPath(arr) {
            if (arr.length) {
                if (arr[arr.length - 1][1].includes(arr[0][0])) {
                    var path = arr.map(function (v) {
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
        function annotate(fn, name) {
            var arr = [];
            if (util_1.default.type(fn) == 'array') {
                if (fn.length)
                    arr = fn.slice(0, fn.length - 1);
                else
                    arr = [];
            }
            if (util_1.default.type(fn) == 'function') {
                if (strict) {
                    $log.error('函数没有$inject属性，不能再严格模式下使用');
                }
                else if (fn.$inject) { //普通函数，有$inject属性
                    arr = fn.$inject;
                }
                else {
                    var fns = (fn.toString().replace(COMMENTS_REG, '')).match(FN_REG);
                    arr = util_1.default.arrayCompact(fns[1].split(',')).map(function (a) {
                        return a.match(SPACE_REG)[1];
                    });
                    if (name != null) {
                        depPath.push([name, arr]);
                    }
                }
            }
            // console.log(arr)
            return arr;
        }
        return dataInjecter;
    };
    return Injector;
}());
exports.default = Injector;
