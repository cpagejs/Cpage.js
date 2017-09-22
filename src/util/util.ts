import { utilAction } from './util_action';
import { applyMixins } from '../mixins';
import HandelType from './handelType';
import HandelCoding from './handelCoding';
import * as $log from '../log';

export class util implements utilAction, HandelType, HandelCoding {

	// HandelType
	type:(str:any) => any;
	isNumber:(str:any) => Boolean;
	isExponent:(ch:any) => Boolean;
	isLetter:(str:any) => Boolean;
	isWhiteSpace:(str:any) => Boolean;
	whichType:(str:any) => any;

	// HandelCoding
	nonComputedMember:(left:any, right:any) => any;
	computedMember:(left:any, right:any) => any;
	concatCode:(token:string, value:any) => any;
	conditionIsRight:(array:Array<any>, condition:any, statement:any) => void;
	compileId:(id:number, arr:any[], flag?:Boolean) => string;
	notExist:(expression:any) => any;

    /**
     * 判断两个变量是否相等，只能匹配简单的数据类型
     * @param str1
     * @param str2
     * @returns {boolean}
     */
	public isEqual(str1:any, str2:any):Boolean{
		return JSON.stringify(str1) === JSON.stringify(str2);
	}
	
	/**
	 * 判断两个变量是否相等
	 * @param newVal
	 * @param oldVal
	 * @param equalStatus 为TRUE,则深层次比较
	 */
	public areEqual(newVal:any, oldVal:any, equalStatus:Boolean):Boolean{
		if(equalStatus){
			return this.compare(newVal, oldVal);
		}else {
			// return (newVal === oldVal) && (typeof newVal == 'number' && typeof oldVal == 'number' && !isNaN(newVal) && !isNaN(oldVal)) && (newVal != NaN && oldVal != NaN);
			if(newVal.toString() == 'NaN'){
				return true;
			}else {
				return newVal === oldVal;
			}
		}
	}

	/**
	 * 判断两个变量是否相等, 此方法用于相同数据类型的变量比较
	 * @param a
	 * @param b
	 * @returns {boolean}
	 */
	public compare(a:any, b:any):Boolean{
		const pt = /undefined|number|string|boolean/,
			fn = /^(function\s*)(\w*\b)/,
			cr = "constructor",
			cn = "childNodes",
			pn = "parentNode";
		if(pt.test(typeof a) || pt.test(typeof b) || a === null || b === null){
			return a === b || (isNaN(a) && isNaN(b)); //为了方便，此处假定NaN == NaN
		}
		if(a[cr] !== b[cr]){
			return false;
		}
		switch(a[cr]){
			case Date : 
				return a.valueOf() === b.valueOf();
			case Function : 
				return a.toString().replace(fn,'$1') === b.toString().replace(fn,'$1'); //硬编码中声明函数的方式会影响到toString的结果，因此用正则进行格式化
			case Array : 
				if(a.length !== b.length){
					return false;
				}
				for(let i=0;i<a.length;i++){
					// if(!ce(a[i],b[i])){
					// 	return false;
					// }
					if(a[i].toString() == b[i].toString()){}
				}
				break;
			default : 
				let alen = 0, blen = 0, d;
				if(a === b){
					return true;
				}
				if(a[cn] || a[pn] || b[cn] || b[pn]){
					return a === b;
				}
				for(d in a){
					alen++ ;
				}
				for(d in b){
					blen++;
				}
				if(alen !== blen){
					return false;
				}
				for(d in a){
					if(a[d].toString() != b[d].toString()){
						return false;
					}
				}
				break;
		}
		return true;
	} 

	/**
	 * 浅拷贝，才方法只针对普通对象{}和数组[]
	 * @param str
	 * @returns {any}
	 */
	public clone(str:any):any{
		return JSON.parse(JSON.stringify(str));
	}

	public deepClone(data:any):any{
		var t = this.type(data), o, i, ni;
  
		if(t === 'array') {
			o = [];
		}else if( t === 'object') {
			o = {};
		}else {
			return data;
		}
		
		if(t === 'array') {
			for (i = 0, ni = data.length; i < ni; i++) {
			o.push(this.deepClone(data[i]));
			}
			return o;
		}else if( t === 'object') {
			for( i in data) {
			o[i] = this.deepClone(data[i]);
			}
			return o;
		}
	}

	/**
	 * 字符串或函数的执行次数
	 * @param obj:类型为Function, String
	 */
	public repeatObj(obj, manyTime:Number):any{
		if(this.type(manyTime) != 'number'){ 
			$log.error('函数repeat的参数manyTime类型为number'); 
		}

		switch(this.type(obj)){
			case 'string':
				return obj.repeat(manyTime);
			case 'function':
				const arr = new Array(manyTime); 
				for(let i=0; i<arr.length; i++){
					obj();
				}
				break;
			default:
				return null;
		}
	}

