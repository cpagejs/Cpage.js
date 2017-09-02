import * as $log from '../log';
import Util from '../util';
import Store from '../store';
const store:any = new Store();

interface indexAction {
    go({}):void;
    hash(path?:string):any;
    reflesh():void;
    back():void;
}

export default class Router implements indexAction {
    private url:string;  //浏览器pathname
    public routers:Array<object>; //路由集合
    public nowRouter;  //当前路由
    public params:object; //路由参数

    constructor(url, routers) {
        this.url = url;
        this.routers = this._parseRouters(routers);
        this.nowRouter = this._getNowRouter(url, this.routers);
        this.params = this.nowRouter ? (this.nowRouter.params ? this.nowRouter.params : {}) : {};
    }

    /**
     * 获取当前路由
     * @param url 浏览器pathname
     * @param routers 路由集合
     */
    _getNowRouter(url, routers) {
        if(url.includes('?')){
            url = url.substr(0, url.lastIndexOf('?'));
        }
        return routers.filter(v => {
            return url.match(v.info.regexp)
        })[0];
    }

    _parseRouters(routers) {
        routers.forEach(v => {
            const r = this._pathToReg(v.path);
            if (r != null) {
                v.info = r;
                this.params = v.params || {};
            }
        });
        return routers;
    }

    /**
     * 转换路径为正则
     * @param path 路径
     */
    _pathToReg(path) {
        var ret = {
                originalPath: path,
                regexp: path
            },
            keys = (<any>ret).keys = [];

        path = path
            .replace(/([().])/g, '\\$1')
            .replace(/(\/)?:(\w+)(\*\?|[?*])?/g, function (_, slash, key, option) {
                var optional = (option === '?' || option === '*?') ? '?' : null;
                var star = (option === '*' || option === '*?') ? '*' : null;
                keys.push({ name: key, optional: !!optional });
                slash = slash || '';
                return ''
                    + (optional ? '' : slash)
                    + '(?:'
                    + (optional ? slash : '')
                    + (star && '(.+?)' || '([^/]+)')
                    + (optional || '')
                    + ')'
                    + (optional || '');
            })
            .replace(/([/$*])/g, '\\$1');

        ret.regexp = new RegExp('^' + path + '$', '');
        return ret;
    }

    /**
     * 跳转到已存在的路由页面
     * @param path 需要跳转的路径
     */
    go({path='', params={}}):void {
        updateRouterConfig(path, params);
        this.hash(path);
    }

    /**
     * url的hash
     * @param path 
     */
    hash(path?:string){
        if(!path){
            return (<any>window).location.hash;
        }
        (<any>window).location.hash = '#'+path;
    }

    /**
     * 刷新当前路由
     */
    reflesh():void {
        const hash = (<any>window).location.hash;
        (<any>window).location.hash = '#';
        (<any>window).location.hash = hash;
    }

    /**
     * 返回
     */
    back():void{
        (<any>window).history.back();
    }
}

// 更新路由配置
function updateRouterConfig(path, params){
    store.get('routerConfig').forEach(v=>{
        if(v.path == path){
            v.params = params;
        }
    });
    store.data('routerConfig', store.get('routerConfig'));
}