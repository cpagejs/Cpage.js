import * as $log from '../log';
import Util from '../util';
import parse from '../parse';

class ParseTpl {
    public text:String;
    public data:Object;
    public props:Object;

    constructor(text, data, props){
        this.text = text;
        this.data = data;
        this.props = props;
    }

    /**
     * 组合data和props属性
     * @param data 
     * @param props 
     */
    private combineData(data={}, props={}):object{
        if(Util.type(data) != 'object')
            $log.error('组件是属性data必须为对象');
        if(Util.type(props) != 'object')
            $log.error('组件是属性props必须为对象');
        if(Util.isEmpty(props))
            return data;

        for(let i in props){
            data[i] = props[i].default;
        }
        return data;
    }

    // 渲染模板
    public tpl():any{
        let self = this;
        let index = 0,
            parts = [],
            startIndex,
            endIndex,
            exp, expFn;
        if(this.text == undefined){
            return;
        }
        while(index < this.text.length){
            startIndex = this.text.indexOf('{{', index);
            if(startIndex != -1){
                endIndex = this.text.indexOf('}}', startIndex + 2);
            }
            
            if(startIndex != -1 && endIndex != -1){
                if(startIndex != index){
                    parts.push(this.text.substring(index, startIndex));
                }
                exp = this.text.substring(startIndex+2, endIndex);
                expFn = parse.parse(exp);
                parts.push(expFn);
                index = endIndex + 2;
            }else{
                parts.push(this.text.substring(index));
                break;
            }
        }
        // console.log(parts)

        return parts.reduce((prev, cur)=>{
            if(Util.type(cur) == 'function'){
                return prev + self.expectNullUndefined(cur(self.combineData(self.data, self.props)))
            }
            else {
                return prev + cur;
            }
        }, '');
    }

    /**
     * 判断表达式是否为null或者undefined，是则返回''
     * @param str 
     */
    private expectNullUndefined(str):string{
        if(Util.type(str) == 'null' || Util.type(str) == 'undefined'){
            return '';
        }
        else if(typeof str == 'object'){
            return JSON.stringify(str);
        }
        else {
            return '' + str;
        }
    }
}

export default function tpl(text, data, props){
    const parseTpl = new ParseTpl(text, data, props);
    return parseTpl.tpl();
}