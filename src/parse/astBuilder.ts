import { astBuilderAction } from './astBuilder_action';
import * as AST from '../config/ast_config';
import * as LEXER from '../config/lexer_config';
import * as $log from '../log';
import Util from '../util';

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
export default class ASTBuilder implements astBuilderAction {

    public lexer;
    public tokens;

    constructor(lexer){
        this.lexer = lexer;
        this.tokens = [];
    }

    /**
     * 生成抽象语法结构树
     * @param text
     * @returns {Object}
     */
    public ast(text:String):Object{
        this.tokens = this.lexer.lex(text);
        return this.init();
    }

    /**
     * 结构树形式, ';'看作是多个表达式的组合，故词法树的body有对象进化为对象数组Array<object>
     * @returns {{type: string, body: {}}}
     */
    private init():Object{
        let body = [];

        while(true){
            if(this.tokens.length){
                body.push(this.pipeBuilder());
            }

            if(!Util.expect(this.tokens, ';')){
                AST.ast_init['body'] = {};
                AST.ast_init['body'] = body;
                return Util.clone(AST.ast_init);
            }
        }
    }

    /**
     * 中介函数
     * @returns {any}
     */
    private agency():any{
        let agency;
        if(Util.expect(this.tokens, '(')){
            agency = this.pipeBuilder();
            Util.consume(this.tokens, ')');
        }
        else if(Util.expect(this.tokens, '[')){
            agency = this.arrayBuilder();
        }
        else if(Util.expect(this.tokens, '{')){
            agency = this.objectBuilder();
        }
        //处理boolean,null,this
        else if(LEXER.LETTER.hasOwnProperty(this.tokens[0]['text'])){
            if(this.tokens[0]['text'] == "this"){
                agency = Util.clone(AST.ast_this);
            }else{
                AST.ast_constant['value'] = LEXER.LETTER[Util.consume(this.tokens)['text']];
                agency = Util.clone(AST.ast_constant);
            }
        }
        //处理标识符
        else if(Util.exitFirst(this.tokens).identifier){
            agency = this.identifierBuilder();
        }
        //处理常量
        else{
            agency = this.constantBuilder();
        }

        /**
         * 处理带有 '.', '[' 的标识符
         * 结构树：{"type":"ASTBuilder.Member","object":{"type":"ASTBuilder.Member","object":{"type":"ASTBuilder.Identifier","value":"a"},"property":{"type":"ASTBuilder.Identifier","value":"b"}},"property":{"type":"ASTBuilder.Identifier","value":"c"}}
         */
        let type;
        while(type = Util.expect(this.tokens, '.', '[', '(')){
            agency = this.memberBuilder(type, agency);
        }
        // console.log(JSON.stringify(agency));
        return agency;
    }

    /**
     * 遍历'[]','{}','()'等对称标识符
     */
    private closingTags(quote:string):Array<any>{
        let arr = [], that = this;
        if(!Util.exitFirst(this.tokens, quote)){
            do{
                if(Util.exitFirst(this.tokens, quote)) break;
                arr.push(that.agency());
            }while(Util.expect(this.tokens, ','));
        }
        Util.consume(this.tokens, quote);
        return arr;
    }

    /**
     * 结构树的常量部分
     * @returns {{type: string, value: {}}}
     */
    private constantBuilder():Object{
        AST.ast_constant['value'] = Util.consume(this.tokens)['value'];
        return Util.clone(AST.ast_constant);
    }

     /**
     * 结构树的标识符部分
     * @returns {{type: string, value: {}}}
     */
    private identifierBuilder(){
        AST.ast_identifier['value'] = Util.consume(this.tokens)['value'];
        return Util.clone(AST.ast_identifier);
    }

    /**
     * 结构树的数组部分
     * @returns {{type: string, value: {}}}
     */
    private arrayBuilder():Object{
        AST.ast_array['value'] = this.closingTags(']');
        return Util.clone(AST.ast_array);
    }

    /**
     * 结构树的对象部分
     * @returns {{type: string, value: {}}}
     */
    private objectBuilder(){
        let arr = [];
        if(!Util.exitFirst(this.tokens, '}')){
            do{
                AST.ast_json['key'] = this.constantBuilder();
                Util.consume(this.tokens, ':');
                AST.ast_json['value'] = this.assignmentBuilder();
                arr.push(Util.clone(AST.ast_json));
            }while(Util.expect(this.tokens, ','));
        }
        Util.consume(this.tokens, '}');
        
        AST.ast_object['value'] = arr;
        return Util.clone(AST.ast_object);
    }

