import targetDom from './targetDom';
import nodeModel from './nodeModel';
import eventModel from './eventModel';
import moveModel from './moveModel';
import { applyMixins } from '../mixins';

// dom操作
class DomAction extends targetDom {

    constructor(selector){
        super(selector);
    }
}

applyMixins(DomAction, [nodeModel, eventModel, moveModel]);

const Dom = function(selector){
    const dom = new DomAction(selector);
    return dom;
}

export default Dom;