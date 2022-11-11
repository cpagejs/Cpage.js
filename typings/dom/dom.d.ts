declare class HandelDom {
    private BOOLEAN_ATTRS;
    private BOOLEAN_ELEMENT;
    constructor();
    /**
     * 获取dom节点
     * @param str 节点标识,class,id...
     */
    q(str: any): any;
    /**
     * 根据字符串创建dom节点，返回dom节点
     * @param str
     */
    createDom(str: any): any;
    /**
     * 根据字符串创建dom节点，返回dom的子节点
     * @param str
     */
    create(str: any): Array<any>;
    /**
    * 获取节点名称
    * @param node
    */
    getNodeName(node: any): string;
    /**
     * 获取节点的驼峰名称
     * @param node
     */
    parseName(node: any): string;
    /**
     * 包括dom节点
     * @param str 节点字符串
     * @param wrap 包括的tag标签
     */
    wrapDom(str: string, wrap: string): string;
    /**
     * 获取某个属性的集合
     * @param attr 属性名
     * @param node 节点
     */
    getAttr(attr: any, node: any): Array<any>;
    /**
     * 父组件的data值覆盖子组件的props值（组件的attr值与props对比，有则覆盖）
     * @param attr {component:'hello', 'width': 100}
     * @param props { 'width': { default:50, type:'number' } }
     */
    combineAttrAndProps(attr: any, props: any): object;
    /**
     * 节点没有除了attr以外的其他属性
     * @param attr 属性
     * @param node 节点
     */
    noOtherAttr(attr: any, node: any): boolean;
    /**
     * 根据bool值转化成display
     * @param bool true, false
     */
    boolToDisplay(bool: any): string;
    /**
     * 获取节点除了某些属性外的其他属性
     * @param node 节点
     * @param attr 属性
     */
    expectSomeAttr(node: any, attr: any): {};
    /**
     * 添加注释节点
     * @param str 注释内容
     */
    addComment(str: any): Comment;
    /**
     * 替换注释节点
     * @param node 父节点
     * @param text 注释内容
     * @param newNode 新的节点
     */
    replaceComment(node: any, text: any, newNode: any): void;
    /**
     * 更改节点属性
     * @param str 节点
     * @param key 属性名
     * @param val 属性值
     */
    attr(str: any, key: any, val?: any): any;
    /**
     * 返回节点的html
     * @param str 节点标识
     */
    hasHtml(str: any): any;
    /**
     * 返回require,import 的html
     * @param str 节点标识
     */
    hasHtmlUrl(str: any): any;
    /**
     * head添加style
     * @param res style所属类型
     * @param component style所属组件
     */
    addStyle(res: any, component: any): void;
    /**
     * 将样式表添加到head里面
     * @param inner 样式表内容
     * @param title style的title属性，也是组件tag标签
     */
    appendStyle(inner: any, title: any): void;
    /**
     * 给选择符设置前缀
     * @param title style的title属性
     */
    addSelectorPrefix(title: any): void;
    /**
     * 移除具有相同属性的节点，第item个除外
     * @param item 索引
     * @param selector 节点选择器
     */
    delDomExpectWhich(selector: any, item: any): void;
    /**
     * 删除dom节点
     * @param selector 节点选择器
     */
    delDom(selector: any): void;
    watch(node: any): void;
    booleanAttr(node: any, nodeName: any): void;
}
declare const DOM: HandelDom;
export default DOM;