    /**
     * 对每个scope的children进行遍历
     * @param cb
     * @param scope
     * @returns {boolean}
     */
	public everyScope(cb:Function, scope){
		if(cb(scope)){
			return scope.$children.every((child)=>{ 
				return child.everyScope(cb,scope);
			});
		}else{
			return false;
		}
	}

	/**
	 * 处理scope的event事件
	 * @param eventName
	 * @param arr
	 * @param scope
	 */
	public handelEvent(eventName, arr:Array<any>, scope):void{  
		// if(arr[eventName] == undefined){
		// 	$log.error('事件'+eventName+'不存在');
		// }
		// const event = {name: eventName};
		let listener = arr[eventName] || function(){};
		try {
			listener(scope);
		} catch(e){
			$log.error(e);
		}
	}

    /**
     * 对象转map对象
     * @param obj
     * @returns {Map}
     */
	public objToMap(obj:Object):Map<any, any>{
		if(this.type(obj) != 'object') return;
		let map = new Map();
		for(let i in obj){
			map.set(i, obj[i]);
		}
		return map;
	}

    /**
     * map对象转普通对象
     * @param map
     * @returns {{}}
     */
	public mapToObj(map:Map<any, any>):Object{
		if(this.type(map) != 'map') return;
		let obj = {}; 
		map.forEach((val ,key)=>{
			obj[key] = val;
		});
		return obj;
	}

    /**
     * 此方法用于获取首位不写0浮点数的下一位字符
     * @param index
     * @param str
     * @returns {string|boolean}
     */
	public nextLeter(index:number, str:string):string | boolean{
		return (index<str.length-1) ? str.charAt(index+1) : false; 
	}

	/**
	 * 将string类型的数据外层包装\
	 * @param str
	 * @returns {any}
	 */
	public wrapString(str):any{ 
		if(this.type(str) == 'string'){
			return '\'' + str + '\'';
		}else if(this.type(str) == 'null'){
			return 'null';
		}else {
			return str;
		}
	}

    /**
     * 判断数组第一个元素是否与有某个元素相等，如果是则将其移除
     * @param str
     * @param arr
     * @returns {any[]}
     */
	public expect(arr:Array<any>, ...str):any{
		let that = this;
		function es(val){
			return that.exitFirst(arr, val);
		}
		// console.log(str);
		if(str.some(es)){
			return arr.shift();
		}
		// if(this.exitFirst(arr, str)) return arr.shift();
    }

    /**
     * 在expect函数基础上，如果目标元素不匹配报错
     * @param str
     * @param arr
     * @returns {any}
     */
    public consume(arr:Array<any>, str?):any{
        const t = this.expect(arr, str); 
		if(!t) $log.error('词法解析错误'+str);
		return t;
    }

	/**
	 * 判断数组第一个元素是否与有某个元素相等，相等则返回首个数组首个元素
	 * @param str
	 * @param arr
	 * @returns {number}
	 */
	public exit(str:any, arr:Array<any>):any{
		if(this.type(arr) != 'array') return;
		if(!arr.length) return;
		for(let i=0; i<arr.length; i++){
			if(str == arr[i]['text']){
				return i;
			}
		}
	}

	/**
	 * 只针对对象的第一个元素
	 * @param arr
	 * @param str
	 * @returns {any}
	 */
	public exitFirst(arr:Array<any>, str?:any):any{
		if(this.type(arr) != 'array') return;
		if(!arr.length) return;

		if( !str || (str == arr[0]['text']) ){
			return arr[0];
		}
	}

	/**
     * 数组去重，针对普通类型的数组
     * @param arr
     * @returns {Array}
     */
	public uArray(arr:Array<any>):Array<number> | Array<string> | Array<boolean>{
		let newArr = [];
		let set = new Set(arr);
		set.forEach((val)=>{
			newArr.push(val);
		});
		return newArr;
	}

    /**
     * 获取数组中某个元素的下标，返回结果维数组
     * @param data
     * @param array
     * @returns {any}
     */
	public arrayItem(data:any, array:Array<any>):Array<number>{
	    if(this.type(array) != 'array') return;
	    let item = [];
        for(let i=0; i<array.length; i++){
            if(array[i].toString() === data.toString()) item.push(i);
        }
        // console.log(item,array);
	    return item;
    }

	/**
     * 获取数组中某个对象元素的下标
     */
	public arrayItem2(data:any, array:Array<any>):string{
	    if(this.type(array) != 'array') return;
	    let item;
        for(let i=0; i<array.length; i++){
            if(array[i]['name'] === data) item = i;
        }
	    return item;
    }

	/**
     * 获取数组中某个重复元素的最后下标
     */
	public arrayLastItem(data:any, array:Array<any>):string{
	    if(this.type(array) != 'array') return;
	    let item;
		array = array.reverse();
        for(let i=0; i<array.length; i++){
            if(array[i] === data) item = i;
        }
	    return item;
    }

