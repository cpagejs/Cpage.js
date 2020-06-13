"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HandelEventer_1 = require("../util/HandelEventer");
var util_1 = require("../util");
/**
 * 监听组件的data数据变化
 */
var HandelData = /** @class */ (function () {
    function HandelData() {
        this.data = {};
        this.name = '';
        this.token = undefined;
        this.props = {};
        this.componentStatus = '';
    }
    HandelData.prototype.$data = function (key, val) {
        var n = arguments.length;
        switch (n) {
            case 0:
                return this.data;
            case 1:
                return this.data[key];
            case 2:
                var oldData = util_1.default.deepClone(this.data);
                this.data[key] = val;
                var newData = this.data;
                HandelEventer_1.default.trigger(key, util_1.default.clone({
                    target: this.token,
                    which: this.name,
                    old: oldData,
                    new: newData,
                    oldVal: oldData[key],
                    newVal: newData[key],
                    props: this.props == undefined ? {} : this.props,
                    componentStatus: this.componentStatus
                }));
                break;
        }
    };
    return HandelData;
}());
var Data = new HandelData();
exports.default = Data;
