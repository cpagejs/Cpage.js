import Eventer from '../util/HandelEventer';

/**
 * 组件事件监听函数
 */
class HandelEvent {
    
    /**
     * 触发事件
     * @param name 事件名称
     * @param msg 信息
     */
     emit(name, msg){
        Eventer.emit(name, msg);
    }

    /**
     * 监听事件
     * @param name 事件名称
     * @param fn 回调函数，返回触发的信息
     */
    on(name, fn){
        Eventer.on(name, fn);
    }

}

const handelEvent = new HandelEvent();
export default handelEvent;