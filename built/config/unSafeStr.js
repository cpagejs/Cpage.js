"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FUN = exports.NODE = exports.WINDOW = exports.PROPERTY = void 0;
//对象属性
var PROPERTY = ['constructor', '__proto__', '__defineGetter__', '__defineSetter__', '__lookupGetter__', '__loopupSetter__'];
exports.PROPERTY = PROPERTY;
//window对象
var WINDOW = ['document', 'alert', 'location', 'setInterval', 'setTimeout'];
exports.WINDOW = WINDOW;
//dom节点
var NODE = ['nodeName', 'children'];
exports.NODE = NODE;
//函数
var FUN = [Function.prototype.call, Function.prototype.apply, Function.prototype.bind];
exports.FUN = FUN;
