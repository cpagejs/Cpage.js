"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Component = void 0;
var $log = require("../log");
var util_1 = require("../util");
var render_1 = require("./render");
var componentGuard_1 = require("./componentGuard");
var store_1 = require("../store");
var store = new store_1.default();
store.data("componentList", []);
store.service("component", function () {
    this.ensureOneInvokeComponent = function (name, arr) {
        var res = {
            type: "yes",
            info: "",
        }, rootName = [], names = [];
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].name == name)
                rootName.push(name);
            names.push(arr[i].name);
        }
        if (rootName.length >= 2)
            res = {
                type: "no",
                info: "只能有一个根组件，却发现" + rootName.length + "个" + name + "根组件",
            };
        return res;
    };
});
var CPage = /** @class */ (function () {
    function CPage() {
        this.CList = [];
        this.id = 0;
        this.id = 0;
    }
    /**
     * es6模式，渲染组件
     * @param selector id选择符，如果是class，则取第一个节点
     * @param fn 根组件函数
     */
    CPage.bootstrap = function (selector, fn) {
        var rootComponent = {};
        function componetList(fn, isRoot) {
            if (isRoot === void 0) { isRoot = false; }
            var classToJson = util_1.default.classToJson(fn, isRoot);
            var componentJson = classToJson.componentJson;
            if (isRoot) {
                rootComponent = classToJson.rootComponent;
            }
            (0, componentGuard_1.default)(componentJson);
            store.data("componentList", store.get("componentList").push(componentJson));
            if (componentJson.components &&
                util_1.default.type(componentJson.components) == "array" &&
                componentJson.components.length) {
                componentJson.components.forEach(function (v) {
                    componetList(v);
                });
            }
        }
        componetList(fn, true);
        var r = new render_1.default(selector, rootComponent, store.get("componentList"));
        r.componentToDom();
    };
    /**
     * 路由
     * @param config 路由配置
     */
    CPage.router = function (config) {
        function check(str) {
            if (util_1.default.type(str) != "array") {
                $log.error("路由配置项需为数组形式");
            }
        }
        check(config);
        config.forEach(function (v) {
            var classToJson = util_1.default.classToJson(v.component, false);
            v.component = classToJson.componentJson;
        });
        store.data("routerConfig", config);
    };
    CPage.prototype.directive = function (name, fn) {
        var conf = fn();
        conf.id = this.id;
        this.CList.push(conf);
        this.id++;
        var guard = store
            .get("component")
            .ensureOneInvokeComponent(name, this.CList);
        if (guard.type == "no") {
            $log.error(guard.info);
        }
        return conf;
    };
    /**
     * es5模式获取组建信息
     * @param obj
     */
    CPage.prototype.component = function (obj) {
        (0, componentGuard_1.default)(obj);
        var componentInfo = util_1.default.deepClone(obj);
        Object.defineProperties(componentInfo, {
            isRoot: {
                value: false,
                writable: true,
            },
            $el: {
                value: undefined,
                writable: true,
            },
            $props: {
                value: {},
                writable: true,
            },
        });
        return this.directive(obj.name, function () {
            return componentInfo;
        });
    };
    /**
     * es5模式，将组件渲染到dom
     * @param selector id选择符，如果是class，则取第一个节点
     * @param root 根组件信息
     */
    CPage.prototype.bootstrap = function (selector, root) {
        if (util_1.default.type(selector) != "string") {
            $log.error(selector + "应为字符串");
        }
        if (!document.querySelector(selector)) {
            $log.error("节点“" + selector + "”不存在");
        }
        if (util_1.default.type(root) != "object") {
            $log.error(root + "应为json对象");
        }
        if (arguments.length == 2) {
            (0, componentGuard_1.default)(root);
            if (!root.name) {
                $log.error("找不到根组件的name属性");
            }
            store.data("rootComponent", root.name);
            var r = new render_1.default(selector, root, this.CList);
            r.componentToDom();
        }
    };
    CPage.version = "1.2.5";
    return CPage;
}());
exports.default = CPage;
/**
 * es6模式构建组件
 */
var Component = /** @class */ (function () {
    function Component() {
        this.components = [];
        this.name = "";
        this.template = "";
        this.templateUrl = "";
        this.style = "";
        this.styleUrl = "";
        this.data = {};
        this.props = {};
    }
    Component.prototype.render = function () {
        $log.error("render方法必须被继承");
    };
    return Component;
}());
exports.Component = Component;
