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
var nodeModel = /** @class */ (function (_super) {
    __extends(nodeModel, _super);
    function nodeModel(selector) {
        return _super.call(this, selector) || this;
    }
    /**
     * 设置，获取html
     * @param str html值
     */
    nodeModel.prototype.html = function (str) {
        if (str && util_1.default.type(str) != 'string') {
            return;
        }
        if (!str) {
            return this.els[0].innerHTML;
        }
        else {
            this.each(this.els, function (val, index) {
                val.innerHTML = str;
            });
            return this;
        }
    };
    /**
     * 设置，获取节点文本
     * @param str 文本值
     */
    nodeModel.prototype.text = function (str) {
        var e_1, _a;
        if (str && util_1.default.type(str) != 'string') {
            return;
        }
        try {
            for (var _b = __values(this.els), _c = _b.next(); !_c.done; _c = _b.next()) {
                var i = _c.value;
                if (arguments.length == 0) {
                    return i.innerText || i.textContent;
                }
                else if (arguments.length == 1) {
                    if (i.innerText) {
                        i.innerText = str;
                    }
                    else {
                        i.textContent = str;
                    }
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
    nodeModel.prototype.css = function (key, value) {
        var e_2, _a;
        if (key && util_1.default.type(key) != 'string') {
            return;
        }
        if (value && util_1.default.type(value) != 'string') {
            return;
        }
        try {
            for (var _b = __values(this.els), _c = _b.next(); !_c.done; _c = _b.next()) {
                var i = _c.value;
                if (arguments.length == 1) {
                    return window.getComputedStyle(i, null)[key];
                }
                else if (arguments.length == 2) {
                    i.style[key] = value;
                    return this;
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
     * 获取，设置元素宽度
     * @param str
     */
    nodeModel.prototype.width = function (str) {
        var e_3, _a;
        if (str && util_1.default.type(str) != 'string') {
            return;
        }
        try {
            for (var _b = __values(this.els), _c = _b.next(); !_c.done; _c = _b.next()) {
                var i = _c.value;
                if (str) {
                    i.style.width = str;
                }
                else {
                    return i.offsetWidth;
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
        return this;
    };
    /**
    * 获取，设置元素高度
    * @param str
    */
    nodeModel.prototype.height = function (str) {
        var e_4, _a;
        if (str && util_1.default.type(str) != 'string') {
            return;
        }
        try {
            for (var _b = __values(this.els), _c = _b.next(); !_c.done; _c = _b.next()) {
                var i = _c.value;
                if (str) {
                    i.style.height = str;
                }
                else {
                    return i.offsetHeight;
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
    /**
     * 获取，设置节点的属性值
     * @param attr 属性名
     * @param value 属性值
     */
    nodeModel.prototype.attr = function (attr, value) {
        var e_5, _a;
        if (util_1.default.type(attr) != 'string') {
            return;
        }
        if (value && util_1.default.type(value) != 'string') {
            return;
        }
        try {
            for (var _b = __values(this.els), _c = _b.next(); !_c.done; _c = _b.next()) {
                var i = _c.value;
                if (arguments.length == 1) {
                    if (i.hasAttribute(attr)) {
                        return i.getAttribute(attr);
                    }
                }
                else if (arguments.length == 2) {
                    i.setAttribute(attr, value);
                    return this;
                }
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_5) throw e_5.error; }
        }
    };
    /**
     * 获取，设置节点的value值
     * @param str value值
     */
    nodeModel.prototype.val = function (str) {
        var e_6, _a;
        if (str && util_1.default.type(str) != 'string') {
            return;
        }
        try {
            for (var _b = __values(this.els), _c = _b.next(); !_c.done; _c = _b.next()) {
                var i = _c.value;
                if (arguments.length == 1) {
                    var oldStr = i.getAttribute('value');
                    i.setAttribute(oldStr, str);
                }
                else if (arguments.length == 0) {
                    if (i.nodeName.match(/INPUT|TEXTAREA|SELECT|RADIO|CHECKBOX/)) {
                        return i.value;
                    }
                    return i.getAttribute('value');
                }
            }
        }
        catch (e_6_1) { e_6 = { error: e_6_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_6) throw e_6.error; }
        }
        return this;
    };
    /**
     * 给节点添加class
     * @param name
     */
    nodeModel.prototype.addClass = function (name) {
        var e_7, _a;
        if (name && util_1.default.type(name) != 'string') {
            return;
        }
        try {
            for (var _b = __values(this.els), _c = _b.next(); !_c.done; _c = _b.next()) {
                var i = _c.value;
                i.classList.add(name);
            }
        }
        catch (e_7_1) { e_7 = { error: e_7_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_7) throw e_7.error; }
        }
        return this;
    };
    /**
     * 删除节点的class
     * @param name
     */
    nodeModel.prototype.removeClass = function (name) {
        var e_8, _a;
        if (name && util_1.default.type(name) != 'string') {
            return;
        }
        try {
            for (var _b = __values(this.els), _c = _b.next(); !_c.done; _c = _b.next()) {
                var i = _c.value;
                i.classList.remove(name);
            }
        }
        catch (e_8_1) { e_8 = { error: e_8_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_8) throw e_8.error; }
        }
        return this;
    };
    /**
     * 切换class
     */
    nodeModel.prototype.toggleClass = function (name) {
        var e_9, _a;
        if (name && util_1.default.type(name) != 'string') {
            return;
        }
        try {
            for (var _b = __values(this.els), _c = _b.next(); !_c.done; _c = _b.next()) {
                var i = _c.value;
                if (i.classList.toggle(name)) {
                    return true;
                }
                else {
                    return false;
                }
            }
        }
        catch (e_9_1) { e_9 = { error: e_9_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_9) throw e_9.error; }
        }
    };
    return nodeModel;
}(targetDom_1.default));
exports.default = nodeModel;
