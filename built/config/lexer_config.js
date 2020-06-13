"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// js特殊字符
var SPECIALS = {
    '\'': '\'',
    '\"': '\"',
    '&': '\&',
    '\\': '\\',
    'n': '\n',
    'r': '\r',
    't': '\t',
    'b': '\b',
    'f': '\f',
};
exports.SPECIALS = SPECIALS;
//词法解析中关于字符的配置对象
var LETTER = {
    'null': null,
    'true': true,
    'false': false,
    'undefined': undefined,
    'this': undefined
};
exports.LETTER = LETTER;
//运算符
var OPERATORS = {
    '+': true,
    '!': true,
    '-': true,
    '*': true,
    '%': true,
    '/': true,
    '=': true,
    '>': true,
    '<': true,
    '>=': true,
    '<=': true,
    '==': true,
    '===': true,
    '!=': true,
    '!==': true,
    '&&': true,
    '||': true,
    '|': true
};
exports.OPERATORS = OPERATORS;
