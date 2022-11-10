export default class Duff {
    private _array;
    private _fn;
    constructor(array: any, fn: any);
    get array(): Array<any>;
    set array(value: Array<any>);
    get fn(): Function;
    set fn(value: Function);
    duff(): void;
}
