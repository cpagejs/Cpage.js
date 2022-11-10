// js特殊字符
const SPECIALS:Object = {
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

//词法解析中关于字符的配置对象
const LETTER:Object = {
    'null': null,
    'true': true,
    'false': false,
    'undefined': undefined,
    'this': undefined
};

//运算符
const OPERATORS:Object = {
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

export { SPECIALS, LETTER, OPERATORS };
