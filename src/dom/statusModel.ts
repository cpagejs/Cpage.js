import targetDom from './targetDom';
import Util from '../util';
import * as $log from '../log';

// 操作dom节点
export default class statusModel extends targetDom {
    constructor(selector){
        super(selector);
    }

    // 判断节点是否拥有属性
    hasAttrs(){
        for(let i of this.els){
            if(i.hasAttributes()){
                return true;
            }else {
                return false;
            }
         }
    }

    hasAttr(attr){
        for(let i of this.els){
           if(i.hasAttribute(attr)){
               return true;
           }else {
               return false;
           }
        }
    }
}