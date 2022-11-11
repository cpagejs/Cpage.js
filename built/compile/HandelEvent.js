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
    HandelEvent.prototype.emit = function (name, msg) {
        HandelEventer_1.default.emit(name, msg);
    };
    /**
     * 监听事件
     * @param name 事件名称
     * @param fn 回调函数，返回触发的信息
     */
    HandelEvent.prototype.on = function (name, fn) {
        HandelEventer_1.default.on(name, fn);
    };
    return HandelEvent;
}());
var handelEvent = new HandelEvent();
exports.default = handelEvent;
