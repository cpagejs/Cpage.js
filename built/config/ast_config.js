"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ast_teranry = exports.ast_logical = exports.ast_binary = exports.ast_unary = exports.ast_assignment = exports.ast_function = exports.ast_member = exports.ast_this = exports.ast_identifier = exports.ast_json = exports.ast_object = exports.ast_array = exports.ast_constant = exports.ast_init = exports.dataType = void 0;
//数据类型
exports.dataType = {
    '1': 'ASTBuilder.Init',
    '2': 'ASTBuilder.MetaData',
    '3': 'ASTBuilder.Array',
    '4': 'ASTBuilder.Object',
    '5': 'ASTBuilder.Identifier',
    '6': 'ASTBuilder.This',
    '7': 'ASTBuilder.Member',
    '8': 'ASTBuilder.Function',
    '9': 'ASTBuilder.Assignment',
    '10': 'ASTBuilder.Unary',
    '11': 'ASTBuilder.Binary',
    '12': 'ASTBuilder.Logical',
    '13': 'ASTBuilder.Teranry'
};
// astBuilder的词法解析匹配模式
exports.ast_init = {
    type: exports.dataType['1'],
    body: {}
};
//常量
exports.ast_constant = {
    type: exports.dataType['2'],
    value: undefined
};
//数组
exports.ast_array = {
    type: exports.dataType['3'],
    value: undefined
};
/**
 * 对象
 * {"type":"ASTBuilder.Object","value":[{"type":"ASTBuilder.Identifier","key":{"type":"ASTBuilder.MetaData","value":"id"},"value":{"type"
:"ASTBuilder.MetaData","value":1}}]}
 */
exports.ast_object = {
    type: exports.dataType['4'],
    value: undefined //数组，指向ast_json
};
exports.ast_json = {
    type: exports.dataType['5'],
    key: undefined,
    value: undefined
};
// 标识符
exports.ast_identifier = {
    type: exports.dataType['5'],
    value: undefined
};
// this
exports.ast_this = {
    type: exports.dataType['6']
};
// 对象属性表达式，a.b a['b']
exports.ast_member = {
    type: exports.dataType['7'],
    object: undefined,
    property: undefined,
    computed: undefined
};
// 函数表达式
exports.ast_function = {
    type: exports.dataType['8'],
    callee: undefined,
    arguments: undefined,
    pipe: Boolean
};
// 赋值表达式
exports.ast_assignment = {
    type: exports.dataType['9'],
    left: undefined,
    right: undefined
};
// 一元运算符
exports.ast_unary = {
    type: exports.dataType['10'],
    operator: '+',
    value: undefined
};
// 二元运算符
exports.ast_binary = {
    type: exports.dataType['11'],
    left: undefined,
    operator: undefined,
    right: undefined
};
// 逻辑运算符
exports.ast_logical = {
    type: exports.dataType['12'],
    left: undefined,
    operator: undefined,
    right: undefined
};
// 三元运算符
exports.ast_teranry = {
    type: exports.dataType['13'],
    boolean_expression: undefined,
    true_value: undefined,
    error_value: undefined
};
