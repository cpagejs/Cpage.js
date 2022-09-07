"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseHttp = void 0;
var util_1 = require("../util");
var $log = require("../log");
// 支持的类型
var httpType = ['get', 'post', 'put', 'delete', 'head', 'options'];
/**
 * 解析http请求
 * @param type 请求类型
 * @param url
 * @param data
 */
function parseHttp(type, url, data) {
    if (util_1.default.type(type) != 'string' && !httpType.includes(type.toLowerCase())) {
        $log.error('http请求类型必须为' + httpType + '中的一个');
    }
    if (util_1.default.type(url) != 'string') {
        $log.error('http请求的url参数需为字符');
    }
    if (data && util_1.default.type(data) != 'object') {
        $log.error('http请求的data参数需为对象');
    }
    var promise = new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open(type, url);
        xhr.onreadystatechange = handel;
        xhr.responseType = 'json';
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.send(data || null);
        function handel() {
            if (this.readyState != 4) {
                return;
            }
            if (this.status == 200) {
                resolve(this.response);
            }
            else {
                reject(new Error(this.statusText));
            }
        }
    });
    return promise;
}
exports.parseHttp = parseHttp;
