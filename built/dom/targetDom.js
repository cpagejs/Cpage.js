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
