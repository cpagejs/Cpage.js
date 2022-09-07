"use strict";
// 简单的日志打印
Object.defineProperty(exports, "__esModule", { value: true });
exports.error = exports.warn = exports.info = exports.log = void 0;
function log(str) {
    console.log(str);
}
exports.log = log;
function info(str) {
    console.info(str);
}
exports.info = info;
function warn(str) {
    console.warn(str);
}
exports.warn = warn;
function error(str) {
    throw new Error(str);
}
exports.error = error;
