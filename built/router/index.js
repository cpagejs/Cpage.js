"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var store_1 = require("../store");
var $log = require("../log");
var store = new store_1.default();
// 后续支持history路由
var Router = /** @class */ (function () {
    function Router(url, routers) {
        this.url = url;
        this.routers = this._parseRouters(routers);
        this.nowRouter = this._getNowRouter(url, this.routers);
        this.params = this.nowRouter
            ? this.nowRouter.params
                ? this.nowRouter.params
                : {}
            : {};
    }
    /**
     * 获取当前路由
     * @param url 浏览器pathname
     * @param routers 路由集合
     */
    Router.prototype._getNowRouter = function (url, routers) {
        if (url.includes("?")) {
            url = url.substr(0, url.lastIndexOf("?"));
        }
        return routers.filter(function (v) {
            return url.match(v.info.regexp);
        })[0];
    };
    Router.prototype._parseRouters = function (routers) {
        var _this = this;
        routers.forEach(function (v) {
            var r = _this._pathToReg(v.path);
            if (r != null) {
                v.info = r;
                _this.params = v.params || {};
            }
        });
        return routers;
    };
    /**
     * 转换路径为正则
     * @param path 路径
     */
    Router.prototype._pathToReg = function (path) {
        var ret = {
            originalPath: path,
            regexp: path,
        }, keys = (ret.keys = []);
        path = path
            .replace(/([().])/g, "\\$1")
            .replace(/(\/)?:(\w+)(\*\?|[?*])?/g, function (_, slash, key, option) {
            var optional = option === "?" || option === "*?" ? "?" : null;
            var star = option === "*" || option === "*?" ? "*" : null;
            keys.push({ name: key, optional: !!optional });
            slash = slash || "";
            return ("" +
                (optional ? "" : slash) +
                "(?:" +
                (optional ? slash : "") +
                ((star && "(.+?)") || "([^/]+)") +
                (optional || "") +
                ")" +
                (optional || ""));
        })
            .replace(/([/$*])/g, "\\$1");
        ret.regexp = new RegExp("^" + path + "$", "");
        return ret;
    };
    /**
     * 跳转到已存在的路由页面
     * @param path 需要跳转的路径
     */
    Router.prototype.go = function (_a) {
        var _b = _a.path, path = _b === void 0 ? "" : _b, _c = _a.params, params = _c === void 0 ? {} : _c;
        updateRouterConfig(path, params);
        this.hash(path);
    };
    /**
     * url的hash
     * @param path
     */
    Router.prototype.hash = function (path) {
        if (!path) {
            return window.location.hash;
        }
        window.location.hash = "#" + path;
    };
    /**
     * 跳转到新路由
     * @param path 路由路径
     */
    Router.prototype.push = function (path) {
        if (path) {
            window.location.hash = "#" + path;
        }
        else {
            $log.error("路由跳转路径不能为空");
        }
    };
    /**
     * 刷新当前路由
     */
    Router.prototype.reflesh = function () {
        var hash = window.location.hash;
        window.location.hash = "#";
        window.location.hash = hash;
    };
    /**
     * 返回
     */
    Router.prototype.back = function () {
        window.history.back();
    };
    return Router;
}());
exports.default = Router;
// 更新路由配置
function updateRouterConfig(path, params) {
    store.get("routerConfig").forEach(function (v) {
        if (v.path == path) {
            v.params = params;
        }
    });
    store.data("routerConfig", store.get("routerConfig"));
}
