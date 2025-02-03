"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ast_config = exports.OPERATORS = exports.LETTER = exports.SPECIALS = void 0;
var ast_config = require("./ast_config");
exports.ast_config = ast_config;
var lexer_config_1 = require("./lexer_config");
Object.defineProperty(exports, "SPECIALS", { enumerable: true, get: function () { return lexer_config_1.SPECIALS; } });
Object.defineProperty(exports, "LETTER", { enumerable: true, get: function () { return lexer_config_1.LETTER; } });
Object.defineProperty(exports, "OPERATORS", { enumerable: true, get: function () { return lexer_config_1.OPERATORS; } });
