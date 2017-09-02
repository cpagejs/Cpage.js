import targetDom from './targetDom';
import Util from '../util';
import * as $log from '../log';

// 事件的操作
export default class eventModel extends targetDom {
    constructor(selector){
        super(selector);
    }
    
    // 事件绑定
    public on(eventType:string, fn:Function):void{
        this.each(this.els, (val, index)=>{
            val.addEventListener(eventType, fn, false);
        });
    }

    // 解除事件绑定
    public off(eventType:string, fn:Function):void{
        this.each(this.els, (val, index)=>{
            val.removeEventListener(eventType, fn, false);
        });
    }

    // 鼠标移入移除
    public hover(hover:Function, out:Function){
        for(let i of this.els){
			if(Util.type(hover) == 'function'){
				i.addEventListener('mouseover', hover, false);
			}else{
				throw new Error('hover方法：没有传递回调函数');
			}
			if(Util.type(out) == 'function'){
				i.addEventListener('mouseout', hover, false);
			}
		}
		return this;
    }

    // 点击事件
    public click(fn:Function){
        for(let i of this.els){
            if(Util.type(fn) == 'function'){
                i.addEventListener('click', fn, false);
            }
        }
        return this;
    }

    //设置点击切换方法
    public toggle(){
        for(let i of this.els){
			(function (element, args) {
                var count = 0;
                element.addEventListener('click', function () {
					args[count++ % args.length].call(this);
				},false);
			})(i, arguments);
		}
		return this;
    }

    //窗口滚动事件
    public scroll(fn:Function){
        for(let i of this.els){
            if(Util.type(fn) == 'function'){
                i.addEventListener('scroll', fn, false);
            }
        }
        return this;
    }

    public resize(fn:Function){
        for(let i of this.els){
			var offsetLeft = i.offsetLeft;
			var offsetWidth = i.offsetWidth;
			var offsetTop = i.offsetTop;
            var offsetHeight = i.offsetHeight;
            (<any>window).onresize = function(){
                fn();
                if(offsetLeft >= Util.page().width-offsetWidth){
					offsetLeft = Util.page().width-offsetWidth;
				}
				if(offsetTop >= Util.page().height-offsetHeight){
					offsetTop = Util.page().height-offsetHeight;
				}
            }
		}
		return this;
    }
}
