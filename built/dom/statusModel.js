"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
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
// 操作dom节点
var statusModel = /** @class */ (function (_super) {
    __extends(statusModel, _super);
    function statusModel(selector) {
        return _super.call(this, selector) || this;
    }
    // 判断节点是否拥有属性
    statusModel.prototype.hasAttrs = function () {
        var e_1, _a;
        try {
            for (var _b = __values(this.els), _c = _b.next(); !_c.done; _c = _b.next()) {
                var i = _c.value;
                if (i.hasAttributes()) {
                    return true;
                }
                else {
                    return false;
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
    };
    /**
     * 判断节点是否有某个属性
     * @param attr 属性名
     */
    statusModel.prototype.hasAttr = function (attr) {
        var e_2, _a;
        if (attr && util_1.default.type(attr) != 'string') {
            return;
        }
        try {
            for (var _b = __values(this.els), _c = _b.next(); !_c.done; _c = _b.next()) {
                var i = _c.value;
                if (i.hasAttribute(attr)) {
                    return true;
                }
                else {
                    return false;
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
    };
    /**
     * 判断节点是否有某个class
     * @param name class名称
     */
    statusModel.prototype.hasClass = function (name) {
        var e_3, _a;
        if (name && util_1.default.type(name) != 'string') {
            return;
        }
        try {
            for (var _b = __values(this.els), _c = _b.next(); !_c.done; _c = _b.next()) {
                var i = _c.value;
                if (i.classList.contains(name)) {
                    return true;
                }
                else {
                    return false;
                }
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_3) throw e_3.error; }
        }
    };
    return statusModel;
}(targetDom_1.default));
exports.default = statusModel;
