export interface routerAction {
    go({}):void;
    hash(path?:string):any;
    reflesh():void;
    back():void;
}