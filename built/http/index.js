"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var parseHttp_1 = require("./parseHttp");
var Http = /** @class */ (function () {
    function Http() {
    }
    /**
     * ajax请求方式，全配置
     * @param param0
     */
    Http.prototype.ajax = function (_a) {
        var _b = _a.type, type = _b === void 0 ? 'get' : _b, _c = _a.url, url = _c === void 0 ? '' : _c, data = _a.data;
        return parseHttp_1.parseHttp(type, url, data);
    };
    /**
     * get请求方式
     * @param url
     */
    Http.prototype.get = function (url) {
        return parseHttp_1.parseHttp('get', url, null);
    };
    /**
     * post请求
     * @param url
     * @param data
     */
    Http.prototype.post = function (url, data) {
        return parseHttp_1.parseHttp('post', url, data);
    };
    /**
     * put请求
     * @param url
     * @param data
     */
    Http.prototype.put = function (url, data) {
        return parseHttp_1.parseHttp('put', url, data);
    };
    /**
     * delete请求
     * @param url
     * @param data
     */
    Http.prototype.delete = function (url, data) {
        return parseHttp_1.parseHttp('delete', url, data);
    };
    return Http;
}());
var http = new Http();
exports.default = http;
