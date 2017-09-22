import 'mocha';
import { expect } from 'chai';
import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonchai from 'sinon-chai';
chai.use(sinonchai);

// import Util from '../built/util.js';
import Util from '../src/util/index';

describe('Util工具函数测试',function(){
	var u; 

    beforeEach(function(){
        u = Util;
    });

	it('1, type测试',function(){
		var uu = u.type('str');

		expect(uu).to.eq('string');
	});

	it('2, compare比较数组',function(){
		var uu = u.compare([1,2],[1,2]);
		expect(uu).to.eq(true);
	});

	it('3, compare比较数组对象',function(){
		var a = [{id:1,a:function(){alert(1)},f:false},{id:2,a:function(){alert(2)},f:false}];
		var b = {id:2,a:function(){alert(2)},f:false};
		var uu = u.compare(a[1], b);
		expect(uu).to.eq(true);
	});

	it('4, areEqual函数',function(){
		var a = 0/0;
		var b = 0/0;
		var uu = u.areEqual(a, b);
		expect(uu).to.eq(true);
	});

	it('5, 浅拷贝',function(){
		var arr1 = ['ab'];
		var arr2 =u.clone(arr1);
		expect(arr2).to.deep.eq(arr1);
	});

	it('6, 深拷贝',function(){
		var arr1 = ['ab'];
		var arr2 =u.deepClone(arr1);
		expect(arr2).to.deep.eq(arr1);
	});

	it('7, repeatObj测试字符串',function(){
		var str = 'ab';
		var u1 = u.repeatObj(str, 2);
		expect(u1).to.eq('abab');
	});

	it('8, repeatObj测试函数',function(){
		var aa = sinon.spy();
		var u1 = u.repeatObj(aa, 2);

		expect(aa).to.have.been.callCount(2);
	});

	it('9, uArray数组去重',function(){
		var arr = [1,2,3,1];
		var newArr = u.uArray(arr);

		expect(newArr).to.deep.eq([1,2,3]);
	});

	it('10, objToMap对象转map对象',function(){
		var obj = {id:1,cb:function(){}};
		var newObj = u.objToMap(obj);

		expect(newObj.constructor).to.eq(Map);
		expect(newObj.get('id')).to.eq(1);
	});

	it('11, mapToObjmap对象转普通对象',function(){
		var map = new Map();
		map.set('id',3);
		map.set('addr','addraddr');
		var newObj = u.mapToObj(map);

		expect(newObj.constructor).to.eq(Object);
		expect(newObj).to.deep.eq({id:3,addr:'addraddr'});
	});

	it('12, exitFirst函数测试',function(){
		var a = [{text:'['}];
		var b = '[';
		var res = u.exitFirst(a, b);
		expect(res).to.deep.eq({text:'['});
	});

	it('13, uArray数组去重',function(){
		var a = [1,1,2,];
		var b = u.uArray(a);
		expect(b).to.deep.eq([1,2]);
	});
});
