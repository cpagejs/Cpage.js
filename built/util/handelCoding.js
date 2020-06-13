"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HandelCoding = /** @class */ (function () {
    function HandelCoding() {
    }
    /**
     * 组合对象属性语句，类似于a.b
     * @param left
     * @param right
     * @returns {any}
     */
    HandelCoding.prototype.nonComputedMember = function (left, right) {
        return '(' + left + ').' + right;
    };
    /**
     *
     * @param left
     * @param right
     * @returns {any}
     */
    HandelCoding.prototype.computedMember = function (left, right) {
        return '(' + left + ')[' + right + ']';
    };
    /**
     * 组合成条件不存在的语句 例如!(str)
     * @param expression any
     * @returns {any}
     */
    HandelCoding.prototype.notExist = function (expression) {
        return '!(' + expression + ')';
    };
    /**
     * 组合js表达式,例如组合成 var a = 123;
     * @param token
     * @param value
     * @returns {any}
     */
    HandelCoding.prototype.concatCode = function (token, value) {
        return token + '=' + value + ';';
    };
    /**
    * 此方法用于模拟if语句，判断参数是否成立，并组装成if语句
    * @param condition
    * @param statement
    */
    HandelCoding.prototype.conditionIsRight = function (array, condition, statement) {
        array.push('if(', condition, '){', statement, '}');
    };
    /**
     * 该函数每次被调用，参数id递增
     * @param id
     * @return {string}
     */
    HandelCoding.prototype.compileId = function (id, arr, flag) {
        var uid = 'compileId' + id;
        if (!flag) {
            arr.unshift(uid);
        }
        return uid;
    };
    return HandelCoding;
}());
exports.default = HandelCoding;
