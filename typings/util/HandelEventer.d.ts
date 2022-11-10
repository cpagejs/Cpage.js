declare class HandelEventer {
    eventList: any;
    constructor();
    /**
     * 触发事件
     * @param name
     * @param msg
     */
    trigger(name: any, msg: any): boolean;
    /**
     * 监听事件
     * @param name
     * @param fn
     */
    listen(name: any, fn: any): void;
    remove(key: any, fn: any): boolean;
}
declare const Eventer: HandelEventer;
export default Eventer;
