"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var loader_1 = require("./loader");
var injector_1 = require("./injector");
var loader = new loader_1.default();
var inject = new injector_1.default();
/**
 * 数据存储解析服务
 */
var Store = /** @class */ (function () {
    function Store(moduleName) {
        if (moduleName === void 0) { moduleName = 'Cpage'; }
        this.app = loader.module(moduleName, []);
        this.ins = function () {
            return inject.inject([moduleName]);
        };
    }
    /**
     * 存储数据
     * @param key
     * @param val
     */
    Store.prototype.data = function (key, val) {
        this.app.data(key, val);
    };
    /**
     * 是否有key这个变量
     * @param key
     */
    Store.prototype.has = function (key) {
        return this.ins().has(key);
    };
    /**
     * 获取数据
     * @param key
     */
    Store.prototype.get = function (key) {
        return this.ins().get(key);
    };
    /**
     * provider函数
     * @param key
     * @param obj { $get: function(){} }
     */
    Store.prototype.provider = function (key, obj) {
        this.app.provider(key, obj);
    };
    /**
     * factory函数
     * @param key
     * @param fn 需要返回值
     */
    Store.prototype.factory = function (key, fn) {
        this.app.factory(key, fn);
    };
    /**
     * service 函数
     * @param key
     * @param fn
     */
    Store.prototype.service = function (key, fn) {
        this.app.service(key, fn);
    };
    return Store;
}());
exports.default = Store;
