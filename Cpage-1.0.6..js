(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var compile_1 = __webpack_require__(1);
	exports.Component = compile_1.Component;
	var Dom_1 = __webpack_require__(30);
	exports.Dom = Dom_1.default;
	var store_1 = __webpack_require__(26);
	var Store = new store_1.default('user');
	exports.Store = Store;
	var cookie_1 = __webpack_require__(36);
	exports.Cookie = cookie_1.default;
	exports.default = compile_1.default;
	window.Cpage = new compile_1.default();


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var $log = __webpack_require__(2);
	var util_1 = __webpack_require__(3);
	var render_1 = __webpack_require__(8);
	var componentGuard_1 = __webpack_require__(29);
	var store_1 = __webpack_require__(26);
	var store = new store_1.default();
	store.data('componentList', []);
	store.service('component', function () {
	    this.ensureOneInvokeComponent = function (name, arr) {
	        var res = {
	            type: 'yes'
	        }, rootName = [], names = [];
	        for (var i = 0; i < arr.length; i++) {
	            if (arr[i].name == name)
	                rootName.push(name);
	            names.push(arr[i].name);
	        }
	        if (rootName.length >= 2)
	            res = {
	                type: 'no',
	                info: '只能有一个根组件，却发现' + rootName.length + '个' + name + '根组件'
	            };
	        return res;
	    };
	});
	var CPage = /** @class */ (function () {
	    function CPage() {
	        this.CList = [];
	        this.id = 0;
	        this.id = 0;
	    }
	    /**
	     * es6模式，渲染组件
	     * @param selector id选择符，如果是class，则取第一个节点
	     * @param fn 根组件函数
	     */
	    CPage.bootstrap = function (selector, fn) {
	        var rootComponent = {};
	        function componetList(fn, isRoot) {
	            if (isRoot === void 0) { isRoot = false; }
	            var classToJson = util_1.default.classToJson(fn, isRoot);
	            var componentJson = classToJson.componentJson;
	            if (isRoot) {
	                rootComponent = classToJson.rootComponent;
	            }
	            componentGuard_1.default(componentJson);
	            store.data('componentList', store.get('componentList').push(componentJson));
	            if (componentJson.components && util_1.default.type(componentJson.components) == 'array' && componentJson.components.length) {
	                componentJson.components.forEach(function (v) {
	                    componetList(v);
	                });
	            }
	        }
	        componetList(fn, true);
	        var r = new render_1.default(selector, rootComponent, store.get('componentList'));
	        r.componentToDom();
	    };
	    /**
	     * 路由
	     * @param config 路由配置
	     */
	    CPage.router = function (config) {
	        function check(str) {
	            if (util_1.default.type(str) != 'array') {
	                $log.error('路由配置项需为数组形式');
	            }
	        }
	        check(config);
	        config.forEach(function (v) {
	            var classToJson = util_1.default.classToJson(v.component, false);
	            v.component = classToJson.componentJson;
	        });
	        store.data('routerConfig', config);
	    };
	    CPage.prototype.directive = function (name, fn) {
	        var conf = fn();
	        conf.id = this.id;
	        this.CList.push(conf);
	        this.id++;
	        var guard = store.get('component').ensureOneInvokeComponent(name, this.CList);
	        if (guard.type == 'no') {
	            $log.error(guard.info);
	        }
	        return conf;
	    };
	    /**
	     * es5模式获取组建信息
	     * @param obj
	     */
	    CPage.prototype.component = function (obj) {
	        componentGuard_1.default(obj);
	        var componentInfo = util_1.default.deepClone(obj);
	        Object.defineProperties(componentInfo, {
	            isRoot: {
	                value: false,
	                writable: true
	            },
	            $el: {
	                value: undefined,
	                writable: true
	            },
	            $props: {
	                value: {},
	                writable: true
	            }
	        });
	        return this.directive(obj.name, function () {
	            return componentInfo;
	        });
	    };
	    /**
	     * es5模式，将组件渲染到dom
	     * @param selector id选择符，如果是class，则取第一个节点
	     * @param root 根组件信息
	     */
	    CPage.prototype.bootstrap = function (selector, root) {
	        if (util_1.default.type(selector) != 'string') {
	            $log.error(selector + '应为字符串');
	        }
	        if (!document.querySelector(selector)) {
	            $log.error('节点“' + selector + '”不存在');
	        }
	        if (util_1.default.type(root) != 'object') {
	            $log.error(root + '应为json对象');
	        }
	        if (arguments.length == 2) {
	            componentGuard_1.default(root);
	            if (!root.name) {
	                $log.error('找不到根组件的name属性');
	            }
	            store.data('rootComponent', root.name);
	            var r = new render_1.default(selector, root, this.CList);
	            r.componentToDom();
	        }
	    };
	    CPage.version = '1.0.5';
	    return CPage;
	}());
	exports.default = CPage;
	/**
	 * es6模式构建组件
	 */
	var Component = /** @class */ (function () {
	    function Component() {
	        this.components = [];
	        this.name = '';
	        this.template = '';
	        this.data = {};
	        this.props = {};
	    }
	    Component.prototype.render = function () {
	        $log.error('render方法必须被继承');
	    };
	    return Component;
	}());
	exports.Component = Component;


/***/ }),
/* 2 */
/***/ (function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	function log(str) {
	    console.log(str);
	}
	exports.log = log;
	function info(str) {
	    console.log(str);
	}
	exports.info = info;
	function warn(str) {
	    console.log(str);
	}
	exports.warn = warn;
	function error(str) {
	    throw new Error(str);
	}
	exports.error = error;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var util_1 = __webpack_require__(4);
	var Util = new util_1.util();
	exports.default = Util;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var mixins_1 = __webpack_require__(5);
	var handelType_1 = __webpack_require__(6);
	var handelCoding_1 = __webpack_require__(7);
	var $log = __webpack_require__(2);
	var util = /** @class */ (function () {
	    function util() {
	    }
	    /**
	     * 判断两个变量是否相等，只能匹配简单的数据类型
	     * @param str1
	     * @param str2
	     * @returns {boolean}
	     */
	    util.prototype.isEqual = function (str1, str2) {
	        return JSON.stringify(str1) === JSON.stringify(str2);
	    };
	    /**
	     * 判断两个变量是否相等
	     * @param newVal
	     * @param oldVal
	     * @param equalStatus 为TRUE,则深层次比较
	     */
	    util.prototype.areEqual = function (newVal, oldVal, equalStatus) {
	        if (equalStatus) {
	            return this.compare(newVal, oldVal);
	        }
	        else {
	            // return (newVal === oldVal) && (typeof newVal == 'number' && typeof oldVal == 'number' && !isNaN(newVal) && !isNaN(oldVal)) && (newVal != NaN && oldVal != NaN);
	            if (newVal.toString() == 'NaN') {
	                return true;
	            }
	            else {
	                return newVal === oldVal;
	            }
	        }
	    };
	    /**
	     * 判断两个变量是否相等, 此方法用于相同数据类型的变量比较
	     * @param a
	     * @param b
	     * @returns {boolean}
	     */
	    util.prototype.compare = function (a, b) {
	        var pt = /undefined|number|string|boolean/, fn = /^(function\s*)(\w*\b)/, cr = "constructor", cn = "childNodes", pn = "parentNode";
	        if (pt.test(typeof a) || pt.test(typeof b) || a === null || b === null) {
	            return a === b || (isNaN(a) && isNaN(b)); //为了方便，此处假定NaN == NaN
	        }
	        if (a[cr] !== b[cr]) {
	            return false;
	        }
	        switch (a[cr]) {
	            case Date:
	                return a.valueOf() === b.valueOf();
	            case Function:
	                return a.toString().replace(fn, '$1') === b.toString().replace(fn, '$1'); //硬编码中声明函数的方式会影响到toString的结果，因此用正则进行格式化
	            case Array:
	                if (a.length !== b.length) {
	                    return false;
	                }
	                for (var i = 0; i < a.length; i++) {
	                    // if(!ce(a[i],b[i])){
	                    // 	return false;
	                    // }
	                    if (a[i].toString() == b[i].toString()) { }
	                }
	                break;
	            default:
	                var alen = 0, blen = 0, d = void 0;
	                if (a === b) {
	                    return true;
	                }
	                if (a[cn] || a[pn] || b[cn] || b[pn]) {
	                    return a === b;
	                }
	                for (d in a) {
	                    alen++;
	                }
	                for (d in b) {
	                    blen++;
	                }
	                if (alen !== blen) {
	                    return false;
	                }
	                for (d in a) {
	                    if (a[d].toString() != b[d].toString()) {
	                        return false;
	                    }
	                }
	                break;
	        }
	        return true;
	    };
	    /**
	     * 浅拷贝，才方法只针对普通对象{}和数组[]
	     * @param str
	     * @returns {any}
	     */
	    util.prototype.clone = function (str) {
	        return JSON.parse(JSON.stringify(str));
	    };
	    util.prototype.deepClone = function (data) {
	        var t = this.type(data), o, i, ni;
	        if (t === 'array') {
	            o = [];
	        }
	        else if (t === 'object') {
	            o = {};
	        }
	        else {
	            return data;
	        }
	        if (t === 'array') {
	            for (i = 0, ni = data.length; i < ni; i++) {
	                o.push(this.deepClone(data[i]));
	            }
	            return o;
	        }
	        else if (t === 'object') {
	            for (i in data) {
	                o[i] = this.deepClone(data[i]);
	            }
	            return o;
	        }
	    };
	    /**
	     * 字符串或函数的执行次数
	     * @param obj:类型为Function, String
	     */
	    util.prototype.repeatObj = function (obj, manyTime) {
	        if (this.type(manyTime) != 'number') {
	            $log.error('函数repeat的参数manyTime类型为number');
	        }
	        switch (this.type(obj)) {
	            case 'string':
	                return obj.repeat(manyTime);
	            case 'function':
	                var arr = new Array(manyTime);
	                for (var i = 0; i < arr.length; i++) {
	                    obj();
	                }
	                break;
	            default:
	                return null;
	        }
	    };
	    /**
	     * 对每个scope的children进行遍历
	     * @param cb
	     * @param scope
	     * @returns {boolean}
	     */
	    util.prototype.everyScope = function (cb, scope) {
	        if (cb(scope)) {
	            return scope.$children.every(function (child) {
	                return child.everyScope(cb, scope);
	            });
	        }
	        else {
	            return false;
	        }
	    };
	    /**
	     * 处理scope的event事件
	     * @param eventName
	     * @param arr
	     * @param scope
	     */
	    util.prototype.handelEvent = function (eventName, arr, scope) {
	        // if(arr[eventName] == undefined){
	        // 	$log.error('事件'+eventName+'不存在');
	        // }
	        // const event = {name: eventName};
	        var listener = arr[eventName] || function () { };
	        try {
	            listener(scope);
	        }
	        catch (e) {
	            $log.error(e);
	        }
	    };
	    /**
	     * 对象转map对象
	     * @param obj
	     * @returns {Map}
	     */
	    util.prototype.objToMap = function (obj) {
	        if (this.type(obj) != 'object')
	            return;
	        var map = new Map();
	        for (var i in obj) {
	            map.set(i, obj[i]);
	        }
	        return map;
	    };
	    /**
	     * map对象转普通对象
	     * @param map
	     * @returns {{}}
	     */
	    util.prototype.mapToObj = function (map) {
	        if (this.type(map) != 'map')
	            return;
	        var obj = {};
	        map.forEach(function (val, key) {
	            obj[key] = val;
	        });
	        return obj;
	    };
	    /**
	     * 此方法用于获取首位不写0浮点数的下一位字符
	     * @param index
	     * @param str
	     * @returns {string|boolean}
	     */
	    util.prototype.nextLeter = function (index, str) {
	        return (index < str.length - 1) ? str.charAt(index + 1) : false;
	    };
	    /**
	     * 将string类型的数据外层包装\
	     * @param str
	     * @returns {any}
	     */
	    util.prototype.wrapString = function (str) {
	        if (this.type(str) == 'string') {
	            return '\'' + str + '\'';
	        }
	        else if (this.type(str) == 'null') {
	            return 'null';
	        }
	        else {
	            return str;
	        }
	    };
	    /**
	     * 判断数组第一个元素是否与有某个元素相等，如果是则将其移除
	     * @param str
	     * @param arr
	     * @returns {any[]}
	     */
	    util.prototype.expect = function (arr) {
	        var str = [];
	        for (var _i = 1; _i < arguments.length; _i++) {
	            str[_i - 1] = arguments[_i];
	        }
	        var that = this;
	        function es(val) {
	            return that.exitFirst(arr, val);
	        }
	        // console.log(str);
	        if (str.some(es)) {
	            return arr.shift();
	        }
	        // if(this.exitFirst(arr, str)) return arr.shift();
	    };
	    /**
	     * 在expect函数基础上，如果目标元素不匹配报错
	     * @param str
	     * @param arr
	     * @returns {any}
	     */
	    util.prototype.consume = function (arr, str) {
	        var t = this.expect(arr, str);
	        if (!t)
	            $log.error('词法解析错误' + str);
	        return t;
	    };
	    /**
	     * 判断数组第一个元素是否与有某个元素相等，相等则返回首个数组首个元素
	     * @param str
	     * @param arr
	     * @returns {number}
	     */
	    util.prototype.exit = function (str, arr) {
	        if (this.type(arr) != 'array')
	            return;
	        if (!arr.length)
	            return;
	        for (var i = 0; i < arr.length; i++) {
	            if (str == arr[i]['text']) {
	                return i;
	            }
	        }
	    };
	    /**
	     * 只针对对象的第一个元素
	     * @param arr
	     * @param str
	     * @returns {any}
	     */
	    util.prototype.exitFirst = function (arr, str) {
	        if (this.type(arr) != 'array')
	            return;
	        if (!arr.length)
	            return;
	        if (!str || (str == arr[0]['text'])) {
	            return arr[0];
	        }
	    };
	    /**
	     * 数组去重，针对普通类型的数组
	     * @param arr
	     * @returns {Array}
	     */
	    util.prototype.uArray = function (arr) {
	        var newArr = [];
	        var set = new Set(arr);
	        set.forEach(function (val) {
	            newArr.push(val);
	        });
	        return newArr;
	    };
	    /**
	     * 获取数组中某个元素的下标，返回结果维数组
	     * @param data
	     * @param array
	     * @returns {any}
	     */
	    util.prototype.arrayItem = function (data, array) {
	        if (this.type(array) != 'array')
	            return;
	        var item = [];
	        for (var i = 0; i < array.length; i++) {
	            if (array[i].toString() === data.toString())
	                item.push(i);
	        }
	        // console.log(item,array);
	        return item;
	    };
	    /**
	     * 获取数组中某个对象元素的下标
	     */
	    util.prototype.arrayItem2 = function (data, array) {
	        if (this.type(array) != 'array')
	            return;
	        var item;
	        for (var i = 0; i < array.length; i++) {
	            if (array[i]['name'] === data)
	                item = i;
	        }
	        return item;
	    };
	    /**
	     * 获取数组中某个重复元素的最后下标
	     */
	    util.prototype.arrayLastItem = function (data, array) {
	        if (this.type(array) != 'array')
	            return;
	        var item;
	        array = array.reverse();
	        for (var i = 0; i < array.length; i++) {
	            if (array[i] === data)
	                item = i;
	        }
	        return item;
	    };
	    /**
	     * 去除数组中的重复元素
	     * @param data
	     * @param array
	     * @returns {Array}
	     */
	    util.prototype.arraySplice = function (data, array) {
	        if (this.type(array) != 'array')
	            return;
	        var arr = this.arrayItem(data, array);
	        for (var i = 0; i < arr.length; i++) {
	            array.splice(arr[i], 1);
	        }
	        return array;
	    };
	    /**
	     * 去除数组中的'',null,undefined
	     */
	    util.prototype.arrayCompact = function (arr) {
	        var newArr = [];
	        arr.forEach(function (v) {
	            if (v != '' && v != null && v != undefined)
	                newArr.push(v);
	        });
	        return newArr;
	    };
	    /**
	     * 获取两个数组的交集
	     * @param a
	     * @param b
	     */
	    util.prototype.intersection = function (a, b) {
	        return a.filter(function (v) { return b.includes(v); });
	    };
	    /**
	     * 对字符串进行解析
	     * @param str
	     * @returns {Function}
	     */
	    util.prototype.parseString = function (str) {
	        if (this.type(str) != 'string')
	            return;
	        return new Function("return " + str);
	    };
	    /**
	     * 用于判断对象是否含有某个属性,并返回与表达式 ‘scope’ && （\‘a\’ in 'scope'）
	     * @param obj
	     * @param ele
	     * @returns {any}
	     */
	    util.prototype.hasProperty = function (obj, ele) {
	        return obj + ' && (' + this.wrapString(ele) + ' in ' + obj + ')';
	    };
	    /**
	     * 判断所传字符串与目标字符串是否相等
	     * @param target
	     * @param str
	     * @returns {any}
	     */
	    util.prototype.inStr = function (target, str) {
	        return str.includes(target);
	    };
	    /**
	     * 获取对象的键
	     * @param obj
	     */
	    util.prototype.objKey = function (obj) {
	        var arr = [];
	        for (var i in obj) {
	            arr.push(i);
	        }
	        return arr;
	    };
	    /**
	     * 获取对象的值
	     * @param obj
	     */
	    util.prototype.objVal = function (obj) {
	        var arr = [];
	        for (var i in obj) {
	            arr.push(obj[i]);
	        }
	        return arr;
	    };
	    /**
	     * 判断对象是否为空
	     * @param obj 对象
	     */
	    util.prototype.isEmpty = function (obj) {
	        if (this.type(obj) != 'object')
	            return;
	        if (JSON.stringify(obj) == '{}')
	            return true;
	        return false;
	    };
	    /**
	     * 移除对象中某些元素
	     * @param obj 对象
	     * @param ...str  需要移除的元素
	     */
	    util.prototype.expectSome = function (obj) {
	        var str = [];
	        for (var _i = 1; _i < arguments.length; _i++) {
	            str[_i - 1] = arguments[_i];
	        }
	        var newObj = this.clone(obj);
	        str.forEach(function (v) {
	            delete newObj[v];
	        });
	        return newObj;
	    };
	    /**
	     * x-a转驼峰xA
	     * @param str
	     */
	    util.prototype.cameCase = function (str) {
	        return str.replace(/\-(\w)/g, function (x) { return x.slice(1).toUpperCase(); });
	    };
	    /**
	     * 驼峰xA转x-a
	     * @param str
	     */
	    util.prototype._cameCase = function (str) {
	        return str.replace(/([A-Z])/g, "-$1");
	    };
	    /**
	     * 合并对象
	     * @param target
	     * @param source
	     */
	    util.prototype.extend = function (target, source) {
	        for (var i in source) {
	            target[i] = source[i];
	        }
	        return target;
	    };
	    /**
	     * 去除空格 回车 换行
	     * @param str
	     */
	    util.prototype.trimStr = function (str) {
	        var res = str.trim();
	        res = res.replace(/\s+/g, '');
	        res = res.replace(/[\r\n]/g, '');
	        return res;
	    };
	    /**
	     * 获取当前时间 20170516
	     */
	    util.prototype.now = function () {
	        var date = new Date(), year = date.getFullYear().toString(), month = (date.getMonth() + 1).toString(), day = date.getDate().toString();
	        month = parseInt(month) < 10 ? '0' + month : month;
	        return year + month + day + '0';
	    };
	    util.prototype.page = function () {
	        return {
	            width: window.innerWidth,
	            height: window.innerHeight
	        };
	    };
	    /**
	     * 将class转换为json
	     * @param fn class函数
	     * @param isRoot 是否为根组件
	     */
	    util.prototype.classToJson = function (fn, isRoot) {
	        if (isRoot === void 0) { isRoot = false; }
	        var app;
	        var rootComponent = {};
	        if (fn) {
	            app = new fn();
	        }
	        else {
	            $log.error('函数' + fn + '未找到');
	        }
	        var obj = Object.create(app);
	        var propertyObj = obj.__proto__;
	        var prototypeObj = obj.__proto__.__proto__;
	        var arr = Object.entries(propertyObj).concat(Object.entries(prototypeObj).slice(1));
	        var protoNames = Object.getOwnPropertyNames(prototypeObj);
	        var componentJson = {};
	        for (var i = 1; i < protoNames.length; i++) {
	            componentJson[protoNames[i]] = prototypeObj[protoNames[i]];
	        }
	        arr.forEach(function (v, i) {
	            componentJson[v[0]] = v[1];
	            if (isRoot) {
	                rootComponent[v[0]] = v[1];
	            }
	        });
	        return {
	            componentJson: componentJson, rootComponent: rootComponent
	        };
	    };
	    return util;
	}());
	exports.util = util;
	mixins_1.applyMixins(util, [handelType_1.default, handelCoding_1.default]);


/***/ }),
/* 5 */
/***/ (function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	function mixins() {
	    var otherClass = [];
	    for (var _i = 0; _i < arguments.length; _i++) {
	        otherClass[_i] = arguments[_i];
	    }
	    return function (targetClass) {
	        Object.assign.apply(Object, [targetClass.prototype].concat(otherClass));
	    };
	}
	exports.mixins = mixins;
	/**
	 * 此方法用于实现class多继承
	 * @param derivedCtor
	 * @param baseCtors
	 */
	function applyMixins(derivedCtor, baseCtors) {
	    baseCtors.forEach(function (baseCtor) {
	        Object.getOwnPropertyNames(baseCtor.prototype).forEach(function (name) {
	            derivedCtor.prototype[name] = baseCtor.prototype[name];
	        });
	    });
	}
	exports.applyMixins = applyMixins;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var $log = __webpack_require__(2);
	var HandelType = /** @class */ (function () {
	    function HandelType() {
	    }
	    /**
	     * 判断数据类型
	     * @param str
	     * @returns {any}
	     */
	    HandelType.prototype.type = function (str) {
	        var toString = Object.prototype.toString, map = {
	            '[object Boolean]': 'boolean',
	            '[object Number]': 'number',
	            '[object String]': 'string',
	            '[object Function]': 'function',
	            '[object Array]': 'array',
	            '[object Date]': 'date',
	            '[object RegExp]': 'regExp',
	            '[object Undefined]': 'undefined',
	            '[object Null]': 'null',
	            '[object Object]': 'object',
	            '[object Map]': 'map',
	            '[object Set]': 'set',
	            '[object Symbol]': 'symbol'
	        };
	        return map[toString.call(str)];
	    };
	    /**
	     * 判断输入的内容是否在0~9之间
	     * @param str
	     * @returns {boolean}
	     */
	    HandelType.prototype.isNumber = function (str) {
	        // if(Number(str).toString() != 'NaN') return true;
	        // else return false;
	        if (this.type(str) != 'string')
	            return false;
	        else
	            return str >= '0' && str <= '9';
	    };
	    /**
	     * 判断是否符合指数特征
	     * @param ch
	     * @returns {boolean|Boolean}
	     */
	    HandelType.prototype.isExponent = function (ch) {
	        return ch === '+' || ch === '-' || this.isNumber(ch);
	    };
	    /**
	     * 判断是否属于特定字符：字母，_, $
	     * @param str
	     * @returns {boolean}
	     */
	    HandelType.prototype.isLetter = function (str) {
	        var arr = str.split('');
	        return arr.every(function (i) {
	            return (i >= 'a' && i <= 'z') || (i >= 'A' && i <= 'Z') || (i === '_') || (i === '$');
	        });
	    };
	    /**
	     * 判断字符是否属于空格
	     * @param str
	     * @returns {boolean}
	     */
	    HandelType.prototype.isWhiteSpace = function (str) {
	        return str === ' ' || str === '\r' || str === '\t' || str === '\n' || str === '\v' || str === '\u00A0';
	    };
	    /**
	     * 判断被解析的字符串属于那种数据类型
	     * @param str
	     * @returns {any}
	     */
	    HandelType.prototype.whichType = function (str) {
	        if (this.type(str) != 'string')
	            $log.error('数据类型错误' + str);
	        // '12', '12.12', '0.12e2'
	        if (this.isNumber(str) || str === '.')
	            return 'number';
	        else if (str.charAt(0) === "'" || str.charAt(0) === '"')
	            return 'string';
	        else if (this.isLetter(str))
	            return 'letter';
	        else if ((str === '[' || str === ']' || str === ','))
	            return 'array';
	        else if ((str === '{' || str === '}' || str === ':'))
	            return 'object';
	        else if (str === '(' || str === ')')
	            return 'function';
	        else
	            return 'other';
	    };
	    return HandelType;
	}());
	exports.default = HandelType;


/***/ }),
/* 7 */
/***/ (function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var HandelCoding = /** @class */ (function () {
	    function HandelCoding() {
	    }
	    /**
	     * 组合对象属性语句，类似于a.b
	     * @param left
	     * @param right
	     * @returns {any}
	     */
	    HandelCoding.prototype.nonComputedMember = function (left, right) {
	        return '(' + left + ').' + right;
	    };
	    /**
	     *
	     * @param left
	     * @param right
	     * @returns {any}
	     */
	    HandelCoding.prototype.computedMember = function (left, right) {
	        return '(' + left + ')[' + right + ']';
	    };
	    /**
	     * 组合成条件不存在的语句 例如!(str)
	     * @param expression any
	     * @returns {any}
	     */
	    HandelCoding.prototype.notExist = function (expression) {
	        return '!(' + expression + ')';
	    };
	    /**
	     * 组合js表达式,例如组合成 var a = 123;
	     * @param token
	     * @param value
	     * @returns {any}
	     */
	    HandelCoding.prototype.concatCode = function (token, value) {
	        return token + '=' + value + ';';
	    };
	    /**
	    * 此方法用于模拟if语句，判断参数是否成立，并组装成if语句
	    * @param condition
	    * @param statement
	    */
	    HandelCoding.prototype.conditionIsRight = function (array, condition, statement) {
	        array.push('if(', condition, '){', statement, '}');
	    };
	    /**
	     * 该函数每次被调用，参数id递增
	     * @param id
	     * @return {string}
	     */
	    HandelCoding.prototype.compileId = function (id, arr, flag) {
	        var uid = 'compileId' + id;
	        if (!flag) {
	            arr.unshift(uid);
	        }
	        return uid;
	    };
	    return HandelCoding;
	}());
	exports.default = HandelCoding;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
	    return new (P || (P = Promise))(function (resolve, reject) {
	        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
	        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
	        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
	        step((generator = generator.apply(thisArg, _arguments || [])).next());
	    });
	};
	var __generator = (this && this.__generator) || function (thisArg, body) {
	    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
	    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
	    function verb(n) { return function (v) { return step([n, v]); }; }
	    function step(op) {
	        if (f) throw new TypeError("Generator is already executing.");
	        while (_) try {
	            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
	            if (y = 0, t) op = [0, t.value];
	            switch (op[0]) {
	                case 0: case 1: t = op; break;
	                case 4: _.label++; return { value: op[1], done: false };
	                case 5: _.label++; y = op[1]; op = [0]; continue;
	                case 7: op = _.ops.pop(); _.trys.pop(); continue;
	                default:
	                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
	                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
	                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
	                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
	                    if (t[2]) _.ops.pop();
	                    _.trys.pop(); continue;
	            }
	            op = body.call(thisArg, _);
	        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
	        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
	    }
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	var $log = __webpack_require__(2);
	var util_1 = __webpack_require__(3);
	var dom_1 = __webpack_require__(9);
	var parseTpl_1 = __webpack_require__(10);
	var HandelData_1 = __webpack_require__(20);
	var HandelEventer_1 = __webpack_require__(21);
	var HandelEvent_1 = __webpack_require__(22);
	var index_1 = __webpack_require__(11);
	var http_1 = __webpack_require__(23);
	var router_1 = __webpack_require__(25);
	var store_1 = __webpack_require__(26);
	var store = new store_1.default();
	var PREFIX_DIRECTIVE = /(x[\:\-_]|data[\:\-_])/i;
	var ID = 'c-data-id';
	var ID_FOR = 'c-for-id';
	var ID_REPEAT = 'c-repeat-id';
	var renderComponents = /** @class */ (function () {
	    function renderComponents(selector, root, CList) {
	        this.selector = selector;
	        this.root = root;
	        this.CList = CList;
	        this.CObj = this.listToObj(CList);
	        this.eventList = [];
	        this.cRefList = [];
	        this.showList = [];
	        this.ifList = [];
	        this.ifTpl = {};
	        this.cHtmlList = [];
	        this.cForList = [];
	        this.cRepeatList = [];
	        this.cViewList = [];
	        this.dataId = parseInt(util_1.default.now());
	        this.componentToken = [];
	        this.componentNames = this.getComponentNameList();
	        this.componentAttrs = {};
	        this.templateId = {};
	        this.oneRootComponent = 1;
	        this.$router = undefined;
	        this.$routerCache = {};
	    }
	    /**
	     * 组件渲染到dom节点
	     */
	    renderComponents.prototype.componentToDom = function () {
	        var self = this, node, components = [], rootTpl = dom_1.default.wrapDom(this.theTpl(this.root), util_1.default._cameCase(this.root.name).toLowerCase());
	        function handelComponent() {
	            return __awaiter(this, void 0, void 0, function () {
	                return __generator(this, function (_a) {
	                    switch (_a.label) {
	                        case 0: return [4 /*yield*/, invokeLooopNodes()];
	                        case 1:
	                            _a.sent();
	                            return [4 /*yield*/, invokeLoopComponents()];
	                        case 2:
	                            _a.sent();
	                            return [4 /*yield*/, invokeRouter()];
	                        case 3:
	                            _a.sent();
	                            return [2 /*return*/];
	                    }
	                });
	            });
	        }
	        handelComponent();
	        // 遍历节点
	        function invokeLooopNodes() {
	            node = self.loopNodes(self.root.name, dom_1.default.create(rootTpl), components);
	        }
	        // 遍历组件
	        function invokeLoopComponents() {
	            self.root.template = node[0].outerHTML;
	            self.root.isRoot = true;
	            self.templateId[node[0].getAttribute(ID)] = node[0].outerHTML;
	            self.loopComponents(components, self.root.data, self.root.components, self.root.name);
	        }
	        // 处理路由
	        function invokeRouter() {
	            if (store.has('routerConfig')) {
	                handelRouter();
	            }
	            function handelRouter() {
	                setTimeout(function () {
	                    if (window.document.readyState == "complete") {
	                        var hash = window.location.hash;
	                        if (hash == '') {
	                            var index = pathIndex();
	                            if (util_1.default.type(index) == 'object') {
	                                handelView(index);
	                            }
	                        }
	                        else {
	                            var r = getNowRouter(hash.substr(1));
	                            if (r != undefined) {
	                                handelView(r);
	                            }
	                        }
	                    }
	                    window.addEventListener('hashchange', function (data) {
	                        var nowPath = '';
	                        if (data.newURL.includes('/#')) {
	                            nowPath = data.newURL.split('/#')[1];
	                        }
	                        var r = getNowRouter(nowPath);
	                        if (r != undefined) {
	                            handelView(r);
	                        }
	                    }, false);
	                    function handelView(obj) {
	                        var name = obj.component.name;
	                        var delay = obj.delay || 0;
	                        setTimeout(function () {
	                            self.cViewList.forEach(function (v) {
	                                if (!dom_1.default.q(v.ele))
	                                    return;
	                                if (obj.cache && self.$routerCache.hasOwnProperty(name)) {
	                                    dom_1.default.q(v.ele).innerHTML = self.$routerCache[name];
	                                    self.handelEventListener(self.CObj[name], dom_1.default.q(v.ele).firstChild);
	                                }
	                                else {
	                                    dom_1.default.q(v.ele).innerHTML = '';
	                                    dom_1.default.q(v.ele).insertAdjacentHTML('afterbegin', '<' + util_1.default._cameCase(name) + '></' + util_1.default._cameCase(name) + '>');
	                                    self.loopNodes(name, dom_1.default.q(v.ele).childNodes, []);
	                                    self.loopComponents([self.CObj[name]], self.CObj[v.which].data || {}, [], v.which);
	                                    setTimeout(function () {
	                                        self.$routerCache[name] = dom_1.default.q(util_1.default._cameCase(name)).outerHTML;
	                                    }, 0);
	                                }
	                            });
	                        }, delay);
	                    }
	                }, 0);
	            }
	        }
	        // 获取当前路由
	        function getNowRouter(path) {
	            var router = new router_1.default(path, store.get('routerConfig'));
	            self.$router = router;
	            return router.nowRouter;
	        }
	        // 默认路径
	        function pathIndex() {
	            var obj = undefined;
	            store.get('routerConfig').forEach(function (v) {
	                if (v.path == '/') {
	                    obj = v;
	                }
	            });
	            return obj;
	        }
	    };
	    /**
	     * 组件的template, templateId, templateUrl
	     * @param component 组件
	     */
	    renderComponents.prototype.theTpl = function (component) {
	        // hasHtmlUrl, webpack打包需要引入html-loader
	        return (component.template ? component.template.trim() : undefined) || dom_1.default.hasHtml(component.templateId) || dom_1.default.hasHtmlUrl(component.templateUrl);
	    };
	    /**
	     * 组件的style, styleId, styleUrl
	     * @param component 组件
	     */
	    renderComponents.prototype.theStyle = function (component) {
	        // component.style
	        function handelString(str) {
	            if (str != undefined) {
	                return {
	                    type: 'string',
	                    result: str
	                };
	            }
	            return false;
	        }
	        // component.styleId
	        function handelId(id) {
	            if (dom_1.default.q(id) != undefined) {
	                return {
	                    type: 'id',
	                    result: id
	                };
	            }
	            return false;
	        }
	        // component.styleUrl, webpack打包需要引入css-loader
	        function handelUrl(url) {
	            if (url != undefined) {
	                // 针对import * as css from '';
	                if (util_1.default.type(url) == 'object') {
	                    url = url[0][1];
	                }
	                // 针对require('../xx.css')
	                if (util_1.default.type(url) == 'array') {
	                    url = url[1];
	                }
	                return {
	                    type: 'url',
	                    result: url
	                };
	            }
	            return false;
	        }
	        return handelString(component.style) || handelId(component.styleId) || handelUrl(component.styleUrl);
	    };
	    /**
	     * 遍历dom节点
	     * @param name 组件名称
	     * @param node dom节点
	     * @param components 组件列表
	     */
	    renderComponents.prototype.loopNodes = function (name, node, components) {
	        var _this = this;
	        for (var i = 0; i < node.length; i++) {
	            if (node[i].nodeType == 1) {
	                node[i].setAttribute("c-data-id", this.dataId);
	                var cs = this.getComponent(node[i], name);
	                cs.forEach(function (v) {
	                    if (components) {
	                        components.push(util_1.default.deepClone(util_1.default.extend(_this.CObj[v], { token: _this.dataId })));
	                        // components.push(Util.extend(this.CObj[v], {token: this.dataId}));
	                    }
	                });
	                this.dataId++;
	                // 添加eventList, showList...等集合
	                this.addDirectiveList(name, node[i]);
	                if (node[i].childNodes && node[i].childNodes.length) {
	                    this.loopNodes(name, node[i].childNodes, components);
	                }
	            }
	        }
	        return node;
	    };
	    /**
	     * 添加eventList, showList...等集合
	     * @param name 组件名称
	     * @param node 节点
	     */
	    renderComponents.prototype.addDirectiveList = function (name, node) {
	        for (var j = 0, len = node.attributes; j < len.length; j++) {
	            var attrName = this.normalizeDirective(len[j].name);
	            if (attrName.match(/^cClick|cDbclick|cMouseover|cMousedown|cMouseup|cMousemove|cMouseout|cMouseleave|cBlur|cFocus|cChange|cInput|cDrag|cDragend|cDragenter|cDragleave|cDragover|cDragstart|cDrop|cFocus|cKeydown|cKeypress|cKeyup|cScroll|cSelect|cSubmit|cTtoggle|cResize|cWaiting|cProgress|cLoadstart|cDurationchange|cLoadedmetadata|cLoadeddata|cCanplay|cCanplaythrough|cPlay|cPause|cRef|cShow|cIf|cHtml|cFor|cRepeat|cView$/g)) {
	                switch (attrName) {
	                    case 'cRef':
	                        this.cRefList.push({
	                            which: name,
	                            type: len[j].name.split('-')[1],
	                            fn: len[j].value,
	                            ele: '[' + ID + '="' + node.getAttribute(ID) + '"]',
	                            id: node.getAttribute(ID)
	                        });
	                        break;
	                    case 'cShow':
	                        this.showList.push({
	                            which: name,
	                            type: len[j].name.split('-')[1],
	                            fn: len[j].value,
	                            ele: '[' + ID + '="' + node.getAttribute(ID) + '"]',
	                            id: node.getAttribute(ID),
	                            directive: attrName
	                        });
	                        // 在组件渲染前面处理display
	                        var displayStatus = dom_1.default.boolToDisplay(parseTpl_1.default(len[j].value, this.CObj[name].data, this.CObj[name].props));
	                        node.style.display = displayStatus;
	                        break;
	                    case 'cIf':
	                        this.ifList.push({
	                            which: name,
	                            type: len[j].name.split('-')[1],
	                            fn: len[j].value,
	                            ele: '[' + ID + '="' + node.getAttribute(ID) + '"]',
	                            id: node.getAttribute(ID),
	                            directive: attrName,
	                            html: node.outerHTML
	                        });
	                        var ifInfo = parseTpl_1.default(len[j].value, this.CObj[name].data, this.CObj[name].props);
	                        if (ifInfo == 'true') {
	                            node.style.display = 'none';
	                        }
	                        break;
	                    case 'cHtml':
	                        this.cHtmlList.push({
	                            which: name,
	                            type: len[j].name.split('-')[1],
	                            fn: len[j].value,
	                            ele: '[' + ID + '="' + node.getAttribute(ID) + '"]',
	                            id: node.getAttribute(ID),
	                            directive: attrName,
	                            html: node.outerHTML
	                        });
	                        break;
	                    case 'cFor':
	                        this.cForList.push({
	                            which: name,
	                            type: len[j].name.split('-')[1],
	                            fn: len[j].value,
	                            ele: '[' + ID + '="' + node.getAttribute(ID) + '"]',
	                            id: node.getAttribute(ID),
	                            html: node.innerHTML
	                        });
	                        break;
	                    case 'cRepeat':
	                        this.cRepeatList.push({
	                            which: name,
	                            type: len[j].name.split('-')[1],
	                            fn: len[j].value,
	                            ele: '[' + ID + '="' + node.getAttribute(ID) + '"]',
	                            id: node.getAttribute(ID)
	                        });
	                        break;
	                    case 'cView':
	                        this.cViewList.push({
	                            which: name,
	                            type: len[j].name.split('-')[1],
	                            fn: len[j].value,
	                            ele: '[' + ID + '="' + node.getAttribute(ID) + '"]',
	                            id: node.getAttribute(ID)
	                        });
	                        break;
	                    default:
	                        this.eventList.push({
	                            which: name,
	                            type: len[j].name.split('-')[1],
	                            fn: len[j].value,
	                            ele: '[' + ID + '="' + node.getAttribute(ID) + '"]',
	                            id: node.getAttribute(ID)
	                        });
	                        break;
	                }
	            }
	        }
	    };
	    /**
	     * 遍历组件
	     * @param components 模板中的组件集合
	     * @param fatherData 父组件data数据
	     * @param componentArr 注入的组件集合
	     * @param componentName 父组件名称
	     */
	    renderComponents.prototype.loopComponents = function (components, fatherData, componentArr, componentName) {
	        if (components.length && componentArr == undefined) {
	            $log.error('找不到组件为' + componentName + '的components属性');
	        }
	        var self = this;
	        components.forEach(function (v) {
	            if (v == undefined)
	                return;
	            // “模板中的组件” 与 “注入的组件” 对比
	            self.compareChildComponentAndInjectComponents(v.name, componentArr);
	            // 给组件赋能
	            v.$data = HandelData_1.default.$data;
	            v.$http = http_1.default;
	            v.$event = HandelEvent_1.default;
	            v.$router = self.$router;
	            function handelCC() {
	                return __awaiter(this, void 0, void 0, function () {
	                    var before;
	                    return __generator(this, function (_a) {
	                        switch (_a.label) {
	                            case 0: return [4 /*yield*/, self.handelDataChange(v)];
	                            case 1:
	                                _a.sent(); // 监听data数据改变
	                                return [4 /*yield*/, self.handelBeforeRender(v)];
	                            case 2:
	                                before = _a.sent();
	                                return [4 /*yield*/, self.handelAfterRender(before, v)];
	                            case 3:
	                                _a.sent(); //在组件渲染之后执行
	                                return [2 /*return*/];
	                        }
	                    });
	                });
	            }
	            handelCC();
	        });
	    };
	    /**
	     * 在组建渲染之前执行
	     * @param v 组件
	     */
	    renderComponents.prototype.handelBeforeRender = function (v) {
	        if (v.beforeRender) {
	            v.$el = undefined;
	            v.$refs = undefined;
	            v.componentStatus = 'beforeRender';
	            v.beforeRender();
	        }
	        return 'beforeRenderIsDone';
	    };
	    /**
	     * 在组件渲染之后执行
	     * @param status handelBeforeRender()的返回值
	     * @param v 组件
	     */
	    renderComponents.prototype.handelAfterRender = function (status, v) {
	        if (status != 'beforeRenderIsDone') {
	            return;
	        }
	        var self = this;
	        function invokeAfterRender() {
	            return __awaiter(this, void 0, void 0, function () {
	                var step1, step2, step3, step4, step5, step6, step7;
	                return __generator(this, function (_a) {
	                    switch (_a.label) {
	                        case 0: return [4 /*yield*/, addStyle()];
	                        case 1:
	                            step1 = _a.sent();
	                            return [4 /*yield*/, renderOnce(step1)];
	                        case 2:
	                            step2 = _a.sent();
	                            return [4 /*yield*/, handelCforDirective(step2)];
	                        case 3:
	                            step3 = _a.sent();
	                            return [4 /*yield*/, handelOtherDirective(step3)];
	                        case 4:
	                            step4 = _a.sent();
	                            return [4 /*yield*/, handelRenderFn(step4)];
	                        case 5:
	                            step5 = _a.sent();
	                            return [4 /*yield*/, loopChildComponent(step5)];
	                        case 6:
	                            step6 = _a.sent();
	                            return [4 /*yield*/, handelClickDirective(step6)];
	                        case 7:
	                            step7 = _a.sent();
	                            return [2 /*return*/];
	                    }
	                });
	            });
	        }
	        if (v.render) {
	            invokeAfterRender();
	        }
	        function addStyle() {
	            // head添加style
	            dom_1.default.addStyle(self.theStyle(v), v);
	            return 'done';
	        }
	        function renderOnce(status) {
	            if (status != 'done') {
	                return;
	            }
	            var node;
	            // 根组件单独渲染
	            if (v.name == self.root.name) {
	                if (self.oneRootComponent == 2) {
	                    $log.error('根组件' + self.root.name + '只能有一个');
	                }
	                var dom = dom_1.default.q(self.selector);
	                if (dom == undefined) {
	                    $log.error('节点' + self.selector + '不存在');
	                }
	                dom.innerHTML = parseTpl_1.default(self.theTpl(self.root), self.root.data, {});
	                node = dom_1.default.q('[' + ID + '="' + v.token + '"]');
	                self.oneRootComponent++;
	            }
	            else {
	                var newNode = self.loopNodes(v.name, dom_1.default.create(self.theTpl(self.CObj[v.name])));
	                node = dom_1.default.q('[' + ID + '="' + v.token + '"]');
	                self.templateId[v.token] = newNode[0].outerHTML;
	                // 编译组件属性，父组件的data值覆盖子组件的props值（组件的attr值与props对比，有则覆盖）
	                var newProps = dom_1.default.combineAttrAndProps(self.componentAttrs[v.token], self.CObj[v.name].props);
	                node.innerHTML = self.getChangedData(newNode[0].outerHTML, self.CObj[v.name].data, newProps);
	            }
	            return node;
	        }
	        function handelCforDirective(node) {
	            // 处理c-for
	            self.loopCforToDom(self.cForList, v);
	            return node;
	        }
	        function handelOtherDirective(node) {
	            // 处理c-if
	            self.loopIfToDom(self.ifList, v);
	            // 处理c-html
	            self.loopHtmlToDom(self.cHtmlList, v);
	            return node;
	        }
	        function handelRenderFn(node) {
	            v.$el = node;
	            // 处理c-ref
	            v.$refs = {};
	            var currentRefs = self.cRefList.filter(function (rfs) {
	                return rfs.which == v.name;
	            });
	            currentRefs.forEach(function (r) {
	                v.$refs[r.fn] = dom_1.default.q(r.ele);
	            });
	            v.componentStatus = 'afterRender';
	            v.render();
	            return node;
	        }
	        function loopChildComponent(node) {
	            // 遍历组件子节点
	            if (v.name != self.root.name) {
	                var arr = self.findComponent(node.firstChild);
	                if (arr.length) {
	                    if (v.name) {
	                        // self.loopComponents(arr, v.data, Util.deepClone(v.components), v.name)
	                        self.loopComponents(arr, v.data, v.components, v.name);
	                    }
	                }
	            }
	            return node;
	        }
	        function handelClickDirective(node) {
	            //绑定事件
	            self.handelEventListener(v, node);
	        }
	    };
	    /**
	     * “模板中的组件” 与 “注入的组件” 对比
	     * @param child 模板中的单个组件
	     * @param arr 注入的组件集合
	     */
	    renderComponents.prototype.compareChildComponentAndInjectComponents = function (child, arr) {
	        var self = this, flag = false;
	        if (child = this.root.name) {
	            flag = true;
	        }
	        else if (!arr.length && child != this.root.name) {
	            flag = false;
	        }
	        else {
	            flag = arr.some(function (v) {
	                if (v.name) {
	                    return child != self.root.name && child == v.name;
	                }
	            });
	        }
	        if (!flag)
	            $log.error('名称为' + child + '的组件未找到');
	    };
	    /**
	     * 组件渲染后的事件绑定
	     * @param v 组件对象
	     * @param node 节点
	     */
	    renderComponents.prototype.handelEventListener = function (v, node) {
	        // 获取当前组件的事件集合
	        var attrArr = dom_1.default.getAttr(ID, node);
	        var newAttrArr = this.array_intersection(attrArr, this.eventList);
	        // 事件绑定处理
	        if (newAttrArr.length) {
	            var arr = newAttrArr.filter(function (ev) {
	                return ev.which == v.name;
	            });
	            arr.forEach(function (val) {
	                if (document.querySelectorAll(val.ele)) {
	                    try {
	                        for (var _i = 0, _a = document.querySelectorAll(val.ele); _i < _a.length; _i++) {
	                            var dq = _a[_i];
	                            dq.addEventListener(val.type, function (event) {
	                                try {
	                                    if (val.fn.toString().match(/\(\)$/)) {
	                                        if (v.hasOwnProperty(val.fn.toString().split('()')[0])) {
	                                            index_1.default.parse(val.fn)(v, { $event: event });
	                                        }
	                                        else {
	                                            $log.error('组件' + v.name + '中不存在方法' + val.fn);
	                                        }
	                                    }
	                                    else {
	                                        $log.error('组件' + v.name + '中方法' + val.fn + '语法错误');
	                                    }
	                                }
	                                catch (e) {
	                                    console.log(e);
	                                }
	                            }, false);
	                        }
	                    }
	                    catch (e) {
	                        $log.error(e);
	                    }
	                }
	                else {
	                    $log.error('属性为' + val.ele + '的节点不存在！');
	                }
	            });
	        }
	    };
	    /**
	     * 监听data数据改变
	     * @param v 组件对象
	     */
	    renderComponents.prototype.handelDataChange = function (v, type) {
	        var _this = this;
	        var _loop_1 = function (i) {
	            HandelEventer_1.default.listen(i, function (info) {
	                if (info.target == v.token && JSON.stringify(info.oldVal) != JSON.stringify(info.newVal)) {
	                    // 获取组件原始的tpl，将其转为dom
	                    var parseNode = dom_1.default.create(_this.templateId[v.token]);
	                    var dataPos = _this.dataPosition(i, parseNode, v.name);
	                    // 在dom渲染之前执行，更新data数据
	                    _this.updateData(i, info);
	                    if (dom_1.default.q(util_1.default._cameCase(v.name))) {
	                        // data数据改变重新渲染对象的节点
	                        _this.dataChangeToDom(parseNode, dataPos, info, v.name);
	                    }
	                }
	            });
	        };
	        for (var i in v.data) {
	            _loop_1(i);
	        }
	    };
	    /**
	     * 在dom渲染之前执行，更新data数据
	     * @param key data的key
	     * @param info 更改的信息
	     */
	    renderComponents.prototype.updateData = function (key, info) {
	        // 所属组件
	        var component = info.which;
	        this.CObj[component].data[key] = info.newVal;
	    };
	    /**
	     * data数据改变重新渲染对象的节点
	     * @param parseNode 原始的dom节点
	     * @param dataPos 改变的数据集合
	     * @param info data的变化信息
	     * @param component 所属组件
	     */
	    renderComponents.prototype.dataChangeToDom = function (parseNode, dataPos, info, component) {
	        // 文本类型
	        this.loopTextToDom(parseNode, dataPos, info, component);
	        // 属性类型
	        this.loopAttrToDom(dataPos, info, component);
	    };
	    /**
	     * 文本改变渲染对应的dom节点
	     * @param parseNode 编译的节点
	     * @param dataPos 改变的数据集合
	     * @param info data的变化信息
	     * @param component 所属组件
	     */
	    renderComponents.prototype.loopTextToDom = function (parseNode, dataPos, info, component) {
	        var textData = dataPos.filter(function (df) {
	            return df.type == 'text';
	        });
	        if (textData.length) {
	            textData.forEach(function (dp) {
	                var originNode = parseNode[0].parentNode.querySelector(dp.position).childNodes[dp.item].textContent;
	                document.querySelector(dp.position).childNodes[dp.item].textContent = parseTpl_1.default(originNode, info.new, info.props);
	            });
	        }
	    };
	    /**
	     * 属性改变渲染对应的dom节点
	     * @param dataPos 改变的数据集合
	     * @param info data的变化信息
	     * @param component 所属组件
	     */
	    renderComponents.prototype.loopAttrToDom = function (dataPos, info, component) {
	        var _this = this;
	        var self = this;
	        var attrData = dataPos.filter(function (df) {
	            return df.type == 'attr';
	        });
	        if (attrData.length) {
	            attrData.forEach(function (dp) {
	                // 处理指令
	                switch (dp.attr) {
	                    case 'c-show':
	                        var newAttr = dom_1.default.boolToDisplay(index_1.default.parse(dp.value)(info.new));
	                        dom_1.default.q(dp.position).style.display = newAttr;
	                        break;
	                    case 'c-if':
	                        var dom = dom_1.default.q(dp.position);
	                        if (dom != undefined) {
	                            dom_1.default.q(dp.position).setAttribute(dp.attr, info.newVal);
	                        }
	                        _this.handelIf(dp, component);
	                        break;
	                    case 'c-for':
	                        _this.loopCforToDom(dataPos, _this.CObj[component], 'dataChange');
	                        break;
	                    default:
	                        changeAttr(dp);
	                }
	                function changeAttr(dp) {
	                    dom_1.default.q(dp.position).setAttribute(dp.attr, info.newVal);
	                    // 更新componentAttrs
	                    self.componentAttrs[dp.componentToken][dp.attr] = info.newVal;
	                }
	                //父组件的属性改变
	                function handelComponent(dp) {
	                    var childChangePos = self.dataPosition(dp.attr, dom_1.default.create(self.templateId[dp.componentToken]), component);
	                    // 文本类型
	                    var childChangePosText = childChangePos.filter(function (df) {
	                        return df.type == 'text';
	                    });
	                    childChangePosText.forEach(function (chItem) {
	                        var changedComponent = self.CObj[dp.componentName], changedOriginComponentProps = changedComponent.props, changedComponentData = changedComponent.data, changedPropKey = dp.attr, changedPropVal = self.componentAttrs[dp.componentToken][dp.attr], changedComponentProps = self.combineChangedProps(changedPropKey, changedPropVal, changedOriginComponentProps);
	                        var changedOrginNode = dom_1.default.create(self.templateId[dp.componentToken]);
	                        var changedOrginText = changedOrginNode[0].parentNode.querySelector(chItem.position).childNodes[chItem.item].textContent;
	                        dom_1.default.q(chItem.position).childNodes[chItem.item].textContent = parseTpl_1.default(changedOrginText, changedComponentData, changedComponentProps);
	                    });
	                    // 属性类型
	                    var childChangePosAttr = childChangePos.filter(function (df) {
	                        return df.type == 'attr';
	                    });
	                    childChangePosAttr.forEach(function (chItem) {
	                        // 父组件的attr值与子组件的props值进行联动
	                        if (dp.attr == chItem.value) {
	                            chItem.value = dp.value;
	                        }
	                        dom_1.default.q(chItem.position).setAttribute(chItem.attr, chItem.value);
	                        // 更新componentAttrs
	                        self.componentAttrs[chItem.componentToken][chItem.attr] = chItem.value;
	                        self.componentAttrs[chItem.componentToken][chItem.attr] = chItem.value;
	                        if (chItem.isComponent) {
	                            handelComponent(chItem);
	                        }
	                    });
	                }
	                if (dp.isComponent) {
	                    handelComponent(dp);
	                }
	            });
	        }
	    };
	    /**
	     * 处理c-for指令
	     * @param arr c-for 集合
	     * @param component 指令所在组件
	     */
	    renderComponents.prototype.loopCforToDom = function (arr, component, reRender) {
	        var _this = this;
	        var currentRepeat = arr.filter(function (rVal) {
	            return rVal.which == component.name;
	        });
	        var self = this;
	        currentRepeat.forEach(function (re) {
	            // 解析指令，获取重复次数
	            var match2 = re.fn.match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)\s*$/);
	            if (!match2) {
	                $log.error('c-for格式有误');
	            }
	            var itemExp = match2[1];
	            var itemsExp = match2[2];
	            var items = _this.inComponent(itemsExp, component);
	            if (items && util_1.default.type(items) == 'array' && items.length) {
	                if (reRender == 'dataChange') {
	                    dom_1.default.removeDomExpectWhich(0, '[c-for-id="' + dom_1.default.q(re.ele).getAttribute('c-for-id') + '"]');
	                }
	                // 渲染单个有c-for指令的模板
	                items.forEach(function (item, i) {
	                    // 克隆节点，重复次数
	                    var newn = dom_1.default.q(re.ele).cloneNode(true);
	                    var data = {};
	                    data[match2[1]] = item;
	                    newn.innerHTML = parseTpl_1.default(re.html, data, self.CObj[component.name]['props'] || {});
	                    var newNode = self.loopNodes(component.name, dom_1.default.create(newn.outerHTML));
	                    var innerComponents = self.findComponent(newNode[0]);
	                    newNode[0].setAttribute('c-for-id', re.id);
	                    // 重新编译节点
	                    if (i == 0) {
	                        dom_1.default.q(re.ele).innerHTML = newNode[0].innerHTML;
	                        dom_1.default.q(re.ele).setAttribute('c-for-id', re.id);
	                    }
	                    else {
	                        var el = document.querySelectorAll('[c-for-id="' + re.id + '"][c-for="' + re.fn + '"]');
	                        el[el.length - 1].insertAdjacentElement('afterEnd', newNode[0]);
	                    }
	                    if (innerComponents.length) {
	                        self.loopComponents(util_1.default.deepClone(innerComponents), data, [], component.name);
	                    }
	                });
	            }
	            else {
	                $log.error('组件' + component.name + '内c-for指令的格式不正确');
	            }
	        });
	    };
	    /**
	     * 处理c-if指令
	     * @param arr c-if 集合
	     * @param component 指令所在组件
	     */
	    renderComponents.prototype.loopIfToDom = function (arr, component) {
	        var _this = this;
	        var currentIf = arr.filter(function (ifVal) {
	            return ifVal.which == component.name;
	        });
	        currentIf.forEach(function (cIf) {
	            _this.handelIf(cIf, component.name);
	        });
	    };
	    /**
	     * 移除c-if指令所在的节点
	     * @param cIf c-if指令所绑定的节点信息
	     */
	    renderComponents.prototype.handelIf = function (cIf, componentName) {
	        var ifDom = dom_1.default.q(cIf.ele || cIf.position);
	        // 节点存在，移除节点
	        if (ifDom != undefined) {
	            var ifInfo = ifDom.getAttribute('c-if');
	            if (ifInfo == 'true') {
	                ifDom.parentNode.replaceChild(dom_1.default.addComment('c-if:' + cIf.id + ''), ifDom);
	                this.ifTpl[cIf.id] = ifDom.outerHTML;
	            }
	        }
	        // 已经被移除，还原节点
	        if (ifDom == undefined) {
	            dom_1.default.replaceComment(dom_1.default.q(util_1.default._cameCase(componentName)), cIf.attr + ':' + cIf.id, dom_1.default.create(this.ifTpl[cIf.id])[0]);
	            // 更改属性
	            dom_1.default.attr((cIf.ele || cIf.position), 'c-if', false);
	            dom_1.default.q(cIf.ele || cIf.position).style.display = 'block';
	        }
	    };
	    /**
	     * 处理c-html指令
	     * @param arr c-html指令集合
	     * @param component 所属组件
	     */
	    renderComponents.prototype.loopHtmlToDom = function (arr, component) {
	        var currentHtml = arr.filter(function (h) {
	            return h.which == component.name;
	        });
	        currentHtml.forEach(function (h) {
	            dom_1.default.q(h.ele).innerHTML = dom_1.default.attr(h.ele, 'c-html');
	        });
	    };
	    /**
	     * 组合经过改变的组件的props值
	     * @param key
	     * @param val
	     * @param props
	     */
	    renderComponents.prototype.combineChangedProps = function (key, val, props) {
	        if (props[key]) {
	            props[key]['default'] = val;
	        }
	        return props;
	    };
	    /**
	     * 数组去重
	     * @param a
	     * @param b
	     */
	    renderComponents.prototype.array_intersection = function (a, b) {
	        var result = [];
	        for (var i = 0; i < b.length; i++) {
	            var temp = b[i].id;
	            for (var j = 0; j < a.length; j++) {
	                if (temp === a[j]) {
	                    result.push(b[i]);
	                    break;
	                }
	            }
	        }
	        return result;
	    };
	    /**
	     * 判断dom节点是组件
	     * @param node dom节点
	     */
	    renderComponents.prototype.isComponent = function (node) {
	        var name = dom_1.default.parseName(node);
	        return this.CObj[name] != undefined;
	    };
	    /**
	     * 判断表达式内的字符是否在组件的data中
	     * @param name data属性名称
	     * @param expression '{{xxx}}'
	     * @returns 存在返回{{ }}内的表达式，否在返回null
	     */
	    renderComponents.prototype.isComponentData = function (name, expression) {
	        var regExp = new RegExp("{{\\s*([\\s\\S]*" + name + "[\\s\\S]*)\\s*}}", "gm");
	        var res = regExp.exec(expression);
	        if (res == null) {
	            return null;
	        }
	        var exp = {
	            '': true,
	            '+': true,
	            '-': true,
	            '*': true,
	            '/': true,
	            '(': true,
	            ')': true,
	            '.': true,
	            '[': true,
	            ']': true,
	            '!': true,
	            '!=': true,
	            '!==': true,
	            '>': true,
	            '>=': true,
	            '>==': true,
	            '<': true,
	            '<=': true,
	            '<==': true,
	            '?': true,
	            ':': true
	        };
	        var nameIndex = res[1].indexOf(name), prev1 = res[1].charAt(nameIndex - 1), prev2 = res[1].charAt(nameIndex - 2), prev3 = res[1].charAt(nameIndex - 3), next1 = res[1].charAt(nameIndex + 1), next2 = res[1].charAt(nameIndex + 2), next3 = res[1].charAt(nameIndex + 3);
	        if (exp[prev1] || exp[prev2] || exp[prev3] || exp[next1] || exp[next2] || exp[next3]) {
	            return res[1];
	        }
	        return null;
	    };
	    /**
	     * 获取某个data属性名在节点中的位置
	     * @param name data属性名称
	     * @param node dom节点
	     * @param component 所属组件
	     */
	    renderComponents.prototype.dataPosition = function (name, node, component) {
	        var res = [], self = this;
	        // 属性
	        function loopAttr(node) {
	            if (typeof node == 'object' && node.length) {
	                for (var i = 0; i < node.length; i++) {
	                    if (node[i].nodeType == 1 && node[i].hasAttributes()) {
	                        for (var j = 0, len = node[i].attributes; j < len.length; j++) {
	                            if (len[j].name == 'c-for') {
	                                var match2 = len[j].value.match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)\s*$/);
	                                if (!match2) {
	                                    $log.error('组件' + component + '内的c-for指令表达式' + len[j] + '有误');
	                                }
	                                if (match2[2] == name && !self.isComponent(node[i])) {
	                                    res = res.concat({
	                                        attr: len[j].name,
	                                        fn: len[j].value,
	                                        type: 'attr',
	                                        id: node[i].getAttribute(ID),
	                                        ele: '[' + ID + '="' + node[i].getAttribute(ID) + '"]',
	                                        item: i,
	                                        isComponent: false,
	                                        html: node[i].innerHTML,
	                                        which: component //所属组件
	                                    });
	                                }
	                            }
	                            else {
	                                var attrVal = self.isComponentData(name, len[j].value);
	                                if (attrVal) {
	                                    var isCs = self.isComponent(node[i]);
	                                    if (isCs) {
	                                        res = res.concat({
	                                            attr: len[j].name,
	                                            value: name,
	                                            type: 'attr',
	                                            id: node[i].getAttribute(ID),
	                                            position: '[' + ID + '="' + node[i].getAttribute(ID) + '"]',
	                                            item: i,
	                                            isComponent: true,
	                                            componentName: dom_1.default.parseName(node[i]),
	                                            componentToken: node[i].getAttribute(ID),
	                                            which: component //所属组件
	                                        });
	                                    }
	                                    else {
	                                        res = res.concat({
	                                            attr: len[j].name,
	                                            value: attrVal,
	                                            type: 'attr',
	                                            id: node[i].getAttribute(ID),
	                                            position: '[' + ID + '="' + node[i].getAttribute(ID) + '"]',
	                                            item: i,
	                                            isComponent: false,
	                                            which: component //所属组件
	                                        });
	                                    }
	                                }
	                            }
	                        }
	                        if (node[i].childNodes && node[i].childNodes.length) {
	                            loopAttr(node[i].childNodes);
	                        }
	                    }
	                }
	            }
	        }
	        loopAttr(node);
	        // textContent
	        function loopText(node) {
	            if (typeof node == 'object' && node.length) {
	                for (var i = 0; i < node.length; i++) {
	                    if (node[i].nodeType == 3) {
	                        var text = node[i].textContent;
	                        if (self.isComponentData(name, text)) {
	                            res = res.concat({
	                                value: name,
	                                type: 'text',
	                                position: '[' + ID + '="' + node[i].parentNode.getAttribute(ID) + '"]',
	                                item: i,
	                                isComponent: false
	                            });
	                        }
	                    }
	                    if (node[i].childNodes && node[i].childNodes.length) {
	                        loopText(node[i].childNodes);
	                    }
	                }
	            }
	        }
	        loopText(node);
	        return res;
	    };
	    /**
	     * 组件集合转json对象
	     * @param arr
	     */
	    renderComponents.prototype.listToObj = function (arr) {
	        var obj = {};
	        arr.forEach(function (v) {
	            obj[v.name] = v;
	        });
	        return obj;
	    };
	    /**
	     * 获取组件的名称集合
	     */
	    renderComponents.prototype.getComponentNameList = function () {
	        var arr = [];
	        this.CList.forEach(function (v) {
	            arr.push(v.name);
	        });
	        return arr;
	    };
	    /**
	     * 根据dom节点获取component， 遍历子节点
	     * @param node dom节点
	     */
	    renderComponents.prototype.findComponent = function (node) {
	        if (node.nodeType == 3) {
	            return;
	        }
	        var arr = [];
	        var self = this;
	        // tag标签
	        function loopTagNode(node) {
	            var normalizedNodeName = self.normalizeDirective(dom_1.default.getNodeName(node).toLowerCase());
	            if (self.componentNames.includes(normalizedNodeName)) {
	                // arr.push(Util.deepClone(Util.extend(self.CObj[normalizedNodeName], {token: node.getAttribute(ID)})));
	                arr.push(util_1.default.extend(self.CObj[normalizedNodeName], { token: node.getAttribute(ID) }));
	            }
	            if (node.childNodes && node.childNodes.length) {
	                node.childNodes.forEach(function (v) {
	                    if (v.nodeType != 3) {
	                        loopTagNode(v);
	                    }
	                });
	            }
	        }
	        loopTagNode(node);
	        return arr;
	    };
	    /**
	     * 根据dom节点获取component， 不遍历子节点
	     * @param node dom节点
	     * @param name 组件名称
	     */
	    renderComponents.prototype.getComponent = function (node, name) {
	        var arr = [];
	        var self = this;
	        // tag标签
	        function loopTagNode(node) {
	            var normalizedNodeName = util_1.default.cameCase(dom_1.default.getNodeName(node).toLowerCase());
	            if (self.componentNames.includes(normalizedNodeName)) {
	                arr.push(normalizedNodeName);
	                var obj = {};
	                for (var i = 0, len = node.attributes; i < len.length; i++) {
	                    if (len[i].name != ID) {
	                        obj[len[i].name] = parseTpl_1.default(len[i].value, self.CObj[name].data, self.CObj[name].props);
	                    }
	                }
	                if (!dom_1.default.noOtherAttr(ID, node)) {
	                    obj['component'] = normalizedNodeName;
	                    self.componentAttrs[node.getAttribute(ID)] = obj;
	                }
	            }
	        }
	        loopTagNode(node);
	        return arr;
	    };
	    /**
	     * 判断指令是否含有mulit属性
	     * @param name
	     */
	    renderComponents.prototype.directiveIsMulit = function (name) {
	        for (var i = 0, len = this.CList; i < len.length; i++) {
	            if (len[i]['name'] == name && len[i].mulit == true) {
	                return true;
	            }
	        }
	        return false;
	    };
	    /**
	     * 组件指令的层级关系
	     * @param a
	     * @param b
	     */
	    renderComponents.prototype.componentLayer = function (a, b) {
	        var sort = b.layer - a.layer;
	        if (sort == 0) {
	            if (a.name != b.name) {
	                return a.name < b.name ? -1 : 1;
	            }
	            else {
	                return a.cid - b.cid;
	            }
	        }
	        else {
	            return sort;
	        }
	    };
	    /**
	     * 获取data数据改变后的模板
	     * @param html
	     * @param data
	     */
	    renderComponents.prototype.getChangedData = function (html, data, props) {
	        return parseTpl_1.default(html, data, props);
	    };
	    /**
	     * 序列化指令
	     * @param name
	     */
	    renderComponents.prototype.normalizeDirective = function (name) {
	        return util_1.default.cameCase(name.replace(PREFIX_DIRECTIVE, ''));
	    };
	    /**
	     * 判断变量是否在组件的data,props之中, 并返回结果
	     * @param exp 变量
	     * @param component 组件
	     */
	    renderComponents.prototype.inComponent = function (exp, component) {
	        return component.data[exp] || component.props.default[exp];
	    };
	    return renderComponents;
	}());
	exports.default = renderComponents;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var util_1 = __webpack_require__(3);
	var $log = __webpack_require__(2);
	var HandelDom = /** @class */ (function () {
	    function HandelDom() {
	        this.BOOLEAN_ATTRS = {
	            selected: true
	        };
	        this.BOOLEAN_ELEMENT = {};
	    }
	    /**
	     * 获取dom节点
	     * @param str 节点标识,class,id...
	     */
	    HandelDom.prototype.q = function (str) {
	        return document.querySelector(str);
	    };
	    /**
	     * 根据字符串创建dom节点，返回dom节点
	     * @param str
	     */
	    HandelDom.prototype.createDom = function (str) {
	        if (util_1.default.type(str) != 'string') {
	            $log.error('组件模板' + str + '必须为字符串，请检查组件的template,templateId,templateUrl属性');
	        }
	        var html = "" + str;
	        html = html.trim();
	        html = html.replace(/<!--[\s\S]*?-->/gm, ''); //去除html注释
	        html = html.replace(/>\s+([^\s<]*)\s+</gm, '>$1<').trim(); //去除html标签间的多余空白
	        var pattern = /([^>]*)(<([a-z/][-a-z0-9_:.]*)[^>/]*(\/*)>)([^<]*)/gm, matchArr, start = Date.now();
	        var arr = [];
	        while ((matchArr = pattern.exec(html))) {
	            var textBefore = matchArr[1], //获取排在标签前的文本
	            elem = matchArr[2], //获取整个开标签或闭标签
	            elemName = matchArr[3], //获取标签名
	            closeSign = matchArr[4], //判断是否为自闭合标签标记
	            textAfter = matchArr[5]; //获取排在标签后的文本
	            arr.push(elemName);
	        }
	        var dom = document.createElement(arr[0]);
	        dom.innerHTML = str;
	        return dom;
	    };
	    /**
	     * 根据字符串创建dom节点，返回dom的子节点
	     * @param str
	     */
	    HandelDom.prototype.create = function (str) {
	        var div = this.createDom(str);
	        return div.childNodes;
	    };
	    /**
	    * 获取节点名称
	    * @param node
	    */
	    HandelDom.prototype.getNodeName = function (node) {
	        return node.nodeName ? node.nodeName : node[0].nodeName;
	    };
	    /**
	     * 获取节点的驼峰名称
	     * @param node
	     */
	    HandelDom.prototype.parseName = function (node) {
	        return util_1.default.cameCase(node.tagName.toLowerCase());
	    };
	    /**
	     * 包括dom节点
	     * @param str 节点字符串
	     * @param wrap 包括的tag标签
	     */
	    HandelDom.prototype.wrapDom = function (str, wrap) {
	        return "<" + wrap + ">" + str + "</" + wrap + ">";
	    };
	    /**
	     * 获取某个属性的集合
	     * @param attr 属性名
	     * @param node 节点
	     */
	    HandelDom.prototype.getAttr = function (attr, node) {
	        var arr = [];
	        if (node.nodeType == 1 && node.getAttribute(attr)) {
	            arr.push(node.getAttribute(attr));
	        }
	        if (node.childNodes && node.childNodes.length) {
	            getA(node.childNodes);
	        }
	        function getA(node) {
	            for (var i = 0; i < node.length; i++) {
	                if (node[i].nodeType == 1 && node[i].getAttribute(attr)) {
	                    arr.push(node[i].getAttribute(attr));
	                }
	                if (node[i].childNodes && node[i].childNodes.length) {
	                    getA(node[i].childNodes);
	                }
	            }
	        }
	        return arr;
	    };
	    /**
	     * 父组件的data值覆盖子组件的props值（组件的attr值与props对比，有则覆盖）
	     * @param attr {component:'hello', 'width': 100}
	     * @param props { 'width': { default:50, type:Number } }
	     */
	    HandelDom.prototype.combineAttrAndProps = function (attr, props) {
	        if (util_1.default.isEmpty(attr))
	            return props;
	        if (attr) {
	            var newAttr = util_1.default.expectSome(attr, 'component');
	            for (var i in newAttr) {
	                if (props && props[i]) {
	                    props[i].default = newAttr[i];
	                }
	            }
	        }
	        return props;
	    };
	    /**
	     * 节点没有除了attr以外的其他属性
	     * @param attr 属性
	     * @param node 节点
	     */
	    HandelDom.prototype.noOtherAttr = function (attr, node) {
	        if (node.nodeType == 1) {
	            if (node.attributes) {
	                if (node.attributes.length >= 2)
	                    return false;
	                if (node.attributes.length == 1) {
	                    if (node.attributes[0].name == attr)
	                        return true;
	                    else
	                        return false;
	                }
	            }
	        }
	    };
	    /**
	     * 根据bool值转化成display
	     * @param bool true, false
	     */
	    HandelDom.prototype.boolToDisplay = function (bool) {
	        if (bool == 'true' || bool == true)
	            return 'block';
	        if (bool == 'false' || bool == false)
	            return 'none';
	    };
	    /**
	     * 获取节点除了某些属性外的其他属性
	     * @param node 节点
	     * @param attr 属性
	     */
	    HandelDom.prototype.expectSomeAttr = function (node, attr) {
	        var obj = {};
	        if (node.attributes && node.attributes.length) {
	            for (var i = 0, len = node.attributes; i < len.length; i++) {
	                if (len[i].name != attr) {
	                    obj[len[i].name] = len[i].value;
	                }
	            }
	        }
	        return obj;
	    };
	    /**
	     * 添加注释节点
	     * @param str 注释内容
	     */
	    HandelDom.prototype.addComment = function (str) {
	        var dom = document.createComment(str);
	        return dom;
	    };
	    /**
	     * 替换注释节点
	     * @param node 父节点
	     * @param text 注释内容
	     * @param newNode 新的节点
	     */
	    HandelDom.prototype.replaceComment = function (node, text, newNode) {
	        var iterator = document.createNodeIterator(node, NodeFilter.SHOW_COMMENT, null, false);
	        var n = iterator.nextNode();
	        while (n) {
	            if (n.nodeValue == text) {
	                n.parentNode.replaceChild(newNode, n);
	            }
	            n = iterator.nextNode();
	        }
	    };
	    /**
	     * 更改节点属性
	     * @param str 节点
	     * @param key 属性名
	     * @param val 属性值
	     */
	    HandelDom.prototype.attr = function (str, key, val) {
	        var dom = this.q(str);
	        if (dom != undefined) {
	            if (arguments.length == 3) {
	                dom.setAttribute(key, val);
	            }
	            if (arguments.length == 2) {
	                return dom.getAttribute(key);
	            }
	        }
	    };
	    /**
	     * 返回节点的html
	     * @param str 节点标识
	     */
	    HandelDom.prototype.hasHtml = function (str) {
	        if (DOM.q(str)) {
	            return DOM.q(str).innerHTML;
	        }
	        return undefined;
	    };
	    /**
	     * 返回require,import 的html
	     * @param str 节点标识
	     */
	    HandelDom.prototype.hasHtmlUrl = function (str) {
	        return str;
	    };
	    /**
	     * head添加style
	     * @param res style所属类型
	     * @param component style所属组件
	     */
	    HandelDom.prototype.addStyle = function (res, component) {
	        if (component.name == undefined) {
	            $log.error('找不到组件的name属性，无法添加style样式');
	        }
	        if (res == undefined) {
	            return;
	        }
	        // 组件的标签名称
	        var tag = util_1.default._cameCase(component.name);
	        switch (res.type) {
	            case 'string':
	                this.appendStyle(res.result, tag);
	                break;
	            case 'id':
	                if (this.q(res.result) == undefined) {
	                    $log.error('名称为' + component.name + '组件中，节点' + res.result + '不存在');
	                }
	                var inner = this.q(res.result).innerHTML;
	                this.appendStyle(inner, tag);
	                break;
	            case 'url':
	                this.appendStyle(res.result, tag);
	                break;
	        }
	    };
	    /**
	     * 将样式表添加到head里面
	     * @param inner 样式表内容
	     * @param title style的title属性，也是组件tag标签
	     */
	    HandelDom.prototype.appendStyle = function (inner, title) {
	        var style = "" + inner;
	        style = util_1.default.trimStr(style);
	        var newStyle = document.createElement('style');
	        newStyle.type = 'text/css';
	        newStyle.title = title;
	        newStyle.innerHTML = style;
	        this.q('head').appendChild(newStyle);
	        // 给选择符设置前缀
	        this.addSelectorPrefix(title);
	    };
	    /**
	     * 给选择符设置前缀
	     * @param title style的title属性
	     */
	    HandelDom.prototype.addSelectorPrefix = function (title) {
	        var stylesheet = document.styleSheets;
	        for (var i = 0; i < stylesheet.length; i++) {
	            if (stylesheet[i].title == title) {
	                for (var j = 0, cr = stylesheet[i].cssRules; j < cr.length; j++) {
	                    cr[j].selectorText = title + ' ' + cr[j].selectorText;
	                }
	            }
	        }
	    };
	    /**
	     * 移除具有相同属性的节点，第item个除外
	     * @param item 索引
	     * @param selector 节点选择器
	     */
	    HandelDom.prototype.removeDomExpectWhich = function (item, selector) {
	        var nodes = document.querySelectorAll(selector);
	        for (var i = 0; i < nodes.length; i++) {
	            if (i != item) {
	                nodes[i].parentNode.removeChild(nodes[i]);
	            }
	        }
	    };
	    HandelDom.prototype.watch = function (node) {
	        // 观察dom数据变化
	        var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
	        var target = document.querySelector(node);
	        var observer = new MutationObserver(function (mu) {
	            // console.log(mu)
	        });
	        var config = { childList: true, attributes: true, characterData: true, subtree: true, attributeOldValue: true, characterDataOldValue: true };
	        observer.observe(target, config);
	    };
	    HandelDom.prototype.booleanAttr = function (node, nodeName) {
	    };
	    return HandelDom;
	}());
	var DOM = new HandelDom();
	exports.default = DOM;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var $log = __webpack_require__(2);
	var util_1 = __webpack_require__(3);
	var parse_1 = __webpack_require__(11);
	var ParseTpl = /** @class */ (function () {
	    function ParseTpl(text, data, props) {
	        this.text = text;
	        this.data = data;
	        this.props = props;
	    }
	    /**
	     * 组合data和props属性
	     * @param data
	     * @param props
	     */
	    ParseTpl.prototype.combineData = function (data, props) {
	        if (data === void 0) { data = {}; }
	        if (props === void 0) { props = {}; }
	        if (util_1.default.type(data) != 'object')
	            $log.error('组件是属性data必须为对象');
	        if (util_1.default.type(props) != 'object')
	            $log.error('组件是属性props必须为对象');
	        if (util_1.default.isEmpty(props))
	            return data;
	        for (var i in props) {
	            data[i] = props[i].default;
	        }
	        return data;
	    };
	    // 渲染模板
	    ParseTpl.prototype.tpl = function () {
	        var self = this;
	        var index = 0, parts = [], startIndex, endIndex, exp, expFn;
	        if (this.text == undefined) {
	            return;
	        }
	        while (index < this.text.length) {
	            startIndex = this.text.indexOf('{{', index);
	            if (startIndex != -1) {
	                endIndex = this.text.indexOf('}}', startIndex + 2);
	            }
	            if (startIndex != -1 && endIndex != -1) {
	                if (startIndex != index) {
	                    parts.push(this.text.substring(index, startIndex));
	                }
	                exp = this.text.substring(startIndex + 2, endIndex);
	                expFn = parse_1.default.parse(exp);
	                parts.push(expFn);
	                index = endIndex + 2;
	            }
	            else {
	                parts.push(this.text.substring(index));
	                break;
	            }
	        }
	        // console.log(parts)
	        return parts.reduce(function (prev, cur) {
	            if (util_1.default.type(cur) == 'function') {
	                return prev + self.expectNullUndefined(cur(self.combineData(self.data, self.props)));
	            }
	            else {
	                return prev + cur;
	            }
	        }, '');
	    };
	    /**
	     * 判断表达式是否为null或者undefined，是则返回''
	     * @param str
	     */
	    ParseTpl.prototype.expectNullUndefined = function (str) {
	        if (util_1.default.type(str) == 'null' || util_1.default.type(str) == 'undefined') {
	            return '';
	        }
	        else if (typeof str == 'object') {
	            return JSON.stringify(str);
	        }
	        else {
	            return '' + str;
	        }
	    };
	    return ParseTpl;
	}());
	function tpl(text, data, props) {
	    var parseTpl = new ParseTpl(text, data, props);
	    return parseTpl.tpl();
	}
	exports.default = tpl;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var lexer_1 = __webpack_require__(12);
	var parser_1 = __webpack_require__(14);
	var pipe_1 = __webpack_require__(19);
	var ps = new pipe_1.default();
	var util_1 = __webpack_require__(3);
	var Parse = /** @class */ (function () {
	    function Parse() {
	        this.pipes = ps.pipes;
	    }
	    /**
	     * 注册管道
	     * @param name
	     * @param factory
	     */
	    Parse.prototype.register = function (name, factory) {
	        ps.register(name, factory);
	        return this;
	    };
	    Parse.prototype.pipe = function (name) {
	        return ps.pipe(name);
	    };
	    /**
	     * 词法解析
	     * @param str
	     */
	    Parse.prototype.parse = function (str) {
	        var that = this;
	        function parse(expression, pipes) {
	            switch (util_1.default.type(expression)) {
	                case 'string':
	                    var lexer = new lexer_1.default();
	                    var parser = new parser_1.default(lexer, pipes);
	                    var oneTime = false;
	                    //单次检测
	                    if (expression.charAt(0) == ':' && expression.charAt(1) == ':') {
	                        oneTime = true;
	                        expression = expression.substring(2);
	                    }
	                    var parseFn = parser.parse(expression);
	                    if (parseFn.constant) {
	                        parseFn.$$handelWatch = that.constantHandelWatch;
	                    }
	                    if (oneTime) {
	                        parseFn.$$handelWatch = parseFn.literal ? that.oneTimeLiteralHandelWatch : that.oneTimeHandelWatch;
	                    }
	                    if (parseFn.inputs) {
	                        parseFn.$$handelWatch = that.inputsHandelWatch;
	                    }
	                    return parseFn;
	                case 'function':
	                    return expression;
	            }
	        }
	        return parse(str, this.pipes);
	    };
	    /**
	     * 处理参数为常量的状况
	     * @param state
	     * @param listenerFn
	     * @param valueEq
	     * @param watchFn
	     */
	    Parse.prototype.constantHandelWatch = function (state, listenerFn, valueEq, watchFn) {
	        var cancel = state.$watch(function () {
	            return watchFn(state);
	        }, function (newVal, oldVal, state) {
	            if (util_1.default.type(listenerFn) == 'function') {
	                listenerFn.apply(this, arguments);
	            }
	        }, valueEq);
	        return cancel;
	    };
	    /**
	     * 处理单次检测问题
	     * @param state
	     * @param listenerFn
	     * @param valueEq
	     * @param watchFn
	     */
	    Parse.prototype.oneTimeHandelWatch = function (state, listenerFn, valueEq, watchFn) {
	        var lastVal;
	        var cancel = state.$watch(function () {
	            return watchFn(state);
	        }, function (newVal, oldVal, state) {
	            lastVal = newVal;
	            if (util_1.default.type(listenerFn) == 'function') {
	                listenerFn.apply(this, arguments);
	            }
	            if (util_1.default.type(newVal) != 'undefined') {
	                state.$afterDigest(function () {
	                    if (util_1.default.type(lastVal) != 'undefined') {
	                        cancel();
	                    }
	                });
	            }
	        }, valueEq);
	        return cancel;
	    };
	    /**
	     * 处理数组或对象的变量问题
	     * @param state
	     * @param listenerFn
	     * @param valueEq
	     * @param watchFn
	     */
	    Parse.prototype.oneTimeLiteralHandelWatch = function (state, listenerFn, valueEq, watchFn) {
	        var lastVal;
	        var cancel = state.$watch(function () {
	            return watchFn(state);
	        }, function (newVal, oldVal, state) {
	            lastVal = newVal;
	            if (util_1.default.type(listenerFn) == 'function') {
	                listenerFn.apply(this, arguments);
	            }
	            if (util_1.default.type(newVal) != 'undefined') {
	                state.$afterDigest(function () {
	                    if (util_1.default.type(lastVal) != 'undefined') {
	                        cancel();
	                    }
	                });
	            }
	        }, valueEq);
	        return cancel;
	    };
	    Parse.prototype.inputsHandelWatch = function (state, listenerFn, valueEq, watchFn) {
	        var inputExpr = watchFn.inputs;
	        return state.$watch(function () {
	        }, listenerFn, valueEq);
	    };
	    return Parse;
	}());
	var parse = new Parse();
	exports.default = parse;
	// 默认管道函数--开始
	var newParse = new Parse();
	newParse.register('filter', defaultFilter);
	function defaultFilter() {
	    return function (array, filterExp) {
	        var predicateFn;
	        switch (util_1.default.type(filterExp)) {
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
	    };
	}
	// 如果pipe后面非函数表达式就生成一个
	function createPredicateFn(exp) {
	    // item指数组元素
	    return function predicateFn(item) {
	        return deepCompareValues(item, exp, compareValues);
	    };
	}
	// source值数组的元素，target值pipe表达式冒号后面的字符，pipe:"a"
	function compareValues(source, target) {
	    if (util_1.default.type(source) == 'null' || util_1.default.type(target) == 'null') {
	        return source === target;
	    }
	    // 不对undefined处理
	    if (util_1.default.type(source) == 'undefined')
	        return false;
	    source = ('' + source).toLowerCase();
	    target = ('' + target).toLowerCase();
	    return source.includes(target);
	}
	// 如果数组元素是对象进行深度比较
	function deepCompareValues(source, target, compare) {
	    if (util_1.default.type(target) == 'string' && target.startsWith('!')) {
	        return !deepCompareValues(source, target.substring(1), compare);
	    }
	    if (util_1.default.type(source) == 'object') {
	        if (util_1.default.type(target) == 'object') {
	            for (var i in target) {
	                return deepCompareValues(source[i], target[i], compare);
	            }
	        }
	        var arr = util_1.default.objVal(source);
	        return arr.some(function (val) {
	            return deepCompareValues(val, target, compare);
	        });
	    }
	    return compare(source, target);
	}
	// 注册管道函数--结束


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var $log = __webpack_require__(2);
	var util_1 = __webpack_require__(3);
	var lexer_config_1 = __webpack_require__(13);
	/**
	 * 此法解析器，用于解析{{a + b}} 之类的插值运算
	 */
	var Lexer = /** @class */ (function () {
	    function Lexer() {
	        this.index = 0;
	        this.now = undefined;
	        this.tokens = [];
	        this.text = '';
	    }
	    /**
	     * 词法解析函数
	     * @param text
	     * @returns {Array<any>}
	     */
	    Lexer.prototype.lex = function (text) {
	        this.text = text;
	        while (this.index < this.text.length) {
	            this.now = this.text.charAt(this.index);
	            if (util_1.default.whichType(this.now) == 'number' ||
	                (this.now === '.' && util_1.default.whichType(util_1.default.nextLeter(this.index, this.text)))) {
	                this.loopNumber();
	            }
	            else if (util_1.default.whichType(this.now) == 'string') {
	                this.loopString(this.now);
	            }
	            else if (util_1.default.whichType(this.now) == 'letter') {
	                this.loopLetter();
	            }
	            else if (util_1.default.isWhiteSpace(this.now)) {
	                this.index++;
	            }
	            else if (util_1.default.inStr(this.now, '[],{}.:()?;')) {
	                this.pushObj();
	            }
	            else {
	                this.loopOperator();
	            }
	        }
	        return this.tokens;
	    };
	    /**
	     * 添加词法解析对象
	     */
	    Lexer.prototype.pushObj = function () {
	        this.tokens.push({
	            text: this.now,
	            value: this.now
	        });
	        this.index++;
	    };
	    /**
	     * 获取下一个字符
	     * @param n
	     * @returns {string|boolean}
	     */
	    Lexer.prototype.nextStr = function (n) {
	        if (n === void 0) { n = 1; }
	        return (this.index + n < this.text.length) ?
	            this.text.charAt(this.index + n) :
	            false;
	    };
	    /**
	     * 遍历数字类
	     */
	    Lexer.prototype.loopNumber = function () {
	        var number = '';
	        while (this.index < this.text.length) {
	            var now = this.text.charAt(this.index).toLowerCase();
	            if (util_1.default.whichType(now) == 'number' || now === '.') {
	                number += now;
	            }
	            else {
	                var next = util_1.default.nextLeter(this.index, this.text);
	                var prev = number.charAt(number.length - 1);
	                if (now == 'e' && util_1.default.isExponent(next)) {
	                    number += now;
	                }
	                else if (util_1.default.isExponent(now) && prev === 'e' && next && util_1.default.isNumber(next)) {
	                    number += now;
	                }
	                else if (util_1.default.isExponent(now) && prev === 'e' && (!next || !util_1.default.isNumber(next))) {
	                    $log.error("指数格式错误！");
	                }
	                else {
	                    break;
	                }
	            }
	            this.index++;
	        }
	        this.tokens.push({
	            text: number,
	            value: Number(number)
	        });
	    };
	    /**
	     * 遍历字符串类，'"abc"'
	     */
	    Lexer.prototype.loopString = function (quote) {
	        this.index++;
	        var string = '', 
	        //避免单独的操作符匹配错误，例如'"!"'
	        raw = quote;
	        while (this.index < this.text.length) {
	            var now = this.text.charAt(this.index);
	            raw += now;
	            if (now == quote) {
	                this.index++;
	                this.tokens.push({
	                    text: raw,
	                    value: string
	                });
	                return;
	            }
	            else if (now == lexer_config_1.SPECIALS[now]) {
	                string += lexer_config_1.SPECIALS[now];
	            }
	            else {
	                string += now;
	            }
	            this.index++;
	        }
	        $log.error('无法匹配的符号');
	    };
	    /**
	     * 字符类, 'abc_$'
	     */
	    Lexer.prototype.loopLetter = function () {
	        var letter = '';
	        while (this.index < this.text.length) {
	            var now = this.text.charAt(this.index);
	            if (util_1.default.isLetter(now) || util_1.default.isNumber(now)) {
	                letter += now;
	            }
	            else {
	                break;
	            }
	            this.index++;
	        }
	        // 针对boolean,null,undefined
	        var v = lexer_config_1.LETTER.hasOwnProperty(letter) ? lexer_config_1.LETTER[letter] : letter;
	        this.tokens.push({
	            text: letter,
	            identifier: true,
	            value: v
	        });
	    };
	    /**
	     * 操作符，+- ！==
	     */
	    Lexer.prototype.loopOperator = function () {
	        var str = this.now, str2 = this.now + this.nextStr(1), str3 = this.now + this.nextStr(1) + this.nextStr(2), op = lexer_config_1.OPERATORS[str], op2 = lexer_config_1.OPERATORS[str2], op3 = lexer_config_1.OPERATORS[str3];
	        if (op || op2 || op3) {
	            var ct = op3 ? str3 : (op2 ? str2 : str);
	            this.tokens.push({
	                text: ct,
	                value: ct
	            });
	            this.index += ct.length;
	        }
	        else {
	            $log.error('未识别的字符' + this.now);
	        }
	    };
	    return Lexer;
	}());
	exports.default = Lexer;


/***/ }),
/* 13 */
/***/ (function(module, exports) {

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


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var astBuilder_1 = __webpack_require__(15);
	var astCompile_1 = __webpack_require__(17);
	var Parser = /** @class */ (function () {
	    function Parser(lexer, pipes) {
	        this.lexer = lexer;
	        this.astBuilder = new astBuilder_1.default(this.lexer);
	        this.astCompile = new astCompile_1.default(this.astBuilder, pipes);
	    }
	    Parser.prototype.parse = function (text) {
	        return this.astCompile.compile(text);
	    };
	    return Parser;
	}());
	exports.default = Parser;


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var AST = __webpack_require__(16);
	var LEXER = __webpack_require__(13);
	var util_1 = __webpack_require__(3);
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
	var ASTBuilder = /** @class */ (function () {
	    function ASTBuilder(lexer) {
	        this.lexer = lexer;
	        this.tokens = [];
	    }
	    /**
	     * 生成抽象语法结构树
	     * @param text
	     * @returns {Object}
	     */
	    ASTBuilder.prototype.ast = function (text) {
	        this.tokens = this.lexer.lex(text);
	        return this.init();
	    };
	    /**
	     * 结构树形式, ';'看作是多个表达式的组合，故词法树的body有对象进化为对象数组Array<object>
	     * @returns {{type: string, body: {}}}
	     */
	    ASTBuilder.prototype.init = function () {
	        var body = [];
	        while (true) {
	            if (this.tokens.length) {
	                body.push(this.pipeBuilder());
	            }
	            if (!util_1.default.expect(this.tokens, ';')) {
	                AST.ast_init['body'] = {};
	                AST.ast_init['body'] = body;
	                return util_1.default.clone(AST.ast_init);
	            }
	        }
	    };
	    /**
	     * 中介函数
	     * @returns {any}
	     */
	    ASTBuilder.prototype.agency = function () {
	        var agency;
	        if (util_1.default.expect(this.tokens, '(')) {
	            agency = this.pipeBuilder();
	            util_1.default.consume(this.tokens, ')');
	        }
	        else if (util_1.default.expect(this.tokens, '[')) {
	            agency = this.arrayBuilder();
	        }
	        else if (util_1.default.expect(this.tokens, '{')) {
	            agency = this.objectBuilder();
	        }
	        else if (LEXER.LETTER.hasOwnProperty(this.tokens[0]['text'])) {
	            if (this.tokens[0]['text'] == "this") {
	                agency = util_1.default.clone(AST.ast_this);
	            }
	            else {
	                AST.ast_constant['value'] = LEXER.LETTER[util_1.default.consume(this.tokens)['text']];
	                agency = util_1.default.clone(AST.ast_constant);
	            }
	        }
	        else if (util_1.default.exitFirst(this.tokens).identifier) {
	            agency = this.identifierBuilder();
	        }
	        else {
	            agency = this.constantBuilder();
	        }
	        /**
	         * 处理带有 '.', '[' 的标识符
	         * 结构树：{"type":"ASTBuilder.Member","object":{"type":"ASTBuilder.Member","object":{"type":"ASTBuilder.Identifier","value":"a"},"property":{"type":"ASTBuilder.Identifier","value":"b"}},"property":{"type":"ASTBuilder.Identifier","value":"c"}}
	         */
	        var type;
	        while (type = util_1.default.expect(this.tokens, '.', '[', '(')) {
	            agency = this.memberBuilder(type, agency);
	        }
	        // console.log(JSON.stringify(agency));
	        return agency;
	    };
	    /**
	     * 遍历'[]','{}','()'等对称标识符
	     */
	    ASTBuilder.prototype.closingTags = function (quote) {
	        var arr = [], that = this;
	        if (!util_1.default.exitFirst(this.tokens, quote)) {
	            do {
	                if (util_1.default.exitFirst(this.tokens, quote))
	                    break;
	                arr.push(that.agency());
	            } while (util_1.default.expect(this.tokens, ','));
	        }
	        util_1.default.consume(this.tokens, quote);
	        return arr;
	    };
	    /**
	     * 结构树的常量部分
	     * @returns {{type: string, value: {}}}
	     */
	    ASTBuilder.prototype.constantBuilder = function () {
	        AST.ast_constant['value'] = util_1.default.consume(this.tokens)['value'];
	        return util_1.default.clone(AST.ast_constant);
	    };
	    /**
	    * 结构树的标识符部分
	    * @returns {{type: string, value: {}}}
	    */
	    ASTBuilder.prototype.identifierBuilder = function () {
	        AST.ast_identifier['value'] = util_1.default.consume(this.tokens)['value'];
	        return util_1.default.clone(AST.ast_identifier);
	    };
	    /**
	     * 结构树的数组部分
	     * @returns {{type: string, value: {}}}
	     */
	    ASTBuilder.prototype.arrayBuilder = function () {
	        AST.ast_array['value'] = this.closingTags(']');
	        return util_1.default.clone(AST.ast_array);
	    };
	    /**
	     * 结构树的对象部分
	     * @returns {{type: string, value: {}}}
	     */
	    ASTBuilder.prototype.objectBuilder = function () {
	        var arr = [];
	        if (!util_1.default.exitFirst(this.tokens, '}')) {
	            do {
	                AST.ast_json['key'] = this.constantBuilder();
	                util_1.default.consume(this.tokens, ':');
	                AST.ast_json['value'] = this.assignmentBuilder();
	                arr.push(util_1.default.clone(AST.ast_json));
	            } while (util_1.default.expect(this.tokens, ','));
	        }
	        util_1.default.consume(this.tokens, '}');
	        AST.ast_object['value'] = arr;
	        return util_1.default.clone(AST.ast_object);
	    };
	    /**
	     * 结构树的对象取值部分，a.b  a["b"]，a() 等
	     * @param type
	     * @param agency
	     * @returns {{type: string, value: {}}}
	     */
	    ASTBuilder.prototype.memberBuilder = function (type, agency) {
	        if (type.text === '[') {
	            agency = {
	                type: AST.dataType['7'],
	                object: agency,
	                property: this.agency(),
	                computed: true
	            };
	            util_1.default.consume(this.tokens, ']');
	        }
	        if (type.text === '.') {
	            agency = {
	                type: AST.dataType['7'],
	                object: agency,
	                property: this.identifierBuilder(),
	                computed: false
	            };
	        }
	        if (type.text === '(') {
	            agency = {
	                type: AST.ast_function['type'],
	                callee: agency,
	                arguments: this.closingTags(')'),
	                pipe: false
	            };
	        }
	        return agency;
	    };
	    /**
	     * 含有‘=’等符号
	     * @returns {any}
	     */
	    ASTBuilder.prototype.assignmentBuilder = function () {
	        var left = this.ternaryBuilder();
	        if (util_1.default.expect(this.tokens, '=')) {
	            var right = this.ternaryBuilder();
	            AST.ast_assignment['left'] = left;
	            AST.ast_assignment['right'] = right;
	            return util_1.default.clone(AST.ast_assignment);
	        }
	        return left;
	    };
	    /**
	     * 一元运算符
	     * @returns {any}
	     */
	    ASTBuilder.prototype.unaryBuilder = function () {
	        var ue = util_1.default.expect(this.tokens, '+', '!', '-');
	        if (ue) {
	            AST.ast_unary['operator'] = ue.text;
	            AST.ast_unary['value'] = this.unaryBuilder();
	            return util_1.default.clone(AST.ast_unary);
	        }
	        if (!ue)
	            return this.agency();
	    };
	    /**
	     *乘法运算
	     * @returns {Object}
	     */
	    ASTBuilder.prototype.multiplicativeBuilder = function () {
	        var left = this.unaryBuilder(), ue;
	        while (ue = util_1.default.expect(this.tokens, '*', '%', '/')) {
	            AST.ast_binary['operator'] = ue.text;
	            AST.ast_binary['left'] = left;
	            AST.ast_binary['right'] = this.unaryBuilder();
	            left = util_1.default.clone(AST.ast_binary);
	        }
	        return left;
	    };
	    /**
	     * 加法运算
	     * @returns {Object}
	     */
	    ASTBuilder.prototype.additiveBuilder = function () {
	        var left = this.multiplicativeBuilder(), ue;
	        while (ue = util_1.default.expect(this.tokens, '+', '-')) {
	            left = {
	                type: AST.ast_binary['type'],
	                operator: ue.text,
	                left: left,
	                right: this.multiplicativeBuilder()
	            };
	        }
	        return left;
	    };
	    /**
	     * 关系运算符，‘>’
	     * @returns {Object}
	     */
	    ASTBuilder.prototype.relationalBuilder = function () {
	        var left = this.additiveBuilder(), ue;
	        while (ue = util_1.default.expect(this.tokens, '>', '<', '>=', '<=')) {
	            left = {
	                type: AST.ast_binary['type'],
	                operator: ue.text,
	                left: left,
	                right: this.additiveBuilder()
	            };
	        }
	        return left;
	    };
	    /**
	     * 等法运算符，‘==’
	     * @returns {Object}
	     */
	    ASTBuilder.prototype.equalityBuilder = function () {
	        var left = this.relationalBuilder(), ue;
	        while (ue = util_1.default.expect(this.tokens, '==', '===', '!=', '!==')) {
	            left = {
	                type: AST.ast_binary['type'],
	                operator: ue.text,
	                left: left,
	                right: this.relationalBuilder()
	            };
	        }
	        return left;
	    };
	    /**
	     * && 运算符， &&高于||
	     * @returns {Object}
	     */
	    ASTBuilder.prototype.andBuilder = function () {
	        var left = this.equalityBuilder(), ue;
	        while (ue = util_1.default.expect(this.tokens, '&&')) {
	            left = {
	                type: AST.ast_logical['type'],
	                operator: ue.text,
	                left: left,
	                right: this.equalityBuilder()
	            };
	        }
	        return left;
	    };
	    /**
	     * || 运算符， &&高于||
	     * @returns {Object}
	     */
	    ASTBuilder.prototype.orBuilder = function () {
	        var left = this.andBuilder(), ue;
	        while (ue = util_1.default.expect(this.tokens, '||')) {
	            left = {
	                type: AST.ast_logical['type'],
	                operator: ue.text,
	                left: left,
	                right: this.andBuilder()
	            };
	        }
	        return left;
	    };
	    /**
	     * 三元运算符
	     * @returns {Object}
	     */
	    ASTBuilder.prototype.ternaryBuilder = function () {
	        var boolean_expression = this.orBuilder();
	        if (util_1.default.expect(this.tokens, '?')) {
	            var true_value = this.assignmentBuilder();
	            if (util_1.default.consume(this.tokens, ':')) {
	                var error_value = this.assignmentBuilder();
	                return {
	                    type: AST.ast_teranry['type'],
	                    boolean_expression: boolean_expression,
	                    true_value: true_value,
	                    error_value: error_value
	                };
	            }
	        }
	        return boolean_expression;
	    };
	    /**
	     * 管道处理
	     */
	    ASTBuilder.prototype.pipeBuilder = function () {
	        var pipes = this.assignmentBuilder();
	        while (util_1.default.expect(this.tokens, '|')) {
	            var args = [pipes];
	            pipes = {
	                type: AST.ast_function['type'],
	                callee: this.identifierBuilder(),
	                arguments: args,
	                pipe: true
	            };
	            while (util_1.default.expect(this.tokens, ':')) {
	                args.push(this.assignmentBuilder());
	            }
	        }
	        return pipes;
	    };
	    return ASTBuilder;
	}());
	exports.default = ASTBuilder;


/***/ }),
/* 16 */
/***/ (function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
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


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var ast_config_1 = __webpack_require__(16);
	var $log = __webpack_require__(2);
	var K = __webpack_require__(18);
	var util_1 = __webpack_require__(3);
	var ps = {}; //管道集合
	var ASTCompile = /** @class */ (function () {
	    function ASTCompile(astBuilder, pipes) {
	        this.astBuilder = astBuilder;
	        this.state = {
	            body: [],
	            compileId: 0,
	            echo: [],
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
	            case ast_config_1.dataType['1']://'ASTBuilder.Init'
	                this.initCompile(ast);
	                break;
	            case ast_config_1.dataType['2']://'ASTBuilder.MetaData'
	                return this.metaCompile(ast);
	            case ast_config_1.dataType['3']://'ASTBuilder.Array'
	                return this.arrayCompile(ast);
	            case ast_config_1.dataType['4']://'ASTBuilder.Object'
	                return this.objectCompile(ast);
	            case ast_config_1.dataType['5']://'ASTBuilder.Identifier'
	                return this.identifierCompile(ast, context, createNewElement);
	            case ast_config_1.dataType['6']://'ASTBuilder.This'
	                return this.thisCompile();
	            case ast_config_1.dataType['7']://'ASTBuilder.Member'
	                return this.memberCompile(ast, context, createNewElement);
	            case ast_config_1.dataType['8']://'ASTBuilder.Function'
	                return this.functionCompile(ast);
	            case ast_config_1.dataType['9']://'ASTBuilder.Assignment'
	                return this.assigmentCompile(ast);
	            case ast_config_1.dataType['10']://'ASTBuilder.Unary'
	                return this.unaryCompile(ast);
	            case ast_config_1.dataType['11']://'ASTBuilder.Binary'
	                return this.binaryCompile(ast);
	            case ast_config_1.dataType['12']://'ASTBuilder.Logical'
	                return this.logicalCompile(ast);
	            case ast_config_1.dataType['13']://'ASTBuilder.Ternary'
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
	        if (ast.computed) {
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
	        if (!ast.computed) {
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
	        if (util_1.default.inStr(ast.operator, '+-')) {
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
	            case ast_config_1.dataType['1']://ASTBuilder.Init
	                cons = true;
	                arrayLike(ast.body);
	                break;
	            case ast_config_1.dataType['2']://ASTBuilder.MetaData
	                ast.constant = true;
	                break;
	            case ast_config_1.dataType['3']://ASTBuilder.Array
	                cons = true;
	                arrayLike(ast.value);
	                ast.constant = cons;
	                break;
	            case ast_config_1.dataType['4']://ASTBuilder.Object
	                cons = true;
	                ast.value.forEach(function (val) {
	                    _this.constantExpr(val.value);
	                    cons = cons && val.value.constant;
	                });
	                ast.constant = cons;
	                break;
	            case ast_config_1.dataType['5']: //ASTBuilder.Identifier
	            case ast_config_1.dataType['6']://ASTBuilder.This
	                ast.constant = false;
	                break;
	            case ast_config_1.dataType['7']://ASTBuilder.Member
	                this.constantExpr(ast.object);
	                if (ast.computed) {
	                    this.constantExpr(ast.property);
	                }
	                ast.constant = ast.object.constant && (!ast.computed || ast.property.constant);
	                break;
	            case ast_config_1.dataType['8']://ASTBuilder.Function
	                cons = ast.pipe;
	                arrayLike(ast.arguments);
	                ast.constant = cons;
	                break;
	            case ast_config_1.dataType['9']://ASTBuilder.Assignment
	                leftRight();
	                break;
	            case ast_config_1.dataType['10']://ASTBuilder.Unary
	                this.constantExpr(ast.value);
	                ast.constant = ast.value.constant;
	                break;
	            case ast_config_1.dataType['11']: //ASTBuilder.Binary
	            case ast_config_1.dataType['12']://ASTBuilder.Logical
	                leftRight();
	                break;
	            case ast_config_1.dataType['13']://ASTBuilder.Teranry
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


/***/ }),
/* 18 */
/***/ (function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	//对象属性
	var PROPERTY = ['constructor', '__proto__', '__defineGetter__', '__defineSetter__', '__lookupGetter__', '__loopupSetter__'];
	exports.PROPERTY = PROPERTY;
	//window对象
	var WINDOW = ['document', 'alert', 'location', 'setInterval'];
	exports.WINDOW = WINDOW;
	//dom节点
	var NODE = ['nodeName', 'children'];
	exports.NODE = NODE;
	//函数
	var FUN = [Function.prototype.call, Function.prototype.apply, Function.prototype.bind];
	exports.FUN = FUN;


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var $log = __webpack_require__(2);
	var util_1 = __webpack_require__(3);
	/**
	 * 执行管道过滤操作
	 */
	var Pipe = /** @class */ (function () {
	    function Pipe() {
	        this.pipes = {};
	    }
	    /**
	     * 注册管道函数
	     * @param name 字符串或者对象
	     * @param factory
	     */
	    Pipe.prototype.register = function (name, factory) {
	        // this.pipes = {};
	        //允许对象方式注册多个pipe
	        if (util_1.default.type(name) == 'object') {
	            for (var i in name) {
	                return this.register(i, name[i]);
	            }
	        }
	        if (util_1.default.type(name) == 'string') {
	            if (util_1.default.type(factory) != 'function')
	                $log.error('注册的管道函数类型为function');
	            var pipe = factory();
	            this.pipes[name] = pipe;
	            return pipe;
	        }
	    };
	    /**
	     * 管道执行函数
	     * @param name
	     */
	    Pipe.prototype.pipe = function (name) {
	        return this.pipes[name];
	    };
	    Pipe.prototype.returnPipes = function () {
	        return this.pipes;
	    };
	    return Pipe;
	}());
	exports.default = Pipe;
	// const pipe = new Pipe();
	function $pipeProvider($provider) {
	    var pipes = {};
	    this.register = function (name, factory) {
	        //允许对象方式注册多个pipe
	        if (util_1.default.type(name) == 'object') {
	            for (var i in name) {
	                return this.register(i, name[i]);
	            }
	        }
	        if (util_1.default.type(name) == 'string') {
	            if (util_1.default.type(factory) != 'function')
	                $log.error('注册的管道函数类型为function');
	            return $provider.factory(name + 'Pipe', factory);
	        }
	    };
	    this.$get = ['$injector', function ($injector) {
	            return function (name) {
	                return $injector.get(name + 'Pipe');
	            };
	        }];
	}
	exports.$pipeProvider = $pipeProvider;
	$pipeProvider.$inject = ['$provider'];


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var HandelEventer_1 = __webpack_require__(21);
	var util_1 = __webpack_require__(3);
	/**
	 * 监听组件的data数据变化
	 */
	var HandelData = /** @class */ (function () {
	    function HandelData() {
	        this.data = {};
	        this.name = '';
	        this.token = undefined;
	        this.props = {};
	        this.componentStatus = '';
	    }
	    HandelData.prototype.$data = function (key, val) {
	        var n = arguments.length;
	        switch (n) {
	            case 0:
	                return this.data;
	            case 1:
	                return this.data[key];
	            case 2:
	                var oldData = util_1.default.deepClone(this.data);
	                this.data[key] = val;
	                var newData = this.data;
	                HandelEventer_1.default.trigger(key, util_1.default.clone({
	                    target: this.token,
	                    which: this.name,
	                    old: oldData,
	                    new: newData,
	                    oldVal: oldData[key],
	                    newVal: newData[key],
	                    props: this.props == undefined ? {} : this.props,
	                    componentStatus: this.componentStatus
	                }));
	                break;
	        }
	    };
	    return HandelData;
	}());
	var Data = new HandelData();
	exports.default = Data;


/***/ }),
/* 21 */
/***/ (function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var HandelEventer = /** @class */ (function () {
	    function HandelEventer() {
	        this.eventList = {};
	    }
	    /**
	     * 触发事件
	     * @param name
	     * @param msg
	     */
	    HandelEventer.prototype.trigger = function (name, msg) {
	        var key = Array.prototype.shift.call(arguments);
	        var fns = this.eventList[key];
	        if (!fns || fns.length === 0) {
	            return false;
	        }
	        ;
	        for (var i = 0, fn; fn = fns[i++];) {
	            fn.apply(this, arguments);
	        }
	    };
	    /**
	     * 监听事件
	     * @param name
	     * @param fn
	     */
	    HandelEventer.prototype.listen = function (name, fn) {
	        if (!this.eventList[name]) {
	            this.eventList[name] = [];
	        }
	        ;
	        this.eventList[name].push(fn);
	    };
	    HandelEventer.prototype.remove = function (key, fn) {
	        var fns = this.eventList[key];
	        // key对应的消息没有被人订阅
	        if (!fns) {
	            return false;
	        }
	        // 没有传入fn(具体的回调函数), 表示取消key对应的所有订阅
	        if (!fn) {
	            fns && (fns.length = 0);
	        }
	        else {
	            // 反向遍历
	            for (var i = fns.length - 1, _fn = fns[i]; i >= 0; i--) {
	                if (_fn === fn) {
	                    // 删除订阅回调函数
	                    fns.splice(i, 1);
	                }
	            }
	        }
	    };
	    return HandelEventer;
	}());
	var Eventer = new HandelEventer();
	exports.default = Eventer;


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var HandelEventer_1 = __webpack_require__(21);
	/**
	 * 组件事件监听函数
	 */
	var HandelEvent = /** @class */ (function () {
	    function HandelEvent() {
	    }
	    /**
	     * 触发事件
	     * @param name 事件名称
	     * @param msg 信息
	     */
	    HandelEvent.prototype.trigger = function (name, msg) {
	        HandelEventer_1.default.trigger(name, msg);
	    };
	    /**
	     * 监听事件
	     * @param name 事件名称
	     * @param fn 回调函数，返回触发的信息
	     */
	    HandelEvent.prototype.listen = function (name, fn) {
	        HandelEventer_1.default.listen(name, fn);
	    };
	    return HandelEvent;
	}());
	var handelEvent = new HandelEvent();
	exports.default = handelEvent;


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var parseHttp_1 = __webpack_require__(24);
	var Http = /** @class */ (function () {
	    function Http() {
	    }
	    /**
	     * ajax请求方式，全配置
	     * @param param0
	     */
	    Http.prototype.ajax = function (_a) {
	        var _b = _a.type, type = _b === void 0 ? 'get' : _b, _c = _a.url, url = _c === void 0 ? '' : _c, data = _a.data;
	        return parseHttp_1.parseHttp(type, url, data);
	    };
	    /**
	     * get请求方式
	     * @param url
	     */
	    Http.prototype.get = function (url) {
	        return parseHttp_1.parseHttp('get', url, null);
	    };
	    /**
	     * post请求
	     * @param url
	     * @param data
	     */
	    Http.prototype.post = function (url, data) {
	        return parseHttp_1.parseHttp('post', url, data);
	    };
	    /**
	     * put请求
	     * @param url
	     * @param data
	     */
	    Http.prototype.put = function (url, data) {
	        return parseHttp_1.parseHttp('put', url, data);
	    };
	    /**
	     * delete请求
	     * @param url
	     * @param data
	     */
	    Http.prototype.delete = function (url, data) {
	        return parseHttp_1.parseHttp('delete', url, data);
	    };
	    return Http;
	}());
	var http = new Http();
	exports.default = http;


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var util_1 = __webpack_require__(3);
	var $log = __webpack_require__(2);
	// 支持的类型
	var httpType = ['get', 'post', 'put', 'delete', 'head', 'options'];
	/**
	 * 解析http请求
	 * @param type 请求类型
	 * @param url
	 * @param data
	 */
	function parseHttp(type, url, data) {
	    if (util_1.default.type(type) != 'string' && !httpType.includes(type.toLowerCase())) {
	        $log.error('http请求类型必须为' + httpType + '中的一个');
	    }
	    if (util_1.default.type(url) != 'string') {
	        $log.error('http请求的url参数需为字符');
	    }
	    if (data && util_1.default.type(data) != 'object') {
	        $log.error('http请求的data参数需为对象');
	    }
	    var promise = new Promise(function (resolve, reject) {
	        var xhr = new XMLHttpRequest();
	        xhr.open(type, url);
	        xhr.onreadystatechange = handel;
	        xhr.responseType = 'json';
	        xhr.setRequestHeader('Accept', 'application/json');
	        xhr.send(data || null);
	        function handel() {
	            if (this.readyState != 4) {
	                return;
	            }
	            if (this.status == 200) {
	                resolve(this.response);
	            }
	            else {
	                reject(new Error(this.statusText));
	            }
	        }
	    });
	    return promise;
	}
	exports.parseHttp = parseHttp;


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var store_1 = __webpack_require__(26);
	var store = new store_1.default();
	var Router = /** @class */ (function () {
	    function Router(url, routers) {
	        this.url = url;
	        this.routers = this._parseRouters(routers);
	        this.nowRouter = this._getNowRouter(url, this.routers);
	        this.params = this.nowRouter ? (this.nowRouter.params ? this.nowRouter.params : {}) : {};
	    }
	    /**
	     * 获取当前路由
	     * @param url 浏览器pathname
	     * @param routers 路由集合
	     */
	    Router.prototype._getNowRouter = function (url, routers) {
	        if (url.includes('?')) {
	            url = url.substr(0, url.lastIndexOf('?'));
	        }
	        return routers.filter(function (v) {
	            return url.match(v.info.regexp);
	        })[0];
	    };
	    Router.prototype._parseRouters = function (routers) {
	        var _this = this;
	        routers.forEach(function (v) {
	            var r = _this._pathToReg(v.path);
	            if (r != null) {
	                v.info = r;
	                _this.params = v.params || {};
	            }
	        });
	        return routers;
	    };
	    /**
	     * 转换路径为正则
	     * @param path 路径
	     */
	    Router.prototype._pathToReg = function (path) {
	        var ret = {
	            originalPath: path,
	            regexp: path
	        }, keys = ret.keys = [];
	        path = path
	            .replace(/([().])/g, '\\$1')
	            .replace(/(\/)?:(\w+)(\*\?|[?*])?/g, function (_, slash, key, option) {
	            var optional = (option === '?' || option === '*?') ? '?' : null;
	            var star = (option === '*' || option === '*?') ? '*' : null;
	            keys.push({ name: key, optional: !!optional });
	            slash = slash || '';
	            return ''
	                + (optional ? '' : slash)
	                + '(?:'
	                + (optional ? slash : '')
	                + (star && '(.+?)' || '([^/]+)')
	                + (optional || '')
	                + ')'
	                + (optional || '');
	        })
	            .replace(/([/$*])/g, '\\$1');
	        ret.regexp = new RegExp('^' + path + '$', '');
	        return ret;
	    };
	    /**
	     * 跳转到已存在的路由页面
	     * @param path 需要跳转的路径
	     */
	    Router.prototype.go = function (_a) {
	        var _b = _a.path, path = _b === void 0 ? '' : _b, _c = _a.params, params = _c === void 0 ? {} : _c;
	        updateRouterConfig(path, params);
	        this.hash(path);
	    };
	    /**
	     * url的hash
	     * @param path
	     */
	    Router.prototype.hash = function (path) {
	        if (!path) {
	            return window.location.hash;
	        }
	        window.location.hash = '#' + path;
	    };
	    /**
	     * 刷新当前路由
	     */
	    Router.prototype.reflesh = function () {
	        var hash = window.location.hash;
	        window.location.hash = '#';
	        window.location.hash = hash;
	    };
	    /**
	     * 返回
	     */
	    Router.prototype.back = function () {
	        window.history.back();
	    };
	    return Router;
	}());
	exports.default = Router;
	// 更新路由配置
	function updateRouterConfig(path, params) {
	    store.get('routerConfig').forEach(function (v) {
	        if (v.path == path) {
	            v.params = params;
	        }
	    });
	    store.data('routerConfig', store.get('routerConfig'));
	}


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var loader_1 = __webpack_require__(27);
	var injector_1 = __webpack_require__(28);
	var loader = new loader_1.default();
	var inject = new injector_1.default();
	/**
	 * 数据存储解析服务
	 */
	var Store = /** @class */ (function () {
	    function Store(moduleName) {
	        if (moduleName === void 0) { moduleName = 'Cpage'; }
	        this.app = loader.module(moduleName, []);
	        this.ins = function () {
	            return inject.inject([moduleName]);
	        };
	    }
	    /**
	     * 存储数据
	     * @param key
	     * @param val
	     */
	    Store.prototype.data = function (key, val) {
	        this.app.data(key, val);
	    };
	    /**
	     * 是否有key这个变量
	     * @param key
	     */
	    Store.prototype.has = function (key) {
	        return this.ins().has(key);
	    };
	    /**
	     * 获取数据
	     * @param key
	     */
	    Store.prototype.get = function (key) {
	        return this.ins().get(key);
	    };
	    /**
	     * provider函数
	     * @param key
	     * @param obj { $get: function(){} }
	     */
	    Store.prototype.provider = function (key, obj) {
	        this.app.provider(key, obj);
	    };
	    /**
	     * factory函数
	     * @param key
	     * @param fn 需要返回值
	     */
	    Store.prototype.factory = function (key, fn) {
	        this.app.factory(key, fn);
	    };
	    /**
	     * service 函数
	     * @param key
	     * @param fn
	     */
	    Store.prototype.service = function (key, fn) {
	        this.app.service(key, fn);
	    };
	    return Store;
	}());
	exports.default = Store;


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var $log = __webpack_require__(2);
	var moduleNames = {};
	var Loader = /** @class */ (function () {
	    function Loader() {
	        this.modules = {
	            name: '',
	            requires: []
	        };
	    }
	    Loader.prototype.clear = function () {
	        this.modules = {};
	    };
	    /**
	     * 模块
	     * @param name 模块名称
	     * @param requires 模块的依赖项
	     * @param configFn 配置函数
	     */
	    Loader.prototype.module = function (name, requires, configFn) {
	        var modules = {};
	        if (requires) {
	            this.modules = this.$$set(name, requires, modules, configFn);
	        }
	        else {
	            this.modules = this.$$get(name, modules);
	        }
	        return this.modules;
	    };
	    /**
	     * 生成module
	     * @param name
	     * @param requires
	     * @param configFn
	     */
	    Loader.prototype.$$set = function (name, requires, modules, configFn) {
	        if (name == 'hasOwnProperty')
	            $log.error('hasOwnProperty不能用于键名');
	        var invokeQueue = [];
	        var configQueue = [];
	        /**
	         * 引用函数
	         * @param service 服务名称
	         * @param prefix data,provider
	         * @param arrProp 数组属性
	         * @param queue 引用队列
	         */
	        var invokeFn = function (service, prefix, arrProp, queue) {
	            if (arrProp === void 0) { arrProp = 'push'; }
	            if (queue === void 0) { queue = invokeQueue; }
	            return function () {
	                queue[arrProp]([service, prefix, arguments]);
	                return moduleObj;
	            };
	        };
	        var moduleObj = {
	            name: name,
	            requires: requires,
	            // data: (key, val)=>{
	            //     invokeQueue.unshift(['data', [key, val]]);
	            // },
	            // provider: (key, val)=>{
	            //     invokeQueue.push(['provider', [key, val]]);
	            // },
	            data: invokeFn('$provider', 'data', 'unshift'),
	            provider: invokeFn('$provider', 'provider'),
	            factory: invokeFn('$provider', 'factory'),
	            value: invokeFn('$provider', 'value'),
	            service: invokeFn('$provider', 'service'),
	            config: invokeFn('$injector', 'invoke', 'push', configQueue),
	            run: function (fn) {
	                moduleObj._runQueue.push(fn);
	                return moduleObj;
	            },
	            pipe: invokeFn('$pipeProvider', 'register'),
	            // directive: invokeFn('$compileProvider', 'directive'),
	            _invokeQueue: invokeQueue,
	            _configQueue: configQueue,
	            _runQueue: []
	        };
	        if (configFn) {
	            moduleObj.config(configFn);
	        }
	        this.modules = moduleNames[name] = moduleObj;
	        return moduleObj;
	    };
	    /**
	     * 根据name获取module
	     * @param name
	     * @param modules
	     */
	    Loader.prototype.$$get = function (name, modules) {
	        if (moduleNames.hasOwnProperty(name)) {
	            return moduleNames[name];
	        }
	        $log.error('名称为' + name + '的module不存在！');
	    };
	    return Loader;
	}());
	exports.default = Loader;


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var $log = __webpack_require__(2);
	var util_1 = __webpack_require__(3);
	var loader_1 = __webpack_require__(27);
	var loader = new loader_1.default();
	// 处理函数
	var FN_REG = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;
	// 处理空格
	var SPACE_REG = /^\s*(\S+)\s*$/;
	// 处理注释
	var COMMENTS_REG = /(\/\*.*?\*\/)|(\/\/$)/mg;
	var Injector = /** @class */ (function () {
	    function Injector() {
	    }
	    /**
	     * 模块注入函数
	     * @param moduleNames 模块名称
	     * @param strict 严格模式的判断，默认false
	     */
	    Injector.prototype.inject = function (moduleNames, strict) {
	        if (util_1.default.type(moduleNames) != 'array')
	            $log.error('模块的名称的参数为数组');
	        // 缓存data数据
	        var providerCache = { $injector: undefined, $provider: { data: undefined, provider: undefined } };
	        var providerInjecter = providerCache.$injector = injectAgency(providerCache, function () {
	            // $log.error('未知的provider'+JSON.stringify(depPath));
	        });
	        var dataCache = { $injector: undefined };
	        var dataInjecter = dataCache.$injector = injectAgency(dataCache, function (name) {
	            var provider = providerInjecter.get(name + 'Provider');
	            return dataInjecter.invoke(provider.$get, provider);
	        });
	        // 已经加载的模块
	        var loadedModules = new Map();
	        var cricle = false;
	        // provider依赖数组,[['数组名',['依赖项']]] [['a',['b']]]
	        var depPath = [];
	        // run 函数队列
	        var runQueue = [];
	        /**
	         * 处理函数的返回值
	         * @param fn
	         */
	        function handelReturn(fn) {
	            return function () {
	                var val = dataInjecter.invoke(fn);
	                if (util_1.default.type(val) == 'undefined') {
	                    $log.error('factory函数必须有返回值');
	                }
	                return val;
	            };
	        }
	        providerCache.$provider = {
	            data: function (key, val) {
	                if (key == 'hasOwnProperty' || key == '$injector' || key == '$provider')
	                    $log.error(key + '不能用于标识符');
	                dataCache[key] = val;
	                providerCache[key] = val;
	            },
	            provider: function (key, val) {
	                if (key == 'hasOwnProperty' || key == '$injector' || key == '$provider')
	                    $log.error(key + '不能用于标识符');
	                if (util_1.default.type(val) == 'function') {
	                    // val = instantiate(val);
	                    val = providerInjecter.instantiate(val);
	                }
	                providerCache[key + 'Provider'] = val;
	            },
	            factory: function (key, fn) {
	                this.provider(key, { $get: handelReturn(fn) });
	            },
	            value: function (key, val) {
	                this.factory(key, function () { return val; });
	            },
	            service: function (key, fn) {
	                this.factory(key, function () {
	                    return dataInjecter.instantiate(fn);
	                });
	            }
	        };
	        var listQueue = function (queues) {
	            queues.forEach(function (inq) {
	                var service = providerInjecter.get(inq[0]);
	                var method = inq[1];
	                var args = inq[2];
	                // const arr = [args[0], args[1]];
	                // providerCache.$provider[method].apply(providerCache.$provider, args);
	                service[method].apply(service, args);
	            });
	        };
	        moduleNames.forEach(function loadMobule(val) {
	            if (!loadedModules.get(val)) {
	                loadedModules.set(val, true);
	                if (util_1.default.type(val) == 'string') {
	                    var module_1 = loader.module(val);
	                    module_1.requires.forEach(loadMobule); // 递归其他的依赖模块
	                    listQueue(module_1._invokeQueue);
	                    listQueue(module_1._configQueue);
	                    runQueue = runQueue.concat(module_1._runQueue);
	                }
	                if (util_1.default.type(val) == 'function' || util_1.default.type(val) == 'array') {
	                    runQueue.push(providerInjecter.invoke(val));
	                }
	            }
	        });
	        //执行run函数队列
	        util_1.default.arrayCompact(runQueue).forEach(function (run) {
	            dataInjecter.invoke(run);
	        });
	        function injectAgency(cache, fn) {
	            /**
	             * 处理缓存
	             * @param name data或者provideer名称
	             */
	            function handelCache(name) {
	                handeldepPath(depPath);
	                if (cache.hasOwnProperty(name)) {
	                    return cache[name];
	                }
	                else {
	                    try {
	                        return (cache[name] = fn(name));
	                    }
	                    finally {
	                        if (cricle)
	                            delete cache[name];
	                    }
	                }
	            }
	            /**
	             * $inject内部的调用函数
	             * @param fn 注入的函数或数组
	             * @param obj 对象，fn为其属性
	             * @param local 用于覆盖$inject数组的item项
	             * @param name data或provider名称
	             */
	            function invoke(fn, obj, local, name) {
	                if (arguments.length == 1) {
	                    obj = null;
	                }
	                var args = annotate(fn, name).map(function (v) {
	                    if (util_1.default.type(v) == 'string')
	                        return (local && local.hasOwnProperty(v)) ? local[v] : handelCache(v);
	                    else
	                        $log.error('无效的标识符' + v + '，标识符应为字符串');
	                });
	                if (util_1.default.type(fn) == 'array') {
	                    fn = fn.slice(-1)[0];
	                }
	                return fn.apply(obj, args);
	            }
	            /**
	             * 实例化
	             * @param fn
	             * @param local
	             */
	            function instantiate(fn, local) {
	                var fn2 = util_1.default.type(fn) == 'array' ? fn.slice(-1)[0] : fn;
	                var instance = Object.create(fn2.prototype);
	                invoke(fn, instance, local);
	                return instance;
	            }
	            function hasKey(key) {
	                return dataCache.hasOwnProperty(key) || providerCache.hasOwnProperty(key + 'Provider');
	            }
	            return {
	                has: hasKey,
	                get: handelCache,
	                invoke: invoke,
	                annotate: annotate,
	                instantiate: instantiate
	            };
	        }
	        function handeldepPath(arr) {
	            if (arr.length) {
	                if (arr[arr.length - 1][1].includes(arr[0][0])) {
	                    var path = arr.map(function (v) {
	                        return v[0];
	                    });
	                    path.push(arr[0][0]);
	                    cricle = true;
	                    $log.error('发现循环依赖' + path.join('->'));
	                }
	            }
	        }
	        /**
	         * 装饰器函数
	         * @param fn 注入的函数
	         */
	        function annotate(fn, name) {
	            var arr = [];
	            if (util_1.default.type(fn) == 'array') {
	                if (fn.length)
	                    arr = fn.slice(0, fn.length - 1);
	                else
	                    arr = [];
	            }
	            if (util_1.default.type(fn) == 'function') {
	                if (strict) {
	                    $log.error('函数没有$inject属性，不能再严格模式下使用');
	                }
	                else if (fn.$inject) {
	                    arr = fn.$inject;
	                }
	                else {
	                    var fns = (fn.toString().replace(COMMENTS_REG, '')).match(FN_REG);
	                    arr = util_1.default.arrayCompact(fns[1].split(',')).map(function (a) {
	                        return a.match(SPACE_REG)[1];
	                    });
	                    if (name != null) {
	                        depPath.push([name, arr]);
	                    }
	                }
	            }
	            // console.log(arr)
	            return arr;
	        }
	        return dataInjecter;
	    };
	    return Injector;
	}());
	exports.default = Injector;


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var $log = __webpack_require__(2);
	var util_1 = __webpack_require__(3);
	/**
	 * 验证组件的状态
	 * @param component 组件
	 */
	function componentGuard(component) {
	    // 验证组件名称
	    if (!component.name) {
	        return;
	    }
	    if (component.name) {
	        if (util_1.default.type(component.name) != 'string')
	            $log.error('组件' + component.name + '的名称必须为字符串');
	    }
	    // 验证组件components属性
	    if (component.components) {
	        if (util_1.default.type(component.components) != 'array') {
	            $log.error('组件' + component.name + '的components属性应为数组！');
	        }
	    }
	    // 验证组件style属性
	    if (component.style) {
	        if (util_1.default.type(component.style) != 'string') {
	            $log.error('组件' + component.name + '的style属性应为字符！');
	        }
	    }
	    // 验证组件styleeId属性
	    if (component.styleId) {
	        if (util_1.default.type(component.styleId) != 'string') {
	            $log.error('组件' + component.name + '的styleId属性应为字符！');
	        }
	        if (document.querySelector(component.styleId) == undefined) {
	            $log.error('节点' + component.styleId + '不存在');
	        }
	    }
	    // 验证组件template属性
	    if (component.template) {
	        if (util_1.default.type(component.template) != 'string') {
	            $log.error('组件' + component.name + '的template属性应为字符！');
	        }
	    }
	    // 验证组件templateId属性
	    if (component.templateId) {
	        if (util_1.default.type(component.templateId) != 'string') {
	            $log.error('组件' + component.name + '的templateId属性应为字符！');
	        }
	        if (document.querySelector(component.templateId) == undefined) {
	            $log.error('节点' + component.templateId + '不存在');
	        }
	    }
	    // 验证组件data属性
	    if (component.data) {
	        if (util_1.default.type(component.data) != 'object') {
	            $log.error('组件' + component.name + '的data属性应为对象！');
	        }
	    }
	    // 验证组件props属性
	    if (component.props) {
	        if (util_1.default.type(component.props) != 'object') {
	            $log.error('组件' + component.name + '的props属性应为对象！');
	        }
	        // 验证type类型
	        Object.entries(component.props).forEach(function (v) {
	            if (util_1.default.type(v[1]['default']) != v[1]['type']) {
	                $log.error('组件' + component.name + 'props属性中元素' + v[0] + '的default值非' + v[1]['type'] + '类型！');
	            }
	        });
	    }
	    // 验证组件props方法
	    if (component.beforeRender) {
	        if (util_1.default.type(component.beforeRender) != 'function') {
	            $log.error('组件' + component.name + '的beforeRender属性应为函数！');
	        }
	    }
	    // 验证组件render方法
	    if (component.render) {
	        if (util_1.default.type(component.render) != 'function') {
	            $log.error('组件' + component.name + '的render属性应为函数！');
	        }
	    }
	    else {
	        return;
	    }
	}
	exports.default = componentGuard;


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = Object.setPrototypeOf ||
	        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var targetDom_1 = __webpack_require__(31);
	var nodeModel_1 = __webpack_require__(32);
	var eventModel_1 = __webpack_require__(33);
	var moveModel_1 = __webpack_require__(34);
	var statusModel_1 = __webpack_require__(35);
	var mixins_1 = __webpack_require__(5);
	// dom操作
	var DomAction = /** @class */ (function (_super) {
	    __extends(DomAction, _super);
	    function DomAction(selector) {
	        return _super.call(this, selector) || this;
	    }
	    return DomAction;
	}(targetDom_1.default));
	mixins_1.applyMixins(DomAction, [nodeModel_1.default, eventModel_1.default, moveModel_1.default, statusModel_1.default]);
	var Dom = function (selector) {
	    var dom = new DomAction(selector);
	    return dom;
	};
	exports.default = Dom;


/***/ }),
/* 31 */
/***/ (function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	/**
	 * 公共方法
	 */
	var targetDom = /** @class */ (function () {
	    function targetDom(selector) {
	        this.elements = document.querySelectorAll(selector);
	        this.els = this._getEles(this.elements);
	    }
	    targetDom.prototype._getEles = function (nodes) {
	        if (nodes && nodes.length) {
	            return nodes;
	        }
	    };
	    /**
	     * 遍历dom节点
	     * @param nodes 节点
	     * @param fn 回调函数 val, index
	     */
	    targetDom.prototype.each = function (nodes, fn) {
	        for (var i = 0; i < nodes.length; i++) {
	            fn(nodes[i], i);
	        }
	    };
	    return targetDom;
	}());
	exports.default = targetDom;


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = Object.setPrototypeOf ||
	        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var targetDom_1 = __webpack_require__(31);
	var util_1 = __webpack_require__(3);
	// 操作dom节点
	var nodeModel = /** @class */ (function (_super) {
	    __extends(nodeModel, _super);
	    function nodeModel(selector) {
	        return _super.call(this, selector) || this;
	    }
	    /**
	     * 设置，获取html
	     * @param str html值
	     */
	    nodeModel.prototype.html = function (str) {
	        if (str && util_1.default.type(str) != 'string') {
	            return;
	        }
	        if (!str) {
	            return this.els[0].innerHTML;
	        }
	        else {
	            this.each(this.els, function (val, index) {
	                val.innerHTML = str;
	            });
	            return this;
	        }
	    };
	    /**
	     * 设置，获取节点文本
	     * @param str 文本值
	     */
	    nodeModel.prototype.text = function (str) {
	        if (str && util_1.default.type(str) != 'string') {
	            return;
	        }
	        for (var _i = 0, _a = this.els; _i < _a.length; _i++) {
	            var i = _a[_i];
	            if (arguments.length == 0) {
	                return i.innerText || i.textContent;
	            }
	            else if (arguments.length == 1) {
	                if (i.innerText) {
	                    i.innerText = str;
	                }
	                else {
	                    i.textContent = str;
	                }
	            }
	        }
	        return this;
	    };
	    nodeModel.prototype.css = function (key, value) {
	        if (key && util_1.default.type(key) != 'string') {
	            return;
	        }
	        if (value && util_1.default.type(value) != 'string') {
	            return;
	        }
	        for (var _i = 0, _a = this.els; _i < _a.length; _i++) {
	            var i = _a[_i];
	            if (arguments.length == 1) {
	                return window.getComputedStyle(i, null)[key];
	            }
	            else if (arguments.length == 2) {
	                i.style[key] = value;
	                return this;
	            }
	        }
	    };
	    /**
	     * 获取，设置元素宽度
	     * @param str
	     */
	    nodeModel.prototype.width = function (str) {
	        if (str && util_1.default.type(str) != 'string') {
	            return;
	        }
	        for (var _i = 0, _a = this.els; _i < _a.length; _i++) {
	            var i = _a[_i];
	            if (str) {
	                i.style.width = str;
	            }
	            else {
	                return i.offsetWidth;
	            }
	        }
	        return this;
	    };
	    /**
	    * 获取，设置元素高度
	    * @param str
	    */
	    nodeModel.prototype.height = function (str) {
	        if (str && util_1.default.type(str) != 'string') {
	            return;
	        }
	        for (var _i = 0, _a = this.els; _i < _a.length; _i++) {
	            var i = _a[_i];
	            if (str) {
	                i.style.height = str;
	            }
	            else {
	                return i.offsetHeight;
	            }
	        }
	        return this;
	    };
	    /**
	     * 获取，设置节点的属性值
	     * @param attr 属性名
	     * @param value 属性值
	     */
	    nodeModel.prototype.attr = function (attr, value) {
	        if (util_1.default.type(attr) != 'string') {
	            return;
	        }
	        if (value && util_1.default.type(value) != 'string') {
	            return;
	        }
	        for (var _i = 0, _a = this.els; _i < _a.length; _i++) {
	            var i = _a[_i];
	            if (arguments.length == 1) {
	                if (i.hasAttribute(attr)) {
	                    return i.getAttribute(attr);
	                }
	            }
	            else if (arguments.length == 2) {
	                i.setAttribute(attr, value);
	                return this;
	            }
	        }
	    };
	    /**
	     * 获取，设置节点的value值
	     * @param str value值
	     */
	    nodeModel.prototype.val = function (str) {
	        if (str && util_1.default.type(str) != 'string') {
	            return;
	        }
	        for (var _i = 0, _a = this.els; _i < _a.length; _i++) {
	            var i = _a[_i];
	            if (arguments.length == 1) {
	                var oldStr = i.getAttribute('value');
	                i.setAttribute(oldStr, str);
	            }
	            else if (arguments.length == 0) {
	                if (i.nodeName.match(/INPUT|TEXTAREA|SELECT|RADIO|CHECKBOX/)) {
	                    return i.value;
	                }
	                return i.getAttribute('value');
	            }
	        }
	        return this;
	    };
	    /**
	     * 给节点添加class
	     * @param name
	     */
	    nodeModel.prototype.addClass = function (name) {
	        if (name && util_1.default.type(name) != 'string') {
	            return;
	        }
	        for (var _i = 0, _a = this.els; _i < _a.length; _i++) {
	            var i = _a[_i];
	            i.classList.add(name);
	        }
	        return this;
	    };
	    /**
	     * 删除节点的class
	     * @param name
	     */
	    nodeModel.prototype.removeClass = function (name) {
	        if (name && util_1.default.type(name) != 'string') {
	            return;
	        }
	        for (var _i = 0, _a = this.els; _i < _a.length; _i++) {
	            var i = _a[_i];
	            i.classList.remove(name);
	        }
	        return this;
	    };
	    /**
	     * 切换class
	     */
	    nodeModel.prototype.toggleClass = function (name) {
	        if (name && util_1.default.type(name) != 'string') {
	            return;
	        }
	        for (var _i = 0, _a = this.els; _i < _a.length; _i++) {
	            var i = _a[_i];
	            if (i.classList.toggle(name)) {
	                return true;
	            }
	            else {
	                return false;
	            }
	        }
	    };
	    return nodeModel;
	}(targetDom_1.default));
	exports.default = nodeModel;


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = Object.setPrototypeOf ||
	        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var targetDom_1 = __webpack_require__(31);
	var util_1 = __webpack_require__(3);
	// 事件的操作
	var eventModel = /** @class */ (function (_super) {
	    __extends(eventModel, _super);
	    function eventModel(selector) {
	        return _super.call(this, selector) || this;
	    }
	    // 事件绑定
	    eventModel.prototype.on = function (eventType, fn) {
	        this.each(this.els, function (val, index) {
	            val.addEventListener(eventType, fn, false);
	        });
	    };
	    // 解除事件绑定
	    eventModel.prototype.off = function (eventType, fn) {
	        this.each(this.els, function (val, index) {
	            val.removeEventListener(eventType, fn, false);
	        });
	    };
	    // 鼠标移入移除
	    eventModel.prototype.hover = function (hover, out) {
	        for (var _i = 0, _a = this.els; _i < _a.length; _i++) {
	            var i = _a[_i];
	            if (util_1.default.type(hover) == 'function') {
	                i.addEventListener('mouseover', hover, false);
	            }
	            else {
	                throw new Error('hover方法：没有传递回调函数');
	            }
	            if (util_1.default.type(out) == 'function') {
	                i.addEventListener('mouseout', hover, false);
	            }
	        }
	        return this;
	    };
	    // 点击事件
	    eventModel.prototype.click = function (fn) {
	        for (var _i = 0, _a = this.els; _i < _a.length; _i++) {
	            var i = _a[_i];
	            if (util_1.default.type(fn) == 'function') {
	                i.addEventListener('click', fn, false);
	            }
	        }
	        return this;
	    };
	    //设置点击切换方法
	    eventModel.prototype.toggle = function () {
	        for (var _i = 0, _a = this.els; _i < _a.length; _i++) {
	            var i = _a[_i];
	            (function (element, args) {
	                var count = 0;
	                element.addEventListener('click', function () {
	                    args[count++ % args.length].call(this);
	                }, false);
	            })(i, arguments);
	        }
	        return this;
	    };
	    //窗口滚动事件
	    eventModel.prototype.scroll = function (fn) {
	        for (var _i = 0, _a = this.els; _i < _a.length; _i++) {
	            var i = _a[_i];
	            if (util_1.default.type(fn) == 'function') {
	                i.addEventListener('scroll', fn, false);
	            }
	        }
	        return this;
	    };
	    eventModel.prototype.resize = function (fn) {
	        for (var _i = 0, _a = this.els; _i < _a.length; _i++) {
	            var i = _a[_i];
	            var offsetLeft = i.offsetLeft;
	            var offsetWidth = i.offsetWidth;
	            var offsetTop = i.offsetTop;
	            var offsetHeight = i.offsetHeight;
	            window.onresize = function () {
	                fn();
	                if (offsetLeft >= util_1.default.page().width - offsetWidth) {
	                    offsetLeft = util_1.default.page().width - offsetWidth;
	                }
	                if (offsetTop >= util_1.default.page().height - offsetHeight) {
	                    offsetTop = util_1.default.page().height - offsetHeight;
	                }
	            };
	        }
	        return this;
	    };
	    return eventModel;
	}(targetDom_1.default));
	exports.default = eventModel;


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = Object.setPrototypeOf ||
	        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var targetDom_1 = __webpack_require__(31);
	var moveModel = /** @class */ (function (_super) {
	    __extends(moveModel, _super);
	    function moveModel(selector) {
	        return _super.call(this, selector) || this;
	    }
	    moveModel.prototype.show = function (delay) {
	        if (delay && typeof delay == 'number') {
	            var _loop_1 = function (i) {
	                setTimeout(function () {
	                    i.style.display = 'none';
	                }, delay || 500);
	            };
	            for (var _i = 0, _a = this.els; _i < _a.length; _i++) {
	                var i = _a[_i];
	                _loop_1(i);
	            }
	        }
	        else if (!delay) {
	            for (var _b = 0, _c = this.els; _b < _c.length; _b++) {
	                var i = _c[_b];
	                i.style.display = 'block';
	            }
	        }
	        return this;
	    };
	    moveModel.prototype.hide = function (delay) {
	        if (delay && typeof delay == 'number') {
	            var _loop_2 = function (i) {
	                setTimeout(function () {
	                    i.style.display = 'block';
	                }, delay || 500);
	            };
	            for (var _i = 0, _a = this.els; _i < _a.length; _i++) {
	                var i = _a[_i];
	                _loop_2(i);
	            }
	        }
	        else if (!delay) {
	            for (var _b = 0, _c = this.els; _b < _c.length; _b++) {
	                var i = _c[_b];
	                i.style.display = 'none';
	            }
	        }
	        return this;
	    };
	    return moveModel;
	}(targetDom_1.default));
	exports.default = moveModel;


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = Object.setPrototypeOf ||
	        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var targetDom_1 = __webpack_require__(31);
	var util_1 = __webpack_require__(3);
	// 操作dom节点
	var statusModel = /** @class */ (function (_super) {
	    __extends(statusModel, _super);
	    function statusModel(selector) {
	        return _super.call(this, selector) || this;
	    }
	    // 判断节点是否拥有属性
	    statusModel.prototype.hasAttrs = function () {
	        for (var _i = 0, _a = this.els; _i < _a.length; _i++) {
	            var i = _a[_i];
	            if (i.hasAttributes()) {
	                return true;
	            }
	            else {
	                return false;
	            }
	        }
	    };
	    /**
	     * 判断节点是否有某个属性
	     * @param attr 属性名
	     */
	    statusModel.prototype.hasAttr = function (attr) {
	        if (attr && util_1.default.type(attr) != 'string') {
	            return;
	        }
	        for (var _i = 0, _a = this.els; _i < _a.length; _i++) {
	            var i = _a[_i];
	            if (i.hasAttribute(attr)) {
	                return true;
	            }
	            else {
	                return false;
	            }
	        }
	    };
	    /**
	     * 判断节点是否有某个class
	     * @param name class名称
	     */
	    statusModel.prototype.hasClass = function (name) {
	        if (name && util_1.default.type(name) != 'string') {
	            return;
	        }
	        for (var _i = 0, _a = this.els; _i < _a.length; _i++) {
	            var i = _a[_i];
	            if (i.classList.contains(name)) {
	                return true;
	            }
	            else {
	                return false;
	            }
	        }
	    };
	    return statusModel;
	}(targetDom_1.default));
	exports.default = statusModel;


/***/ }),
/* 36 */
/***/ (function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var Cookie = {
	    // 判断cookie是否可用
	    support: function () {
	        if (!(document.cookie || navigator.cookieEnabled))
	            return false;
	        return true;
	    },
	    // 添加cookie
	    set: function (name, value, config) {
	        // config = {hours, path, domain, secure}
	        var data = name + "=" + encodeURIComponent(value);
	        console.log(123);
	        if (config && config.hours != undefined) {
	            var d = new Date();
	            d.setHours(d.getHours() + config.hours);
	            data += "; expires=" + d.toUTCString();
	        }
	        data += (config && config.path) ? ("; path=" + config.path) : "";
	        data += (config && config.domain) ? ("; domain=" + config.domain) : "";
	        data += (config && config.secure) ? ("; secure=" + config.secure) : "";
	        document.cookie = data;
	    },
	    // 查询 cookie
	    get: function (name) {
	        var len = arguments.length;
	        if (len == 0) {
	            var cs = document.cookie, arr = [], arr2 = [], obj = {};
	            arr = cs.split(';');
	            // console.log(arr);
	            for (var i = 0; i < arr.length; i++) {
	                var a = arr[i].split('=');
	                var a1 = [a[0].trim(), decodeURIComponent(a[1])];
	                arr2.push(a1);
	            }
	            return JSON.stringify(arr2);
	        }
	        else if (len == 1) {
	            var reg = eval("/(?:^|;\\s*)" + name + "=([^=]+)(?:;|$)/");
	            return reg.test(document.cookie) ? decodeURIComponent(RegExp.$1) : "";
	        }
	    },
	    // 删除 cookie
	    remove: function (name, path) {
	        if (arguments.length == 0) {
	            var all = this.get();
	            for (var i = 0; i < all.length; i++) {
	                this.set(all[i][0], "", -1);
	            }
	        }
	        this.set(name, path || '', { "hours": -1 });
	    }
	};
	exports.default = Cookie;


/***/ })
/******/ ])
});
;
//# sourceMappingURL=bundle.js.map