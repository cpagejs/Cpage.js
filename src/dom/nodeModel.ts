import targetDom from './targetDom';
import Util from '../util';
import * as $log from '../log';

// 操作dom节点
export default class nodeModel extends targetDom {
    constructor(selector){
        super(selector);
    }

    /**
     * 设置，获取html
     * @param str html值
     */
    public html(str?:string){
        if(str && Util.type(str) != 'string'){
            return;
        }
        if(!str){
            return this.els[0].innerHTML;
        }
        else {
            this.each(this.els, (val, index)=>{
                val.innerHTML = str;
            });
            return this;
        }
    }

    /**
     * 设置，获取节点文本
     * @param str 文本值
     */
    public text(str?:string){
        if(str && Util.type(str) != 'string'){
            return;
        }
        for(let i of this.els){
            if(arguments.length == 0) {
				return i.innerText || i.textContent;
			}else if(arguments.length == 1){
				if(i.innerText){
					i.innerText = str;
				}else{
					i.textContent = str;
				}
			}
        }
        return this;
    }

    public css(key:string, value?:string){
        if(key && Util.type(key) != 'string'){
            return;
        }
        if(value && Util.type(value) != 'string'){
            return;
        }

        for(let i of this.els){
            if(arguments.length == 1){
                return (<any>window).getComputedStyle(i, null)[key];
            }else if(arguments.length == 2){
                i.style[key] = value;
                return this;
            }
        }
    }

    /**
     * 获取，设置元素宽度
     * @param str 
     */
    public width(str?:string){
        if(str && Util.type(str) != 'string'){
            return;
        }
        for(let i of this.els){
            if(str){
                i.style.width = str;
            }
            else {
                return i.offsetWidth;
            }
        }
        return this;
    }

     /**
     * 获取，设置元素高度
     * @param str 
     */
    public height(str?:string){
        if(str && Util.type(str) != 'string'){
            return;
        }
        for(let i of this.els){
            if(str){
                i.style.height = str;
            }
            else {
                return i.offsetHeight;
            }
        }
        return this;
    }

    /**
     * 获取，设置节点的属性值
     * @param attr 属性名
     * @param value 属性值
     */
    public attr(attr:string, value?:string){
        if(Util.type(attr) != 'string'){
            return;
        }
        if(value && Util.type(value) != 'string'){
            return;
        }
        for(let i of this.els){
            if(arguments.length == 1){
                if(i.hasAttribute(attr)){
                    return i.getAttribute(attr);
                }
            }else if(arguments.length == 2){
                i.setAttribute(attr, value);
                return this;
            }
        }
    }

    /**
     * 获取，设置节点的value值
     * @param str value值
     */
    public val(str:string){
        if(str && Util.type(str) != 'string'){
            return;
        }
        for(let i of this.els){
			if(arguments.length == 1){
				var oldStr =i.getAttribute('value');
				i.setAttribute(oldStr,str);
			}else if(arguments.length == 0){
				if(i.nodeName.match(/INPUT|TEXTAREA|SELECT|RADIO|CHECKBOX/)){
					return i.value;
				}
				return i.getAttribute('value');
			}
		}
		return this;
    }

    /**
     * 给节点添加class
     * @param name 
     */
    public addClass(name){
        if(name && Util.type(name) != 'string'){
            return;
        }
        for(let i of this.els){
            i.classList.add(name)
         }
         return this;
    }

    /**
     * 删除节点的class
     * @param name 
     */
    public removeClass(name){
        if(name && Util.type(name) != 'string'){
            return;
        }
        for(let i of this.els){
            i.classList.remove(name)
        }
        return this;
    }

    /**
     * 切换class
     */
    public toggleClass(name){
        if(name && Util.type(name) != 'string'){
            return;
        }
        for(let i of this.els){
            if(i.classList.toggle(name)){
                return true;
            }else {
                return false;
            }
         }
    }

}