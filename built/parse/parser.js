"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var astBuilder_1 = require("./astBuilder");
var astCompile_1 = require("./astCompile");
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
