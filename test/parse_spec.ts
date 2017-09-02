import 'mocha';
import { expect } from 'chai';
import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonchai from 'sinon-chai';
chai.use(sinonchai);

import parse from '../src/parse/index';
var cb;

describe('parse测试',function(){

	describe('1）测试数字类型',function(){

		it('1, 解析整数',function(){
			cb = parse.parse('123');
			expect(cb()).to.eq(123);
		});

		it('2, 解析浮点数',function(){
			cb = parse.parse('1.2');
			expect(cb()).to.eq(1.2);
		});

		it('3, 解析浮点数--省略首位0',function(){
			cb = parse.parse('.21');
			expect(cb()).to.eq(0.21);
		});

		it('4, 解析指数',function(){
			cb = parse.parse('12e2');
			expect(cb()).to.eq(1200);
		});

		it('5, 解析指数',function(){
			cb = parse.parse('.12e2');
			expect(cb()).to.eq(12);
		});

		it('6, 解析指数',function(){
			cb = parse.parse('12E+2');
			expect(cb()).to.eq(1200);
		});

		it('7, 解析指数',function(){
			cb = parse.parse('12e-2');
			expect(cb()).to.eq(0.12);
		});

		it('8, 解析非指数',function(){
			cb = function(){
				return parse.parse('12e--2')()
			};
			expect(cb).to.throw('指数格式错误！');
		});

		it('8, 解析指数',function(){
			cb = function(){
				return parse.parse('12E+')()
			};
			expect(cb).to.throw("指数格式错误！");
		});

		it('9, 解析指数',function(){
			cb = function(){
				return parse.parse('12e-')()
			};
			expect(cb).to.throw('指数格式错误！');
		});
	});

	describe('2）测试字符串',function(){
		it('1, 解析字符串',function(){
			cb = parse.parse('"abc"');
			expect(cb()).to.eq("abc");
		});

		it('2, 解析字符串',function(){
			cb = parse.parse('"ab\tc"');
			expect(cb()).to.eq("ab\tc");
		});

		it('3 解析字符串',function(){
			cb = parse.parse('"ab\\\c"');
			expect(cb()).to.eq("ab\c");
		});
	});
    
	describe('3）测试true,false,null',function(){
		it('1, 解析true',function(){
			cb = parse.parse('true');
			expect(cb()).to.eq(true);
		});
    
		it('2, 解析false',function(){
			cb = parse.parse('false');
			expect(cb()).to.eq(false);
		});
    
		it('3, 解析null',function(){
			cb = parse.parse('null');
			expect(cb()).to.eq(null);
		});
    
		it('4, 解析undefined',function(){
			cb = parse.parse('undefined');
			expect(cb()).to.eq(undefined);
		});
	});
    
	describe('4）测试空格',function(){
		it('1, 空格',function () {
			cb = parse.parse(' 12 ');
			expect(cb()).to.eq(12);
		});
	});
    
	describe('5）测试数组',function(){
        it('1, 空数组',function () {
            cb = parse.parse('[]');
            expect(cb()).to.deep.eq([]);
        });
    
		it('2, 非空数组-单个元素',function () {
            cb = parse.parse('[12]');
            expect(cb()).to.deep.eq([12]);
        });
    
		it('3, 非空数组-末尾有逗号',function () {
            cb = parse.parse('[12,]');
            expect(cb()).to.deep.eq([12]);
        });
    
		it('4, 非空数组-多个元素',function () {
            cb = parse.parse('[12,23]');
            expect(cb()).to.deep.eq([12,23]);
    
			var cb2 = parse.parse('["ab","cd"]');
            expect(cb2()).to.deep.eq(["ab","cd"]);
    
			var cb3 = parse.parse("['ab']");
            expect(cb3()).to.deep.eq(['ab']);
        });
    
		it('5, 非空数组-字符元素',function () {
			cb = parse.parse('[1,"abc",[2,3]]');
			expect(cb()).to.deep.eq([1,"abc",[2,3]]);
		});
    
		it('6, 非空数组-数组嵌套',function () {
			cb = parse.parse('[[1,[2,3]],"abc",["c","d"]]');
			expect(cb()).to.deep.eq([[1,[2,3]],"abc",["c","d"]]);
		});
	});
    
	describe('6）测试对象',function(){
        it('1, 空对象',function () {
            cb = parse.parse('{}');
            expect(cb()).to.deep.eq({});
        });

		it('2, 非空对象',function () {
            cb = parse.parse('{"id":1, "flag": true, "arr": [1,2]}');
            expect(cb()).to.deep.eq({"id":1, "flag": true, "arr": [1,2]});
        });

		it('3, 非空对象',function () {
            cb = parse.parse('{a:1, b:[1,2]}');
            expect(cb()).to.deep.eq({a:1, b:[1,2]});
        });
	});

	describe('7)测试属性赋值',function(){
		it('1, 简单属性',function(){
			cb = parse.parse('a');
			var cb2 = parse.parse('b');
			var cb3 = parse.parse('c');

			expect(cb({a:12,b:1})).to.eq(12);
			// expect(cb({})).to.be.undefined;
			expect(cb2({b:12})).to.eq(12);
			expect(cb3({c:12})).to.eq(12);
		});

		it('2, 简单属性',function(){
			cb = parse.parse('a');
			// expect(cb()).to.be.undefined;
		});

		it('3, 测试this',function(){
			cb = parse.parse('this');
			var obj = {};
			expect(cb(obj)).to.eq(obj);
		});

		it('4, 多属性',function(){
			cb = parse.parse('a.b');
			expect(cb({a:{b:1}})).to.eq(1);
		});

		it('5, 多属性',function(){
			cb = parse.parse('a.b.c');
			expect(cb({a:{b:{c:1}}})).to.eq(1);
		});
	});

	describe('8)测试locals数据',function(){
		it('1, locals数据',function(){
			cb = parse.parse('a');
			var scope = {a:1};
			var local = {b:2};
			expect(cb(scope, local)).to.eq(1);
		});

		it('2, locals数据',function(){
			cb = parse.parse('a.b');
			var scope = {a:{b:1}};
			var local = {a:{b:2}};
			expect(cb(scope, local)).to.eq(2);
		});
	});

	describe('9)方括号形式属性',function(){
		it('1, 方括号',function(){
			cb = parse.parse('a["b"]');
			expect(cb({a:{b:1}})).to.eq(1);
		});

		it('2, 方括号',function(){
			cb = parse.parse('a[1]');
			expect(cb({a:[1,2]})).to.eq(2);
		});

		it('3, 方括号',function(){
			cb = parse.parse('b[a]');
			expect(cb({a:'a1',b:{a1:10}})).to.eq(10);
		});
	});

	describe('10)测试函数',function(){
		it('1, 函数',function(){
			cb = parse.parse('a()');
			expect(cb({a:function(){return 123}})).to.eq(123);
		});

		it('2, 函数传参数',function(){
			cb = parse.parse('a(123)');
			expect(cb({a:function(str){return str}})).to.eq(123);
		});

		it('3, 函数传参数',function(){
			cb = parse.parse('a(n)');
			expect(cb({n:123, a:function(str){return str}})).to.eq(123);
		});

		it('4, 函数',function(){
			var obj = {
				a:{
					b:12,
					c:function(){
						return this.b
					}
				}
			};
			expect(parse.parse('a["c"]()')(obj));
			expect(parse.parse('a.c()')(obj));
		});

		it('5, this',function(){
			var obj = {
				a:function(){ return this }
			};
			expect(parse.parse('a()')(obj)).to.deep.equal(obj);
		});
	});

	describe('11)测试赋值',function(){
		it('1,简单属性值',function(){
			cb = parse.parse('a=12');
			var obj = {};
			cb(obj);
			expect(obj['a']).to.eq(12);
		});

		it('2,简单属性值',function(){
			cb = parse.parse('a.b=12');
			var obj = {a:{}};
			cb(obj);
			expect(obj['a']['b']).to.eq(12);
		});

		it('3,简单属性值',function(){
			cb = parse.parse('a.b.c=12');
			var obj = {};
			cb(obj);
			expect(obj['a']['b']['c']).to.eq(12);
		});
	});

	describe('12)安全的属性名',function(){
		it('1,测试constructor',function(){
			var fn = function(){
				return parse.parse('a.constructor')({a:{}})
			};
			expect(fn).to.throw(Error);
		});

		it('2,测试__defineGetter__',function(){
			var fn = function(){
				return parse.parse('a.__defineGetter__')({a:{}})
			};
			expect(fn).to.throw(Error);
		});

	});

	describe('13)安全的对象',function(){
		it('1,window对象', function(){
			var fn = function(){
				return parse.parse('a.b')({a:{b:window}});
			}
			expect(fn).to.throw(Error);
		});

		it('2,window对象', function(){
			var fn = function(){
				return parse.parse('a.b')({a:function(){}, b:window});
			}
			expect(fn).to.throw(Error);
		});

		it('2,window对象', function(){
			var fn = function(){
				return parse.parse('a.alert(1)')({a:window});
			}
			expect(fn).to.throw(Error);
		});

		it('3,window对象', function(){
			var fn = function(){
				return parse.parse('a()')({a:function(){return window}});
			}
			expect(fn).to.throw(Error);
		});

		it('4,window对象', function(){
			var fn = function(){
				return parse.parse('a')({a:window});
			}
			expect(fn).to.throw(Error);
		});
	});

	describe('14)函数安全',function(){
		it('1,call',function(){
			var fn = function(){
				return parse.parse('a.call(b)')({a:function(){}, b:function(){}});
			}
			expect(fn).to.throw(Error);
		});

		it('2,apply',function(){
			var fn = function(){
				return parse.parse('a.apply(b)')({a:function(){}, b:function(){}});
			}
			expect(fn).to.throw(Error);
		});
	});

	describe('15)运算表达式',function(){

		describe('1,一元表达式+',function(){
			it('1, +',function(){
				expect(parse.parse('+12')()).to.eq(12);
				expect(parse.parse('+a')({a:12})).to.eq(12);
				expect(parse.parse('+a')({})).to.eq(0);
			});

			it('2, !',function(){
				expect(parse.parse('!true')()).to.eq(false);
				expect(parse.parse('!12')()).to.eq(false);
				expect(parse.parse('!a')({a:true})).to.eq(false);
				expect(parse.parse('!!a')({a:true})).to.eq(true);
				expect(parse.parse('"!"')()).to.eq('!');
			});

			it('3, -',function(){
				expect(parse.parse('-12')()).to.eq(-12);
				expect(parse.parse('-a.b')({a:{b:12}})).to.eq(-12);
				expect(parse.parse('-a')({})).to.eq(0);
			});
		});

		describe('2,二元表达式',function(){
			it('1,乘法运算',function(){
				expect(parse.parse('2*3')()).to.eq(6);
			});

			it('2,除法运算',function(){
				expect(parse.parse('6%3')()).to.eq(0);
			});

			it('3,求余数运算',function(){
				expect(parse.parse('6/3')()).to.eq(2);
			});
		});

		describe('3,加法运算',function () {
			it('1,加法',function(){
				expect(parse.parse('2 +3')()).to.eq(5);
				expect(parse.parse('2 -3')()).to.eq(-1);
			});

			it('2,加法',function(){
				expect(parse.parse('2 + 3 * 2')()).to.eq(8);
				expect(parse.parse('2 - 3/1 + 1')()).to.eq(0);
			});

			it('3,加法',function(){
				expect(parse.parse('a+2')()).to.eq(2);
			});
		});

		describe('4,比较运算符',function(){
			it('1,比较运算',function(){
				expect(parse.parse('1>2')()).to.eq(false);
				expect(parse.parse('1<2')()).to.eq(true);
				expect(parse.parse('1>=2')()).to.eq(false);
				expect(parse.parse('1<=2')()).to.eq(true);
			});

			it('2,比较运算',function(){
				expect(parse.parse('1 === 2')()).to.eq(false);
				expect(parse.parse('1!=2')()).to.eq(true);
				expect(parse.parse('1 === 1')()).to.eq(true);
				expect(parse.parse('[] == []')()).to.eq(false);
			});
		});

		describe('5,与或运算符',function(){
			it('1,与',function(){
				expect(parse.parse('true && true')()).to.eq(true);
				expect(parse.parse('true && false')()).to.eq(false);
			});

			it('1,或',function(){
				expect(parse.parse('true || true')()).to.eq(true);
				expect(parse.parse('true || false')()).to.eq(true);
			});
		});

		describe('6,三元运算符',function(){
			it('1,测试',function(){
				expect(parse.parse('a>2?1:0')({a:3})).to.eq(1);
			});
		});

		describe('7,括号',function(){
			it('1,测试括号',function(){
				expect(parse.parse('(1+2)*3')()).to.eq(9);
			});
		});

		describe('8,多个表达式',function(){
			it('1,多表达式',function(){
				cb = parse.parse('a=1;b=2');
				var obj = {};
				cb(obj);
				expect(obj).to.deep.eq({a:1,b:2});
			});

			it('2,多表达式',function(){
				expect(parse.parse('a=1;b=2;a+b')({})).to.eq(3);
			});
		});

	})

	describe('16),字面量',function(){
        it('1,数字型',function(){
            expect(parse.parse('12').literal).to.eq(true);
        });

        it('2,字符串',function(){
            expect(parse.parse('"abc"').literal).to.eq(true);
        });

        it('3,数组',function(){
            expect(parse.parse('[1,2]').literal).to.eq(true);
        });

        it('4,对象',function(){
            expect(parse.parse('{ID:1}').literal).to.eq(true);
        });

        it('5,运算符',function(){
            expect(parse.parse('1+2').literal).to.eq(false);
        });

        it('6,数组',function(){
            expect(parse.parse('[1,2,a]').literal).to.eq(true);
        });
    });

    describe('17),常量',function(){
        it('1,数字型',function(){
            expect(parse.parse('12').constant).to.eq(true);
        });

        it('2,字符串',function(){
            expect(parse.parse('"abc"').constant).to.eq(true);
        });

        it('3,boolean',function(){
            expect(parse.parse('true').constant).to.eq(true);
        });

        it('4,字符',function(){
            expect(parse.parse('abc').constant).to.eq(false);
        });

        it('4,对象',function(){
            expect(parse.parse('{ID:1}').literal).to.eq(true);
        });

        it('5,运算符',function(){
            expect(parse.parse('1+2').literal).to.eq(false);
        });

        it('6,数组',function(){
            expect(parse.parse('[1,2]').constant).to.eq(true);
            expect(parse.parse('[1,2,[3]]').constant).to.eq(true);
            expect(parse.parse('[1,2,a]').constant).to.eq(false);
        });

        it('7,对象',function(){
        	expect(parse.parse('{id:1}').constant).to.eq(true);
        	expect(parse.parse('{id:1,addr:"h"}').constant).to.eq(true);
        	expect(parse.parse('{id:1,say:Say}').constant).to.eq(false);
        });

        it('8,this',function(){
        	expect(parse.parse('this').constant).to.eq(false);
        });

        it('9,对象属性',function(){
        	expect(parse.parse('{a:123}.a').constant).to.eq(true);
        	// expect(parse.parse('{a:123}.c').constant).to.eq(false);
        	expect(parse.parse('a.b').constant).to.eq(false);
        });

        it('10,对象属性',function(){
        	expect(parse.parse('{a:123}["a"]').constant).to.eq(true);
        	expect(parse.parse('a["b"]').constant).to.eq(false);
        	expect(parse.parse('a[b]').constant).to.eq(false);
        	expect(parse.parse('{a:123}[c]').constant).to.eq(false);
        });

        it('11,函数',function(){
        	var say = function(){};
        	expect(parse.parse('say()').constant).to.eq(false);
        });

        it('12,管道',function(){
        	parse.register('allNumber',function(str){
        		return typeof str == 'number'
        	});

        	expect(parse.parse('[1,2] | allNumber').constant).to.eq(true);
        	expect(parse.parse('[1,2,a] | allNumber').constant).to.eq(false);
        });

        it('13,赋值表达式',function(){
        	expect(parse.parse('1=2').constant).to.eq(true);
        	expect(parse.parse('1=a').constant).to.eq(false);
        });

        it('14,一元运算',function(){
        	expect(parse.parse('+1').constant).to.eq(true);
        	expect(parse.parse('+a').constant).to.eq(false);
        });

        it('15,二元运算',function(){
        	expect(parse.parse('2+1').constant).to.eq(true);
        	expect(parse.parse('2+a').constant).to.eq(false);
        });

        it('16,逻辑运算',function(){
        	expect(parse.parse('2 && 1').constant).to.eq(true);
        	expect(parse.parse('2 || a').constant).to.eq(false);
        });

        it('17,三元运算符',function(){
        	expect(parse.parse('true ? 1 : 2').constant).to.eq(true);
        	expect(parse.parse('a ? 1 : 2').constant).to.eq(false);
        });
    });

});

