import { utilAction } from './util_action';
import HandelType from './handelType';
import HandelCoding from './handelCoding';
export declare class util implements utilAction, HandelType, HandelCoding {
    type: (str: any) => any;
    isNumber: (str: any) => Boolean;
    isExponent: (ch: any) => Boolean;
    isLetter: (str: any) => Boolean;
    isWhiteSpace: (str: any) => Boolean;
    whichType: (str: any) => any;
    nonComputedMember: (left: any, right: any) => any;
    computedMember: (left: any, right: any) => any;
    concatCode: (token: string, value: any) => any;
    conditionIsRight: (array: Array<any>, condition: any, statement: any) => void;
    compileId: (id: number, arr: any[], flag?: Boolean) => string;
    notExist: (expression: any) => any;
    /**
     * 判断两个变量是否相等，只能匹配简单的数据类型
     * @param str1
     * @param str2
     * @returns {boolean}
     */
    isEqual(str1: any, str2: any): Boolean;
    /**
     * 判断两个变量是否相等
     * @param newVal
     * @param oldVal
     * @param equalStatus 为TRUE,则深层次比较
     */
    areEqual(newVal: any, oldVal: any, equalStatus: Boolean): Boolean;
    /**
     * 判断两个变量是否相等, 此方法用于相同数据类型的变量比较
     * @param a
     * @param b
     * @returns {boolean}
     */
    compare(a: any, b: any): Boolean;
    /**
     * 浅拷贝，才方法只针对普通对象{}和数组[]
     * @param str
     * @returns {any}
     */
    clone(str: any): any;
    deepClone(data: any): any;
    /**
     * 字符串或函数的执行次数
     * @param obj:类型为Function, String
     */
    repeatObj(obj: any, manyTime: Number): any;
    /**
     * 对每个scope的children进行遍历
     * @param cb
     * @param scope
     * @returns {boolean}
     */
    everyScope(cb: Function, scope: any): any;
    /**
     * 处理scope的event事件
     * @param eventName
     * @param arr
     * @param scope
     */
    handelEvent(eventName: any, arr: Array<any>, scope: any): void;
    /**
     * 对象转map对象
     * @param obj
     * @returns {Map}
     */
    objToMap(obj: Object): Map<any, any>;
    /**
     * map对象转普通对象
     * @param map
     * @returns {{}}
     */
    mapToObj(map: Map<any, any>): Object;
    /**
     * 此方法用于获取首位不写0浮点数的下一位字符
     * @param index
     * @param str
     * @returns {string|boolean}
     */
    nextLeter(index: number, str: string): string | boolean;
    /**
     * 将string类型的数据外层包装\
     * @param str
     * @returns {any}
     */
    wrapString(str: any): any;
    /**
     * 判断数组第一个元素是否与有某个元素相等，如果是则将其移除
     * @param str
     * @param arr
     * @returns {any[]}
     */
    expect(arr: Array<any>, ...str: any[]): any;
    /**
     * 在expect函数基础上，如果目标元素不匹配报错
     * @param str
     * @param arr
     * @returns {any}
     */
    consume(arr: Array<any>, str?: any): any;
    /**
     * 判断数组第一个元素是否与有某个元素相等，相等则返回首个数组首个元素
     * @param str
     * @param arr
     * @returns {number}
     */
    exit(str: any, arr: Array<any>): any;
    /**
     * 只针对对象的第一个元素
     * @param arr
     * @param str
     * @returns {any}
     */
    exitFirst(arr: Array<any>, str?: any): any;
    /**
     * 数组去重，针对普通类型的数组
     * @param arr
     * @returns {Array}
     */
    uArray(arr: Array<any>): Array<number> | Array<string> | Array<boolean>;
    /**
     * 获取数组中某个元素的下标，返回结果维数组
     * @param data
     * @param array
     * @returns {any}
     */
    arrayItem(data: any, array: Array<any>): Array<number>;
    /**
     * 获取数组中某个对象元素的下标
     */
    arrayItem2(data: any, array: Array<any>): string;
    /**
     * 获取数组中某个重复元素的最后下标
     */
    arrayLastItem(data: any, array: Array<any>): string;
    /**
     * 去除数组中的重复元素
     * @param data
     * @param array
     * @returns {Array}
     */
    arraySplice(data: any, array: Array<any>): Array<any>;
    /**
     * 去除数组中的'',null,undefined
     */
    arrayCompact(arr: Array<any>): Array<any>;
    /**
     * 获取两个数组的交集
     * @param a
     * @param b
     */
    intersection(a: Array<any>, b: Array<string>): Array<any>;
    /**
     * 对字符串进行解析
     * @param str
     * @returns {Function}
     */
    parseString(str: String): any;
    /**
     * 用于判断对象是否含有某个属性,并返回与表达式 ‘scope’ && （\‘a\’ in 'scope'）
     * @param obj
     * @param ele
     * @returns {any}
     */
    hasProperty(obj: any, ele: any): any;
    /**
     * 判断所传字符串与目标字符串是否相等
     * @param target
     * @param str
     * @returns {any}
     */
    inStr(target: string, str: string): Boolean;
    /**
     * 获取对象的键
     * @param obj
     */
    objKey(obj: any): any[];
    /**
     * 获取对象的值
     * @param obj
     */
    objVal(obj: any): any[];
    /**
     * 判断对象是否为空
     * @param obj 对象
     */
    isEmpty(obj: any): boolean;
    /**
     * 移除对象中某些元素
     * @param obj 对象
     * @param ...str  需要移除的元素
     */
    expectSome(obj: any, ...str: any[]): any;
    /**
     * x-a转驼峰xA
     * @param str
     */
    cameCase(str: string): string;
    /**
     * 驼峰xA转x-a
     * @param str
     */
    _cameCase(str: string): string;
    /**
     * 合并对象
     * @param target
     * @param source
     */
    extend(target: any, source: any): any;
    /**
     * 去除空格 回车 换行
     * @param str
     */
    trimStr(str: any): any;
    /**
     * 获取当前时间 20190516
     */
    now(): string;
    page(): {
        width: number;
        height: number;
    };
    /**
     * 将class转换为json
     * @param fn class函数
     * @param isRoot 是否为根组件
     */
    classToJson(fn: any, isRoot?: boolean): {
        componentJson: any;
        rootComponent: object;
    };
    /**
     * 延迟加载
     * @param delay 延迟时间
     */
    sleep(delay?: number): Promise<void>;
    /**
     * 判断元素是否为null或者undefined
     * @param ele
     */
    isNil(ele: any): boolean;
}
