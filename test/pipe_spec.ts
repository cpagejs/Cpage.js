import 'mocha';
import { expect } from 'chai';
import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonchai from 'sinon-chai';
chai.use(sinonchai);

import parse from '../src/parse/index';
import Pipe from '../src/pipe/pipe';
const p = new Pipe();

describe('pipe测试',function(){
    describe('1)，注册pipe',function(){
        it('1,注册pipe',function(){
            var mypipe = function(){};
            var pipeFactory = function(){
                return mypipe;
            };

            p.register('my',pipeFactory);

            expect(p.pipe('my')).to.eq(mypipe);
        });

        it('2,以对象方式注册pipe',function(){
            var one = function(){
            };
            var two = function(){
            };

            p.register({
                'one':function(){return one;},
                'two': function(){return two}
            });

            expect(p.pipe('one')).to.eq(one);
        });
    });

    describe('2)管道表达式',function(){
        it('1,转大写',function(){
            parse.register('upper',function(){
                return function(str){
                    return str.toUpperCase();
                }
            });

            var fn = parse.parse('name | upper');
            expect(fn({name:'chen'})).to.eq('CHEN');
        });

        it('2,多个管道',function(){
            parse.register('upper',function(){
                return function(str){
                    return str.toUpperCase();
                }
            });

            parse.register('addStr',function(){
                return function(str){
                    return str + '--pipe';
                }
            });

            var fn = parse.parse('name | upper | addStr');
            expect(fn({name:'li'})).to.eq('LI--pipe');
        });

        it('3,参数',function(){
            parse.register('repeat',function(){
                return function(str, times){
                    return str.repeat(times);
                }
            });

            var fn = parse.parse('"hello" | repeat:3');
            expect(fn()).to.eq('hellohellohello');
        });

        it('4,多个参数',function(){
            parse.register('surround',function(){
                return function(str, left, right){
                    return left + str + right;
                }
            });

            var fn = parse.parse('"hello" | surround:"^":"$"');
            expect(fn()).to.eq('^hello$');
        });

    });

    describe('3)默认注册的array',function(){
        it('1,默认的array',function(){
            expect(parse.pipe('filter')).to.not.be.undefined;
        });

        it('2,filter--函数',function(){
            var fn = parse.parse('[1,2,3] | filter:isOdd');
            var cb = {
                isOdd:function(str){
                    return str%2 != 0
                }
            };
            expect(fn(cb)).to.deep.eq([1,3]);
        });

        it('3,过滤字符串',function(){
            var fn = parse.parse('arr|filter:"a"');
            expect(fn({arr:["a","b"]})).to.deep.eq(["a"]);
        });

        it('4,过滤字符串',function(){
            var fn = parse.parse('arr|filter:"a"');
            expect(fn({arr:["cab","b",1]})).to.deep.eq(["cab"]);
        });

        it('5,过滤对象',function(){
            var fn = parse.parse('arr|filter:"j"');
            expect(fn({arr:[{name:"jone"},{name:"ke"}]})).to.deep.eq([{name:"jone"}]);
        });

        it('6,过滤null',function(){
            var fn = parse.parse('arr|filter:"null"');
            expect(fn({arr:[{name:"null"},{name:"ke"}]})).to.deep.eq([{name:"null"}]);
        });

        it('7,过滤null',function(){
            var fn = parse.parse('arr|filter:null');
            expect(fn({arr:[null,{name:"null"},{name:"ke"}]})).to.deep.eq([null]);
        });

        it('8,过滤数字',function(){
            var fn = parse.parse('[1,2] | filter:1');
            expect(fn()).to.deep.eq([1]);
        });

        it('9,取反',function(){
            var fn = parse.parse('["a","ab","c"] | filter:"!a"');
            expect(fn()).to.deep.eq(["c"]);
        });

        it('10,过滤对象',function(){
            var fn = parse.parse('arr | filter:{name:"a"}');
            expect(fn({arr:[{name:'ao'},{name:"li"}]})).to.deep.eq([{name:"ao"}]);
        });
    });

});