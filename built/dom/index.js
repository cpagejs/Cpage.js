"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var targetDom_1 = require("./targetDom");
var nodeModel_1 = require("./nodeModel");
var eventModel_1 = require("./eventModel");
var moveModel_1 = require("./moveModel");
var statusModel_1 = require("./statusModel");
var mixins_1 = require("../mixins");
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
