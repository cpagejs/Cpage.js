import Lexer from './lexer';
import Parser from './parser';
import Pipe from '../pipe/pipe';
var ps = new Pipe();
import Util from '../util';

class Parse {
	private pipes;

	constructor() {
		this.pipes = ps.pipes;
	}

    /**
     * 注册管道
     * @param name 
     * @param factory 
     */
	public register(name, factory?: Function) {
		ps.register(name, factory);

		return this;
	}
	public pipe(name: string) {
		return ps.pipe(name);
	}

    /**
     * 词法解析
     * @param str 
     */
	public parse(str) {
		const that = this;
		function parse(expression, pipes) {
			switch (Util.type(expression)) {
				case 'string':
					const lexer = new Lexer();
					const parser = new Parser(lexer, pipes);
					let oneTime = false;

					//单次检测
					if(expression.charAt(0) == ':' && expression.charAt(1) == ':'){
						oneTime = true;
						expression = expression.substring(2);
					}

					const parseFn = parser.parse(expression);
					if (parseFn.constant) { //常量
						parseFn.$$handelWatch = that.constantHandelWatch;
					}
					if(oneTime){ //单次检测
						parseFn.$$handelWatch = parseFn.literal ? that.oneTimeLiteralHandelWatch : that.oneTimeHandelWatch;
					}
					if(parseFn.inputs){
						parseFn.$$handelWatch = that.inputsHandelWatch;
					}
					return parseFn;
				case 'function':
					return expression;
			}
		}
		return parse(str, this.pipes);
	}

	/**
	 * 处理参数为常量的状况
	 * @param state 
	 * @param listenerFn 
	 * @param valueEq 
	 * @param watchFn 
	 */
	private constantHandelWatch(state, listenerFn, valueEq, watchFn) {
		const cancel = state.$watch(
			function () {
				return watchFn(state);
			},
			function (newVal, oldVal, state) {
				if (Util.type(listenerFn) == 'function') {
					listenerFn.apply(this, arguments);
				}
			},
			valueEq
		);
		return cancel;
	}

	/**
	 * 处理单次检测问题
	 * @param state 
	 * @param listenerFn 
	 * @param valueEq 
	 * @param watchFn 
	 */
	private oneTimeHandelWatch(state, listenerFn, valueEq, watchFn){
		let lastVal;
		const cancel = state.$watch(
			function () {
				return watchFn(state);
			},
			function (newVal, oldVal, state) {
				lastVal = newVal;
				if (Util.type(listenerFn) == 'function') {
					listenerFn.apply(this, arguments);
				}
				if(Util.type(newVal) != 'undefined'){
					state.$afterDigest(()=>{
						if(Util.type(lastVal) != 'undefined'){
							cancel();
						}
					});
				}
			},
			valueEq
		);
		return cancel;
	}

	/**
	 * 处理数组或对象的变量问题
	 * @param state 
	 * @param listenerFn 
	 * @param valueEq 
	 * @param watchFn 
	 */
	private oneTimeLiteralHandelWatch(state, listenerFn, valueEq, watchFn){
		let lastVal;
		const cancel = state.$watch(
			function () {
				return watchFn(state);
			},
			function (newVal, oldVal, state) {
				lastVal = newVal;
				if (Util.type(listenerFn) == 'function') {
					listenerFn.apply(this, arguments);
				}
				if(Util.type(newVal) != 'undefined'){
					state.$afterDigest(()=>{
						if(Util.type(lastVal) != 'undefined'){
							cancel();
						}
					});
				}
			},
			valueEq
		);
		return cancel;
	}

	private inputsHandelWatch(state, listenerFn, valueEq, watchFn){
		const inputExpr = watchFn.inputs;

		return state.$watch(function(){

		},listenerFn, valueEq);
	}

}

const parse = new Parse();
export default parse;


// 默认管道函数--开始
let newParse = new Parse();
newParse.register('filter', defaultFilter);

function defaultFilter() {
	return (array, filterExp) => {
		let predicateFn;
		switch (Util.type(filterExp)) {
			case 'function':
				predicateFn = filterExp;
				break;
			case 'string':
			case 'number':
			case 'boolean':
			case 'null':
			case 'undefined':
			case 'object':
				predicateFn = createPredicateFn(filterExp);
				break;
			default:
				return array;
		}
		return array.filter(predicateFn);
	}
}

// 如果pipe后面非函数表达式就生成一个
function createPredicateFn(exp) {
	// item指数组元素
	return function predicateFn(item) {
		return deepCompareValues(item, exp, compareValues);
	}
}

// source值数组的元素，target值pipe表达式冒号后面的字符，pipe:"a"
function compareValues(source: string, target) {
	if (Util.type(source) == 'null' || Util.type(target) == 'null') {
		return source === target;
	}

	// 不对undefined处理
	if (Util.type(source) == 'undefined') return false;

	source = ('' + source).toLowerCase();
	target = ('' + target).toLowerCase();

	return source.includes(target);
}

// 如果数组元素是对象进行深度比较
function deepCompareValues(source, target, compare) {
	if (Util.type(target) == 'string' && target.startsWith('!')) {
		return !deepCompareValues(source, target.substring(1), compare);
	}

	if (Util.type(source) == 'object') {
		if (Util.type(target) == 'object') {
			for (let i in target) {
				return deepCompareValues(source[i], target[i], compare);
			}
		}

		let arr = Util.objVal(source);
		return arr.some((val) => {
			return deepCompareValues(val, target, compare);
		});
	}

	return compare(source, target);
}
// 注册管道函数--结束
