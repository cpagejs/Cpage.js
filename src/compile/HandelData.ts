import Eventer from '../util/HandelEventer';
import Util from '../util';

/**
 * 监听组件的data数据变化
 */
class HandelData {
    private data;
    private name;
    private token;
    private props;
    private componentStatus;

    constructor(){
        this.data = {};
        this.name = '';
        this.token = undefined;
        this.props = {};
        this.componentStatus = '';
    }

    public $data(key, val){
        const n = arguments.length;
        switch(n){
            case 0:
                return this.data;
            case 1:
                return this.data[key];
            case 2:
                const oldData = Util.deepClone(this.data);
                this.data[key] = val;
                const newData = this.data;
                
                Eventer.trigger(key, Util.clone({
                    target: this.token, 
                    which: this.name, 
                    old: oldData, 
                    new: newData, 
                    oldVal: oldData[key], 
                    newVal: newData[key],
                    props: this.props == undefined ? {} : this.props,
                    componentStatus: this.componentStatus
                }));
                break;
        }
    }
}

const Data = new HandelData();
export default Data;