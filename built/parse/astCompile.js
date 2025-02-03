"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ast_config_1 = require("../config/ast_config");
var $log = require("../log");
var K = require("../config/unSafeStr");
var util_1 = require("../util");
var ps = {}; //管道集合
var ASTCompile = /** @class */ (function () {
    function ASTCompile(astBuilder, pipes) {
        this.astBuilder = astBuilder;
        this.state = {
            body: [],
            compileId: 0,
            echo: [], //不同'compileId'的集合
            pipes: {} //管道过滤器
        };
        this.ast = {};
        ps = pipes;
    }
    /**
     * 词法树的最终解析执行函数
     * @param text
     * @returns {Function}
     */
    ASTCompile.prototype.compile = function (text) {
        this.ast = this.astBuilder.ast(text);
        this.handelTree(this.ast);
        this.constantExpr(this.ast);
        var fn = this.pipePrefix() + 'var fn = function(scope, local){'
            + (this.state.echo.length ? 'var ' + this.state.echo.join(',') + ';' : '')
            + this.state.body.join('') + '}; return fn;';
        var fns = new Function('safeProperty', 'safeObject', 'safeFunction', 'isUndefined', 'pipe', fn)(safeProperty, safeObject, safeFunction, isUndefined, pipe);
        fns.literal = this.isLiteral(); // 定义字面量
        fns.constant = this.ast.constant; // 定义常亮
        return fns;
    };
    /**
     * 递归解析词法树
     * @param ast 词法结构树
     * @param context 针对函数的上下文
     * @param createNewElement 布尔值，如果属性不存在就动态创建一个
     * @returns {any}
     */
    ASTCompile.prototype.handelTree = function (ast, context, createNewElement) {
        if (context === void 0) { context = { context: undefined, name: undefined, computed: undefined }; }
        switch (ast.type) {
            case ast_config_1.dataType['1']: //'ASTBuilder.Init'
                this.initCompile(ast);
                break;
            case ast_config_1.dataType['2']: //'ASTBuilder.MetaData'
                return this.metaCompile(ast);
            case ast_config_1.dataType['3']: //'ASTBuilder.Array'
                return this.arrayCompile(ast);
            case ast_config_1.dataType['4']: //'ASTBuilder.Object'
                return this.objectCompile(ast);
            case ast_config_1.dataType['5']: //'ASTBuilder.Identifier'
                return this.identifierCompile(ast, context, createNewElement);
            case ast_config_1.dataType['6']: //'ASTBuilder.This'
                return this.thisCompile();
            case ast_config_1.dataType['7']: //'ASTBuilder.Member'
                return this.memberCompile(ast, context, createNewElement);
            case ast_config_1.dataType['8']: //'ASTBuilder.Function'
                return this.functionCompile(ast);
            case ast_config_1.dataType['9']: //'ASTBuilder.Assignment'
                return this.assigmentCompile(ast);
            case ast_config_1.dataType['10']: //'ASTBuilder.Unary'
                return this.unaryCompile(ast);
            case ast_config_1.dataType['11']: //'ASTBuilder.Binary'
                return this.binaryCompile(ast);
            case ast_config_1.dataType['12']: //'ASTBuilder.Logical'
                return this.logicalCompile(ast);
            case ast_config_1.dataType['13']: //'ASTBuilder.Ternary'
                return this.ternaryCompile(ast);
        }
    };
    /**
     * 初始化词法编译器
     * @param ast
     */
    ASTCompile.prototype.initCompile = function (ast) {
        var _this = this;
        var arr = util_1.default.clone(ast.body);
        var last = arr.pop();
        arr.forEach(function (val) {
            _this.state.body.push(_this.handelTree(val));
        });
        this.state.body.push('return ', this.handelTree(last), ';');
    };
    /**
     * 基础类数据编译
     * @param ast
     * @returns {any}
     */
    ASTCompile.prototype.metaCompile = function (ast) {
        return util_1.default.wrapString(ast.value);
    };
    /**
     * 数组类词法树编译
     * @param ast
     * @returns {string}
     */
    ASTCompile.prototype.arrayCompile = function (ast) {
        var _this = this;
        var arr = ast.value.map(function (val) {
            return _this.handelTree(val);
        });
        return '[' + arr.join(',') + ']';
    };
    /**
     * 对象类词法树编译
     * @param ast
     * @returns {string}
     */
    ASTCompile.prototype.objectCompile = function (ast) {
        var _this = this;
        var arrJson = ast.value.map(function (val) {
            var key = val['key']['value'];
            var value = _this.handelTree(val['value']);
            return key + ':' + value;
        });
        return '{' + arrJson.join(',') + '}';
    };
    /**
     * 标识符词法树编译
     * @param ast
     * @param context
     * @param createNewElement
     * @returns {string}
     */
    ASTCompile.prototype.identifierCompile = function (ast, context, createNewElement) {
        //判断是否是安全的属性名
        safeProperty(ast.value);
        var id = this.incrementId();
        // 存在本地属性local
        util_1.default.conditionIsRight(this.state.body, util_1.default.hasProperty('local', ast.value), util_1.default.concatCode(id, util_1.default.nonComputedMember('local', ast.value)));
        // 创建空对象
        if (createNewElement) {
            util_1.default.conditionIsRight(this.state.body, util_1.default.notExist(util_1.default.hasProperty('local', ast.value)) + ' && scope && ' + util_1.default.notExist(util_1.default.hasProperty('scope', ast.value)), util_1.default.concatCode(util_1.default.nonComputedMember('scope', ast.value), '{}'));
        }
        //不存在本地属性，只有scope属性
        util_1.default.conditionIsRight(this.state.body, util_1.default.notExist(util_1.default.hasProperty('local', ast.value)) + ' && scope', util_1.default.concatCode(id, util_1.default.nonComputedMember('scope', ast.value)));
        // 处理函数上下文
        if (context) {
            context.context = util_1.default.hasProperty('local', ast.value) + '?local:scope';
            context.name = ast.value;
            context.computed = false;
        }
        this.state.body.push('safeObject(' + id + ');');
        return id;
    };
    /**
     * 含有this的编译
     * @returns {string}
     */
    ASTCompile.prototype.thisCompile = function () {
        return 'scope';
    };
    /**
     * 对象属性操作类词法树编译，如a.b, a["b"]
     * @param ast
     * @param context
     * @param createNewElement
     * @returns {string}
     */
    ASTCompile.prototype.memberCompile = function (ast, context, createNewElement) {
        var id = this.incrementId();
        var noComp = this.handelTree(ast.object, undefined, true);
        if (context) {
            context.context = noComp;
        }
        if (ast.computed) { //a["b"]
            var comp = this.handelTree(ast.property);
            this.state.body.push('safeProperty(' + comp + ');');
            //处理空对象
            if (createNewElement) {
                util_1.default.conditionIsRight(this.state.body, util_1.default.notExist(util_1.default.computedMember(noComp, comp)), util_1.default.concatCode(util_1.default.computedMember(noComp, comp), '{}'));
            }
            util_1.default.conditionIsRight(this.state.body, noComp, util_1.default.concatCode(id, 'safeObject(' + util_1.default.computedMember(noComp, comp) + ')'));
            if (context) {
                context.name = comp;
                context.computed = true;
            }
        }
        if (!ast.computed) { //a.b
            safeProperty(ast.property.value);
            if (createNewElement) {
                util_1.default.conditionIsRight(this.state.body, util_1.default.notExist(util_1.default.nonComputedMember(noComp, ast.property.value)), util_1.default.concatCode(util_1.default.nonComputedMember(noComp, ast.property.value), '{}'));
            }
            util_1.default.conditionIsRight(this.state.body, noComp, util_1.default.concatCode(id, 'safeObject(' + util_1.default.nonComputedMember(noComp, ast.property.value) + ')'));
            if (context) {
                context.name = ast.property.value;
                context.computed = false;
            }
        }
        return id;
    };
    /**
     * 函数类词法树编译
     * @param ast
     * @returns {string}
     */
    ASTCompile.prototype.functionCompile = function (ast) {
        var _this = this;
        var callContext, callee, args;
        if (ast.pipe) {
            callee = this.pipeCompile(ast.callee.value);
            args = ast.arguments.map(function (val) {
                return _this.handelTree(val);
            });
            return callee + '(' + args.join(',') + ')';
        }
        if (!ast.pipe) {
            callContext = { context: undefined, name: undefined, computed: undefined };
            callee = this.handelTree(ast.callee, callContext);
            args = ast.arguments.map(function (val) {
                return 'safeObject(' + _this.handelTree(val) + ')'; //检测函数参数是否安全
            });
            // console.log(callContext);
            if (callContext.name) {
                this.state.body.push('safeObject(' + callContext.context + ');');
                if (callContext.computed) {
                    callee = util_1.default.computedMember(callContext.context, callContext.name);
                }
                else {
                    callee = util_1.default.nonComputedMember(callContext.context, callContext.name);
                }
            }
            //检测函数是否安全
            this.state.body.push('safeFunction(' + callee + ');');
            //safeObject 检测函数返回值是否安全
            return callee + ' && safeObject(' + callee + '(' + args.join(',') + '))';
        }
    };
    /**
     *含有等号等符号类词法树编译
     * @param ast
     * @returns {any}
     */
    ASTCompile.prototype.assigmentCompile = function (ast) {
        var left, leftCon = { context: undefined, name: undefined, computed: undefined };
        this.handelTree(ast.left, leftCon, true);
        if (leftCon.computed) {
            left = util_1.default.computedMember(leftCon.context, leftCon.name);
        }
        else {
            left = util_1.default.nonComputedMember(leftCon.context, leftCon.name);
        }
        // console.log(leftCon, left);
        //safeObject 用于检测表达式右侧是否安全
        return util_1.default.concatCode(left, 'safeObject(' + this.handelTree(ast.right) + ')');
    };
    /**
     * 含有一元运算符的编译
     * @param ast
     * @returns {string}
     */
    ASTCompile.prototype.unaryCompile = function (ast) {
        return ast.operator + '(' + 'isUndefined(' + this.handelTree(ast.value) + '))';
    };
    /**
     * 二元运算符编译
     * @param ast
     * @returns {string}
     */
    ASTCompile.prototype.binaryCompile = function (ast) {
        if (util_1.default.inStr(ast.operator, '+-')) { //加减运算
            return '(isUndefined(' + this.handelTree(ast.left) + ')' + ast.operator + 'isUndefined(' + this.handelTree(ast.right) + '))';
        }
        return '(' + this.handelTree(ast.left) + ast.operator + this.handelTree(ast.right) + ')';
    };
    /**
     * 逻辑运算符编译
     * @param ast
     * @returns {string}
     */
    ASTCompile.prototype.logicalCompile = function (ast) {
        var id = this.incrementId();
        this.state.body.push(util_1.default.concatCode(id, this.handelTree(ast.left)));
        util_1.default.conditionIsRight(this.state.body, ast.operator == '&&' ? id : util_1.default.notExist(id), util_1.default.concatCode(id, this.handelTree(ast.right)));
        return id;
    };
    /**
     * 三元运算符编译
     * @param ast
     * @returns {string}
     */
    ASTCompile.prototype.ternaryCompile = function (ast) {
        var id = this.incrementId();
        var id2 = this.incrementId();
        this.state.body.push(util_1.default.concatCode(id2, this.handelTree(ast.boolean_expression)));
        util_1.default.conditionIsRight(this.state.body, id2, util_1.default.concatCode(id, this.handelTree(ast.true_value)));
        util_1.default.conditionIsRight(this.state.body, util_1.default.notExist(id2), util_1.default.concatCode(id, this.handelTree(ast.error_value)));
        return id;
    };
    /**
     * 管道编译
     * @param name
     */
    ASTCompile.prototype.pipeCompile = function (name) {
        var ps = this.state.pipes;
        if (!ps.hasOwnProperty('name')) {
            ps[name] = this.incrementId(true);
        }
        return ps[name];
    };
    /**
     * 判断pipes是否存在
     */
    ASTCompile.prototype.pipePrefix = function () {
        var ps = this.state.pipes;
        if (JSON.stringify(ps) == '{}') {
            return '';
        }
        var arr = [];
        for (var k in ps) {
            arr.push(ps[k] + '=' + 'pipe(' + util_1.default.wrapString(k) + ')');
        }
        // console.log(arr);
        return 'var ' + arr.join(',') + ';';
    };
    /**
     * compileId自增
     */
    ASTCompile.prototype.incrementId = function (flag) {
        var id = util_1.default.compileId(this.state.compileId, this.state.echo, flag);
        this.state.compileId++;
        return id;
    };
    /**
     * 字面量
     */
    ASTCompile.prototype.isLiteral = function () {
        var arr = this.ast.body;
        return !arr.length || ((arr.length === 1) &&
            (arr[0].type === ast_config_1.dataType['2'] ||
                arr[0].type === ast_config_1.dataType['3'] ||
                arr[0].type === ast_config_1.dataType['4'] ||
                arr[0].type === ast_config_1.dataType['5']));
    };
    /**
     * 常量
     * @param ast
     */
    ASTCompile.prototype.constantExpr = function (ast) {
        var _this = this;
        var cons, that = this;
        switch (ast.type) {
            case ast_config_1.dataType['1']: //ASTBuilder.Init
                cons = true;
                arrayLike(ast.body);
                break;
            case ast_config_1.dataType['2']: //ASTBuilder.MetaData
                ast.constant = true;
                break;
            case ast_config_1.dataType['3']: //ASTBuilder.Array
                cons = true;
                arrayLike(ast.value);
                ast.constant = cons;
                break;
            case ast_config_1.dataType['4']: //ASTBuilder.Object
                cons = true;
                ast.value.forEach(function (val) {
                    _this.constantExpr(val.value);
                    cons = cons && val.value.constant;
                });
                ast.constant = cons;
                break;
            case ast_config_1.dataType['5']: //ASTBuilder.Identifier
            case ast_config_1.dataType['6']: //ASTBuilder.This
                ast.constant = false;
                break;
            case ast_config_1.dataType['7']: //ASTBuilder.Member
                this.constantExpr(ast.object);
                if (ast.computed) {
                    this.constantExpr(ast.property);
                }
                ast.constant = ast.object.constant && (!ast.computed || ast.property.constant);
                break;
            case ast_config_1.dataType['8']: //ASTBuilder.Function
                cons = ast.pipe;
                arrayLike(ast.arguments);
                ast.constant = cons;
                break;
            case ast_config_1.dataType['9']: //ASTBuilder.Assignment
                leftRight();
                break;
            case ast_config_1.dataType['10']: //ASTBuilder.Unary
                this.constantExpr(ast.value);
                ast.constant = ast.value.constant;
                break;
            case ast_config_1.dataType['11']: //ASTBuilder.Binary
            case ast_config_1.dataType['12']: //ASTBuilder.Logical
                leftRight();
                break;
            case ast_config_1.dataType['13']: //ASTBuilder.Teranry
                this.constantExpr(ast.boolean_expression);
                this.constantExpr(ast.true_value);
                this.constantExpr(ast.error_value);
                ast.constant = ast.boolean_expression.constant && ast.true_value.constant && ast.error_value.constant;
                break;
        }
        function arrayLike(array) {
            array.forEach(function (val) {
                that.constantExpr(val);
                cons = cons && val.constant;
            });
            ast.constant = cons;
        }
        function leftRight() {
            that.constantExpr(ast.left);
            that.constantExpr(ast.right);
            ast.constant = ast.left.constant && ast.right.constant;
        }
    };
    return ASTCompile;
}());
exports.default = ASTCompile;
/**
 * 检测是否是安全的属性名，例如constructor, __defineGetter__等
 * @param str
 */
