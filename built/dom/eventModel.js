"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
var targetDom_1 = require("./targetDom");
var util_1 = require("../util");
// 事件的操作
var eventModel = /** @class */ (function (_super) {
    __extends(eventModel, _super);
    function eventModel(selector) {
        return _super.call(this, selector) || this;
    }
    // 事件绑定
    eventModel.prototype.on = function (eventType, fn) {
        this.each(this.els, function (val, index) {
            val.addEventListener(eventType, fn, false);
        });
    };
    // 解除事件绑定
    eventModel.prototype.off = function (eventType, fn) {
        this.each(this.els, function (val, index) {
            val.removeEventListener(eventType, fn, false);
        });
    };
    // 鼠标移入移除
    eventModel.prototype.hover = function (hover, out) {
        var e_1, _a;
        try {
            for (var _b = __values(this.els), _c = _b.next(); !_c.done; _c = _b.next()) {
                var i = _c.value;
                if (util_1.default.type(hover) == 'function') {
                    i.addEventListener('mouseover', hover, false);
                }
                else {
                    throw new Error('hover方法：没有传递回调函数');
                }
                if (util_1.default.type(out) == 'function') {
                    i.addEventListener('mouseout', hover, false);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return this;
    };
    // 点击事件
    eventModel.prototype.click = function (fn) {
        var e_2, _a;
        try {
            for (var _b = __values(this.els), _c = _b.next(); !_c.done; _c = _b.next()) {
                var i = _c.value;
                if (util_1.default.type(fn) == 'function') {
                    i.addEventListener('click', fn, false);
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return this;
    };
    //设置点击切换方法
    eventModel.prototype.toggle = function () {
        var e_3, _a;
        try {
            for (var _b = __values(this.els), _c = _b.next(); !_c.done; _c = _b.next()) {
                var i = _c.value;
                (function (element, args) {
                    var count = 0;
                    element.addEventListener('click', function () {
                        args[count++ % args.length].call(this);
                    }, false);
                })(i, arguments);
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_3) throw e_3.error; }
        }
        return this;
    };
    //窗口滚动事件
    eventModel.prototype.scroll = function (fn) {
        var e_4, _a;
        try {
            for (var _b = __values(this.els), _c = _b.next(); !_c.done; _c = _b.next()) {
                var i = _c.value;
                if (util_1.default.type(fn) == 'function') {
                    i.addEventListener('scroll', fn, false);
                }
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_4) throw e_4.error; }
        }
        return this;
    };
    eventModel.prototype.resize = function (fn) {
        var e_5, _a;
        try {
            for (var _b = __values(this.els), _c = _b.next(); !_c.done; _c = _b.next()) {
                var i = _c.value;
                var offsetLeft = i.offsetLeft;
                var offsetWidth = i.offsetWidth;
                var offsetTop = i.offsetTop;
                var offsetHeight = i.offsetHeight;
                window.onresize = function () {
                    fn();
                    if (offsetLeft >= util_1.default.page().width - offsetWidth) {
                        offsetLeft = util_1.default.page().width - offsetWidth;
                    }
                    if (offsetTop >= util_1.default.page().height - offsetHeight) {
                        offsetTop = util_1.default.page().height - offsetHeight;
                    }
                };
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_5) throw e_5.error; }
        }
        return this;
    };
    return eventModel;
}(targetDom_1.default));
exports.default = eventModel;
