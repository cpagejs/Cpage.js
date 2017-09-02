/**
 * 公共方法
 */
export default class targetDom {
    public elements;
    public els;
    constructor(selector){
        this.elements = document.querySelectorAll(selector);
        this.els = this._getEles(this.elements);
    }

    _getEles(nodes){
        if(nodes && nodes.length){
            return nodes;
        }
    }

    /**
     * 遍历dom节点
     * @param nodes 节点
     * @param fn 回调函数 val, index
     */
    public each(nodes, fn){
        for(var i=0; i<nodes.length; i++){
            fn(nodes[i], i);
        }
    }
}