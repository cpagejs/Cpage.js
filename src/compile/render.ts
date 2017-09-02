import * as $log from '../log';
import Util from '../util';
import DOM from '../dom/dom';
import tpl from './parseTpl';
import Data from './HandelData';
import Eventer from '../util/HandelEventer';
import handelEvent from './HandelEvent';
import parse from '../parse/index';
import http from '../http';
import componentGuard from './componentGuard';
import Router from '../router';
import Store from '../store';
const store:any = new Store();

const PREFIX_DIRECTIVE = /(x[\:\-_]|data[\:\-_])/i;
const ID = 'c-data-id';
const ID_FOR = 'c-for-id';
const ID_REPEAT = 'c-repeat-id';

export default class renderComponents {
    private selector:string;  //需要渲染的根节点
    private root:any;  //根组件
    private CList:Array<any>;  //组件集合
    private CObj:object;  //组件键值对
    private eventList:Array<any>;  //事件集合
    private cRefList:Array<any>;  //c-ref集合
    private showList:Array<any>;  //c-show结合
    private ifList:Array<any>;  //c-if结合
    private ifTpl:object;  //c-if 模板集合
    private cHtmlList:Array<any>;  //c-html集合
    private cForList:Array<any>;  //c-for集合
    private cRepeatList:Array<any>;  //c-repeat集合
    private cViewList:Array<any>;  //c-view集合
    private dataId:number;  //节点编号
    private componentToken:Array<any>;  //组件token
    private componentNames:Array<any>;  //组件名称集合
    private componentAttrs:object;  //组件属性
    private templateId:object;  //模板id集合
    private oneRootComponent:number;  //只有唯一一个根组件
    private $router; // 路由
    private $routerCache; //路由缓存

