export default class HandelCoding {

    /**
	 * 组合对象属性语句，类似于a.b
	 * @param left 
	 * @param right 
	 * @returns {any}
	 */
	 public nonComputedMember(left:any, right:any):any{
        return '(' + left + ').' + right;
    }

    /**
     * 
     * @param left 
     * @param right 
     * @returns {any}
     */
    public computedMember(left:any, right:any):any{
        return '(' + left + ')[' + right + ']';
    }

    /**
     * 组合成条件不存在的语句 例如!(str)
     * @param expression any
     * @returns {any}
     */
    public notExist(expression:any):any{
        return '!(' + expression + ')';
    }

	/**
	 * 组合js表达式,例如组合成 var a = 123;
	 * @param token 
	 * @param value 
	 * @returns {any}
	 */
	public concatCode(token:string, value:any):any{
        return token + '=' + value + ';';
    }

	 /**
     * 此方法用于模拟if语句，判断参数是否成立，并组装成if语句
     * @param condition 
     * @param statement 
     */
    public conditionIsRight(array:Array<any>, condition:any, statement:any):void{
        array.push('if(', condition, '){', statement, '}');
    }

    /**
     * 该函数每次被调用，参数id递增
     * @param id
     * @return {string} 
     */
    public compileId(id:number, arr:any[], flag?:Boolean):string{
        let uid = 'compileId' + id;
        if(!flag){
            arr.unshift(uid);
        }
        return uid;
    }
}