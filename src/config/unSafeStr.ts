//对象属性
const PROPERTY = ['constructor', '__proto__', '__defineGetter__', '__defineSetter__','__lookupGetter__','__loopupSetter__'];

//window对象
const WINDOW = ['document', 'alert', 'location', 'setInterval'];

//dom节点
const NODE =['nodeName', 'children'];

//函数
const FUN = [Function.prototype.call, Function.prototype.apply, Function.prototype.bind];

export { PROPERTY, WINDOW, NODE, FUN };