"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lexer_1 = require("./lexer");
var parser_1 = require("./parser");
var pipe_1 = require("../pipe/pipe");
var ps = new pipe_1.default();
var util_1 = require("../util");
var Parse = /** @class */ (function () {
    function Parse() {
        this.pipes = ps.pipes;
    }
    /**
     * 注册管道
     * @param name
     * @param factory
     */
    Parse.prototype.register = function (name, factory) {
        ps.register(name, factory);
        return this;
    };
    Parse.prototype.pipe = function (name) {
        return ps.pipe(name);
    };
    /**
     * 词法解析
     * @param str
     */
    Parse.prototype.parse = function (str) {
        var that = this;
        function parse(expression, pipes) {
            switch (util_1.default.type(expression)) {
                case 'string':
                    var lexer = new lexer_1.default();
                    var parser = new parser_1.default(lexer, pipes);
                    var oneTime = false;
                    //单次检测
                    if (expression.charAt(0) == ':' && expression.charAt(1) == ':') {
                        oneTime = true;
                        expression = expression.substring(2);
                    }
                    var parseFn = parser.parse(expression);
                    if (parseFn.constant) { //常量
                        parseFn.$$handelWatch = that.constantHandelWatch;
                    }
                    if (oneTime) { //单次检测
                        parseFn.$$handelWatch = parseFn.literal ? that.oneTimeLiteralHandelWatch : that.oneTimeHandelWatch;
                    }
                    if (parseFn.inputs) {
                        parseFn.$$handelWatch = that.inputsHandelWatch;
                    }
                    return parseFn;
                case 'function':
                    return expression;
            }
        }
        return parse(str, this.pipes);
    };
    /**
     * 处理参数为常量的状况
     * @param state
     * @param listenerFn
     * @param valueEq
     * @param watchFn
     */
    Parse.prototype.constantHandelWatch = function (state, listenerFn, valueEq, watchFn) {
        var cancel = state.$watch(function () {
            return watchFn(state);
        }, function (newVal, oldVal, state) {
            if (util_1.default.type(listenerFn) == 'function') {
                listenerFn.apply(this, arguments);
            }
        }, valueEq);
        return cancel;
    };
    /**
     * 处理单次检测问题
     * @param state
     * @param listenerFn
     * @param valueEq
     * @param watchFn
     */
    Parse.prototype.oneTimeHandelWatch = function (state, listenerFn, valueEq, watchFn) {
        var lastVal;
        var cancel = state.$watch(function () {
            return watchFn(state);
        }, function (newVal, oldVal, state) {
            lastVal = newVal;
            if (util_1.default.type(listenerFn) == 'function') {
                listenerFn.apply(this, arguments);
            }
            if (util_1.default.type(newVal) != 'undefined') {
                state.$afterDigest(function () {
                    if (util_1.default.type(lastVal) != 'undefined') {
                        cancel();
                    }
                });
            }
        }, valueEq);
        return cancel;
    };
    /**
     * 处理数组或对象的变量问题
     * @param state
     * @param listenerFn
     * @param valueEq
     * @param watchFn
     */
    Parse.prototype.oneTimeLiteralHandelWatch = function (state, listenerFn, valueEq, watchFn) {
        var lastVal;
        var cancel = state.$watch(function () {
            return watchFn(state);
        }, function (newVal, oldVal, state) {
            lastVal = newVal;
            if (util_1.default.type(listenerFn) == 'function') {
                listenerFn.apply(this, arguments);
            }
            if (util_1.default.type(newVal) != 'undefined') {
                state.$afterDigest(function () {
                    if (util_1.default.type(lastVal) != 'undefined') {
                        cancel();
                    }
                });
            }
        }, valueEq);
        return cancel;
    };
    Parse.prototype.inputsHandelWatch = function (state, listenerFn, valueEq, watchFn) {
        var inputExpr = watchFn.inputs;
        return state.$watch(function () {
        }, listenerFn, valueEq);
    };
    return Parse;
}());
var parse = new Parse();
exports.default = parse;
// 默认管道函数--开始
var newParse = new Parse();
newParse.register('filter', defaultFilter);
function defaultFilter() {
    return function (array, filterExp) {
        var predicateFn;
        switch (util_1.default.type(filterExp)) {
            case 'function':
                predicateFn = filterExp;
                break;
            case 'string':
            case 'number':
            case 'boolean':
            case 'null':
            case 'undefined':
            case 'object':
                predicateFn = createPredicateFn(filterExp);
                break;
            default:
                return array;
        }
        return array.filter(predicateFn);
    };
}
// 如果pipe后面非函数表达式就生成一个
function createPredicateFn(exp) {
    // item指数组元素
    return function predicateFn(item) {
        return deepCompareValues(item, exp, compareValues);
    };
}
// source值数组的元素，target值pipe表达式冒号后面的字符，pipe:"a"
function compareValues(source, target) {
    if (util_1.default.type(source) == 'null' || util_1.default.type(target) == 'null') {
        return source === target;
    }
    // 不对undefined处理
    if (util_1.default.type(source) == 'undefined')
        return false;
    source = ('' + source).toLowerCase();
    target = ('' + target).toLowerCase();
    return source.includes(target);
}
// 如果数组元素是对象进行深度比较
function deepCompareValues(source, target, compare) {
    if (util_1.default.type(target) == 'string' && target.startsWith('!')) {
        return !deepCompareValues(source, target.substring(1), compare);
    }
    if (util_1.default.type(source) == 'object') {
        if (util_1.default.type(target) == 'object') {
            for (var i in target) {
                return deepCompareValues(source[i], target[i], compare);
            }
        }
        var arr = util_1.default.objVal(source);
        return arr.some(function (val) {
            return deepCompareValues(val, target, compare);
        });
    }
    return compare(source, target);
}
// 注册管道函数--结束
