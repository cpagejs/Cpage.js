export default class renderComponents {
    private selector;
    private root;
    private CList;
    private CObj;
    private eventList;
    private cRefList;
    private cShowList;
    private cIfList;
    private ifTpl;
    private cForTpl;
    private cHtmlList;
    private cForList;
    private cRepeatList;
    private cViewList;
    private dataId;
    private componentToken;
    private componentNames;
    private componentAttrs;
    private templateId;
    private oneRootComponent;
    private $router;
    private $routerCache;
    constructor(selector: any, root: any, CList: any);
    /**
     * 组件渲染到dom节点
     */
    componentToDom(): Promise<void>;
    /**
     * 组件的template, templateId, templateUrl
     * @param component 组件
     */
    private theTpl;
    /**
     * 组件的style, styleId, styleUrl
     * @param component 组件
     */
    private theStyle;
    /**
     * 遍历dom节点
     * @param name 组件名称
     * @param node dom节点
     * @param components 组件列表
     */
    private loopNodes;
    /**
     * 添加eventList, cShowList...等集合
     * @param name 组件名称
     * @param node 节点
     */
    private addDirectiveList;
    /**
     * 遍历组件
     * @param components 模板中的组件集合
     * @param componentArr 注入的组件集合
     * @param componentName 父组件名称
     * @param fatherData 父组件data数据
     */
    private loopComponents;
    /**
     * 在组建渲染之前执行
     * @param v 组件
     */
    private handelBeforeRender;
    /**
     * 在组件渲染之后执行
     * @param status handelBeforeRender()的返回值
     * @param v 组件
     */
    private handelAfterRender;
    /**
     * “模板中的组件” 与 “注入的组件” 对比
     * @param child 模板中的单个组件
     * @param arr 注入的组件集合
     */
    private compareChildComponentAndInjectComponents;
    /**
     * 组件渲染后的事件绑定
     * @param v 组件对象
     * @param node 节点
     */
    private handelEventListener;
    /**
     * 监听data数据改变
     * @param v 组件对象
     */
    private handelDataChange;
    /**
     * 在dom渲染之前执行，更新data数据
     * @param key data的key
     * @param info 更改的信息
     */
    private updateData;
    /**
     * data数据改变重新渲染对象的节点
     * @param parseNode 原始的dom节点
     * @param dataPos 改变的数据集合
     * @param info data的变化信息
     * @param component 所属组件
     */
    private dataChangeToDom;
    /**
     * 文本改变渲染对应的dom节点
     * @param parseNode 编译的节点
     * @param dataPos 改变的数据集合
     * @param info data的变化信息
     * @param component 所属组件
     */
    private loopTextToDom;
    /**
     * 属性改变渲染对应的dom节点
     * @param dataPos 改变的数据集合
     * @param info data的变化信息
     * @param component 所属组件
     */
    private loopAttrToDom;
    /**
     * 处理c-for指令
     * @param arr c-for 集合
     * @param component 指令所在组件
     * @param reRender 再次渲染
     */
    private loopCforToDom;
    /**
     * 处理c-if指令
     * @param arr c-if 集合
     * @param component 指令所在组件
     */
    private loopIfToDom;
    /**
     * 移除c-if指令所在的节点
     * @param cIf c-if指令所绑定的节点信息
     * @param component 所属组件
     */
    private handelIf;
    /**
     * 处理c-html指令
     * @param arr c-html指令集合
     * @param component 所属组件
     */
    private loopHtmlToDom;
    /**
     * 组合经过改变的组件的props值
     * @param key
     * @param val
     * @param props
     */
    private combineChangedProps;
    /**
     * 数组去重
     * @param a
     * @param b
     */
    private array_intersection;
    /**
     * 判断dom节点是组件
     * @param node dom节点
     */
    private isComponent;
    /**
     * 判断表达式内的字符是否在组件的data中
     * @param name data属性名称
     * @param expression '{{xxx}}'
     * @returns 存在返回{{ }}内的表达式，否在返回null
     */
    private isComponentData;
    /**
     * 获取某个data属性名在节点中的位置
     * @param name data属性名称
     * @param node dom节点
     * @param component 所属组件
     */
    private dataPosition;
    /**
     * 组件集合转json对象
     * @param arr
     */
    private listToObj;
    /**
     * 获取组件的名称集合
     */
    private getComponentNameList;
    /**
     * 根据dom节点获取component， 遍历子节点
     * @param node dom节点
     */
    private findComponent;
    /**
     * 根据dom节点获取component， 不遍历子节点
     * @param node dom节点
     * @param name 组件名称
     */
    private getComponent;
    /**
     * 判断指令是否含有mulit属性
     * @param name
     */
    private directiveIsMulit;
    /**
     * 组件指令的层级关系
     * @param a
     * @param b
     */
    private componentLayer;
    /**
     * 获取data数据改变后的模板
     * @param html
     * @param data
     */
    private getChangedData;
    /**
     * 序列化指令
     * @param name
     */
    private normalizeDirective;
    /**
     * 判断变量是否在组件的data,props之中, 并返回结果
     * @param exp 变量
     * @param component 组件
     */
    private inComponent;
}
