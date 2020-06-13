"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var $log = require("../log");
var util_1 = require("../util");
var parse_1 = require("../parse");
var ParseTpl = /** @class */ (function () {
    function ParseTpl(text, data, props) {
        this.text = text;
        this.data = data;
        this.props = props;
    }
    /**
     * 组合data和props属性
     * @param data
     * @param props
     */
    ParseTpl.prototype.combineData = function (data, props) {
        if (data === void 0) { data = {}; }
        if (props === void 0) { props = {}; }
        if (util_1.default.type(data) != 'object')
            $log.error('组件是属性data必须为对象');
        if (util_1.default.type(props) != 'object')
            $log.error('组件是属性props必须为对象');
        if (util_1.default.isEmpty(props))
            return data;
        for (var i in props) {
            data[i] = props[i].default;
        }
        return data;
    };
    // 渲染模板
    ParseTpl.prototype.tpl = function () {
        var self = this;
        var index = 0, parts = [], startIndex, endIndex, exp, expFn;
        if (this.text == undefined) {
            return;
        }
        while (index < this.text.length) {
            startIndex = this.text.indexOf('{{', index);
            if (startIndex != -1) {
                endIndex = this.text.indexOf('}}', startIndex + 2);
            }
            if (startIndex != -1 && endIndex != -1) {
                if (startIndex != index) {
                    parts.push(this.text.substring(index, startIndex));
                }
                exp = this.text.substring(startIndex + 2, endIndex);
                expFn = parse_1.default.parse(exp);
                parts.push(expFn);
                index = endIndex + 2;
            }
            else {
                parts.push(this.text.substring(index));
                break;
            }
        }
        // console.log(parts)
        return parts.reduce(function (prev, cur) {
            if (util_1.default.type(cur) == 'function') {
                return prev + self.expectNullUndefined(cur(self.combineData(self.data, self.props)));
            }
            else {
                return prev + cur;
            }
        }, '');
    };
    /**
     * 判断表达式是否为null或者undefined，是则返回''
     * @param str
     */
    ParseTpl.prototype.expectNullUndefined = function (str) {
        if (util_1.default.type(str) == 'null' || util_1.default.type(str) == 'undefined') {
            return '';
        }
        else if (typeof str == 'object') {
            return JSON.stringify(str);
        }
        else {
            return '' + str;
        }
    };
    return ParseTpl;
}());
function tpl(text, data, props) {
    var parseTpl = new ParseTpl(text, data, props);
    return parseTpl.tpl();
}
exports.default = tpl;
