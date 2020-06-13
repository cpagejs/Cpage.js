"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HandelEventer_1 = require("../util/HandelEventer");
/**
 * 组件事件监听函数
 */
var HandelEvent = /** @class */ (function () {
    function HandelEvent() {
    }
    /**
     * 触发事件
     * @param name 事件名称
     * @param msg 信息
     */
    HandelEvent.prototype.trigger = function (name, msg) {
        HandelEventer_1.default.trigger(name, msg);
    };
    /**
     * 监听事件
     * @param name 事件名称
     * @param fn 回调函数，返回触发的信息
     */
    HandelEvent.prototype.listen = function (name, fn) {
        HandelEventer_1.default.listen(name, fn);
    };
    return HandelEvent;
}());
var handelEvent = new HandelEvent();
exports.default = handelEvent;
