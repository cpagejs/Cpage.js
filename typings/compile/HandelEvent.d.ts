/**
 * 组件事件监听函数
 */
declare class HandelEvent {
    /**
     * 触发事件
     * @param name 事件名称
     * @param msg 信息
     */
    emit(name: any, msg: any): void;
    /**
     * 监听事件
     * @param name 事件名称
     * @param fn 回调函数，返回触发的信息
     */
    on(name: any, fn: any): void;
}
declare const handelEvent: HandelEvent;
export default handelEvent;
