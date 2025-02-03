"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$pipeProvider = $pipeProvider;
var $log = require("../log");
var util_1 = require("../util");
/**
 * 执行管道过滤操作
 */
var Pipe = /** @class */ (function () {
    function Pipe() {
        this.pipes = {};
    }
    /**
     * 注册管道函数
     * @param name 字符串或者对象
     * @param factory
     */
    Pipe.prototype.register = function (name, factory) {
        // this.pipes = {};
        //允许对象方式注册多个pipe
        if (util_1.default.type(name) == 'object') {
            for (var i in name) {
                return this.register(i, name[i]);
            }
        }
        if (util_1.default.type(name) == 'string') {
            if (util_1.default.type(factory) != 'function')
                $log.error('注册的管道函数类型为function');
            var pipe = factory();
            this.pipes[name] = pipe;
            return pipe;
        }
    };
    /**
     * 管道执行函数
     * @param name
     */
    Pipe.prototype.pipe = function (name) {
        return this.pipes[name];
    };
    Pipe.prototype.returnPipes = function () {
        return this.pipes;
    };
    return Pipe;
}());
exports.default = Pipe;
// const pipe = new Pipe();
function $pipeProvider($provider) {
    var pipes = {};
    this.register = function (name, factory) {
        //允许对象方式注册多个pipe
        if (util_1.default.type(name) == 'object') {
            for (var i in name) {
                return this.register(i, name[i]);
            }
        }
        if (util_1.default.type(name) == 'string') {
            if (util_1.default.type(factory) != 'function')
                $log.error('注册的管道函数类型为function');
            return $provider.factory(name + 'Pipe', factory);
        }
    };
    this.$get = ['$injector', function ($injector) {
            return function (name) {
                return $injector.get(name + 'Pipe');
            };
        }];
}
$pipeProvider.$inject = ['$provider'];