    /**
     * 去除数组中的重复元素
     * @param data
     * @param array
     * @returns {Array}
     */
	public arraySplice(data:any, array:Array<any>):Array<any>{
        if(this.type(array) != 'array') return;

        let arr = this.arrayItem(data, array);
        for(let i=0; i<arr.length; i++){
            array.splice(arr[i], 1);
        }

	    return array;
    }

	/**
	 * 去除数组中的'',null,undefined
	 */
	public arrayCompact(arr:Array<any>):Array<any>{
		let newArr = [];
		arr.forEach((v)=>{
			if(v!='' && v!= null && v!= undefined)
				newArr.push(v)
		});
		return newArr;
	}

	/**
	 * 获取两个数组的交集
	 * @param a 
	 * @param b 
	 */
	public intersection(a:Array<any>, b:Array<string>):Array<any>{
		return a.filter(v => { return b.includes(v) });
	}

	/**
	 * 对字符串进行解析
	 * @param str
	 * @returns {Function}
	 */
	public parseString(str:String):any{
		if(this.type(str) != 'string') return;
		return new Function("return "+str);
	}

	/**
	 * 用于判断对象是否含有某个属性,并返回与表达式 ‘scope’ && （\‘a\’ in 'scope'）
	 * @param obj
	 * @param ele
	 * @returns {any}
	 */
	public hasProperty(obj:any, ele:any):any{
		return obj + ' && (' + this.wrapString(ele) + ' in ' + obj + ')';
	}

	/**
	 * 判断所传字符串与目标字符串是否相等
	 * @param target
	 * @param str
	 * @returns {any}
	 */
	public inStr(target:string, str:string):Boolean{
		return str.includes(target);
	}

	/**
	 * 获取对象的键
	 * @param obj 
	 */
	public objKey(obj){
		let arr = [];
		for(let i in obj){
			arr.push(i);
		}
		return arr;
	}

	/**
	 * 获取对象的值
	 * @param obj 
	 */
	public objVal(obj){
		let arr = [];
		for(let i in obj){
			arr.push(obj[i]);
		}
		return arr;
	}

	/**
	 * 判断对象是否为空
	 * @param obj 对象
	 */
	public isEmpty(obj):boolean{
		if(this.type(obj) != 'object')
			return;
		if(JSON.stringify(obj) == '{}')
			return true;
		return false;
	}

	/**
	 * 移除对象中某些元素
	 * @param obj 对象
	 * @param ...str  需要移除的元素
	 */
	public expectSome(obj, ...str){
		let newObj = this.clone(obj);
		str.forEach(v=>{
			delete newObj[v];
		});
		return newObj;
	}

	/**
	 * x-a转驼峰xA
	 * @param str 
	 */
	public cameCase(str:string):string{
		return str.replace(/\-(\w)/g, function(x){return x.slice(1).toUpperCase();});
	}

	/**
	 * 驼峰xA转x-a
	 * @param str 
	 */
	public _cameCase(str:string):string{
		return str.replace(/([A-Z])/g, "-$1");
	}

	/**
	 * 合并对象
	 * @param target 
	 * @param source 
	 */
	public extend(target, source){
		for(let i in source){
			target[i] = source[i];
		}
		return target;
	}

	/**
	 * 去除空格 回车 换行
	 * @param str 
	 */
	public trimStr(str){
		let res = str.trim();
		res = res.replace(/\s+/g, '');
		res = res.replace(/[\r\n]/g, '');
		return res;
	}

	/**
	 * 获取当前时间 20170516
	 */
	public now(){
		let date = new Date(),
			year:string = date.getFullYear().toString(),
			month:string = (date.getMonth() + 1).toString(),
			day:string = date.getDate().toString();
		month = parseInt(month)<10 ? '0'+month : month;

		return year+month+day+'0';
	}

	public page(){
		return {
			width: window.innerWidth,
			height: window.innerHeight
		}
	}

	/**
	 * 将class转换为json
	 * @param fn class函数
	 * @param isRoot 是否为根组件
	 */
	public classToJson(fn, isRoot=false){
		let app:Function;
		let rootComponent:object = {};

		if(fn){
			app = new fn();
		}else {
			$log.error('函数'+fn+'未找到');
		}

		const obj = Object.create(app);
		const propertyObj = obj.__proto__;
		const prototypeObj = obj.__proto__.__proto__;
		const arr = Object.entries(propertyObj).concat(Object.entries(prototypeObj).slice(1));
		const protoNames = Object.getOwnPropertyNames(prototypeObj);
		let componentJson:any = {};

		for(let i=1; i<protoNames.length; i++){
			componentJson[protoNames[i]] = prototypeObj[protoNames[i]];
		}
		
		arr.forEach((v,i)=>{
			componentJson[v[0]] = v[1];
			if(isRoot){
				rootComponent[v[0]] = v[1];
			}
		});

		return {
			componentJson, rootComponent
		}
	}
}

applyMixins(util, [HandelType, HandelCoding]);
