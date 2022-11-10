export interface utilAction {
    isEqual(str1: any, str2: any): Boolean;
    areEqual(newVal: any, oldVal: any, equalStatus: Boolean): Boolean;
    compare(a: any, b: any): Boolean;
    clone(str: any): any;
    repeatObj(obj: any, manyTime: Number): any;
    everyScope(cb: Function, scope: any): any;
    handelEvent(eventName: any, arr: Array<any>, scope: any): void;
    uArray(arr: Array<any>): Array<number> | Array<string> | Array<boolean>;
    objToMap(obj: Object): Map<any, any>;
    mapToObj(map: Map<any, any>): Object;
    nextLeter(index: number, str: string): string | boolean;
    wrapString(str: any): any;
    expect(str: any, arr: Array<any>): any;
    consume(str: any, arr: Array<any>): any;
    exit(str: any, arr: Array<any>): any;
}
