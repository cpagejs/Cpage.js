"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Duff = /** @class */ (function () {
    function Duff(array, fn) {
        this._array = array;
        this._fn = fn;
    }
    Object.defineProperty(Duff.prototype, "array", {
        get: function () {
            return this._array;
        },
        set: function (value) {
            if (!Array.isArray(value))
                return;
            this._array = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Duff.prototype, "fn", {
        get: function () {
            return this._fn;
        },
        set: function (value) {
            if (value.constructor != Function)
                return;
            this._fn = value;
        },
        enumerable: false,
        configurable: true
    });
    Duff.prototype.duff = function () {
        var iterations = Math.floor(this._array.length / 8);
        var leftover = this._array.length % 8;
        var i = 0;
        if (leftover > 0) {
            do {
                this._fn(this._array[i++]);
            } while (--leftover > 0);
        }
        do {
            this._fn(this._array[i++]);
            this._fn(this._array[i++]);
            this._fn(this._array[i++]);
            this._fn(this._array[i++]);
            this._fn(this._array[i++]);
            this._fn(this._array[i++]);
            this._fn(this._array[i++]);
            this._fn(this._array[i++]);
        } while (--iterations > 0);
    };
    return Duff;
}());
exports.default = Duff;
