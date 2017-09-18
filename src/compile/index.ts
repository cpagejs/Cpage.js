import * as $log from '../log';
import Util from '../util';
import renderComponents from './render';
import componentGuard from './componentGuard';
import Store from '../store';
const store:any = new Store();

store.data('componentList', []);
store.service('component', function(){
    this.ensureOneInvokeComponent = (name,arr)=>{
        let res = {
                type: 'yes'
            },
            rootName = [],
            names = [];

        for(let i=0; i<arr.length; i++){
            if(arr[i].name == name)
                rootName.push(name);

            names.push(arr[i].name);
        }
        if(rootName.length >= 2)
            res = {
                type: 'no',
                info: '只能有一个根组件，却发现'+rootName.length+'个'+name+'根组件'
            }   
        return res;
    }
});

export  default class CPage {
    CList = [];
    id = 0;

    static version = '1.0.5';

    constructor(){
        this.id = 0;
    }

    /**
     * es6模式，渲染组件
     * @param selector id选择符，如果是class，则取第一个节点
     * @param fn 根组件函数
     */
    static bootstrap(selector, fn){
        let rootComponent:any = {};
        function componetList(fn, isRoot=false){
            const classToJson = Util.classToJson(fn, isRoot);
            const componentJson = classToJson.componentJson;
            if(isRoot){
                rootComponent = classToJson.rootComponent;
            }

            componentGuard(componentJson);

            store.data('componentList', store.get('componentList').push(componentJson));

            if(componentJson.components && Util.type(componentJson.components)=='array' && componentJson.components.length){
                componentJson.components.forEach(v => {
                    componetList(v);
                });
            }
        }
        componetList(fn, true);
        
        const r = new renderComponents(selector, rootComponent, store.get('componentList'));
        r.componentToDom();
    }

    /**
     * 路由
     * @param config 路由配置
     */
    static router(config:Array<object>){
        function check(str){
            if(Util.type(str) != 'array'){
                $log.error('路由配置项需为数组形式');
            }
        }
        check(config);

        config.forEach(v=>{
            const classToJson = Util.classToJson((<any>v).component, false);
            (<any>v).component = classToJson.componentJson;
        });
        
        store.data('routerConfig', config);
    }

    public directive(name, fn){
        let conf = fn();
        conf.id = this.id;
        this.CList.push(conf);
        this.id++;

        const guard = store.get('component').ensureOneInvokeComponent(name, this.CList);
        if(guard.type == 'no') {
            $log.error(guard.info);
        }
        return conf;
    }

    /**
     * es5模式获取组建信息
     * @param obj 
     */
    public component(obj):object{
        componentGuard(obj);

        let componentInfo = Util.deepClone(obj);
        Object.defineProperties(componentInfo, {
            isRoot: {
                value: false,
                writable: true
            },
            $el: {
                value: undefined,
                writable: true
            },
            $props: {
                value: {},
                writable: true
            }
        });
        
        return this.directive(obj.name, function(){
            return componentInfo;
        });
    }

    /**
     * es5模式，将组件渲染到dom
     * @param selector id选择符，如果是class，则取第一个节点
     * @param root 根组件信息
     */
    public bootstrap(selector:string, root):void{
        if(Util.type(selector) != 'string'){
            $log.error(selector+'应为字符串');
        }
        if(!document.querySelector(selector)){
            $log.error('节点“'+selector+'”不存在');
        }
        if(Util.type(root) != 'object'){
            $log.error(root+'应为json对象');
        }

        if(arguments.length == 2){
            componentGuard(root);
            if(!root.name){
                $log.error('找不到根组件的name属性');
            }
            store.data('rootComponent', root.name);
            const r = new renderComponents(selector, root, this.CList);
            r.componentToDom();
        }
    }
}

/**
 * es6模式构建组件
 */
export class Component {
    public components:Array<any>;
    public name:string;
    public template:string;
    public data:object;
    public props:object;

    constructor(){
        this.components = [];
        this.name = '';
        this.template = '';
        this.data = {};
        this.props = {};
    }

    render(){
        $log.error('render方法必须被继承');
    }
}