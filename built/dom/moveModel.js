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
/**
 * 动画操作
 */
var moveModel = /** @class */ (function (_super) {
    __extends(moveModel, _super);
    function moveModel(selector) {
        return _super.call(this, selector) || this;
    }
    moveModel.prototype.show = function (delay) {
        var e_1, _a, e_2, _b;
        if (delay && typeof delay == 'number') {
            var _loop_1 = function (i) {
                setTimeout(function () {
                    i.style.display = 'none';
                }, delay || 500);
            };
            try {
                for (var _c = __values(this.els), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var i = _d.value;
                    _loop_1(i);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        else if (!delay) {
            try {
                for (var _e = __values(this.els), _f = _e.next(); !_f.done; _f = _e.next()) {
                    var i = _f.value;
                    i.style.display = 'block';
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                }
                finally { if (e_2) throw e_2.error; }
            }
        }
        return this;
    };
    moveModel.prototype.hide = function (delay) {
        var e_3, _a, e_4, _b;
        if (delay && typeof delay == 'number') {
            var _loop_2 = function (i) {
                setTimeout(function () {
                    i.style.display = 'block';
                }, delay || 500);
            };
            try {
                for (var _c = __values(this.els), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var i = _d.value;
                    _loop_2(i);
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                }
                finally { if (e_3) throw e_3.error; }
            }
        }
        else if (!delay) {
            try {
                for (var _e = __values(this.els), _f = _e.next(); !_f.done; _f = _e.next()) {
                    var i = _f.value;
                    i.style.display = 'none';
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                }
                finally { if (e_4) throw e_4.error; }
            }
        }
        return this;
    };
    return moveModel;
}(targetDom_1.default));
exports.default = moveModel;