    /**
     * 结构树的对象取值部分，a.b  a["b"]，a() 等
     * @param type
     * @param agency
     * @returns {{type: string, value: {}}}
     */
    private memberBuilder(type:any, agency:any):Object{
        if(type.text === '['){
            agency = {
                type: AST.dataType['7'],
                object: agency,
                property: this.agency(),
                computed: true
            };
            Util.consume(this.tokens, ']');
        }

        if(type.text === '.'){
            agency = {
                type: AST.dataType['7'],
                object: agency,
                property: this.identifierBuilder(),
                computed: false
            };
        }

        if(type.text === '('){
            agency = {
                type: AST.ast_function['type'],
                callee: agency,
                arguments: this.closingTags(')'),
                pipe: false
            };
        }

        return agency;
    }

    /**
     * 含有‘=’等符号
     * @returns {any}
     */
    private assignmentBuilder():Object{
        const left = this.ternaryBuilder();
        
        if(Util.expect(this.tokens, '=')){
            const right = this.ternaryBuilder();
            AST.ast_assignment['left'] = left;
            AST.ast_assignment['right'] = right;
            return Util.clone(AST.ast_assignment);
        }

        return left;
    }

    /**
     * 一元运算符
     * @returns {any}
     */
    private unaryBuilder():Object{
        const ue = Util.expect(this.tokens, '+', '!', '-');

        if(ue){
            AST.ast_unary['operator'] = ue.text;
            AST.ast_unary['value'] = this.unaryBuilder();
            return Util.clone(AST.ast_unary);
        }

        if(!ue) return this.agency();
    }

    /**
     *乘法运算
     * @returns {Object}
     */
    private multiplicativeBuilder():Object{
        let left = this.unaryBuilder(),
            ue;

        while(ue = Util.expect(this.tokens, '*', '%', '/')){
            AST.ast_binary['operator'] = ue.text;
            AST.ast_binary['left'] = left;
            AST.ast_binary['right'] = this.unaryBuilder();

            left = Util.clone(AST.ast_binary);
        }

        return left;
    }

    /**
     * 加法运算
     * @returns {Object}
     */
    private additiveBuilder():Object{
        let left = this.multiplicativeBuilder(),
            ue;

        while(ue = Util.expect(this.tokens, '+', '-')){
            left = {
                type: AST.ast_binary['type'],
                operator: ue.text,
                left: left,
                right: this.multiplicativeBuilder()
            };
        }

        return left;
    }

    /**
     * 关系运算符，‘>’
     * @returns {Object}
     */
    private relationalBuilder():Object{
        let left = this.additiveBuilder(),
            ue;

        while(ue = Util.expect(this.tokens, '>', '<', '>=', '<=')){

            left = {
                type: AST.ast_binary['type'],
                operator: ue.text,
                left: left,
                right: this.additiveBuilder()
            };
        }

        return left;
    }

    /**
     * 等法运算符，‘==’
     * @returns {Object}
     */
    private equalityBuilder():Object{
        let left = this.relationalBuilder(),
            ue;

        while(ue = Util.expect(this.tokens, '==', '===', '!=', '!==')){

            left = {
                type: AST.ast_binary['type'],
                operator: ue.text,
                left: left,
                right: this.relationalBuilder()
            };
        }

        return left;
    }

    /**
     * && 运算符， &&高于||
     * @returns {Object}
     */
    private andBuilder():Object{
        let left = this.equalityBuilder(),
            ue;

        while(ue = Util.expect(this.tokens, '&&')){
            left = {
                type: AST.ast_logical['type'],
                operator: ue.text,
                left: left,
                right: this.equalityBuilder()
            };
        }

        return left;
    }

    /**
     * || 运算符， &&高于||
     * @returns {Object}
     */
    private orBuilder():Object{
        let left = this.andBuilder(),
            ue;

        while(ue = Util.expect(this.tokens, '||')){

            left = {
                type: AST.ast_logical['type'],
                operator: ue.text,
                left: left,
                right: this.andBuilder()
            };
        }

        return left;
    }

    /**
     * 三元运算符
     * @returns {Object}
     */
    private ternaryBuilder():Object{
        const boolean_expression = this.orBuilder();

        if(Util.expect(this.tokens, '?')){
            const true_value = this.assignmentBuilder();
            if(Util.consume(this.tokens, ':')){
                const error_value = this.assignmentBuilder();
                return {
                    type: AST.ast_teranry['type'],
                    boolean_expression: boolean_expression,
                    true_value: true_value,
                    error_value: error_value
                };
            }
        }

        return boolean_expression;
    }

    /**
     * 管道处理
     */
    private pipeBuilder():Object{
        let pipes = this.assignmentBuilder();
        
        while(Util.expect(this.tokens, '|')){
            let args = [pipes];
            pipes = {
                type: AST.ast_function['type'],
                callee: this.identifierBuilder(),  //管道名称
                arguments: args,  //待处理的内容以及管道参数
                pipe: true
            };

             while(Util.expect(this.tokens, ':')){
                args.push(this.assignmentBuilder());
            }
        }

        return pipes;
    }
}