import targetDom from './targetDom';
declare class DomAction extends targetDom {
    constructor(selector: any);
}
declare const Dom: (selector: any) => DomAction;
export default Dom;
