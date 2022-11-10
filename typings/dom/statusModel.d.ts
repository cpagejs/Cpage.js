import targetDom from './targetDom';
/**
 * 节点是否包含某些属性
 */
export default class statusModel extends targetDom {
    constructor(selector: any);
    hasAttrs(): boolean;
    /**
     * 判断节点是否有某个属性
     * @param attr 属性名
     */
    hasAttr(attr: any): boolean;
    /**
     * 判断节点是否有某个class
     * @param name class名称
     */
    hasClass(name: any): boolean;
}