    constructor(selector, root, CList){
        this.selector = selector;
        this.root = root;
        this.CList = CList;
        this.CObj = this.listToObj(CList);
        this.eventList = [];
        this.cRefList = [];
        this.showList = [];
        this.ifList = [];
        this.ifTpl = {};
        this.cHtmlList = [];
        this.cForList = [];
        this.cRepeatList = [];
        this.cViewList = [];
        this.dataId = parseInt(Util.now());
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
    public componentToDom():void{
        let self = this, node,
            components = [],
            rootTpl = DOM.wrapDom(this.theTpl(this.root), Util._cameCase(this.root.name).toLowerCase());

        async function handelComponent(){
            await invokeLooopNodes();
            await invokeLoopComponents();
            await invokeRouter();
        }
        handelComponent();

        // 遍历节点
        function invokeLooopNodes(){
            node = self.loopNodes(self.root.name,
                    DOM.create(rootTpl), 
                    components
                );
        }

        // 遍历组件
        function invokeLoopComponents(){
            self.root.template = node[0].outerHTML;
            self.root.isRoot = true;
            self.templateId[node[0].getAttribute(ID)] = node[0].outerHTML;

            self.loopComponents(components, self.root.data, self.root.components, self.root.name);
        }

        // 处理路由
        function invokeRouter(){
            if(store.has('routerConfig')){
                handelRouter();
            }
            function handelRouter(){
                setTimeout(()=>{
                    if ((<any>window).document.readyState == "complete") {
                        const hash = (<any>window).location.hash;
                        if (hash == '') {  // 处理默认首页， path="/"
                            const index = pathIndex();
                            if (Util.type(index) == 'object') {
                                handelView(index);
                            }
                        }
                        else {
                            const r = getNowRouter(hash.substr(1));
                            if(r != undefined){
                                handelView((<any>r));
                            }
                        }
                    }
    
                    (<any>window).addEventListener('hashchange', (data)=>{
                        let nowPath:string = '';
                        if(data.newURL.includes('/#')){
                            nowPath = data.newURL.split('/#')[1];
                        }
                        
                        const r = getNowRouter(nowPath);
                        if(r != undefined){
                            handelView((<any>r))
                        }
                        
                    }, false);
    
                    function handelView(obj){
                        const name = obj.component.name;
                        const delay = obj.delay || 0;
    
                        setTimeout(()=>{
                            self.cViewList.forEach(v => {
                                if(!DOM.q(v.ele)) return;
                                if(obj.cache && self.$routerCache.hasOwnProperty(name)){
                                    DOM.q(v.ele).innerHTML = self.$routerCache[name];
                                    self.handelEventListener(self.CObj[name], DOM.q(v.ele).firstChild);
                                }
                                else{
                                    DOM.q(v.ele).innerHTML = '';
                                    DOM.q(v.ele).insertAdjacentHTML('afterbegin', '<' + Util._cameCase(name) + '></' + Util._cameCase(name) + '>');
                                    self.loopNodes(name, DOM.q(v.ele).childNodes, []);
                                    self.loopComponents([self.CObj[name]], self.CObj[v.which].data || {}, [], v.which);
                                    setTimeout(()=>{
                                        self.$routerCache[name] = DOM.q(Util._cameCase(name)).outerHTML;
                                    },0);
                                }
                            });
                        }, delay);
                    }
    
                },0);
            }
        }

        // 获取当前路由
        function getNowRouter(path){
            const router = new Router(path, store.get('routerConfig'));
            self.$router = router;
            return router.nowRouter;
        }

        // 默认路径
        function pathIndex(){
            let obj = undefined;
            store.get('routerConfig').forEach(v=>{
                if(v.path == '/'){
                    obj = v;
                }
            });
            return obj;
        }
       
    }

    /**
     * 组件的template, templateId, templateUrl
     * @param component 组件
     */
    private theTpl(component):string{
        // hasHtmlUrl, webpack打包需要引入html-loader
        return (component.template ? component.template.trim() : undefined) || DOM.hasHtml(component.templateId) || DOM.hasHtmlUrl(component.templateUrl);
    }

    /**
     * 组件的style, styleId, styleUrl
     * @param component 组件
     */
    private theStyle(component):boolean | object{
        // component.style
        function handelString(str:string){
            if(str != undefined){
                return {
                    type: 'string',
                    result: str
                }
            }
            return false;
        }

        // component.styleId
        function handelId(id:string){
            if(DOM.q(id) != undefined){
                return {
                    type: 'id',
                    result: id
                }
            }
            return false;
        }

        // component.styleUrl, webpack打包需要引入css-loader
        function handelUrl(url){
            if(url != undefined){
                // 针对import * as css from '';
                if(Util.type(url) == 'object'){
                    url = url[0][1];
                }
                // 针对require('../xx.css')
                if(Util.type(url) == 'array'){
                    url = url[1];
                }

                return {
                    type: 'url',
                    result: url
                }
            }
            return false;
        }
        return handelString(component.style) || handelId(component.styleId) || handelUrl(component.styleUrl);
    }

    /**
     * 遍历dom节点
     * @param name 组件名称
     * @param node dom节点
     * @param components 组件列表
     */
    private loopNodes(name:string, node, components?:Array<any>){
        for (let i = 0; i < node.length; i++) {
            if (node[i].nodeType == 1) {
                node[i].setAttribute("c-data-id", this.dataId);

                const cs = this.getComponent(node[i], name);
                cs.forEach(v=>{
                    if(components){
                        components.push(Util.deepClone(Util.extend(this.CObj[v], {token: this.dataId})));
                        // components.push(Util.extend(this.CObj[v], {token: this.dataId}));
                    }
                });
                
                this.dataId++;

                // 添加eventList, showList...等集合
                this.addDirectiveList(name, node[i]);

                if (node[i].childNodes && node[i].childNodes.length) {
                    this.loopNodes(name, node[i].childNodes, components);
                }

            }
        }
        return node;
    }

    /**
     * 添加eventList, showList...等集合
     * @param name 组件名称
     * @param node 节点
     */
    private addDirectiveList(name:string, node):void{
        for (let j = 0, len = node.attributes; j < len.length; j++) {
            const attrName = this.normalizeDirective(len[j].name);
            if (attrName.match(/^cClick|cDbclick|cMouseover|cMousedown|cMouseup|cMousemove|cMouseout|cMouseleave|cBlur|cFocus|cChange|cInput|cDrag|cDragend|cDragenter|cDragleave|cDragover|cDragstart|cDrop|cFocus|cKeydown|cKeypress|cKeyup|cScroll|cSelect|cSubmit|cTtoggle|cResize|cWaiting|cProgress|cLoadstart|cDurationchange|cLoadedmetadata|cLoadeddata|cCanplay|cCanplaythrough|cPlay|cPause|cRef|cShow|cIf|cHtml|cFor|cRepeat|cView$/g)) {
                switch(attrName){
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
                        this.showList.push({
                            which: name,
                            type: len[j].name.split('-')[1],
                            fn: len[j].value,
                            ele: '[' + ID + '="' + node.getAttribute(ID) + '"]',
                            id: node.getAttribute(ID),
                            directive: attrName
                        });
                        
                        // 在组件渲染前面处理display
                        const displayStatus = DOM.boolToDisplay(tpl(len[j].value, this.CObj[name].data, this.CObj[name].props));
                        node.style.display = displayStatus;
                        break;
                    case 'cIf':
                        this.ifList.push({
                            which: name,
                            type: len[j].name.split('-')[1],
                            fn: len[j].value,
                            ele: '[' + ID + '="' + node.getAttribute(ID) + '"]',
                            id: node.getAttribute(ID),
                            directive: attrName,
                            html: node.outerHTML
                        });
                        const ifInfo = tpl(len[j].value, this.CObj[name].data, this.CObj[name].props);
                        if(ifInfo == 'true'){
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
    }

    /**
     * 遍历组件
     * @param components 模板中的组件集合 
     * @param fatherData 父组件data数据
     * @param componentArr 注入的组件集合
     * @param componentName 父组件名称
     */
    private loopComponents(components:Array<any>, fatherData:object, componentArr:Array<any>, componentName:string){
        if(components.length && componentArr == undefined){
            $log.error('找不到组件为'+componentName+'的components属性');
        }

        let self = this;
        components.forEach(v => {
            if(v == undefined) return;
            // “模板中的组件” 与 “注入的组件” 对比
            self.compareChildComponentAndInjectComponents(v.name, componentArr);

            // 给组件赋能
            v.$data = Data.$data;
            v.$http = http;
            v.$event = handelEvent;
            v.$router = self.$router;

            async function handelCC(){
                await self.handelDataChange(v);  // 监听data数据改变
                const before = await self.handelBeforeRender(v);  //在组建渲染之前执行
                await self.handelAfterRender(before, v);  //在组件渲染之后执行
            }

            handelCC();

        });
    }

    /**
     * 在组建渲染之前执行
     * @param v 组件
     */
    private handelBeforeRender(v){
        if(v.beforeRender){
            v.$el = undefined;
            v.$refs = undefined;
            v.componentStatus = 'beforeRender';
            
            v.beforeRender();
        }
        return 'beforeRenderIsDone';
    }

    /**
     * 在组件渲染之后执行
     * @param status handelBeforeRender()的返回值
     * @param v 组件
     */
    private handelAfterRender(status, v){
        if(status != 'beforeRenderIsDone'){
            return;
        }

        let self = this;
        
        async function invokeAfterRender(){
            const step1 = await addStyle();
            const step2 = await renderOnce(step1);
            const step3 = await handelCforDirective(step2);
            const step4 = await handelOtherDirective(step3);
            const step5 = await handelRenderFn(step4);
            const step6 = await loopChildComponent(step5);
            const step7 = await handelClickDirective(step6);
        }
        
        if(v.render){
            invokeAfterRender();
        }

        function addStyle(){
            // head添加style
            DOM.addStyle(self.theStyle(v), v);
            return 'done';
        }

        function renderOnce(status){
            if(status != 'done'){
                return;
            }

            let node;

            // 根组件单独渲染
            if(v.name == self.root.name){
                if(self.oneRootComponent == 2){
                    $log.error('根组件'+self.root.name+'只能有一个');
                }
                const dom = DOM.q(self.selector);
                if(dom == undefined){
                    $log.error('节点'+self.selector+'不存在');
                }
                dom.innerHTML = tpl(self.theTpl(self.root), self.root.data, {});
                node = DOM.q('['+ ID +'="'+ v.token +'"]');
                self.oneRootComponent++;
            }
            else {
                const newNode = self.loopNodes(v.name, DOM.create(self.theTpl(self.CObj[v.name])));
                node = DOM.q('['+ ID +'="'+ v.token +'"]');
                self.templateId[v.token] = newNode[0].outerHTML;

                // 编译组件属性，父组件的data值覆盖子组件的props值（组件的attr值与props对比，有则覆盖）
                const newProps = DOM.combineAttrAndProps(self.componentAttrs[v.token], self.CObj[v.name].props);
                node.innerHTML = self.getChangedData(newNode[0].outerHTML, self.CObj[v.name].data, newProps);
            }
            return node;
        }

        function handelCforDirective(node){
            // 处理c-for
            self.loopCforToDom(self.cForList, v);
            return node;
        }

        function handelOtherDirective(node){
            // 处理c-if
            self.loopIfToDom(self.ifList, v);

            // 处理c-html
            self.loopHtmlToDom(self.cHtmlList, v);

            return node;
        }

        function handelRenderFn(node){
            v.$el = node;

            // 处理c-ref
            v.$refs = {};
            const currentRefs = self.cRefList.filter(rfs=>{
                return rfs.which == v.name;
            });
            currentRefs.forEach(r=>{
                v.$refs[r.fn] = DOM.q(r.ele);
            });
            
            v.componentStatus = 'afterRender';
            v.render();

            return node;
        }

        function loopChildComponent(node){
            // 遍历组件子节点
            if(v.name != self.root.name){
                const arr = self.findComponent(node.firstChild);
                if(arr.length){
                    if(v.name){
                        // self.loopComponents(arr, v.data, Util.deepClone(v.components), v.name)
                        self.loopComponents(arr, v.data, v.components, v.name);
                    }
                }
            }
            return node;
        }

        function handelClickDirective(node){
            //绑定事件
            self.handelEventListener(v, node);
        }

    }

    /**
     * “模板中的组件” 与 “注入的组件” 对比
     * @param child 模板中的单个组件
     * @param arr 注入的组件集合
     */
    private compareChildComponentAndInjectComponents(child, arr){
        let self = this, flag=false;

        if(child = this.root.name){  //判断是否为根组件
            flag = true;
        }
        else if(!arr.length && child != this.root.name){  //普通组件，有组件标识但components为空
            flag = false;
        }
        else {  //普通组件，有组件标识但components不为空
            flag = arr.some(v => {
                if(v.name){
                    return child != self.root.name && child == v.name
                }
            });
        }
        
        if(!flag)
            $log.error('名称为'+child+'的组件未找到');
    }

    /**
     * 组件渲染后的事件绑定
     * @param v 组件对象
     * @param node 节点
     */
    private handelEventListener(v, node){
        // 获取当前组件的事件集合
        const attrArr = DOM.getAttr(ID, node);
        const newAttrArr = this.array_intersection(attrArr, this.eventList);

        // 事件绑定处理
        if (newAttrArr.length) {
            const arr = newAttrArr.filter((ev) => {
                return ev.which == v.name
            });
            arr.forEach(val => {
                if (document.querySelectorAll(val.ele)) {
                    try {
                        for(let dq of document.querySelectorAll(val.ele)){
                            dq.addEventListener(val.type, function(event){
                                try {
                                    if(val.fn.toString().match(/\(\)$/)){
                                        if(v.hasOwnProperty(val.fn.toString().split('()')[0])){
                                            parse.parse(val.fn)(v, { $event: event });
                                        }else{
                                            $log.error('组件' + v.name + '中不存在方法'+val.fn);
                                        }
                                    }else{
                                        $log.error('组件' + v.name + '中方法'+val.fn+'语法错误');
                                    }
                                }catch(e){
                                    console.log(e)
                                }
                            }, false);
                        }
                    }catch(e){
                        $log.error(e)
                    }
                } else {
                    $log.error('属性为' + val.ele + '的节点不存在！');
                }
            });
        }
    }

    /**
     * 监听data数据改变
     * @param v 组件对象
     */
    private handelDataChange(v, type?):void{
        for(let i in v.data){
            Eventer.listen(i, info=>{
                if(info.target == v.token && JSON.stringify(info.oldVal) != JSON.stringify(info.newVal)){ //只处理当前组件的属性改变
                    // 获取组件原始的tpl，将其转为dom
                    const parseNode = DOM.create(this.templateId[v.token]);
                    const dataPos = this.dataPosition(i, parseNode, v.name);
                    
                    // 在dom渲染之前执行，更新data数据
                    this.updateData(i, info);

                    if(DOM.q(Util._cameCase(v.name))){
                        // data数据改变重新渲染对象的节点
                        this.dataChangeToDom(parseNode, dataPos, info, v.name);
                    }
                }
            });
        }
    }

    /**
     * 在dom渲染之前执行，更新data数据
     * @param key data的key
     * @param info 更改的信息
     */
    private updateData(key, info){
        // 所属组件
        const component = info.which;
        this.CObj[component].data[key] = info.newVal;
    }

    /**
     * data数据改变重新渲染对象的节点
     * @param parseNode 原始的dom节点
     * @param dataPos 改变的数据集合
     * @param info data的变化信息
     * @param component 所属组件
     */
    private dataChangeToDom(parseNode, dataPos, info, component){
        // 文本类型
        this.loopTextToDom(parseNode, dataPos, info, component);

        // 属性类型
        this.loopAttrToDom(dataPos, info, component);
    }

    /**
     * 文本改变渲染对应的dom节点
     * @param parseNode 编译的节点
     * @param dataPos 改变的数据集合
     * @param info data的变化信息
     * @param component 所属组件
     */
    private loopTextToDom(parseNode, dataPos, info, component){
        const textData = dataPos.filter(df=>{
            return df.type == 'text';
        });
        if(textData.length){
            textData.forEach(dp=>{
                const originNode = parseNode[0].parentNode.querySelector(dp.position).childNodes[dp.item].textContent;
                document.querySelector(dp.position).childNodes[dp.item].textContent = tpl(originNode, info.new, info.props);
            });
        }
    }

    /**
     * 属性改变渲染对应的dom节点
     * @param dataPos 改变的数据集合
     * @param info data的变化信息
     * @param component 所属组件
     */
    private loopAttrToDom(dataPos, info, component):void{
        let self = this;
        const attrData = dataPos.filter(df=>{
            return df.type == 'attr';
        });
        if(attrData.length){
            attrData.forEach(dp=>{
                // 处理指令
                switch(dp.attr){
                    case 'c-show':
                        const newAttr = DOM.boolToDisplay(parse.parse(dp.value)(info.new));
                        DOM.q(dp.position).style.display = newAttr;
                        break;
                    case 'c-if':
                        const dom = DOM.q(dp.position);
                        if(dom != undefined){
                            DOM.q(dp.position).setAttribute(dp.attr, info.newVal);
                        }
                        this.handelIf(dp, component);
                        break;
                    case 'c-for':
                        this.loopCforToDom(dataPos, this.CObj[component], 'dataChange');
                        break;
                    default:
                        changeAttr(dp);
                }

                function changeAttr(dp){
                    DOM.q(dp.position).setAttribute(dp.attr, info.newVal);
                    // 更新componentAttrs
                    self.componentAttrs[dp.componentToken][dp.attr] = info.newVal;
                }

                //父组件的属性改变
                function handelComponent(dp){
                    const childChangePos = self.dataPosition(dp.attr, DOM.create(self.templateId[dp.componentToken]), component);

                    // 文本类型
                    const childChangePosText = childChangePos.filter(df=>{
                        return df.type == 'text';
                    });
                    childChangePosText.forEach(chItem=>{
                        let changedComponent = self.CObj[dp.componentName],
                            changedOriginComponentProps = changedComponent.props,
                            changedComponentData = changedComponent.data,
                            changedPropKey = dp.attr,
                            changedPropVal = self.componentAttrs[dp.componentToken][dp.attr],
                            changedComponentProps = self.combineChangedProps(changedPropKey, changedPropVal, changedOriginComponentProps);

                        const changedOrginNode = DOM.create(self.templateId[dp.componentToken]);
                        const changedOrginText = changedOrginNode[0].parentNode.querySelector(chItem.position).childNodes[chItem.item].textContent;
                        DOM.q(chItem.position).childNodes[chItem.item].textContent = tpl(changedOrginText, changedComponentData, changedComponentProps);
                    });

                    // 属性类型
                    const childChangePosAttr = childChangePos.filter(df=>{
                        return df.type == 'attr';
                    });
                    childChangePosAttr.forEach(chItem=>{
                        // 父组件的attr值与子组件的props值进行联动
                        if(dp.attr == chItem.value){
                            chItem.value = dp.value;
                        }
                        DOM.q(chItem.position).setAttribute(chItem.attr, chItem.value);
                        // 更新componentAttrs
                        self.componentAttrs[chItem.componentToken][chItem.attr] = chItem.value;
                        self.componentAttrs[chItem.componentToken][chItem.attr] = chItem.value;
                        if(chItem.isComponent){
                            handelComponent(chItem);
                        }
                    });
                }
                if(dp.isComponent){
                    handelComponent(dp);
                }

            });
        }
    }

    /**
     * 处理c-for指令
     * @param arr c-for 集合
     * @param component 指令所在组件
     */
    private loopCforToDom(arr, component, reRender?){
        const currentRepeat = arr.filter(rVal=>{
            return rVal.which == component.name;
        });

        let self = this;
        
        currentRepeat.forEach(re=>{
            // 解析指令，获取重复次数
            const match2 = (<any>re.fn).match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)\s*$/);
            if(!match2){
                $log.error('c-for格式有误');
            }

            const itemExp = match2[1];
            const itemsExp = match2[2];
            const items = this.inComponent(itemsExp, component);
            if(items && Util.type(items) == 'array' && items.length){

                if(reRender == 'dataChange'){
                    DOM.removeDomExpectWhich(0, '[c-for-id="'+ DOM.q(re.ele).getAttribute('c-for-id') +'"]');
                }

                // 渲染单个有c-for指令的模板
                items.forEach((item, i) => {
                    // 克隆节点，重复次数
                    let newn = DOM.q(re.ele).cloneNode(true);
                    let data = {};
                    data[match2[1]] = item;
                    newn.innerHTML = tpl(re.html, data, self.CObj[component.name]['props'] || {});
                    const newNode = self.loopNodes(component.name, DOM.create(newn.outerHTML));
                    const innerComponents = self.findComponent(newNode[0]);
                    newNode[0].setAttribute('c-for-id', re.id);

                    // 重新编译节点
                    if(i == 0){
                        DOM.q(re.ele).innerHTML = newNode[0].innerHTML;
                        DOM.q(re.ele).setAttribute('c-for-id', re.id);
                    }
                    else {
                        const el = document.querySelectorAll('[c-for-id="'+ re.id +'"][c-for="'+ re.fn +'"]');
                        (<any>el[el.length-1]).insertAdjacentElement('afterEnd', newNode[0]);
                    }
                    if(innerComponents.length){
                        self.loopComponents(Util.deepClone(innerComponents), data, [], component.name);
                    }
                });
            }else {
                $log.error('组件'+component.name+'内c-for指令的格式不正确');
            }
        });
    }

    /**
     * 处理c-if指令
     * @param arr c-if 集合
     * @param component 指令所在组件
     */
    private loopIfToDom(arr, component):void{
        const currentIf = arr.filter(ifVal=>{
            return ifVal.which == component.name;
        });
        currentIf.forEach(cIf=>{
            this.handelIf(cIf, component.name);
        });
    }

    /**
     * 移除c-if指令所在的节点
     * @param cIf c-if指令所绑定的节点信息
     */
    private handelIf(cIf, componentName):void{
        const ifDom = DOM.q(cIf.ele || cIf.position);
        // 节点存在，移除节点
        if(ifDom != undefined){
            const ifInfo = ifDom.getAttribute('c-if');
            if(ifInfo == 'true'){
                ifDom.parentNode.replaceChild(DOM.addComment('c-if:'+ cIf.id +''), ifDom);
                this.ifTpl[cIf.id] = ifDom.outerHTML;
            }
        }
        // 已经被移除，还原节点
        if(ifDom == undefined){
            DOM.replaceComment(
                DOM.q(Util._cameCase(componentName)),
                cIf.attr+':'+cIf.id,
                DOM.create(this.ifTpl[cIf.id])[0]
            );
            // 更改属性
            DOM.attr((cIf.ele || cIf.position), 'c-if', false);
            DOM.q(cIf.ele || cIf.position).style.display = 'block';
        }
    }

    /**
     * 处理c-html指令
     * @param arr c-html指令集合
     * @param component 所属组件
     */
    private loopHtmlToDom(arr, component){
        const currentHtml = arr.filter(h=>{
            return h.which == component.name;
        });
        currentHtml.forEach(h => {
            DOM.q(h.ele).innerHTML = DOM.attr(h.ele, 'c-html');
        });
    }

    /**
     * 组合经过改变的组件的props值
     * @param key 
     * @param val 
     * @param props 
     */
    private combineChangedProps(key, val, props):object{
        if(props[key]){
            props[key]['default'] = val;
        }
        return props;
    }

    /**
     * 数组去重
     * @param a 
     * @param b 
     */
    private array_intersection(a, b):Array<any>{
        let result = [];
        for(let i = 0; i < b.length; i ++) {
            let temp = b[i].id;
            for(let j = 0; j < a.length; j ++) {
                if(temp === a[j]) {
                    result.push(b[i]);
                    break;
                }
            }
        }
        return result;
    }

    /**
     * 判断dom节点是组件
     * @param node dom节点
     */
    private isComponent(node):boolean{
        const name = DOM.parseName(node);
        return this.CObj[name] != undefined
    }

    /**
     * 判断表达式内的字符是否在组件的data中
     * @param name data属性名称
     * @param expression '{{xxx}}'
     * @returns 存在返回{{ }}内的表达式，否在返回null
     */
    private isComponentData(name, expression){
        const regExp = new RegExp("{{\\s*([\\s\\S]*" + name + "[\\s\\S]*)\\s*}}", "gm");
        const res = regExp.exec(expression);

        if(res == null){
            return null;
        }

        const exp = {
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
        const nameIndex = res[1].indexOf(name),
            prev1 = res[1].charAt(nameIndex-1),
            prev2 = res[1].charAt(nameIndex-2),
            prev3 = res[1].charAt(nameIndex-3),
            next1 = res[1].charAt(nameIndex+1),
            next2 = res[1].charAt(nameIndex+2),
            next3 = res[1].charAt(nameIndex+3);

        if( exp[prev1] || exp[prev2] || exp[prev3] || exp[next1] || exp[next2] || exp[next3] ){
            return res[1];
        }

        return null;
    }

    /**
     * 获取某个data属性名在节点中的位置
     * @param name data属性名称
     * @param node dom节点
     * @param component 所属组件
     */
    private dataPosition(name, node, component?):Array<any>{
        let res = [], self = this;

        // 属性
        function loopAttr(node){
            if(typeof node == 'object' && node.length){
                for(let i=0; i<node.length; i++){
                    if(node[i].nodeType == 1 && node[i].hasAttributes()){
                        for(let j=0,len=node[i].attributes; j<len.length; j++){
                            if(len[j].name == 'c-for'){
                                const match2 = len[j].value.match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)\s*$/);
                                if(!match2){
                                    $log.error('组件'+component+'内的c-for指令表达式'+ len[j] +'有误');
                                }
                                if(match2[2] == name && !self.isComponent(node[i])){
                                    res = res.concat({
                                        attr: len[j].name,
                                        fn: len[j].value,
                                        type: 'attr',
                                        id: node[i].getAttribute(ID),
                                        ele: '['+ ID +'="'+ node[i].getAttribute(ID) +'"]',
                                        item: i,
                                        isComponent: false,
                                        html: node[i].innerHTML,
                                        which: component  //所属组件
                                    });
                                }
                            }
                            else {
                                const attrVal = self.isComponentData(name, len[j].value)
                                if(attrVal){
                                    const isCs = self.isComponent(node[i]);
                                    if(isCs){
                                        res = res.concat({
                                            attr: len[j].name,
                                            value: name,
                                            type: 'attr',
                                            id: node[i].getAttribute(ID),
                                            position: '['+ ID +'="'+ node[i].getAttribute(ID) +'"]',
                                            item: i,
                                            isComponent: true,
                                            componentName: DOM.parseName(node[i]),
                                            componentToken: node[i].getAttribute(ID),
                                            which: component  //所属组件
                                        });
                                    }
                                    else {
                                        res = res.concat({
                                            attr: len[j].name,
                                            value: attrVal,
                                            type: 'attr',
                                            id: node[i].getAttribute(ID),
                                            position: '['+ ID +'="'+ node[i].getAttribute(ID) +'"]',
                                            item: i,
                                            isComponent: false,
                                            which: component  //所属组件
                                        });
                                    }
                                }  
                            }
                        }
                        if(node[i].childNodes && node[i].childNodes.length){
                            loopAttr(node[i].childNodes);
                        }
                    }
                }
            }
        }
        loopAttr(node);

        // textContent
        function loopText(node){
            if(typeof node == 'object' && node.length){
                for(let i=0; i<node.length; i++){
                    if(node[i].nodeType == 3){
                        const text = node[i].textContent;
                        if(self.isComponentData(name, text)){
                            res = res.concat({
                                value: name,
                                type: 'text',
                                position: '['+ ID +'="'+ node[i].parentNode.getAttribute(ID) +'"]',
                                item: i,
                                isComponent: false
                            });
                        }
                    }
                    if(node[i].childNodes && node[i].childNodes.length){
                        loopText(node[i].childNodes);
                    }
                }
            }
            
        }
        loopText(node);

        return res;
    }

    /**
     * 组件集合转json对象
     * @param arr 
     */
    private listToObj(arr:Array<any>):object{
        let obj = {};
        arr.forEach(v=>{
            obj[v.name] = v;
        });
        return obj;
    }

    /**
     * 获取组件的名称集合
     */
    private getComponentNameList(){
        let arr = [];
        this.CList.forEach(v=>{
            arr.push(v.name);
        });
        return arr;
    }

    /**
     * 根据dom节点获取component， 遍历子节点
     * @param node dom节点
     */
    private findComponent(node){
        if(node.nodeType == 3){
            return;
        }
        let arr = [];
        let self = this;

        // tag标签
        function loopTagNode(node){
            let normalizedNodeName = self.normalizeDirective(DOM.getNodeName(node).toLowerCase());
            if(self.componentNames.includes(normalizedNodeName)){
                // arr.push(Util.deepClone(Util.extend(self.CObj[normalizedNodeName], {token: node.getAttribute(ID)})));
                arr.push(Util.extend(self.CObj[normalizedNodeName], {token: node.getAttribute(ID)}));
            }
            if(node.childNodes && node.childNodes.length){
                node.childNodes.forEach(v=>{
                    if(v.nodeType != 3){
                        loopTagNode(v);
                    }
                    
                });
            }
        }
        loopTagNode(node);
        
        return arr;
    }

    /**
     * 根据dom节点获取component， 不遍历子节点
     * @param node dom节点
     * @param name 组件名称
     */
    private getComponent(node, name?){
        let arr = [];
        let self = this;

        // tag标签
        function loopTagNode(node){
            let normalizedNodeName = Util.cameCase(DOM.getNodeName(node).toLowerCase());

            if(self.componentNames.includes(normalizedNodeName)){
                arr.push(normalizedNodeName);
                let obj = {};
                for(let i=0,len=node.attributes; i<len.length; i++){
                    if(len[i].name != ID){
                        obj[len[i].name] = tpl(len[i].value, self.CObj[name].data, self.CObj[name].props);
                    }
                }

                if(!DOM.noOtherAttr(ID, node)){
                    obj['component'] = normalizedNodeName;
                    self.componentAttrs[node.getAttribute(ID)] = obj;
                }
            }
        }
        loopTagNode(node);
        
        return arr;
    }

    /**
     * 判断指令是否含有mulit属性
     * @param name 
     */
    private directiveIsMulit(name){
        for(let i=0, len=this.CList; i< len.length; i++){
            if(len[i]['name'] == name && len[i].mulit == true){
                return true;
            }
        }
        return false;
    }

    /**
     * 组件指令的层级关系
     * @param a 
     * @param b 
     */
    private componentLayer(a, b){
        const sort = b.layer - a.layer;
        if(sort == 0){
            if(a.name != b.name){
                return a.name < b.name ? -1 : 1; 
            }
            else {
                return a.cid - b.cid;
            }
        }else {
            return sort;
        }
    }

    /**
     * 获取data数据改变后的模板
     * @param html 
     * @param data 
     */
    private getChangedData(html, data, props){
        return tpl(html, data, props);
    }

    /**
     * 序列化指令
     * @param name 
     */
    private normalizeDirective(name){
        return Util.cameCase(name.replace(PREFIX_DIRECTIVE, ''));
    }

    /**
     * 判断变量是否在组件的data,props之中, 并返回结果
     * @param exp 变量
     * @param component 组件 
     */
    private inComponent(exp:any, component):any{
        return component.data[exp] || component.props.default[exp] 
    }
    
}