"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var $log = require("../log");
var util_1 = require("../util");
var lexer_config_1 = require("../config/lexer_config");
/**
 * 此法解析器，用于解析{{a + b}} 之类的插值运算
 */
var Lexer = /** @class */ (function () {
    function Lexer() {
        this.index = 0;
        this.now = undefined;
        this.tokens = [];
        this.text = '';
    }
    /**
     * 词法解析函数
     * @param text
     * @returns {Array<any>}
     */
    Lexer.prototype.lex = function (text) {
        this.text = text;
        while (this.index < this.text.length) {
            this.now = this.text.charAt(this.index);
            if (util_1.default.whichType(this.now) == 'number' ||
                (this.now === '.' && util_1.default.whichType(util_1.default.nextLeter(this.index, this.text)))) {
                this.loopNumber();
            }
            else if (util_1.default.whichType(this.now) == 'string') {
                this.loopString(this.now);
            }
            else if (util_1.default.whichType(this.now) == 'letter') {
                this.loopLetter();
            }
            else if (util_1.default.isWhiteSpace(this.now)) {
                this.index++;
            }
            else if (util_1.default.inStr(this.now, '[],{}.:()?;')) {
                this.pushObj();
            }
            else {
                this.loopOperator();
            }
        }
        return this.tokens;
    };
    /**
     * 添加词法解析对象
     */
    Lexer.prototype.pushObj = function () {
        this.tokens.push({
            text: this.now,
            value: this.now
        });
        this.index++;
    };
    /**
     * 获取下一个字符
     * @param n
     * @returns {string|boolean}
     */
    Lexer.prototype.nextStr = function (n) {
        if (n === void 0) { n = 1; }
        return (this.index + n < this.text.length) ?
            this.text.charAt(this.index + n) :
            false;
    };
    /**
     * 遍历数字类
     */
    Lexer.prototype.loopNumber = function () {
        var number = '';
        while (this.index < this.text.length) {
            var now = this.text.charAt(this.index).toLowerCase();
            if (util_1.default.whichType(now) == 'number' || now === '.') {
                number += now;
            }
            else {
                var next = util_1.default.nextLeter(this.index, this.text);
                var prev = number.charAt(number.length - 1);
                if (now == 'e' && util_1.default.isExponent(next)) {
                    number += now;
                }
                else if (util_1.default.isExponent(now) && prev === 'e' && next && util_1.default.isNumber(next)) {
                    number += now;
                }
                else if (util_1.default.isExponent(now) && prev === 'e' && (!next || !util_1.default.isNumber(next))) {
                    $log.error("指数格式错误！");
                }
                else {
                    break;
                }
            }
            this.index++;
        }
        this.tokens.push({
            text: number,
            value: Number(number)
        });
    };
    /**
     * 遍历字符串类，'"abc"'
     */
    Lexer.prototype.loopString = function (quote) {
        this.index++;
        var string = '', 
        //避免单独的操作符匹配错误，例如'"!"'
        raw = quote;
        while (this.index < this.text.length) {
            var now = this.text.charAt(this.index);
            raw += now;
            if (now == quote) { //保证首位字符相同
                this.index++;
                this.tokens.push({
                    text: raw,
                    value: string
                });
                return;
            }
            else if (now == lexer_config_1.SPECIALS[now]) { //匹配特殊字符
                string += lexer_config_1.SPECIALS[now];
            }
            else {
                string += now;
            }
            this.index++;
        }
        $log.error('无法匹配的符号');
    };
    /**
     * 字符类, 'abc_$'
     */
    Lexer.prototype.loopLetter = function () {
        var letter = '';
        while (this.index < this.text.length) {
            var now = this.text.charAt(this.index);
            if (util_1.default.isLetter(now) || util_1.default.isNumber(now)) {
                letter += now;
            }
            else {
                break;
            }
            this.index++;
        }
        // 针对boolean,null,undefined
        var v = lexer_config_1.LETTER.hasOwnProperty(letter) ? lexer_config_1.LETTER[letter] : letter;
        this.tokens.push({
            text: letter,
            identifier: true,
            value: v
        });
    };
    /**
     * 操作符，+- ！==
     */
    Lexer.prototype.loopOperator = function () {
        var str = this.now, str2 = this.now + this.nextStr(1), str3 = this.now + this.nextStr(1) + this.nextStr(2), op = lexer_config_1.OPERATORS[str], op2 = lexer_config_1.OPERATORS[str2], op3 = lexer_config_1.OPERATORS[str3];
        if (op || op2 || op3) {
            var ct = op3 ? str3 : (op2 ? str2 : str);
            this.tokens.push({
                text: ct,
                value: ct
            });
            this.index += ct.length;
        }
        else {
            $log.error('未识别的字符' + this.now);
        }
    };
    return Lexer;
}());
exports.default = Lexer;
