"use strict";
// 简单的日志打印
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = log;
exports.info = info;
exports.warn = warn;
exports.error = error;
function log(str) {
    console.log(str);
}
function info(str) {
    console.info(str);
}
function warn(str) {
    console.warn(str);
}
function error(str) {
    throw new Error(str);
}
