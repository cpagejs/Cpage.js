import Util from '../util';
import * as $log from '../log';
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
    trigger(name, msg){
        Eventer.trigger(name, msg);
    }

    /**
     * 监听事件
     * @param name 事件名称
     * @param fn 回调函数，返回触发的信息
     */
    listen(name, fn){
        Eventer.listen(name, fn);
    }

}

const handelEvent = new HandelEvent();
export default handelEvent;