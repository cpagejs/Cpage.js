"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
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
exports.util = void 0;
var mixins_1 = require("../mixins");
var handelType_1 = require("./handelType");
var handelCoding_1 = require("./handelCoding");
var $log = require("../log");
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
     * 获取当前时间 20190516
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
            componentJson: componentJson,
            rootComponent: rootComponent
        };
    };
    /**
     * 延迟加载
     * @param delay 延迟时间
     */
    util.prototype.sleep = function () {
        return __awaiter(this, arguments, void 0, function (delay) {
            if (delay === void 0) { delay = 0; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, delay); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 判断元素是否为null或者undefined
     * @param ele
     */
    util.prototype.isNil = function (ele) {
        return ele === undefined || ele === null;
    };
    return util;
}());
exports.util = util;
(0, mixins_1.applyMixins)(util, [handelType_1.default, handelCoding_1.default]);
