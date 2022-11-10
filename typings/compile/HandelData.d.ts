/**
 * 监听组件的data数据变化
 */
declare class HandelData {
    private data;
    private name;
    private token;
    private props;
    private componentStatus;
    constructor();
    $data(key: any, val: any): any;
}
declare const Data: HandelData;
export default Data;
