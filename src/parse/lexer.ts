import * as $log from '../log';
import Util from '../util';
import { SPECIALS, LETTER, OPERATORS } from "../config/lexer_config";

/**
 * 此法解析器，用于解析{{a + b}} 之类的插值运算
 */
export default class Lexer {

    private index:number;
    private now:any;
    private tokens:Array<any>;
    private text;

    constructor(){
        this.index = 0;
        this.now = undefined;
        this.tokens = [];
        this.text = '';
    }
    
    /**
     * 词法解析函数
     * @param text
     * @returns {Array<any>}
     */
    public lex(text:string):Array<any>{
        this.text = text;

        while(this.index < this.text.length){
            this.now = this.text.charAt(this.index);
            if(
                Util.whichType(this.now) == 'number' ||
                (this.now === '.' && Util.whichType(Util.nextLeter(this.index, this.text)))
            ){
                this.loopNumber();
            }
            else if(Util.whichType(this.now) == 'string'){
                this.loopString(this.now);
            }
            else if(Util.whichType(this.now) == 'letter'){
                this.loopLetter();
            }
            else if(Util.isWhiteSpace(this.now)){
                this.index++;
            }
            else if(Util.inStr(this.now, '[],{}.:()?;')){
                this.pushObj();
            } 
            else{
                this.loopOperator();
            }
        }

        return this.tokens;
    }

    /**
     * 添加词法解析对象
     */
    private pushObj():void{
        this.tokens.push({
            text: this.now,
            value: this.now
        });
        this.index++;
    }

    /**
     * 获取下一个字符
     * @param n
     * @returns {string|boolean}
     */
    private nextStr(n:number=1){
        return (this.index + n < this.text.length) ?
                                                    this.text.charAt(this.index + n) :
                                                    false;
    }

    /**
     * 遍历数字类
     */
    private loopNumber():void{
        let number = '';

        while(this.index < this.text.length){
            const now = this.text.charAt(this.index).toLowerCase();
            if(
                Util.whichType(now) == 'number' || now === '.'
            ){
                number += now;
            } else {
                const next = Util.nextLeter(this.index, this.text);
                const prev = number.charAt(number.length - 1);

                if(now == 'e' && Util.isExponent(next)){
                    number += now;
                } else if(Util.isExponent(now) && prev === 'e' && next && Util.isNumber(next)){
                    number += now;
                } else if(Util.isExponent(now) && prev === 'e' && (!next || !Util.isNumber(next))){
                    $log.error("指数格式错误！");
                } else {
                    break;
                }
            }
            this.index++;
        }

        this.tokens.push({
            text: number,
            value: Number(number)
        });
    }

    /**
     * 遍历字符串类，'"abc"'
     */
    private loopString(quote):void{
        this.index++;
        let string = '',
            //避免单独的操作符匹配错误，例如'"!"'
            raw = quote;

        while(this.index < this.text.length){
            const now = this.text.charAt(this.index);
            raw += now;
            if(now == quote){  //保证首位字符相同
                this.index++;
                this.tokens.push({
                    text: raw,
                    value: string
                });
                return;
            } else if(now == SPECIALS[now]){  //匹配特殊字符
                string += SPECIALS[now];
            } else {
                string += now;
            }
            this.index++;
        }

        $log.error('无法匹配的符号');
    }

    /**
     * 字符类, 'abc_$'
     */
    private loopLetter():void{
        let letter = '';

        while(this.index < this.text.length){
            const now = this.text.charAt(this.index);
            if(Util.isLetter(now) || Util.isNumber(now)){
                letter += now;
            }else{
                break;
            }
            this.index++;
        }

        // 针对boolean,null,undefined
        let v = LETTER.hasOwnProperty(letter) ? LETTER[letter] : letter;

        this.tokens.push({
            text: letter,
            identifier: true,
            value: v
        });
    }

    /**
     * 操作符，+- ！==
     */
    private loopOperator():void{
        const str = this.now,
            str2 = this.now + this.nextStr(1),
            str3 = this.now + this.nextStr(1) + this.nextStr(2),
            op = OPERATORS[str],
            op2 = OPERATORS[str2],
            op3 = OPERATORS[str3];

        if(op || op2 || op3){
            const ct = op3 ? str3 : (op2 ? str2 : str);
            this.tokens.push({
                text: ct,
                value: ct
            });
            this.index += ct.length;
        }else{
            $log.error('未识别的字符'+this.now);
        }
    }

}