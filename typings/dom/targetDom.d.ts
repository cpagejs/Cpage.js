/**
 * 获取目标节点
 */
export default class targetDom {
    elements: any;
    els: any;
    constructor(selector: any);
    _getEles(nodes: any): any;
    /**
     * 遍历dom节点
     * @param nodes 节点
     * @param fn 回调函数 val, index
     */
    each(nodes: any, fn: any): void;
}
