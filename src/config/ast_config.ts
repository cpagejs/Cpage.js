//数据类型
export const dataType = {
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
export const ast_init = {
    type: dataType['1'],
    body: {} 
};

//常量
export const ast_constant = {
    type: dataType['2'],
    value: undefined
};

//数组
export const ast_array = {
    type: dataType['3'],
    value: undefined
};

/**
 * 对象
 * {"type":"ASTBuilder.Object","value":[{"type":"ASTBuilder.Identifier","key":{"type":"ASTBuilder.MetaData","value":"id"},"value":{"type"
:"ASTBuilder.MetaData","value":1}}]}
 */
export const ast_object = {
    type: dataType['4'],
    value: undefined  //数组，指向ast_json
};
export const ast_json = {
    type: dataType['5'],
    key: undefined,
    value: undefined
};

// 标识符
export const ast_identifier = {
    type: dataType['5'],
    value: undefined
};

// this
export const ast_this = {
    type: dataType['6']
};

// 对象属性表达式，a.b a['b']
export const ast_member = {
    type: dataType['7'],
    object: undefined,
    property: undefined,
    computed: undefined
};

// 函数表达式
export const ast_function = {
    type: dataType['8'],
    callee: undefined,
    arguments: undefined,
    pipe: Boolean
};

// 赋值表达式
export const ast_assignment = {
    type: dataType['9'],
    left: undefined,
    right: undefined
};

// 一元运算符
export const ast_unary = {
    type: dataType['10'],
    operator: '+',
    value: undefined
};

// 二元运算符
export const ast_binary = {
    type: dataType['11'],
    left: undefined,
    operator: undefined,
    right: undefined
};

// 逻辑运算符
export const ast_logical = {
    type: dataType['12'],
    left: undefined,
    operator: undefined,
    right: undefined
};

// 三元运算符
export const ast_teranry = {
    type: dataType['13'],
    boolean_expression: undefined,
    true_value: undefined,
    error_value: undefined
};

