"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
var $log = require("../log");
var util_1 = require("../util");
var dom_1 = require("../dom/dom");
var parseTpl_1 = require("./parseTpl");
var HandelData_1 = require("./HandelData");
var HandelEventer_1 = require("../util/HandelEventer");
var HandelEvent_1 = require("./HandelEvent");
var index_1 = require("../parse/index");
var http_1 = require("../http");
var router_1 = require("../router");
var store_1 = require("../store");
var store = new store_1.default();
var isNil = util_1.default.isNil;
var PREFIX_DIRECTIVE = /(x[\:\-_]|data[\:\-_])/i;
var ID = 'c-data-id';
var renderComponents = /** @class */ (function () {
    function renderComponents(selector, root, CList) {
        this.selector = selector;
        this.root = root;
        this.CList = CList;
        this.CObj = this.listToObj(CList);
        this.eventList = [];
        this.cRefList = [];
        this.cShowList = [];
        this.cIfList = [];
        this.ifTpl = {};
        this.cHtmlList = [];
        this.cForList = [];
        this.cRepeatList = [];
        this.cViewList = [];
        this.dataId = parseInt(util_1.default.now());
        this.componentToken = [];
        this.componentNames = this.getComponentNameList();
        this.componentAttrs = {};
        this.templateId = {};
        this.oneRootComponent = 1;
        this.$router = undefined;
        this.$routerCache = {};
    }
    /**
     * 组件渲染到dom节点
     */
    renderComponents.prototype.componentToDom = function () {
        return __awaiter(this, void 0, void 0, function () {
            function handelComponent() {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, invokeLooopNodes()];
                            case 1:
                                _a.sent();
                                return [4 /*yield*/, invokeLoopComponents()];
                            case 2:
                                _a.sent();
                                return [4 /*yield*/, invokeRouter()];
                            case 3:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                });
            }
            // 遍历节点
            function invokeLooopNodes() {
                node = self.loopNodes(self.root.name, dom_1.default.create(rootTpl), components);
            }
            // 遍历组件
            function invokeLoopComponents() {
                self.root.template = node[0].outerHTML;
                self.root.isRoot = true;
                self.templateId[node[0].getAttribute(ID)] = node[0].outerHTML;
                self.loopComponents(components, self.root.components, self.root.name, self.root.data);
            }
            // 处理路由
            function invokeRouter() {
                if (store.has('routerConfig')) {
                    handelRouter();
                }
                function handelRouter() {
                    setTimeout(function () {
                        if (window.document.readyState == "complete") {
                            var hash = window.location.hash;
                            if (hash == '') { // 处理默认首页， path="/"
                                var index = pathIndex();
                                if (util_1.default.type(index) == 'object') {
                                    handelView(index);
                                }
                            }
                            else {
                                var r = getNowRouter(hash.substr(1));
                                if (r != undefined) {
                                    handelView(r);
                                }
                            }
                        }
                        window.addEventListener('hashchange', function (data) {
                            var nowPath = '';
                            if (data.newURL.includes('/#')) {
                                nowPath = data.newURL.split('/#')[1];
                            }
                            var r = getNowRouter(nowPath);
                            if (!isNil(r)) {
                                handelView(r);
                            }
                        }, false);
                        function handelView(obj) {
                            var name = obj.component.name;
                            var delay = obj.delay || 0;
                            setTimeout(function () {
                                self.cViewList.forEach(function (v) {
                                    if (!dom_1.default.q(v.ele))
                                        return;
                                    v.beforeDestory && v.beforeDestory();
                                    if (obj.cache && self.$routerCache.hasOwnProperty(name)) {
                                        dom_1.default.q(v.ele).innerHTML = self.$routerCache[name];
                                        self.handelEventListener(self.CObj[name], dom_1.default.q(v.ele).firstChild);
                                    }
                                    else {
                                        dom_1.default.q(v.ele).innerHTML = '';
                                        dom_1.default.q(v.ele).insertAdjacentHTML('afterbegin', '<' + util_1.default._cameCase(name) + '></' + util_1.default._cameCase(name) + '>');
                                        self.loopNodes(name, dom_1.default.q(v.ele).childNodes, []);
                                        self.loopComponents([self.CObj[name]], [], v.which, self.CObj[v.which].data || {});
                                        setTimeout(function () {
                                            self.$routerCache[name] = dom_1.default.q(util_1.default._cameCase(name)).outerHTML;
                                        }, 0);
                                    }
                                });
                            }, delay);
                        }
                    }, 0);
                }
            }
            // 获取当前路由
            function getNowRouter(path) {
                var router = new router_1.default(path, store.get('routerConfig'));
                self.$router = router;
                return router.nowRouter;
            }
            // 默认路径
            function pathIndex() {
                var obj = undefined;
                store.get('routerConfig').forEach(function (v) {
                    if (v.path == '/') {
                        obj = v;
                    }
                });
                return obj;
            }
            var self, node, components, rootTpl;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        self = this, components = [], rootTpl = dom_1.default.wrapDom(this.theTpl(this.root), util_1.default._cameCase(this.root.name).toLowerCase());
                        return [4 /*yield*/, handelComponent()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 组件的template, templateId, templateUrl
     * @param component 组件
     */
    renderComponents.prototype.theTpl = function (component) {
        // hasHtmlUrl, webpack打包需要引入html-loader
        return (component.template ? component.template.trim() : undefined) || dom_1.default.hasHtml(component.templateId) || dom_1.default.hasHtmlUrl(component.templateUrl);
    };
    /**
     * 组件的style, styleId, styleUrl
     * @param component 组件
     */
    renderComponents.prototype.theStyle = function (component) {
        // component.style
        function handelString(str) {
            if (str != undefined) {
                return {
                    type: 'string',
                    result: str
                };
            }
            return false;
        }
        // component.styleId
        function handelId(id) {
            if (!isNil(dom_1.default.q(id))) {
                return {
                    type: 'id',
                    result: id
                };
            }
            return false;
        }
        // component.styleUrl, webpack打包需要引入css-loader
        function handelUrl(url) {
            if (url != undefined) {
                // 针对import * as css from '';
                if (util_1.default.type(url) === 'object') {
                    url = url[0][1];
                }
                // 针对require('../xx.css')
                if (util_1.default.type(url) === 'array') {
                    url = url[1];
                }
                return {
                    type: 'url',
                    result: url
                };
            }
            return false;
        }
        return handelString(component.style) || handelId(component.styleId) || handelUrl(component.styleUrl);
    };
    /**
     * 遍历dom节点
     * @param name 组件名称
     * @param node dom节点
     * @param components 组件列表
     */
    renderComponents.prototype.loopNodes = function (name, node, components) {
        var _this = this;
        for (var i = 0; i < node.length; i++) {
            if (node[i] && node[i].nodeType === 1) {
                node[i].setAttribute("c-data-id", this.dataId);
                var cs = this.getComponent(node[i], name);
                cs.forEach(function (v) {
                    if (components) {
                        components.push(util_1.default.deepClone(util_1.default.extend(_this.CObj[v], { token: _this.dataId })));
                        // components.push(Util.extend(this.CObj[v], {token: this.dataId}));
                    }
                });
                this.dataId++;
                // 添加eventList, cShowList...等集合
                this.addDirectiveList(name, node[i]);
                if (node[i].childNodes && node[i].childNodes.length) {
                    this.loopNodes(name, node[i].childNodes, components);
                }
            }
        }
        return node;
    };
    /**
     * 添加eventList, cShowList...等集合
     * @param name 组件名称
     * @param node 节点
     */
    renderComponents.prototype.addDirectiveList = function (name, node) {
        for (var j = 0, len = node.attributes; j < len.length; j++) {
            var attrName = this.normalizeDirective(len[j].name);
            if (attrName.match(/^cClick|cDbclick|cMouseover|cMousedown|cMouseup|cMousemove|cMouseout|cMouseleave|cBlur|cFocus|cChange|cInput|cDrag|cDragend|cDragenter|cDragleave|cDragover|cDragstart|cDrop|cFocus|cKeydown|cKeypress|cKeyup|cScroll|cSelect|cSubmit|cToggle|cResize|cWaiting|cProgress|cLoadstart|cDurationchange|cLoadedmetadata|cLoadeddata|cCanplay|cCanplaythrough|cPlay|cPause|cRef|cShow|cIf|cHtml|cFor|cRepeat|cView$/g)) {
                switch (attrName) {
                    case 'cRef':
                        this.cRefList.push({
                            which: name,
                            type: len[j].name.split('-')[1],
                            fn: len[j].value,
                            ele: '[' + ID + '="' + node.getAttribute(ID) + '"]',
                            id: node.getAttribute(ID)
                        });
                        break;
                    case 'cShow':
                        this.cShowList.push({
                            which: name,
                            type: len[j].name.split('-')[1],
                            fn: len[j].value,
                            ele: '[' + ID + '="' + node.getAttribute(ID) + '"]',
                            id: node.getAttribute(ID),
                            directive: attrName
                        });
                        // 在组件渲染前面处理display
                        var displayStatus = dom_1.default.boolToDisplay(parseTpl_1.default(len[j].value, this.CObj[name].data, this.CObj[name].props));
                        node.style.display = displayStatus;
                        break;
                    case 'cIf':
                        this.cIfList.push({
                            which: name,
                            type: len[j].name.split('-')[1],
                            fn: len[j].value,
                            ele: '[' + ID + '="' + node.getAttribute(ID) + '"]',
                            id: node.getAttribute(ID),
                            directive: attrName,
                            html: node.outerHTML
                        });
                        var ifInfo = parseTpl_1.default(len[j].value, this.CObj[name].data, this.CObj[name].props);
                        if (ifInfo == 'true') {
                            node.style.display = 'none';
                        }
                        break;
                    case 'cHtml':
                        this.cHtmlList.push({
                            which: name,
                            type: len[j].name.split('-')[1],
                            fn: len[j].value,
                            ele: '[' + ID + '="' + node.getAttribute(ID) + '"]',
                            id: node.getAttribute(ID),
                            directive: attrName,
                            html: node.outerHTML
                        });
                        break;
                    case 'cFor':
                        this.cForList.push({
                            which: name,
                            type: len[j].name.split('-')[1],
                            fn: len[j].value,
                            ele: '[' + ID + '="' + node.getAttribute(ID) + '"]',
                            id: node.getAttribute(ID),
                            html: node.innerHTML
                        });
                        break;
                    case 'cRepeat':
                        this.cRepeatList.push({
                            which: name,
                            type: len[j].name.split('-')[1],
                            fn: len[j].value,
                            ele: '[' + ID + '="' + node.getAttribute(ID) + '"]',
                            id: node.getAttribute(ID)
                        });
                        break;
                    case 'cView':
                        this.cViewList.push({
                            which: name,
                            type: len[j].name.split('-')[1],
                            fn: len[j].value,
                            ele: '[' + ID + '="' + node.getAttribute(ID) + '"]',
                            id: node.getAttribute(ID)
                        });
                        break;
                    default:
                        this.eventList.push({
                            which: name,
                            type: len[j].name.split('-')[1],
                            fn: len[j].value,
                            ele: '[' + ID + '="' + node.getAttribute(ID) + '"]',
                            id: node.getAttribute(ID)
                        });
                        break;
                }
            }
        }
    };
    /**
     * 遍历组件
     * @param components 模板中的组件集合
     * @param componentArr 注入的组件集合
     * @param componentName 父组件名称
     * @param fatherData 父组件data数据
     */
    renderComponents.prototype.loopComponents = function (components, componentArr, componentName, fatherData) {
        var _this = this;
        if (components.length && componentArr === undefined) {
            $log.error('找不到组件为' + componentName + '的components属性');
        }
        var self = this;
        components.forEach(function (v) { return __awaiter(_this, void 0, void 0, function () {
            function handelCC() {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, self.handelBeforeRender(v)];
                            case 1:
                                _a.sent(); //在组建渲染之前执行
                                return [4 /*yield*/, self.handelAfterRender(v)];
                            case 2:
                                _a.sent(); //在组件渲染之后执行
                                return [4 /*yield*/, self.handelDataChange(v)];
                            case 3:
                                _a.sent(); // 监听data数据改变
                                return [2 /*return*/];
                        }
                    });
                });
            }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (v === undefined)
                            return [2 /*return*/];
                        // “模板中的组件” 与 “注入的组件” 对比
                        // this.compareChildComponentAndInjectComponents(v.name, componentArr);
                        // 给组件赋能
                        v.$data = HandelData_1.default.$data;
                        v.$http = http_1.default;
                        v.$event = HandelEvent_1.default;
                        v.$router = self.$router;
                        return [4 /*yield*/, handelCC()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    };
    /**
     * 在组建渲染之前执行
     * @param v 组件
     */
    renderComponents.prototype.handelBeforeRender = function (v) {
        if (v.beforeRender) {
            v.$el = undefined;
            v.$refs = undefined;
            v.componentStatus = 'beforeRender';
            v.beforeRender();
        }
    };
    /**
     * 在组件渲染之后执行
     * @param status handelBeforeRender()的返回值
     * @param v 组件
     */
    renderComponents.prototype.handelAfterRender = function (v) {
        return __awaiter(this, void 0, void 0, function () {
            function invokeAfterRender() {
                return __awaiter(this, void 0, void 0, function () {
                    var step1, step2, step3, step4, step5, step6;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, addStyle()];
                            case 1:
                                step1 = _a.sent();
                                return [4 /*yield*/, renderOnce(step1)];
                            case 2:
                                step2 = _a.sent();
                                return [4 /*yield*/, handelCforDirective(step2)];
                            case 3:
                                step3 = _a.sent();
                                return [4 /*yield*/, handelOtherDirective(step3)];
                            case 4:
                                step4 = _a.sent();
                                return [4 /*yield*/, handelRenderFn(step4)];
                            case 5:
                                step5 = _a.sent();
                                return [4 /*yield*/, loopChildComponent(step5)];
                            case 6:
                                step6 = _a.sent();
                                return [4 /*yield*/, handelClickDirective(step6)];
                            case 7:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                });
            }
            function addStyle() {
                // head添加style
                dom_1.default.addStyle(self.theStyle(v), v);
                return 'done';
            }
            function renderOnce(status) {
                return __awaiter(this, void 0, void 0, function () {
                    var node, dom, newNode, dataId, newProps;
                    return __generator(this, function (_a) {
                        if (status !== 'done') {
                            return [2 /*return*/];
                        }
                        // 根组件单独渲染
                        if (v.name === self.root.name) {
                            if (self.oneRootComponent === 2) {
                                $log.error('根组件' + self.root.name + '只能有一个');
                            }
                            dom = dom_1.default.q(self.selector);
                            if (dom === undefined) {
                                $log.error('节点' + self.selector + '不存在');
                            }
                            dom.innerHTML = parseTpl_1.default(self.theTpl(self.root), self.root.data, {});
                            node = dom_1.default.q('[' + ID + '="' + v.token + '"]');
                            self.oneRootComponent++;
                        }
                        else { // 其他组件
                            newNode = self.loopNodes(v.name, dom_1.default.create(self.theTpl(self.CObj[v.name])));
                            dataId = dom_1.default.q(v.name) && parseInt(dom_1.default.q(v.name).getAttribute(ID));
                            if (!v.token) {
                                v.token = dataId;
                            }
                            node = dom_1.default.q('[' + ID + '="' + v.token + '"]');
                            if (v.token && !node) {
                                node = dom_1.default.q('[' + ID + '="' + dataId + '"]');
                            }
                            if (node) {
                                self.templateId[v.token] = newNode[0].outerHTML;
                                newProps = dom_1.default.combineAttrAndProps(self.componentAttrs[v.token], self.CObj[v.name].props);
                                node.innerHTML = self.getChangedData(newNode[0].outerHTML, self.CObj[v.name].data, newProps);
                            }
                            else {
                                console.log(v.name + '组件中token不存在', v);
                            }
                        }
                        return [2 /*return*/, node];
                    });
                });
            }
            function handelCforDirective(node) {
                // 处理c-for
                self.loopCforToDom(self.cForList, v);
                return node;
            }
            function handelOtherDirective(node) {
                // 处理c-if
                self.loopIfToDom(self.cIfList, v);
                // 处理c-html
                self.loopHtmlToDom(self.cHtmlList, v);
                return node;
            }
            function handelRenderFn(node) {
                v.$el = node;
                // 处理c-ref
                v.$refs = {};
                var currentRefs = self.cRefList.filter(function (rfs) {
                    return rfs.which == v.name;
                });
                currentRefs.forEach(function (r) {
                    v.$refs[r.fn] = dom_1.default.q(r.ele);
                });
                v.componentStatus = 'afterRender';
                v.render();
                return node;
            }
            function loopChildComponent(node) {
                // 遍历组件子节点
                if (v.name !== self.root.name && node) {
                    var arr = self.findComponent(node.firstChild);
                    if (arr.length) {
                        if (v.name) {
                            // self.loopComponents(arr, v.data, Util.deepClone(v.components), v.name)
                            self.loopComponents(arr, v.components, v.name, v.data);
                        }
                    }
                }
                return node;
            }
            function handelClickDirective(node) {
                //绑定事件
                self.handelEventListener(v, node);
            }
            var self;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        self = this;
                        if (!v.render) return [3 /*break*/, 2];
                        return [4 /*yield*/, invokeAfterRender()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * “模板中的组件” 与 “注入的组件” 对比
     * @param child 模板中的单个组件
     * @param arr 注入的组件集合
     */
    renderComponents.prototype.compareChildComponentAndInjectComponents = function (child, arr) {
        var self = this, flag = false;
        if (child === this.root.name) { //判断是否为根组件
            flag = true;
        }
        else if (!arr.length && child !== this.root.name) { //普通组件，有组件标识但components为空
            flag = false;
        }
        else { //普通组件，有组件标识但components不为空
            flag = arr.some(function (v) {
                if (v.name) {
                    return child !== self.root.name && child === v.name;
                }
            });
        }
        if (!flag)
            $log.error('名称为' + child + '的组件未找到');
    };
    /**
     * 组件渲染后的事件绑定
     * @param v 组件对象
     * @param node 节点
     */
    renderComponents.prototype.handelEventListener = function (v, node) {
        // 获取当前组件的事件集合
        var attrArr = dom_1.default.getAttr(ID, node);
        var newAttrArr = this.array_intersection(attrArr, this.eventList);
        // 事件绑定处理
        if (newAttrArr.length) {
            var arr = newAttrArr.filter(function (ev) {
                return ev.which === v.name;
            });
            arr.forEach(function (val) {
                var e_1, _a;
                if (document.querySelectorAll(val.ele)) {
                    try {
                        try {
                            for (var _b = __values(document.querySelectorAll(val.ele)), _c = _b.next(); !_c.done; _c = _b.next()) {
                                var dq = _c.value;
                                dq.addEventListener(val.type, function (event) {
                                    try {
                                        // console.log(val.fn.toString().match(/\(\)$/))
                                        // if(val.fn.toString().match(/\(\)$/)){
                                        //     if(v.hasOwnProperty(val.fn.toString().split('()')[0])){
                                        //         parse.parse(val.fn)(v, { $event: event });
                                        //     }else{
                                        //         $log.error('组件' + v.name + '中不存在方法'+val.fn);
                                        //     }
                                        // }else{
                                        //     $log.error('组件' + v.name + '中方法'+val.fn+'语法错误');
                                        // }
                                        // console.log(val.fn, v);
                                        index_1.default.parse(val.fn)(v, { $event: event });
                                    }
                                    catch (e) {
                                        console.log(e);
                                    }
                                }, false);
                            }
                        }
                        catch (e_1_1) { e_1 = { error: e_1_1 }; }
                        finally {
                            try {
                                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                            }
                            finally { if (e_1) throw e_1.error; }
                        }
                    }
                    catch (e) {
                        $log.error(e);
                    }
                }
                else {
                    $log.error('属性为' + val.ele + '的节点不存在！');
                }
            });
        }
    };
    /**
     * 监听data数据改变
     * @param v 组件对象
     */
    renderComponents.prototype.handelDataChange = function (v, type) {
        var _this = this;
        var _loop_1 = function (i) {
            HandelEventer_1.default.listen(i, function (info) {
                //只处理当前组件的属性改变
                if (info.target === v.token && JSON.stringify(info.oldVal) !== JSON.stringify(info.newVal)) {
                    // 执行组件更新前函数
                    v.beforeUpdate && v.beforeUpdate(info.oldVal, info.newVal, i);
                    // 获取组件原始的tpl，将其转为dom
                    var parseNode = dom_1.default.create(_this.templateId[v.token]);
                    var dataPos = _this.dataPosition(i, parseNode, v.name);
                    // 在dom渲染之前执行，更新data数据
                    _this.updateData(i, info);
                    if (dom_1.default.q(util_1.default._cameCase(v.name))) {
                        // data数据改变重新渲染对象的节点
                        _this.dataChangeToDom(parseNode, dataPos, info, v.name);
                        // 执行组件更新后函数
                        v.afterUpdate && v.afterUpdate(info.oldVal, info.newVal, i);
                    }
                }
            });
        };
        for (var i in v.data) {
            _loop_1(i);
        }
    };
    /**
     * 在dom渲染之前执行，更新data数据
     * @param key data的key
     * @param info 更改的信息
     */
    renderComponents.prototype.updateData = function (key, info) {
        // 所属组件
        var component = info.which;
        this.CObj[component].data[key] = info.newVal;
    };
    /**
     * data数据改变重新渲染对象的节点
     * @param parseNode 原始的dom节点
     * @param dataPos 改变的数据集合
     * @param info data的变化信息
     * @param component 所属组件
     */
    renderComponents.prototype.dataChangeToDom = function (parseNode, dataPos, info, component) {
        // 文本类型
        this.loopTextToDom(parseNode, dataPos, info, component);
        // 属性类型
        this.loopAttrToDom(dataPos, info, component);
    };
    /**
     * 文本改变渲染对应的dom节点
     * @param parseNode 编译的节点
     * @param dataPos 改变的数据集合
     * @param info data的变化信息
     * @param component 所属组件
     */
    renderComponents.prototype.loopTextToDom = function (parseNode, dataPos, info, component) {
        var textData = dataPos.filter(function (df) {
            return df.type == 'text';
        });
        if (textData.length) {
            textData.forEach(function (dp) {
                var originNode = parseNode[0].parentNode.querySelector(dp.position).childNodes[dp.item].textContent;
                if (document.querySelector(dp.position)) {
                    document.querySelector(dp.position).childNodes[dp.item].textContent = parseTpl_1.default(originNode, info.new, info.props);
                }
            });
        }
    };
    /**
     * 属性改变渲染对应的dom节点
     * @param dataPos 改变的数据集合
     * @param info data的变化信息
     * @param component 所属组件
     */
    renderComponents.prototype.loopAttrToDom = function (dataPos, info, component) {
        var _this = this;
        var self = this;
        var attrData = dataPos.filter(function (df) {
            return df.type === 'attr';
        });
        if (attrData.length) {
            attrData.forEach(function (dp) {
                // 处理指令
                switch (dp.attr) {
                    case 'c-show':
                        var newAttr = dom_1.default.boolToDisplay(index_1.default.parse(dp.value)(info.new));
                        dom_1.default.q(dp.position).style.display = newAttr;
                        dom_1.default.attr(dp.position, 'c-show', newAttr === 'none' ? false : true);
                        break;
                    case 'c-if':
                        var dom = dom_1.default.q(dp.position);
                        if (dom) {
                            dom.setAttribute(dp.attr, info.newVal);
                        }
                        _this.handelIf(dp, _this.CObj[component]);
                        break;
                    case 'c-for':
                        _this.loopCforToDom(dataPos, _this.CObj[component], 'dataChange');
                        break;
                    default:
                        changeAttr(dp);
                }
                function changeAttr(dp) {
                    dom_1.default.q(dp.position).setAttribute(dp.attr, info.newVal);
                    // 更新componentAttrs
                    self.componentAttrs[dp.componentToken][dp.attr] = info.newVal;
                }
                //父组件的属性改变
                function handelComponent(dp) {
                    var childChangePos = self.dataPosition(dp.attr, dom_1.default.create(self.templateId[dp.componentToken]), component);
                    // 文本类型
                    var childChangePosText = childChangePos.filter(function (df) {
                        return df.type == 'text';
                    });
                    childChangePosText.forEach(function (chItem) {
                        var changedComponent = self.CObj[dp.componentName], changedOriginComponentProps = changedComponent.props, changedComponentData = changedComponent.data, changedPropKey = dp.attr, changedPropVal = self.componentAttrs[dp.componentToken][dp.attr], changedComponentProps = self.combineChangedProps(changedPropKey, changedPropVal, changedOriginComponentProps);
                        var changedOrginNode = dom_1.default.create(self.templateId[dp.componentToken]);
                        var changedOrginText = changedOrginNode[0].parentNode.querySelector(chItem.position).childNodes[chItem.item].textContent;
                        dom_1.default.q(chItem.position).childNodes[chItem.item].textContent = parseTpl_1.default(changedOrginText, changedComponentData, changedComponentProps);
                    });
                    // 属性类型
                    var childChangePosAttr = childChangePos.filter(function (df) {
                        return df.type == 'attr';
                    });
                    childChangePosAttr.forEach(function (chItem) {
                        // 父组件的attr值与子组件的props值进行联动
                        if (dp.attr === chItem.value) {
                            chItem.value = dp.value;
                        }
                        dom_1.default.q(chItem.position).setAttribute(chItem.attr, chItem.value);
                        // 更新componentAttrs
                        self.componentAttrs[chItem.componentToken][chItem.attr] = chItem.value;
                        self.componentAttrs[chItem.componentToken][chItem.attr] = chItem.value;
                        if (chItem.isComponent) {
                            handelComponent(chItem);
                        }
                    });
                }
                if (dp.isComponent) {
                    handelComponent(dp);
                }
            });
        }
    };
    /**
     * 处理c-for指令
     * @param arr c-for 集合
     * @param component 指令所在组件
     * @param reRender 再次渲染
     */
    renderComponents.prototype.loopCforToDom = function (arr, component, reRender) {
        var _this = this;
        var currentRepeat = arr.filter(function (rVal) {
            return rVal.which == component.name;
        });
        // console.log('loopCforToDom', arr, component);
        var self = this;
        currentRepeat.forEach(function (re) {
            // 解析指令，获取重复次数
            var match2 = re.fn.match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)\s*$/);
            if (!match2) {
                $log.error('c-for格式有误');
            }
            var itemsExp = match2[2];
            var items = _this.inComponent(itemsExp, component);
            if (items && util_1.default.type(items) === 'array' && items.length) {
                if (reRender === 'dataChange') {
                    dom_1.default.removeDomExpectWhich(0, '[c-for-id="' + dom_1.default.q(re.ele).getAttribute('c-for-id') + '"]');
                }
                // 渲染单个有c-for指令的模板
                items.forEach(function (item, i) {
                    // 克隆节点，重复次数
                    var newn = dom_1.default.q(re.ele).cloneNode(true);
                    var data = {};
                    data[match2[1]] = item;
                    newn.innerHTML = parseTpl_1.default(re.html, data, self.CObj[component.name]['props'] || {});
                    var newNode = self.loopNodes(component.name, dom_1.default.create(newn.outerHTML));
                    var innerComponents = self.findComponent(newNode[0]);
                    newNode[0].setAttribute('c-for-id', re.id);
                    // 重新编译节点
                    if (i === 0) {
                        dom_1.default.q(re.ele).innerHTML = newNode[0].innerHTML;
                        dom_1.default.q(re.ele).setAttribute('c-for-id', re.id);
                    }
                    else {
                        var el = document.querySelectorAll('[c-for-id="' + re.id + '"][c-for="' + re.fn + '"]');
                        el[el.length - 1].insertAdjacentElement('afterEnd', newNode[0]);
                    }
                    if (innerComponents.length) {
                        self.loopComponents(util_1.default.deepClone(innerComponents), [], component.name, data);
                    }
                });
            }
            else {
                $log.error('组件' + component.name + '内c-for指令的格式不正确');
            }
        });
    };
    /**
     * 处理c-if指令
     * @param arr c-if 集合
     * @param component 指令所在组件
     */
    renderComponents.prototype.loopIfToDom = function (arr, component) {
        var _this = this;
        var currentIf = arr.filter(function (ifVal) {
            return ifVal.which == component.name;
        });
        currentIf.forEach(function (cIf) {
            _this.handelIf(cIf, component);
        });
    };
    /**
     * 移除c-if指令所在的节点
     * @param cIf c-if指令所绑定的节点信息
     * @param component 所属组件
     */
    renderComponents.prototype.handelIf = function (cIf, component) {
        var ifDom = dom_1.default.q(cIf.ele || cIf.position);
        // 节点存在，移除节点
        if (ifDom) {
            var ifInfo = ifDom.getAttribute('c-if');
            if (ifInfo === 'false') {
                component.beforeDestory && component.beforeDestory();
                ifDom.parentNode.replaceChild(dom_1.default.addComment('c-if:' + cIf.id + ''), ifDom);
                this.ifTpl[cIf.id] = ifDom.outerHTML;
            }
        }
        else { // 已经被移除，还原节点
            dom_1.default.replaceComment(dom_1.default.q(util_1.default._cameCase(component.name)), cIf.attr + ':' + cIf.id, dom_1.default.create(this.ifTpl[cIf.id])[0]);
            // 更改属性
            dom_1.default.attr((cIf.ele || cIf.position), 'c-if', true);
            dom_1.default.q(cIf.ele || cIf.position).style.display = 'block';
        }
    };
    /**
     * 处理c-html指令
     * @param arr c-html指令集合
     * @param component 所属组件
     */
    renderComponents.prototype.loopHtmlToDom = function (arr, component) {
        var currentHtml = arr.filter(function (h) {
            return h.which === component.name;
        });
        currentHtml.forEach(function (h) {
            dom_1.default.q(h.ele).innerHTML = dom_1.default.attr(h.ele, 'c-html');
        });
    };
    /**
     * 组合经过改变的组件的props值
     * @param key
     * @param val
     * @param props
     */
    renderComponents.prototype.combineChangedProps = function (key, val, props) {
        if (props[key]) {
            props[key]['default'] = val;
        }
        return props;
    };
    /**
     * 数组去重
     * @param a
     * @param b
     */
    renderComponents.prototype.array_intersection = function (a, b) {
        var result = [];
        for (var i = 0; i < b.length; i++) {
            var temp = b[i].id;
            for (var j = 0; j < a.length; j++) {
                if (temp === a[j]) {
                    result.push(b[i]);
                    break;
                }
            }
        }
        return result;
    };
    /**
     * 判断dom节点是组件
     * @param node dom节点
     */
    renderComponents.prototype.isComponent = function (node) {
        var name = dom_1.default.parseName(node);
        return this.CObj[name] != undefined;
    };
    /**
     * 判断表达式内的字符是否在组件的data中
     * @param name data属性名称
     * @param expression '{{xxx}}'
     * @returns 存在返回{{ }}内的表达式，否在返回null
     */
    renderComponents.prototype.isComponentData = function (name, expression) {
        var regExp = new RegExp("{{\\s*([\\s\\S]*" + name + "[\\s\\S]*)\\s*}}", "gm");
        var res = regExp.exec(expression);
        if (res === null) {
            return null;
        }
        var exp = {
            '': true,
            '+': true,
            '-': true,
            '*': true,
            '/': true,
            '(': true,
            ')': true,
            '.': true,
            '[': true,
            ']': true,
            '!': true,
            '!=': true,
            '!==': true,
            '>': true,
            '>=': true,
            '>==': true,
            '<': true,
            '<=': true,
            '<==': true,
            '?': true,
            ':': true
        };
        var nameIndex = res[1].indexOf(name), prev1 = res[1].charAt(nameIndex - 1), prev2 = res[1].charAt(nameIndex - 2), prev3 = res[1].charAt(nameIndex - 3), next1 = res[1].charAt(nameIndex + 1), next2 = res[1].charAt(nameIndex + 2), next3 = res[1].charAt(nameIndex + 3);
        if (exp[prev1] || exp[prev2] || exp[prev3] || exp[next1] || exp[next2] || exp[next3]) {
            return res[1];
        }
        return null;
    };
    /**
     * 获取某个data属性名在节点中的位置
     * @param name data属性名称
     * @param node dom节点
     * @param component 所属组件
     */
    renderComponents.prototype.dataPosition = function (name, node, component) {
        var res = [], self = this;
        // 属性
        function loopAttr(node) {
            if (typeof node === 'object' && node.length) {
                for (var i = 0; i < node.length; i++) {
                    if (node[i].nodeType === 1 && node[i].hasAttributes()) {
                        for (var j = 0, len = node[i].attributes; j < len.length; j++) {
                            if (len[j].name === 'c-for') {
                                var match2 = len[j].value.match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)\s*$/);
                                if (!match2) {
                                    $log.error('组件' + component + '内的c-for指令表达式' + len[j] + '有误');
                                }
                                if (match2[2] === name && !self.isComponent(node[i])) {
                                    res = res.concat({
                                        attr: len[j].name,
                                        fn: len[j].value,
                                        type: 'attr',
                                        id: node[i].getAttribute(ID),
                                        ele: '[' + ID + '="' + node[i].getAttribute(ID) + '"]',
                                        item: i,
                                        isComponent: false,
                                        html: node[i].innerHTML,
                                        which: component //所属组件
                                    });
                                }
                            }
                            else {
                                var attrVal = self.isComponentData(name, len[j].value);
                                if (attrVal) {
                                    var isCs = self.isComponent(node[i]);
                                    if (isCs) {
                                        res = res.concat({
                                            attr: len[j].name,
                                            value: name,
                                            type: 'attr',
                                            id: node[i].getAttribute(ID),
                                            position: '[' + ID + '="' + node[i].getAttribute(ID) + '"]',
                                            item: i,
                                            isComponent: true,
                                            componentName: dom_1.default.parseName(node[i]),
                                            componentToken: node[i].getAttribute(ID),
                                            which: component //所属组件
                                        });
                                    }
                                    else {
                                        res = res.concat({
                                            attr: len[j].name,
                                            value: attrVal,
                                            type: 'attr',
                                            id: node[i].getAttribute(ID),
                                            position: '[' + ID + '="' + node[i].getAttribute(ID) + '"]',
                                            item: i,
                                            isComponent: false,
                                            which: component //所属组件
                                        });
                                    }
                                }
                            }
                        }
                        if (node[i].childNodes && node[i].childNodes.length) {
                            loopAttr(node[i].childNodes);
                        }
                    }
                }
            }
        }
        loopAttr(node);
        // textContent
        function loopText(node) {
            if (typeof node === 'object' && node.length) {
                for (var i = 0; i < node.length; i++) {
                    if (node[i].nodeType === 3) {
                        var text = node[i].textContent;
                        if (self.isComponentData(name, text)) {
                            res = res.concat({
                                value: name,
                                type: 'text',
                                position: '[' + ID + '="' + node[i].parentNode.getAttribute(ID) + '"]',
                                item: i,
                                isComponent: false
                            });
                        }
                    }
                    if (node[i].childNodes && node[i].childNodes.length) {
                        loopText(node[i].childNodes);
                    }
                }
            }
        }
        loopText(node);
        return res;
    };
    /**
     * 组件集合转json对象
     * @param arr
     */
    renderComponents.prototype.listToObj = function (arr) {
        var obj = {};
        arr.forEach(function (v) {
            obj[v.name] = v;
        });
        return obj;
    };
    /**
     * 获取组件的名称集合
     */
    renderComponents.prototype.getComponentNameList = function () {
        var arr = [];
        this.CList.forEach(function (v) {
            arr.push(v.name);
        });
        return arr;
    };
    /**
     * 根据dom节点获取component， 遍历子节点
     * @param node dom节点
     */
    renderComponents.prototype.findComponent = function (node) {
        if (node.nodeType === 3) {
            return;
        }
        var arr = [];
        var self = this;
        // tag标签
        function loopTagNode(node) {
            var normalizedNodeName = self.normalizeDirective(dom_1.default.getNodeName(node).toLowerCase());
            if (self.componentNames.includes(normalizedNodeName)) {
                arr.push(util_1.default.deepClone(util_1.default.extend(self.CObj[normalizedNodeName], { token: node.getAttribute(ID) })));
                // arr.push(Util.extend(self.CObj[normalizedNodeName], {token: node.getAttribute(ID)}));
            }
            if (node.childNodes && node.childNodes.length) {
                node.childNodes.forEach(function (v) {
                    if (v.nodeType !== 3) {
                        loopTagNode(v);
                    }
                });
            }
        }
        loopTagNode(node);
        return arr;
    };
    /**
     * 根据dom节点获取component， 不遍历子节点
     * @param node dom节点
     * @param name 组件名称
     */
    renderComponents.prototype.getComponent = function (node, name) {
        var arr = [];
        var self = this;
        // tag标签
        function loopTagNode(node) {
            var normalizedNodeName = util_1.default.cameCase(dom_1.default.getNodeName(node).toLowerCase());
            if (self.componentNames.includes(normalizedNodeName)) {
                arr.push(normalizedNodeName);
                var obj = {};
                for (var i = 0, len = node.attributes; i < len.length; i++) {
                    if (len[i].name !== ID) {
                        obj[len[i].name] = parseTpl_1.default(len[i].value, self.CObj[name].data, self.CObj[name].props);
                    }
                }
                if (!dom_1.default.noOtherAttr(ID, node)) {
                    obj['component'] = normalizedNodeName;
                    self.componentAttrs[node.getAttribute(ID)] = obj;
                }
            }
        }
        loopTagNode(node);
        return arr;
    };
    /**
     * 判断指令是否含有mulit属性
     * @param name
     */
    renderComponents.prototype.directiveIsMulit = function (name) {
        for (var i = 0, len = this.CList; i < len.length; i++) {
            if (len[i]['name'] == name && len[i].mulit == true) {
                return true;
            }
        }
        return false;
    };
    /**
     * 组件指令的层级关系
     * @param a
     * @param b
     */
    renderComponents.prototype.componentLayer = function (a, b) {
        var sort = b.layer - a.layer;
        if (sort == 0) {
            if (a.name != b.name) {
                return a.name < b.name ? -1 : 1;
            }
            else {
                return a.cid - b.cid;
            }
        }
        else {
            return sort;
        }
    };
    /**
     * 获取data数据改变后的模板
     * @param html
     * @param data
     */
    renderComponents.prototype.getChangedData = function (html, data, props) {
        return parseTpl_1.default(html, data, props);
    };
    /**
     * 序列化指令
     * @param name
     */
    renderComponents.prototype.normalizeDirective = function (name) {
        return util_1.default.cameCase(name.replace(PREFIX_DIRECTIVE, ''));
    };
    /**
     * 判断变量是否在组件的data,props之中, 并返回结果
     * @param exp 变量
     * @param component 组件
     */
    renderComponents.prototype.inComponent = function (exp, component) {
        return component.data[exp] || component.props.default[exp];
    };
    return renderComponents;
}());
exports.default = renderComponents;
