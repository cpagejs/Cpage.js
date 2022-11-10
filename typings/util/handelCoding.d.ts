export default class HandelCoding {
    /**
     * 组合对象属性语句，类似于a.b
     * @param left
     * @param right
     * @returns {any}
     */
    nonComputedMember(left: any, right: any): any;
    /**
     *
     * @param left
     * @param right
     * @returns {any}
     */
    computedMember(left: any, right: any): any;
    /**
     * 组合成条件不存在的语句 例如!(str)
     * @param expression any
     * @returns {any}
     */
    notExist(expression: any): any;
    /**
     * 组合js表达式,例如组合成 var a = 123;
     * @param token
     * @param value
     * @returns {any}
     */
    concatCode(token: string, value: any): any;
    /**
    * 此方法用于模拟if语句，判断参数是否成立，并组装成if语句
    * @param condition
    * @param statement
    */
    conditionIsRight(array: Array<any>, condition: any, statement: any): void;
    /**
     * 该函数每次被调用，参数id递增
     * @param id
     * @return {string}
     */
    compileId(id: number, arr: any[], flag?: Boolean): string;
}
