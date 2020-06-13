"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var $log = require("../../log");
var moduleNames = {};
var Loader = /** @class */ (function () {
    function Loader() {
        this.modules = {
            name: '',
            requires: []
        };
    }
    Loader.prototype.clear = function () {
        this.modules = {};
    };
    /**
     * 模块
     * @param name 模块名称
     * @param requires 模块的依赖项
     * @param configFn 配置函数
     */
    Loader.prototype.module = function (name, requires, configFn) {
        var modules = {};
        if (requires) {
            this.modules = this.$$set(name, requires, modules, configFn);
        }
        else {
            this.modules = this.$$get(name, modules);
        }
        return this.modules;
    };
    /**
     * 生成module
     * @param name
     * @param requires
     * @param configFn
     */
    Loader.prototype.$$set = function (name, requires, modules, configFn) {
        if (name == 'hasOwnProperty')
            $log.error('hasOwnProperty不能用于键名');
        var invokeQueue = [];
        var configQueue = [];
        /**
         * 引用函数
         * @param service 服务名称
         * @param prefix data,provider
         * @param arrProp 数组属性
         * @param queue 引用队列
         */
        var invokeFn = function (service, prefix, arrProp, queue) {
            if (arrProp === void 0) { arrProp = 'push'; }
            if (queue === void 0) { queue = invokeQueue; }
            return function () {
                queue[arrProp]([service, prefix, arguments]);
                return moduleObj;
            };
        };
        var moduleObj = {
            name: name,
            requires: requires,
            // data: (key, val)=>{
            //     invokeQueue.unshift(['data', [key, val]]);
            // },
            // provider: (key, val)=>{
            //     invokeQueue.push(['provider', [key, val]]);
            // },
            data: invokeFn('$provider', 'data', 'unshift'),
            provider: invokeFn('$provider', 'provider'),
            factory: invokeFn('$provider', 'factory'),
            value: invokeFn('$provider', 'value'),
            service: invokeFn('$provider', 'service'),
            config: invokeFn('$injector', 'invoke', 'push', configQueue),
            run: function (fn) {
                moduleObj._runQueue.push(fn);
                return moduleObj;
            },
            pipe: invokeFn('$pipeProvider', 'register'),
            // directive: invokeFn('$compileProvider', 'directive'),
            _invokeQueue: invokeQueue,
            _configQueue: configQueue,
            _runQueue: []
        };
        if (configFn) {
            moduleObj.config(configFn);
        }
        this.modules = moduleNames[name] = moduleObj;
        return moduleObj;
    };
    /**
     * 根据name获取module
     * @param name
     * @param modules
     */
    Loader.prototype.$$get = function (name, modules) {
        if (moduleNames.hasOwnProperty(name)) {
            return moduleNames[name];
        }
        $log.error('名称为' + name + '的module不存在！');
    };
    return Loader;
}());
exports.default = Loader;
