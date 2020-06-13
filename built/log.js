"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
