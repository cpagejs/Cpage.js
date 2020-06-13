"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AST = require("../config/ast_config");
var LEXER = require("../config/lexer_config");
var util_1 = require("../util");
/**
 * 抽象语法结构树
 [{ type: 'ASTBuilder.Program',
  body:
   { type: 'ASTBuilder.Binary',
     boolean_expression:
      { type: 'ASTBuilder.Binary',
        operator: '>',
        left: { type: 'ASTBuilder.Identifier', value: 'a' },
        right: { type: 'ASTBuilder.MetaData', value: 2 } },
     true_value: { type: 'ASTBuilder.MetaData', value: 1 },
     error_value: { type: 'ASTBuilder.MetaData', value: 0 } } }]
 */
var ASTBuilder = /** @class */ (function () {
    function ASTBuilder(lexer) {
        this.lexer = lexer;
        this.tokens = [];
    }
    /**
     * 生成抽象语法结构树
     * @param text
     * @returns {Object}
     */
    ASTBuilder.prototype.ast = function (text) {
        this.tokens = this.lexer.lex(text);
        return this.init();
    };
    /**
     * 结构树形式, ';'看作是多个表达式的组合，故词法树的body有对象进化为对象数组Array<object>
     * @returns {{type: string, body: {}}}
     */
    ASTBuilder.prototype.init = function () {
        var body = [];
        while (true) {
            if (this.tokens.length) {
                body.push(this.pipeBuilder());
            }
            if (!util_1.default.expect(this.tokens, ';')) {
                AST.ast_init['body'] = {};
                AST.ast_init['body'] = body;
                return util_1.default.clone(AST.ast_init);
            }
        }
    };
    /**
     * 中介函数
     * @returns {any}
     */
    ASTBuilder.prototype.agency = function () {
        var agency;
        if (util_1.default.expect(this.tokens, '(')) {
            agency = this.pipeBuilder();
            util_1.default.consume(this.tokens, ')');
        }
        else if (util_1.default.expect(this.tokens, '[')) {
            agency = this.arrayBuilder();
        }
        else if (util_1.default.expect(this.tokens, '{')) {
            agency = this.objectBuilder();
        }
        //处理boolean,null,this
        else if (LEXER.LETTER.hasOwnProperty(this.tokens[0]['text'])) {
            if (this.tokens[0]['text'] == "this") {
                agency = util_1.default.clone(AST.ast_this);
            }
            else {
                AST.ast_constant['value'] = LEXER.LETTER[util_1.default.consume(this.tokens)['text']];
                agency = util_1.default.clone(AST.ast_constant);
            }
        }
        //处理标识符
        else if (util_1.default.exitFirst(this.tokens).identifier) {
            agency = this.identifierBuilder();
        }
        //处理常量
        else {
            agency = this.constantBuilder();
        }
        /**
         * 处理带有 '.', '[' 的标识符
         * 结构树：{"type":"ASTBuilder.Member","object":{"type":"ASTBuilder.Member","object":{"type":"ASTBuilder.Identifier","value":"a"},"property":{"type":"ASTBuilder.Identifier","value":"b"}},"property":{"type":"ASTBuilder.Identifier","value":"c"}}
         */
        var type;
        while (type = util_1.default.expect(this.tokens, '.', '[', '(')) {
            agency = this.memberBuilder(type, agency);
        }
        // console.log(JSON.stringify(agency));
        return agency;
    };
    /**
     * 遍历'[]','{}','()'等对称标识符
     */
    ASTBuilder.prototype.closingTags = function (quote) {
        var arr = [], that = this;
        if (!util_1.default.exitFirst(this.tokens, quote)) {
            do {
                if (util_1.default.exitFirst(this.tokens, quote))
                    break;
                arr.push(that.agency());
            } while (util_1.default.expect(this.tokens, ','));
        }
        util_1.default.consume(this.tokens, quote);
        return arr;
    };
    /**
     * 结构树的常量部分
     * @returns {{type: string, value: {}}}
     */
    ASTBuilder.prototype.constantBuilder = function () {
        AST.ast_constant['value'] = util_1.default.consume(this.tokens)['value'];
        return util_1.default.clone(AST.ast_constant);
    };
    /**
    * 结构树的标识符部分
    * @returns {{type: string, value: {}}}
    */
    ASTBuilder.prototype.identifierBuilder = function () {
        AST.ast_identifier['value'] = util_1.default.consume(this.tokens)['value'];
        return util_1.default.clone(AST.ast_identifier);
    };
    /**
     * 结构树的数组部分
     * @returns {{type: string, value: {}}}
     */
    ASTBuilder.prototype.arrayBuilder = function () {
        AST.ast_array['value'] = this.closingTags(']');
        return util_1.default.clone(AST.ast_array);
    };
    /**
     * 结构树的对象部分
     * @returns {{type: string, value: {}}}
     */
    ASTBuilder.prototype.objectBuilder = function () {
        var arr = [];
        if (!util_1.default.exitFirst(this.tokens, '}')) {
            do {
                AST.ast_json['key'] = this.constantBuilder();
                util_1.default.consume(this.tokens, ':');
                AST.ast_json['value'] = this.assignmentBuilder();
                arr.push(util_1.default.clone(AST.ast_json));
            } while (util_1.default.expect(this.tokens, ','));
        }
        util_1.default.consume(this.tokens, '}');
        AST.ast_object['value'] = arr;
        return util_1.default.clone(AST.ast_object);
    };
    /**
     * 结构树的对象取值部分，a.b  a["b"]，a() 等
     * @param type
     * @param agency
     * @returns {{type: string, value: {}}}
     */
    ASTBuilder.prototype.memberBuilder = function (type, agency) {
        if (type.text === '[') {
            agency = {
                type: AST.dataType['7'],
                object: agency,
                property: this.agency(),
                computed: true
            };
            util_1.default.consume(this.tokens, ']');
        }
        if (type.text === '.') {
            agency = {
                type: AST.dataType['7'],
                object: agency,
                property: this.identifierBuilder(),
                computed: false
            };
        }
        if (type.text === '(') {
            agency = {
                type: AST.ast_function['type'],
                callee: agency,
                arguments: this.closingTags(')'),
                pipe: false
            };
        }
        return agency;
    };
    /**
     * 含有‘=’等符号
     * @returns {any}
     */
    ASTBuilder.prototype.assignmentBuilder = function () {
        var left = this.ternaryBuilder();
        if (util_1.default.expect(this.tokens, '=')) {
            var right = this.ternaryBuilder();
            AST.ast_assignment['left'] = left;
            AST.ast_assignment['right'] = right;
            return util_1.default.clone(AST.ast_assignment);
        }
        return left;
    };
    /**
     * 一元运算符
     * @returns {any}
     */
    ASTBuilder.prototype.unaryBuilder = function () {
        var ue = util_1.default.expect(this.tokens, '+', '!', '-');
        if (ue) {
            AST.ast_unary['operator'] = ue.text;
            AST.ast_unary['value'] = this.unaryBuilder();
            return util_1.default.clone(AST.ast_unary);
        }
        if (!ue)
            return this.agency();
    };
    /**
     *乘法运算
     * @returns {Object}
     */
    ASTBuilder.prototype.multiplicativeBuilder = function () {
        var left = this.unaryBuilder(), ue;
        while (ue = util_1.default.expect(this.tokens, '*', '%', '/')) {
            AST.ast_binary['operator'] = ue.text;
            AST.ast_binary['left'] = left;
            AST.ast_binary['right'] = this.unaryBuilder();
            left = util_1.default.clone(AST.ast_binary);
        }
        return left;
    };
    /**
     * 加法运算
     * @returns {Object}
     */
    ASTBuilder.prototype.additiveBuilder = function () {
        var left = this.multiplicativeBuilder(), ue;
        while (ue = util_1.default.expect(this.tokens, '+', '-')) {
            left = {
                type: AST.ast_binary['type'],
                operator: ue.text,
                left: left,
                right: this.multiplicativeBuilder()
            };
        }
        return left;
    };
    /**
     * 关系运算符，‘>’
     * @returns {Object}
     */
    ASTBuilder.prototype.relationalBuilder = function () {
        var left = this.additiveBuilder(), ue;
        while (ue = util_1.default.expect(this.tokens, '>', '<', '>=', '<=')) {
            left = {
                type: AST.ast_binary['type'],
                operator: ue.text,
                left: left,
                right: this.additiveBuilder()
            };
        }
        return left;
    };
    /**
     * 等法运算符，‘==’
     * @returns {Object}
     */
    ASTBuilder.prototype.equalityBuilder = function () {
        var left = this.relationalBuilder(), ue;
        while (ue = util_1.default.expect(this.tokens, '==', '===', '!=', '!==')) {
            left = {
                type: AST.ast_binary['type'],
                operator: ue.text,
                left: left,
                right: this.relationalBuilder()
            };
        }
        return left;
    };
    /**
     * && 运算符， &&高于||
     * @returns {Object}
     */
    ASTBuilder.prototype.andBuilder = function () {
        var left = this.equalityBuilder(), ue;
        while (ue = util_1.default.expect(this.tokens, '&&')) {
            left = {
                type: AST.ast_logical['type'],
                operator: ue.text,
                left: left,
                right: this.equalityBuilder()
            };
        }
        return left;
    };
    /**
     * || 运算符， &&高于||
     * @returns {Object}
     */
    ASTBuilder.prototype.orBuilder = function () {
        var left = this.andBuilder(), ue;
        while (ue = util_1.default.expect(this.tokens, '||')) {
            left = {
                type: AST.ast_logical['type'],
                operator: ue.text,
                left: left,
                right: this.andBuilder()
            };
        }
        return left;
    };
    /**
     * 三元运算符
     * @returns {Object}
     */
    ASTBuilder.prototype.ternaryBuilder = function () {
        var boolean_expression = this.orBuilder();
        if (util_1.default.expect(this.tokens, '?')) {
            var true_value = this.assignmentBuilder();
            if (util_1.default.consume(this.tokens, ':')) {
                var error_value = this.assignmentBuilder();
                return {
                    type: AST.ast_teranry['type'],
                    boolean_expression: boolean_expression,
                    true_value: true_value,
                    error_value: error_value
                };
            }
        }
        return boolean_expression;
    };
    /**
     * 管道处理
     */
    ASTBuilder.prototype.pipeBuilder = function () {
        var pipes = this.assignmentBuilder();
        while (util_1.default.expect(this.tokens, '|')) {
            var args = [pipes];
            pipes = {
                type: AST.ast_function['type'],
                callee: this.identifierBuilder(),
                arguments: args,
                pipe: true
            };
            while (util_1.default.expect(this.tokens, ':')) {
                args.push(this.assignmentBuilder());
            }
        }
        return pipes;
    };
    return ASTBuilder;
}());
exports.default = ASTBuilder;
