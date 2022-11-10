export declare const dataType: {
    1: string;
    2: string;
    3: string;
    4: string;
    5: string;
    6: string;
    7: string;
    8: string;
    9: string;
    10: string;
    11: string;
    12: string;
    13: string;
};
export declare const ast_init: {
    type: string;
    body: {};
};
export declare const ast_constant: {
    type: string;
    value: any;
};
export declare const ast_array: {
    type: string;
    value: any;
};
/**
 * 对象
 * {"type":"ASTBuilder.Object","value":[{"type":"ASTBuilder.Identifier","key":{"type":"ASTBuilder.MetaData","value":"id"},"value":{"type"
:"ASTBuilder.MetaData","value":1}}]}
 */
export declare const ast_object: {
    type: string;
    value: any;
};
export declare const ast_json: {
    type: string;
    key: any;
    value: any;
};
export declare const ast_identifier: {
    type: string;
    value: any;
};
export declare const ast_this: {
    type: string;
};
export declare const ast_member: {
    type: string;
    object: any;
    property: any;
    computed: any;
};
export declare const ast_function: {
    type: string;
    callee: any;
    arguments: any;
    pipe: BooleanConstructor;
};
export declare const ast_assignment: {
    type: string;
    left: any;
    right: any;
};
export declare const ast_unary: {
    type: string;
    operator: string;
    value: any;
};
export declare const ast_binary: {
    type: string;
    left: any;
    operator: any;
    right: any;
};
export declare const ast_logical: {
    type: string;
    left: any;
    operator: any;
    right: any;
};
export declare const ast_teranry: {
    type: string;
    boolean_expression: any;
    true_value: any;
    error_value: any;
};
