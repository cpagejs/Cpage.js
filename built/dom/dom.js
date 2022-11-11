"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../util");
var $log = require("../log");
var HandelDom = /** @class */ (function () {
    function HandelDom() {
        this.BOOLEAN_ATTRS = {
            selected: true
        };
        this.BOOLEAN_ELEMENT = {};
    }
    /**
     * 获取dom节点
     * @param str 节点标识,class,id...
     */
    HandelDom.prototype.q = function (str) {
        return document.querySelector(str);
    };
    /**
     * 根据字符串创建dom节点，返回dom节点
     * @param str
     */
    HandelDom.prototype.createDom = function (str) {
        if (util_1.default.type(str) != 'string') {
            $log.error('组件模板' + str + '必须为字符串，请检查组件的template,templateId,templateUrl属性');
        }
        var html = "" + str;
        html = html.trim();
        html = html.replace(/<!--[\s\S]*?-->/gm, ''); //去除html注释
        html = html.replace(/>\s+([^\s<]*)\s+</gm, '>$1<').trim(); //去除html标签间的多余空白
        var pattern = /([^>]*)(<([a-z/][-a-z0-9_:.]*)[^>/]*(\/*)>)([^<]*)/gm, matchArr, start = Date.now();
        var arr = [];
        while ((matchArr = pattern.exec(html))) {
            var textBefore = matchArr[1], //获取排在标签前的文本
            elem = matchArr[2], //获取整个开标签或闭标签
            elemName = matchArr[3], //获取标签名
            closeSign = matchArr[4], //判断是否为自闭合标签标记
            textAfter = matchArr[5]; //获取排在标签后的文本
            arr.push(elemName);
        }
        var dom = document.createElement(arr[0]);
        dom.innerHTML = str;
        return dom;
    };
    /**
     * 根据字符串创建dom节点，返回dom的子节点
     * @param str
     */
    HandelDom.prototype.create = function (str) {
        var div = this.createDom(str);
        return div.childNodes;
    };
    /**
    * 获取节点名称
    * @param node
    */
    HandelDom.prototype.getNodeName = function (node) {
        return node.nodeName ? node.nodeName : node[0].nodeName;
    };
    /**
     * 获取节点的驼峰名称
     * @param node
     */
    HandelDom.prototype.parseName = function (node) {
        return util_1.default.cameCase(node.tagName.toLowerCase());
    };
    /**
     * 包括dom节点
     * @param str 节点字符串
     * @param wrap 包括的tag标签
     */
    HandelDom.prototype.wrapDom = function (str, wrap) {
        return "<" + wrap + ">" + str + "</" + wrap + ">";
    };
    /**
     * 获取某个属性的集合
     * @param attr 属性名
     * @param node 节点
     */
    HandelDom.prototype.getAttr = function (attr, node) {
        var arr = [];
        if (!node)
            return arr;
        if (node.nodeType === 1 && node.getAttribute(attr)) {
            arr.push(node.getAttribute(attr));
        }
        if (node.childNodes && node.childNodes.length) {
            getA(node.childNodes);
        }
        function getA(node) {
            for (var i = 0; i < node.length; i++) {
                if (node[i].nodeType === 1 && node[i].getAttribute(attr)) {
                    arr.push(node[i].getAttribute(attr));
                }
                if (node[i].childNodes && node[i].childNodes.length) {
                    getA(node[i].childNodes);
                }
            }
        }
        return arr;
    };
    /**
     * 父组件的data值覆盖子组件的props值（组件的attr值与props对比，有则覆盖）
     * @param attr {component:'hello', 'width': 100}
     * @param props { 'width': { default:50, type:'number' } }
     */
    HandelDom.prototype.combineAttrAndProps = function (attr, props) {
        if (util_1.default.isEmpty(attr))
            return props;
        if (attr) {
            var newAttr = util_1.default.expectSome(attr, 'component');
            for (var i in newAttr) {
                if (props && props[i]) {
                    props[i].default = newAttr[i];
                }
            }
        }
        return props;
    };
    /**
     * 节点没有除了attr以外的其他属性
     * @param attr 属性
     * @param node 节点
     */
    HandelDom.prototype.noOtherAttr = function (attr, node) {
        if (node.nodeType === 1) {
            if (node.attributes) {
                if (node.attributes.length >= 2)
                    return false;
                if (node.attributes.length == 1) {
                    if (node.attributes[0].name == attr)
                        return true;
                    else
                        return false;
                }
            }
        }
    };
    /**
     * 根据bool值转化成display
     * @param bool true, false
     */
    HandelDom.prototype.boolToDisplay = function (bool) {
        if (bool === 'true' || bool === true)
            return 'block';
        if (bool === 'false' || bool === false)
            return 'none';
    };
    /**
     * 获取节点除了某些属性外的其他属性
     * @param node 节点
     * @param attr 属性
     */
    HandelDom.prototype.expectSomeAttr = function (node, attr) {
        var obj = {};
        if (node.attributes && node.attributes.length) {
            for (var i = 0, len = node.attributes; i < len.length; i++) {
                if (len[i].name !== attr) {
                    obj[len[i].name] = len[i].value;
                }
            }
        }
        return obj;
    };
    /**
     * 添加注释节点
     * @param str 注释内容
     */
    HandelDom.prototype.addComment = function (str) {
        var dom = document.createComment(str);
        return dom;
    };
    /**
     * 替换注释节点
     * @param node 父节点
     * @param text 注释内容
     * @param newNode 新的节点
     */
    HandelDom.prototype.replaceComment = function (node, text, newNode) {
        var iterator = document.createNodeIterator(node, NodeFilter.SHOW_COMMENT, null);
        var n = iterator.nextNode();
        while (n) {
            if (n.nodeValue === text) {
                n.parentNode.replaceChild(newNode, n);
            }
            n = iterator.nextNode();
        }
    };
    /**
     * 更改节点属性
     * @param str 节点
     * @param key 属性名
     * @param val 属性值
     */
    HandelDom.prototype.attr = function (str, key, val) {
        var dom = this.q(str);
        if (!util_1.default.isNil(dom)) {
            if (arguments.length === 3) {
                dom.setAttribute(key, val);
            }
            if (arguments.length === 2) {
                return dom.getAttribute(key);
            }
        }
    };
    /**
     * 返回节点的html
     * @param str 节点标识
     */
    HandelDom.prototype.hasHtml = function (str) {
        if (DOM.q(str)) {
            return DOM.q(str).innerHTML;
        }
        return undefined;
    };
    /**
     * 返回require,import 的html
     * @param str 节点标识
     */
    HandelDom.prototype.hasHtmlUrl = function (str) {
        return str;
    };
    /**
     * head添加style
     * @param res style所属类型
     * @param component style所属组件
     */
    HandelDom.prototype.addStyle = function (res, component) {
        if (component.name === undefined) {
            $log.error('找不到组件的name属性，无法添加style样式');
        }
        if (res === undefined) {
            return;
        }
        // 组件的标签名称
        var tag = util_1.default._cameCase(component.name);
        switch (res.type) {
            case 'string':
                this.appendStyle(res.result, tag);
                break;
            case 'id':
                if (this.q(res.result) === undefined) {
                    $log.error('名称为' + component.name + '的组件中，节点' + res.result + '不存在');
                }
                var inner = this.q(res.result).innerHTML;
                this.appendStyle(inner, tag);
                break;
            case 'url':
                this.appendStyle(res.result, tag);
                break;
        }
    };
    /**
     * 将样式表添加到head里面
     * @param inner 样式表内容
     * @param title style的title属性，也是组件tag标签
     */
    HandelDom.prototype.appendStyle = function (inner, title) {
        var style = "" + inner;
        // style = Util.trimStr(style);
        var newStyle = document.createElement('style');
        newStyle.type = 'text/css';
        // newStyle.title = title;
        newStyle.innerHTML = style;
        this.q('head').appendChild(newStyle);
        // 给选择符设置前缀
        this.addSelectorPrefix(title);
    };
    /**
     * 给选择符设置前缀
     * @param title style的title属性
     */
    HandelDom.prototype.addSelectorPrefix = function (title) {
        var stylesheet = document.styleSheets;
        for (var i = 0; i < stylesheet.length; i++) {
            if (stylesheet[i].title === title) {
                for (var j = 0, cr = stylesheet[i].cssRules; j < cr.length; j++) {
                    cr[j].selectorText = title + ' ' + cr[j].selectorText;
                }
            }
        }
    };
    /**
     * 移除具有相同属性的节点，第item个除外
     * @param item 索引
     * @param selector 节点选择器
     */
    HandelDom.prototype.delDomExpectWhich = function (selector, item) {
        var nodes = document.querySelectorAll(selector);
        for (var i = 0; i < nodes.length; i++) {
            if (i !== item) {
                nodes[i].parentNode.removeChild(nodes[i]);
            }
        }
    };
    /**
     * 删除dom节点
     * @param selector 节点选择器
     */
    HandelDom.prototype.delDom = function (selector) {
        var nodes = document.querySelectorAll(selector);
        for (var i = 0; i < nodes.length; i++) {
            nodes[i].parentNode.removeChild(nodes[i]);
        }
    };
    HandelDom.prototype.watch = function (node) {
        // 观察dom数据变化
        var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
        var target = document.querySelector(node);
        var observer = new MutationObserver(function (mu) {
            // console.log(mu)
        });
        var config = { childList: true, attributes: true, characterData: true, subtree: true, attributeOldValue: true, characterDataOldValue: true };
        observer.observe(target, config);
    };
    HandelDom.prototype.booleanAttr = function (node, nodeName) {
    };
    return HandelDom;
}());
var DOM = new HandelDom();
exports.default = DOM;
