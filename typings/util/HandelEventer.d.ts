declare class HandelEventer {
    eventList: any;
    constructor();
    /**
     * 触发事件
     * @param name
     * @param msg
     */
    emit(name: any, msg: any): boolean;
    /**
     * 监听事件
     * @param name
     * @param fn
     */
    on(name: any, fn: any): void;
    remove(key: any, fn: any): boolean;
}
declare const Eventer: HandelEventer;
export default Eventer;
