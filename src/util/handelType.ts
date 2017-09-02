import * as $log from '../log';

export default class HandelType {
    /**
	 * 判断数据类型
	 * @param str
	 * @returns {any}
	 */
	public type(str:any):any{
		const toString = Object.prototype.toString,
            map = {
                '[object Boolean]' : 'boolean',
                '[object Number]'  : 'number',
                '[object String]'  : 'string',
                '[object Function]' : 'function',
                '[object Array]'  : 'array',
                '[object Date]'   : 'date',
                '[object RegExp]'  : 'regExp',
                '[object Undefined]': 'undefined',
                '[object Null]'   : 'null',
                '[object Object]'  : 'object',
                '[object Map]' : 'map',
                '[object Set]' : 'set',
                '[object Symbol]' : 'symbol'
		    };
		return map[toString.call(str)];
	}

    /**
	 * 判断输入的内容是否在0~9之间
	 * @param str
	 * @returns {boolean}
	 */
	public isNumber(str:any):Boolean{
		// if(Number(str).toString() != 'NaN') return true;
		// else return false;
		if(this.type(str) != 'string') return false;
			else return str >= '0' && str <= '9';
	}

    /**
     * 判断是否符合指数特征
     * @param ch
     * @returns {boolean|Boolean}
     */
	 public isExponent(ch:any):Boolean{
	 	return ch === '+' || ch === '-' || this.isNumber(ch);
	 }

    /**
     * 判断是否属于特定字符：字母，_, $
     * @param str
     * @returns {boolean}
     */
	public isLetter(str:any):Boolean{
		let arr = str.split('');
		return arr.every((i)=>{
			return (i >= 'a' && i <= 'z') || (i >= 'A' && i <= 'Z') || (i === '_') || (i === '$');
		});
	}

	/**
     * 判断字符是否属于空格
     * @param str
     * @returns {boolean}
     */
	public isWhiteSpace(str:any):Boolean{
		return str === ' ' || str === '\r' || str === '\t' || str === '\n' || str === '\v' || str === '\u00A0';
	}

    /**
     * 判断被解析的字符串属于那种数据类型
     * @param str
     * @returns {any}
     */
	public whichType(str:any):any{
		if(this.type(str) != 'string') $log.error('数据类型错误'+str);

		// '12', '12.12', '0.12e2'
		if(this.isNumber(str) || str === '.') return 'number';

		// '"abc"'  "'abc'"
		else if(str.charAt(0) === "'" || str.charAt(0) === '"') return 'string';

		//字母，_, $
		else if(this.isLetter(str)) return 'letter';

		// '["a","b"]'
		else if(
			(str === '[' || str === ']' || str === ',')
		) return 'array';

		// '{}'
		else if(
			(str === '{' || str === '}' || str === ':')
		) return 'object';

		// 'function'
		else if(str === '(' || str === ')')
			return 'function';

		else return 'other';

	}
}