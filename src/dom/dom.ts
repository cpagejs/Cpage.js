import Util from '../util';
import * as $log from '../log';
import http from '../http';

class HandelDom {
    private BOOLEAN_ATTRS;
    private BOOLEAN_ELEMENT;

    constructor(){
        this.BOOLEAN_ATTRS = {
            selected: true
        };
        this.BOOLEAN_ELEMENT = {

        };
    }

    /**
     * 获取dom节点
     * @param str 节点标识,class,id...
     */
    public q(str){
        return document.querySelector(str);
    }

    /**
     * 根据字符串创建dom节点，返回dom节点
     * @param str 
     */
    public createDom(str){
        if(Util.type(str) != 'string'){
            $log.error('组件模板'+str+'必须为字符串，请检查组件的template,templateId,templateUrl属性');
        }
    
        var html = `${str}`;
            html = html.trim();
            html = html.replace(/<!--[\s\S]*?-->/gm, '');  //去除html注释
            html = html.replace(/>\s+([^\s<]*)\s+</gm, '>$1<').trim();  //去除html标签间的多余空白

        var pattern = /([^>]*)(<([a-z/][-a-z0-9_:.]*)[^>/]*(\/*)>)([^<]*)/gm,
            matchArr,
            start = Date.now();

        var arr = [];

        while ((matchArr = pattern.exec(html))) {
            var textBefore = matchArr[1],  //获取排在标签前的文本
                elem = matchArr[2],        //获取整个开标签或闭标签
                elemName = matchArr[3],    //获取标签名
                closeSign = matchArr[4],   //判断是否为自闭合标签标记
                textAfter = matchArr[5];   //获取排在标签后的文本

            arr.push(elemName);
        }
        
        let dom = document.createElement(arr[0]);
        dom.innerHTML = str;
        return dom;
    }

    /**
     * 根据字符串创建dom节点，返回dom的子节点
     * @param str 
     */
    public create(str):Array<any>{
        const div = this.createDom(str);
        return div.childNodes;
    }

     /**
     * 获取节点名称
     * @param node 
     */
    public getNodeName(node):string{
        return node.nodeName ? node.nodeName : node[0].nodeName;
    }

    /**
     * 获取节点的驼峰名称
     * @param node 
     */
    public parseName(node):string{
        return Util.cameCase(node.tagName.toLowerCase());
    }

    /**
     * 包括dom节点
     * @param str 节点字符串
     * @param wrap 包括的tag标签
     */
    public wrapDom(str:string, wrap:string):string{
        return "<"+ wrap +">" + str + "</"+ wrap +">";
    }

    /**
     * 获取某个属性的集合
     * @param attr 属性名
     * @param node 节点
     */
    public getAttr(attr, node):Array<any>{
        let arr = [];
        if(node.nodeType == 1 && node.getAttribute(attr)){
            arr.push(node.getAttribute(attr));
        }
        if(node.childNodes && node.childNodes.length){
            getA(node.childNodes);
        }
        function getA(node){
            for(let i=0; i<node.length; i++){
                if(node[i].nodeType == 1 && node[i].getAttribute(attr)){
                    arr.push(node[i].getAttribute(attr));
                }
                if(node[i].childNodes && node[i].childNodes.length){
                    getA(node[i].childNodes);
                }
            }
        }

        return arr;
    }

    /**
     * 父组件的data值覆盖子组件的props值（组件的attr值与props对比，有则覆盖）
     * @param attr {component:'hello', 'width': 100}
     * @param props { 'width': { default:50, type:Number } }
     */
    public combineAttrAndProps(attr, props):object{
        if(Util.isEmpty(attr))
            return props;
        if(attr){
            const newAttr = Util.expectSome(attr, 'component');
            for(let i in newAttr){
                if(props && props[i]){
                    props[i].default = newAttr[i];
                }
            }
        }
        return props;
    }

    /**
     * 节点没有除了attr以外的其他属性
     * @param attr 属性
     * @param node 节点
     */
    public noOtherAttr(attr, node):boolean{
        if(node.nodeType == 1){
            if(node.attributes){
                if(node.attributes.length >= 2)
                    return false;
                if(node.attributes.length == 1){
                    if(node.attributes[0].name == attr) return true;
                    else return false;
                }
            }
        }
    }

    /**
     * 根据bool值转化成display
     * @param bool true, false
     */
    public boolToDisplay(bool):string{
        if(bool == 'true' || bool == true)
            return 'block';
        if(bool == 'false' || bool == false)
            return 'none';
    }

    /**
     * 获取节点除了某些属性外的其他属性
     * @param node 节点
     * @param attr 属性
     */
    public expectSomeAttr(node, attr){
        let obj = {};
        if(node.attributes && node.attributes.length){
            for(let i=0,len=node.attributes; i<len.length; i++){
                if(len[i].name != attr){
                    obj[len[i].name] = len[i].value;
                }
            }
        }
        return obj;
    }

    /**
     * 添加注释节点
     * @param str 注释内容 
     */
    public addComment(str){
        let dom = document.createComment(str);
        return dom;
    }

    /**
     * 替换注释节点
     * @param node 父节点
     * @param text 注释内容
     * @param newNode 新的节点
     */
    public replaceComment(node, text, newNode){
        const iterator = document.createNodeIterator(node, NodeFilter.SHOW_COMMENT, null, false);
        let n = iterator.nextNode();
        while(n){   
            if(n.nodeValue == text){
                n.parentNode.replaceChild(newNode, n);
            }
            n = iterator.nextNode();
        }
    }

    /**
     * 更改节点属性
     * @param str 节点
     * @param key 属性名
     * @param val 属性值
     */
    public attr(str, key, val?){
        const dom = this.q(str);
        if(dom != undefined){
            if(arguments.length == 3){
                dom.setAttribute(key, val);
            }
            if(arguments.length == 2){
                return dom.getAttribute(key);
            }
        }
    }

    /**
     * 返回节点的html
     * @param str 节点标识
     */
    public hasHtml(str){
        if(DOM.q(str)){
            return DOM.q(str).innerHTML;
        }
        return undefined;
    }

    /**
     * 返回require,import 的html
     * @param str 节点标识
     */
    public hasHtmlUrl(str){
        return str;
    }


    /**
     * head添加style
     * @param res style所属类型
     * @param component style所属组件
     */
    public addStyle(res, component){
        if(component.name == undefined){
            $log.error('找不到组件的name属性，无法添加style样式');
        }
        if(res == undefined){
            return;
        }
        // 组件的标签名称
        const tag = Util._cameCase(component.name);

        switch(res.type){
            case 'string':
                this.appendStyle(res.result, tag);
                break;
            case 'id':
                if(this.q(res.result) == undefined){
                    $log.error('名称为'+component.name+'组件中，节点'+res.result+'不存在');
                }
                let inner = this.q(res.result).innerHTML;
                this.appendStyle(inner, tag);
                break;
            case 'url':
                this.appendStyle(res.result, tag);
                break;
        }
    }

    /**
     * 将样式表添加到head里面
     * @param inner 样式表内容
     * @param title style的title属性，也是组件tag标签
     */
    public appendStyle(inner, title){
        let style = `${inner}`;
        style = Util.trimStr(style);

        let newStyle = document.createElement('style');
        newStyle.type = 'text/css';
        newStyle.title = title;
        newStyle.innerHTML = style;
        this.q('head').appendChild(newStyle);

        // 给选择符设置前缀
        this.addSelectorPrefix(title);
    }

    /**
     * 给选择符设置前缀
     * @param title style的title属性
     */
    public addSelectorPrefix(title):void{
        let stylesheet = document.styleSheets;
        for(var i=0; i<stylesheet.length; i++){
            if(stylesheet[i].title == title){
                for(let j=0,cr=(<any>stylesheet[i]).cssRules; j<cr.length; j++){
                    cr[j].selectorText = title + ' ' + cr[j].selectorText;
                }
            }
        }
    }

    /**
     * 移除具有相同属性的节点，第item个除外
     * @param item 索引
     * @param selector 节点选择器 
     */
    public removeDomExpectWhich(item, selector){
        const nodes = document.querySelectorAll(selector);
        for(let i=0; i<nodes.length; i++){
            if(i != item){
                nodes[i].parentNode.removeChild(nodes[i]);
            }
        }
    }

    public watch(node){
        // 观察dom数据变化
        const MutationObserver = (<any>window).MutationObserver || (<any>window).WebKitMutationObserver || (<any>window).MozMutationObserver;
        const target = document.querySelector(node);
        const observer = new MutationObserver(mu=>{
            // console.log(mu)
        });
        const config = { childList: true, attributes: true, characterData: true, subtree:true, attributeOldValue:true, characterDataOldValue:true };
        observer.observe(target, config);
    }

    public booleanAttr(node, nodeName){
        
    }

}

const DOM = new HandelDom();
export default DOM;