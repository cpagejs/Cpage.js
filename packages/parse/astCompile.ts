import { astCompileAction } from './astCompile_action';
import { dataType } from '../config/ast_config';
import * as $log from '../log';
import * as K from '../config/unSafeStr';
import Util from '../util';
let ps = {}; //管道集合

export default class ASTCompile implements astCompileAction{
    private astBuilder;
    private state;
    private ast;

    constructor(astBuilder, pipes){
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
    public compile(text):any{
        this.ast = this.astBuilder.ast(text);
        this.handelTree(this.ast);
        this.constantExpr(this.ast);

        const fn = this.pipePrefix()+'var fn = function(scope, local){'
                        + (this.state.echo.length ? 'var '+this.state.echo.join(',')+';' : '')
                        + this.state.body.join('') + '}; return fn;';
        
        const fns:any =  new Function(
                                'safeProperty',
                                'safeObject',
                                'safeFunction',
                                'isUndefined',
                                'pipe',
                                fn)(
                                    safeProperty,
                                    safeObject,
                                    safeFunction,
                                    isUndefined,
                                    pipe);
        
        fns.literal = this.isLiteral();  // 定义字面量
        fns.constant = this.ast.constant;  // 定义常亮

        return fns;
    }

    /**
     * 递归解析词法树
     * @param ast 词法结构树
     * @param context 针对函数的上下文
     * @param createNewElement 布尔值，如果属性不存在就动态创建一个
     * @returns {any}
     */
    private handelTree(ast:any,
                       context={context:undefined, name: undefined, computed: undefined},
                       createNewElement?:Boolean
    ):any{
        switch(ast.type){
            case dataType['1']:  //'ASTBuilder.Init'
                this.initCompile(ast);
                break;
            case dataType['2']:  //'ASTBuilder.MetaData'
                return this.metaCompile(ast);
            case dataType['3']:  //'ASTBuilder.Array'
                return this.arrayCompile(ast);
            case dataType['4']:  //'ASTBuilder.Object'
                return this.objectCompile(ast);
            case dataType['5']:  //'ASTBuilder.Identifier'
                return this.identifierCompile(ast, context, createNewElement);
            case dataType['6']:  //'ASTBuilder.This'
                return this.thisCompile();
            case dataType['7']:  //'ASTBuilder.Member'
                return this.memberCompile(ast, context, createNewElement);
            case dataType['8']:  //'ASTBuilder.Function'
                return this.functionCompile(ast);
            case dataType['9']:  //'ASTBuilder.Assignment'
                return this.assigmentCompile(ast);
            case dataType['10']: //'ASTBuilder.Unary'
                return this.unaryCompile(ast);
            case dataType['11']: //'ASTBuilder.Binary'
                return this.binaryCompile(ast);
            case dataType['12']: //'ASTBuilder.Logical'
                return this.logicalCompile(ast);
            case dataType['13']: //'ASTBuilder.Ternary'
                return this.ternaryCompile(ast);
        }

    }

    /**
     * 初始化词法编译器
     * @param ast 
     */
    private initCompile(ast):void{
        let arr = Util.clone(ast.body);
        let last = arr.pop();

        arr.forEach((val)=>{
            this.state.body.push(this.handelTree(val));
        });
        
        this.state.body.push('return ', this.handelTree(last), ';');
    }

    /**
     * 基础类数据编译
     * @param ast
     * @returns {any}
     */
    private metaCompile(ast):any{
        return Util.wrapString(ast.value);
    }

    /**
     * 数组类词法树编译
     * @param ast
     * @returns {string}
     */
    private arrayCompile(ast):any{
        let arr = ast.value.map((val)=>{
            return this.handelTree(val);
        });
        return '['+ arr.join(',') +']';
    }

    /**
     * 对象类词法树编译
     * @param ast
     * @returns {string}
     */
    private objectCompile(ast):any{
        let arrJson = ast.value.map((val)=>{
            const key = val['key']['value'];
            const value = this.handelTree(val['value']);
            return key + ':' + value;
        });
        return '{' + arrJson.join(',') +'}';
    }

    /**
     * 标识符词法树编译
     * @param ast
     * @param context
     * @param createNewElement
     * @returns {string}
     */
    private identifierCompile(ast, context, createNewElement):any{
        //判断是否是安全的属性名
        safeProperty(ast.value);

        const id = this.incrementId();

        // 存在本地属性local
        Util.conditionIsRight(
            this.state.body,
            Util.hasProperty('local', ast.value),
            Util.concatCode(id, Util.nonComputedMember('local', ast.value))
        );

        // 创建空对象
        if(createNewElement){
            Util.conditionIsRight(
                this.state.body,
                Util.notExist(Util.hasProperty('local', ast.value)) + ' && scope && ' + Util.notExist(Util.hasProperty('scope', ast.value)),
                Util.concatCode(Util.nonComputedMember('scope', ast.value), '{}')
            )
        }

        //不存在本地属性，只有scope属性
        Util.conditionIsRight(
            this.state.body,
            Util.notExist(Util.hasProperty('local', ast.value))+' && scope',
            Util.concatCode(id, Util.nonComputedMember('scope', ast.value))
        );

        // 处理函数上下文
        if(context){
            context.context = Util.hasProperty('local', ast.value) + '?local:scope';
            context.name = ast.value;
            context.computed = false;
        }

        this.state.body.push('safeObject('+id+');');
        return id;
    }

    /**
     * 含有this的编译
     * @returns {string}
     */
    private thisCompile(){
        return 'scope';
    }

    /**
     * 对象属性操作类词法树编译，如a.b, a["b"]
     * @param ast
     * @param context
     * @param createNewElement
     * @returns {string}
     */
    private memberCompile(ast, context, createNewElement){
        const id = this.incrementId();

        const noComp = this.handelTree(ast.object, undefined, true);
        if(context){
            context.context = noComp;
        }

        if(ast.computed){  //a["b"]
            const comp = this.handelTree(ast.property);

            this.state.body.push('safeProperty(' + comp + ');');

            //处理空对象
            if(createNewElement){
                Util.conditionIsRight(
                    this.state.body,
                    Util.notExist(Util.computedMember(noComp, comp)),
                    Util.concatCode(Util.computedMember(noComp, comp), '{}')
                );
            }
            Util.conditionIsRight(
                this.state.body,
                noComp,
                Util.concatCode(id, 'safeObject('+Util.computedMember(noComp, comp)+')')
            );
            if(context){
                context.name = comp;
                context.computed = true;
            }
        }
        if(!ast.computed){  //a.b
            safeProperty(ast.property.value);

            if(createNewElement){
                Util.conditionIsRight(
                    this.state.body,
                    Util.notExist(Util.nonComputedMember(noComp, ast.property.value)),
                    Util.concatCode(Util.nonComputedMember(noComp, ast.property.value), '{}')
                );
            }
            Util.conditionIsRight(
                this.state.body,
                noComp,
                Util.concatCode(id, 'safeObject('+Util.nonComputedMember(noComp, ast.property.value)+')')
            );
            if(context){
                context.name = ast.property.value;
                context.computed = false;
            }
        }

        return id;
    }

    /**
     * 函数类词法树编译
     * @param ast
     * @returns {string}
     */
    private functionCompile(ast):any{
        let callContext, callee, args;

        if(ast.pipe){
            callee = this.pipeCompile(ast.callee.value);
            args = ast.arguments.map((val)=>{
                return this.handelTree(val);
            });
            return callee + '(' + args.join(',') + ')';
        }

        if(!ast.pipe){
            callContext = {context:undefined, name: undefined, computed: undefined};
            callee = this.handelTree(ast.callee, callContext);
            args = ast.arguments.map((val)=>{
                return 'safeObject('+this.handelTree(val)+')'; //检测函数参数是否安全
            });
            // console.log(callContext);
            if(callContext.name){
                this.state.body.push('safeObject('+callContext.context+');');
                if(callContext.computed){
                    callee = Util.computedMember(callContext.context, callContext.name);
                }else{
                    callee = Util.nonComputedMember(callContext.context, callContext.name);
                }
            }

            //检测函数是否安全
            this.state.body.push('safeFunction('+callee+');');

            //safeObject 检测函数返回值是否安全
            return callee + ' && safeObject(' + callee + '(' + args.join(',') + '))';
        }
    }

    /**
     *含有等号等符号类词法树编译
     * @param ast
     * @returns {any}
     */
    private assigmentCompile(ast):any{
        let left,
            leftCon = {context:undefined, name: undefined, computed: undefined};

        this.handelTree(ast.left, leftCon, true);

        if(leftCon.computed){
            left = Util.computedMember(leftCon.context, leftCon.name);
        }else {
            left = Util.nonComputedMember(leftCon.context, leftCon.name);
        }
        // console.log(leftCon, left);
        //safeObject 用于检测表达式右侧是否安全
        return Util.concatCode(left, 'safeObject('+this.handelTree(ast.right)+')');
    }

    /**
     * 含有一元运算符的编译
     * @param ast
     * @returns {string}
     */
    private unaryCompile(ast):any{
        return ast.operator + '(' + 'isUndefined(' + this.handelTree(ast.value) + '))';
    }

    /**
     * 二元运算符编译
     * @param ast
     * @returns {string}
     */
    private binaryCompile(ast):any{
        if(Util.inStr(ast.operator, '+-')){ //加减运算
            return '(isUndefined(' + this.handelTree(ast.left) + ')' + ast.operator + 'isUndefined(' + this.handelTree(ast.right) + '))';
        }

        return '(' + this.handelTree(ast.left) + ast.operator + this.handelTree(ast.right) + ')';
    }

    /**
     * 逻辑运算符编译
     * @param ast
     * @returns {string}
     */
    private logicalCompile(ast):any{
        const id = this.incrementId();

        this.state.body.push(Util.concatCode(id, this.handelTree(ast.left)));
        Util.conditionIsRight(
            this.state.body,
            ast.operator == '&&' ? id : Util.notExist(id),
            Util.concatCode(id, this.handelTree(ast.right))
        );

        return id;
    }

    /**
     * 三元运算符编译
     * @param ast
     * @returns {string}
     */
    private ternaryCompile(ast):any{
        const id = this.incrementId();
        const id2 = this.incrementId();

        this.state.body.push(Util.concatCode(id2, this.handelTree(ast.boolean_expression)));

        Util.conditionIsRight(
            this.state.body,
            id2,
            Util.concatCode(id, this.handelTree(ast.true_value))
        );

        Util.conditionIsRight(
            this.state.body,
            Util.notExist(id2),
            Util.concatCode(id, this.handelTree(ast.error_value))
        );

        return id;
    }

    /**
     * 管道编译
     * @param name 
     */
    private pipeCompile(name):any{
        let ps = this.state.pipes;

        if(!ps.hasOwnProperty('name')){
            ps[name] = this.incrementId(true);
        }

        return ps[name];
    }

    /**
     * 判断pipes是否存在
     */
    private pipePrefix(){
        const ps = this.state.pipes;

        if(JSON.stringify(ps) == '{}'){
            return '';
        }

        const arr = [];
        for(let k in ps){
            arr.push(ps[k]+'='+'pipe(' + Util.wrapString(k) + ')');
        }
        // console.log(arr);
        return 'var ' + arr.join(',') + ';';
    }

    /**
     * compileId自增
     */
    private incrementId(flag?:Boolean):string{
        const id = Util.compileId(this.state.compileId, this.state.echo, flag);
        this.state.compileId++;
        return id;
    }

    /**
     * 字面量
     */
    private isLiteral(){
        const arr = this.ast.body;
        return !arr.length || ((arr.length === 1) && 
                            ( arr[0].type === dataType['2'] || 
                            arr[0].type === dataType['3'] || 
                            arr[0].type === dataType['4'] || 
                            arr[0].type === dataType['5'] 
                            )
                            );
    }

    /**
     * 常量
     * @param ast 
     */
    private constantExpr(ast){
        let cons, that = this;

        switch(ast.type){
            case dataType['1']:  //ASTBuilder.Init
                cons = true;
                arrayLike(ast.body);
                break;
            case dataType['2']:  //ASTBuilder.MetaData
                ast.constant = true;
                break;
            case dataType['3']:  //ASTBuilder.Array
                cons = true;
                arrayLike(ast.value);
                ast.constant = cons;
                break;
            case dataType['4']: //ASTBuilder.Object
                cons = true;
                ast.value.forEach((val)=>{
                    this.constantExpr(val.value);
                    cons = cons && val.value.constant;
                });
                ast.constant = cons;
                break;
            case dataType['5']:  //ASTBuilder.Identifier
            case dataType['6']:  //ASTBuilder.This
                ast.constant = false;
                break;
            case dataType['7']:  //ASTBuilder.Member
                this.constantExpr(ast.object);
                if(ast.computed){
                    this.constantExpr(ast.property);
                }
                ast.constant = ast.object.constant && (!ast.computed || ast.property.constant);
                break;
            case dataType['8']:  //ASTBuilder.Function
                cons = ast.pipe;
                arrayLike(ast.arguments);
                ast.constant = cons;
                break;
            case dataType['9']: //ASTBuilder.Assignment
                leftRight();
                break;
            case dataType['10']: //ASTBuilder.Unary
                this.constantExpr(ast.value);
                ast.constant = ast.value.constant;
                break;
            case dataType['11']: //ASTBuilder.Binary
            case dataType['12']: //ASTBuilder.Logical
                leftRight();
                break;
            case dataType['13']: //ASTBuilder.Teranry
                this.constantExpr(ast.boolean_expression);
                this.constantExpr(ast.true_value);
                this.constantExpr(ast.error_value);
                ast.constant = ast.boolean_expression.constant && ast.true_value.constant && ast.error_value.constant;
                break;
        }

        function arrayLike(array){
            array.forEach((val)=>{
                that.constantExpr(val);
                cons = cons && val.constant;
            });
            ast.constant = cons;
        }

        function leftRight(){
            that.constantExpr(ast.left);
            that.constantExpr(ast.right);
            ast.constant = ast.left.constant && ast.right.constant;
        }
    }

}

/**
 * 检测是否是安全的属性名，例如constructor, __defineGetter__等
 * @param str
 */
function safeProperty(str){
    const f =  K.PROPERTY.some((val)=>{
        return val === str;
    });

    if(f) $log.error(str + '存在编译风险');
}

/**
 * 检测是否是安全的对象
 * @param obj
 */
function safeObject(obj){
    if(obj == undefined) return;

    const f = K.WINDOW.every((val)=>{
        return obj[val];
    });

    const f2 = K.NODE.every((val)=>{
        return obj[val];
    });

    if(f || f2 || obj.constructor == obj || obj.getOwnPropertyDescriptor || obj.getOwnPropertyNames) $log.error(obj + '存在编译风险');

    return obj;
}

/**
 * 检查函数是否安全
 * @param fun
 */
function safeFunction(fun){
    const f = K.FUN.some((val)=>{
        return val == fun;
    });

    if(f || fun.constructor == fun) $log.error(fun + '存在编译风险');
}

/**
 * 判断目标是否为undefined
 * @param target
 * @param value
 * @returns {any}
 */
function isUndefined(target, value=0):any{
    return typeof target === 'undefined' ? value : target;
}

/**
 * 根据管道名称返回管道处理函数
 * @param name 管道名称
 */
function pipe(name):any{
    // console.log(ps);
    return ps[name];
}
