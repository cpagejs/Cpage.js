import targetDom from './targetDom';

export default class moveModel extends targetDom {
    constructor(selector){
        super(selector);
    }

    public show(delay:number){
        if(delay && typeof delay == 'number') {
			for(let i of this.els){
				setTimeout(function(){
					i.style.display = 'none';
				},delay || 500);
			}
		}else if(!delay){
			for(let i of this.els){
				i.style.display = 'block';
			}
		}
		return this;
    }

    public hide(delay:number){
        if(delay && typeof delay == 'number') {
			for(let i of this.els){
				setTimeout(function(){
					i.style.display = 'block';
				},delay || 500);
			}
		}else if(!delay){
			for(let i of this.els){
				i.style.display = 'none';
			}
		}
		return this;
    }
}