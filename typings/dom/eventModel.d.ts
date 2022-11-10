import targetDom from './targetDom';
export default class eventModel extends targetDom {
    constructor(selector: any);
    on(eventType: string, fn: Function): void;
    off(eventType: string, fn: Function): void;
    hover(hover: Function, out: Function): this;
    click(fn: Function): this;
    toggle(): this;
    scroll(fn: Function): this;
    resize(fn: Function): this;
}