function safeProperty(str) {
    var f = K.PROPERTY.some(function (val) {
        return val === str;
    });
    if (f)
        $log.error(str + '存在编译风险');
}
/**
 * 检测是否是安全的对象
 * @param obj
 */
function safeObject(obj) {
    if (obj == undefined)
        return;
    var f = K.WINDOW.every(function (val) {
        return obj[val];
    });
    var f2 = K.NODE.every(function (val) {
        return obj[val];
    });
    if (f || f2 || obj.constructor == obj || obj.getOwnPropertyDescriptor || obj.getOwnPropertyNames)
        $log.error(obj + '存在编译风险');
    return obj;
}
/**
 * 检查函数是否安全
 * @param fun
 */
function safeFunction(fun) {
    var f = K.FUN.some(function (val) {
        return val == fun;
    });
    if (f || fun.constructor == fun)
        $log.error(fun + '存在编译风险');
}
/**
 * 判断目标是否为undefined
 * @param target
 * @param value
 * @returns {any}
 */
function isUndefined(target, value) {
    if (value === void 0) { value = 0; }
    return typeof target === 'undefined' ? value : target;
}
/**
 * 根据管道名称返回管道处理函数
 * @param name 管道名称
 */
function pipe(name) {
    // console.log(ps);
    return ps[name];
}
