import targetDom from './targetDom';
export default class nodeModel extends targetDom {
    constructor(selector: any);
    /**
     * 设置，获取html
     * @param str html值
     */
    html(str?: string): any;
    /**
     * 设置，获取节点文本
     * @param str 文本值
     */
    text(str?: string): any;
    css(key: string, value?: string): any;
    /**
     * 获取，设置元素宽度
     * @param str
     */
    width(str?: string): any;
    /**
    * 获取，设置元素高度
    * @param str
    */
    height(str?: string): any;
    /**
     * 获取，设置节点的属性值
     * @param attr 属性名
     * @param value 属性值
     */
    attr(attr: string, value?: string): any;
    /**
     * 获取，设置节点的value值
     * @param str value值
     */
    val(str: string): any;
    /**
     * 给节点添加class
     * @param name
     */
    addClass(name: any): this;
    /**
     * 删除节点的class
     * @param name
     */
    removeClass(name: any): this;
    /**
     * 切换class
     */
    toggleClass(name: any): boolean;
}
