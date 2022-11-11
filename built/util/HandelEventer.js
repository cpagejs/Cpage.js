"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HandelEventer = /** @class */ (function () {
    function HandelEventer() {
        this.eventList = {};
    }
    /**
     * 触发事件
     * @param name
     * @param msg
     */
    HandelEventer.prototype.emit = function (name, msg) {
        var key = Array.prototype.shift.call(arguments);
        var fns = this.eventList[key];
        if (!fns || fns.length === 0) {
            return false;
        }
        ;
        for (var i = 0, fn; fn = fns[i++];) {
            fn.apply(this, arguments);
        }
    };
    /**
     * 监听事件
     * @param name
     * @param fn
     */
    HandelEventer.prototype.on = function (name, fn) {
        if (!this.eventList[name]) {
            this.eventList[name] = [];
        }
        ;
        this.eventList[name].push(fn);
    };
    HandelEventer.prototype.remove = function (key, fn) {
        var fns = this.eventList[key];
        // key对应的消息没有被人订阅
        if (!fns) {
            return false;
        }
        // 没有传入fn(具体的回调函数), 表示取消key对应的所有订阅
        if (!fn) {
            fns && (fns.length = 0);
        }
        else {
            // 反向遍历
            for (var i = fns.length - 1, _fn = fns[i]; i >= 0; i--) {
                if (_fn === fn) {
                    // 删除订阅回调函数
                    fns.splice(i, 1);
                }
            }
        }
    };
    return HandelEventer;
}());
var Eventer = new HandelEventer();
exports.default = Eventer;
