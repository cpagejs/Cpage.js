import 'mocha';
import { expect } from 'chai';
import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonchai from 'sinon-chai';
chai.use(sinonchai);

import Loader from '../../built/store/loader/index';
import Injector from '../../built/store/injector/index';

describe('injector测试', function () {

    describe('1),injector', function () {
        var loader;
        var inject;

        beforeEach(function(){
            loader = new Loader();
            inject = new Injector();
        });

        it('1,injector--has', function () {
            var app = loader.module('li', []);
            app.data('str', 123);
            var ins = inject.inject(['li']);
            expect(ins.has('str')).to.eq(true);
        });

        it('2,injector--get', function () {
            var app = loader.module('li', []);
            app.data('str', 123);
            var ins = inject.inject(['li']);
            expect(ins.get('str')).to.eq(123);
        });

        it('3,多个module', function () {
            var app = loader.module('li', []);
            app.data('str', 123);
            var app2 = loader.module('li2', ['li']);
            app2.data('str2', 456);

            var ins = inject.inject(['li2']);
            expect(ins.has('str')).to.eq(true);
            expect(ins.get('str')).to.eq(123);
            expect(ins.has('str2')).to.eq(true);
            expect(ins.get('str2')).to.eq(456);
        });
    });

    describe('2),invoke', function () {
        var loader;
        var inject;

        beforeEach(function(){
            loader = new Loader();
            inject = new Injector();
        });

        it('1,注入函数', function () {
            var app = loader.module('app', []);
            app.data('a', 1);
            app.data('b', 2);

            var ins = inject.inject(['app']);

            function fn(one, two) {
                return one + two
            }
            (<any>fn).$inject = ['a', 'b'];
            expect(ins.invoke(fn)).to.eq(3);
        });

        it('2,标识符错误', function () {
            var app = loader.module('app', []);
            app.data('a', 1);
            app.data('b', 2);

            var ins = inject.inject(['app']);

            function fn(one, two) {
                return one + two
            }
            (<any>fn).$inject = ['a', 2];
            expect(function () { ins.invoke(fn) }).to.throw('无效的标识符2，标识符应为字符串')
        });

        it('3,对象', function () {
            var app = loader.module('app', []);
            app.data('a', 1);
            var ins = inject.inject(['app']);

            var obj = {
                w: 2,
                fn: function (one) {
                    return one + this.w;
                }
            };

            (<any>obj.fn).$inject = ['a'];
            expect(ins.invoke(obj.fn, obj)).to.eq(3);
        });

        it('4,local参数', function () {
            var app = loader.module('app', []);
            app.data('a', 1);
            app.data('b', 2);

            var ins = inject.inject(['app']);

            function fn(one, two) {
                return one + two
            }
            (<any>fn).$inject = ['a', 'b'];
            expect(ins.invoke(fn, undefined, { b: 3 })).to.eq(4);
        });
    });

    describe('3),annotate', function () {
        var loader;
        var inject;

        beforeEach(function(){
            loader = new Loader();
            inject = new Injector();
        });

        it('1,annotate',function(){
            var ins = inject.inject([]);
            function fn(){}

            (<any>fn).$inject = ['a','b'];
            expect(ins.annotate(fn)).to.deep.eq(['a','b']);
        });

        it('2,fn改造成数组',function(){
            var ins = inject.inject([]);
            var fn = ['a','b',function(){}];
            expect(ins.annotate(fn)).to.deep.eq(['a','b']);
        });

        it('3,fn为空数组或者没有$inject属性',function(){
            var ins = inject.inject([]);
            var fn = [];
            expect(ins.annotate(fn)).to.deep.eq([]);

            function fn2(){}
            expect(ins.annotate(fn2)).to.deep.eq([]);
        });

        it('4,fn有参数但没有$inject属性',function(){
            var ins = inject.inject([]);

            function fn2(a,b){}
            expect(ins.annotate(fn2)).to.deep.eq(['a','b']);
        });

        it('5,fn有参数含有注释',function(){
            var ins = inject.inject([]);

            function fn2(a,/*b,*/c){}
            expect(ins.annotate(fn2)).to.deep.eq(['a','c']);
        });

        it('6,fn有参数含有多个注释',function(){
            var ins = inject.inject([]);

            function fn2(a,/*b,*/c/*,d*/){}
            expect(ins.annotate(fn2)).to.deep.eq(['a','c']);
        });

        it('7,fn有参数含有多行注释',function(){
            var ins = inject.inject([]);

            function fn2(a, //b,
                            c){}
            expect(ins.annotate(fn2)).to.deep.eq(['a','//b', 'c']);
        });

        it('8,严格模式',function(){
            var ins = inject.inject([],true);

            function fn(a,/*b,*/c/*,d*/){}
            expect(function(){ins.annotate(fn)}).to.throw(Error);
        });
    });

    describe('4),invoke2',function(){
        var loader;
        var inject;

        beforeEach(function(){
            loader = new Loader();
            inject = new Injector();
        });

        it('1,invoke接收数组参数',function(){
            var app = loader.module('app',[]);
            app.data('a',1);
            app.data('b',2);

            var ins = inject.inject(['app']);

            var fn = ['a','b',function(one,two){ return one+two }];
            expect(ins.invoke(fn)).to.eq(3);
        });

        it('2,fn参数名映射data键',function(){
            var app = loader.module('app',[]);
            app.data('a',1);
            app.data('b',2);

            var ins = inject.inject(['app']);

            var fn = function(a,b){ return a+b; }
            expect(ins.invoke(fn)).to.eq(3);
        });
    });

    describe('5),实例化',function(){
        var loader;
        var inject;

        beforeEach(function(){
            loader = new Loader();
            inject = new Injector();
        });

        it('1,实例化函数',function(){
            var app = loader.module('app',[]);
            app.data('a',1);
            app.data('b',2);

            var ins = inject.inject(['app']);

            function fn(a,b){ this.result = a+b; }
            (<any>fn).$inject = ['a','b'];

            var instance = ins.instantiate(fn);
            expect(instance.result).to.eq(3);
        });

        it('2,实例化函数',function(){
            var app = loader.module('app',[]);
            app.data('a',1);
            app.data('b',2);

            var ins = inject.inject(['app']);

            function fn(a,b){ this.result = a+b; }

            var instance = ins.instantiate(fn);
            expect(instance.result).to.eq(3);
        });

        it('3,实例化数组',function(){
            var app = loader.module('app',[]);
            app.data('a',1);
            app.data('b',2);

            var ins = inject.inject(['app']);

            var fn = ['a','b',function(a,b){ this.result = a+b; }]

            var instance = ins.instantiate(fn);
            expect(instance.result).to.eq(3);
        });

        it('4,构造函数具有原型',function(){
            function a(){
            }
            a.prototype.a1 = function(){
                return 123;
            }
            function b(){
                this.b1 = this.a1();
            }
            b.prototype = a.prototype;

            var app = loader.module('myapp',[]);
            var ins = inject.inject(['myapp']);
            var instance = ins.instantiate(b);
            expect(instance.b1).to.eq(123);
        });

        it('5,本地数据',function(){
            var app = loader.module('app',[]);
            app.data('a',1);
            app.data('b',2);
            var ins = inject.inject(['app']);

            function fn(a,b){
                this.res = a + b;
            }

            var instance = ins.instantiate(fn, {b:3});
            expect(instance.res).to.eq(4);
        });
    });

    describe('6),provider',function(){
        var loader;
        var inject;

        beforeEach(function(){
            loader = new Loader();
            inject = new Injector();
        });

        it('1,$get',function(done){
            var app = loader.module('app',[]);
            app.provider('one',{
                $get: function(){
                    return 'get'
                }
            });

            var ins = inject.inject(['app']);
            expect(ins.has('one')).to.eq(true);
            expect(ins.get('one')).to.eq('get');
            done();
        });

        it('2,provider以data数据为参数',function(done){
            var app = loader.module('app',[]);
            app.data('a',1);
            app.provider('one',{
                $get: function(a){
                    return a+1
                }
            });

            var ins = inject.inject(['app']);
            // expect(ins.has('one')).to.eq(true);
            expect(ins.get('one')).to.eq(2);
            done();
        });

        it('3,provider以data数据为参数，data可以在provider之后申明',function(done){
            var app = loader.module('app',[]);
            
            app.provider('one',{
                $get: function(a){
                    return a+1
                }
            });

            app.provider('a',{
                $get: function(b){
                    return b
                }
            });

            app.provider('b',{
                $get: function(){
                    return 1;
                }
            });

            var ins = inject.inject(['app']);
            expect(ins.has('one')).to.eq(true);
            expect(ins.get('one')).to.eq(2);
            expect(ins.get('b')).to.eq(1);
            done();
        });

        it('4,循环依赖',function(){
            var app = loader.module('app',[]);
            app.provider('a',{$get: function(b){return 1;}});
            app.provider('b',{$get: function(c){return 2;}});
            app.provider('c',{$get: function(b,a){return 3;}});

            var ins = inject.inject(['app']);
            expect(function(){ins.get('a')}).to.throw(Error);
        });
    });

    describe('7),provider第二个接收构造函数',function(){
        var loader;
        var inject;

        beforeEach(function(){
            loader = new Loader();
            inject = new Injector();
        });

        it('1,构造函数有$get属性',function(done){
            var app = loader.module('app',[]);

            function Test(){
                this.$get = function(){
                    return 123;
                }
            }

            app.provider('one', Test);

            var ins = inject.inject(['app']);
            expect(ins.has('one')).to.eq(true);
            expect(ins.get('one')).to.eq(123);
            done();
        });

        it('2,构造函数依赖data',function(done){
            var app = loader.module('app',[]);

            function Test(a){
                this.$get = function(){
                    return a + 1;
                }
            }
            app.data('a',1);
            app.provider('one', Test);

            var ins = inject.inject(['app']);
            expect(ins.has('one')).to.eq(true);
            expect(ins.get('one')).to.eq(2);
            done();
        });

        it('3,data实例首先被注册',function(){
            var app = loader.module('app', []);
            app.provider('a',function Test(){
                this.$get = function(b){
                    return b;
                }
            });

            app.data('b', 123);

            var ins = inject.inject(['app']);
            expect(ins.get('a')).to.eq(123);
        });

    });

    describe('8),高阶依赖注入',function(){
        var loader;
        var inject;

        beforeEach(function(){
            loader = new Loader();
            inject = new Injector();
        });

        it('1,$injector',function(done){
            var app = loader.module('myapp',[]);
            app.data('a', 1);
            app.provider('one', function test(){
                this.$get = function($injector){
                    return $injector.get('a')
                }
            });

            var ins = inject.inject(['myapp']);
            expect(ins.get('one')).to.eq(1);
            done();
        });

        it('2,$injector',function(done){
            var app = loader.module('myapp',[]);

            app.provider('a', function (){
                this.val = 'aa';
                this.$get = function($injector){
                    return this.val;
                }
            });

            app.provider('b',function ($injector){
                var a = $injector.get('aProvider');
                this.$get = function(){
                    return a.val;
                }
            });

            var ins = inject.inject(['myapp']);
            expect(ins.get('b')).to.eq('aa');
            done();
        });

        it('3,$provider',function(done){
            var app = loader.module('myapp',[]);

            app.provider('one', function test($provider){
                $provider.data('a',1);
                this.$get = function(a){
                    return a
                }
            });

            var ins = inject.inject(['myapp']);
            expect(ins.get('one')).to.eq(1);
            done();
        });

        it('4,$provider',function(done){
            var app = loader.module('myapp',[]);

            app.provider('one', function test(){
                // this.$get = function($provider){
                //     $provider.data('a',1)
                // }
            });

            var ins = inject.inject(['myapp']);
            // expect(ins.get('one')).to.eq(1);
            done();
        });

    });

    describe('9),config',function(){
        var loader;
        var inject;

        beforeEach(function(){
            loader = new Loader();
            inject = new Injector();
        });

        it('1,config--local',function(){
            var app = loader.module('myapp', []);
            var str = 'a';
            app.config(function(){
                str = 'b';
            });

            inject.inject(['myapp']);
            expect(str).to.be.eq('b');
        });

        it('2,config--$provider',function(){
            var app = loader.module('myapp', []);

            app.config(function($provider){
                $provider.data('str','a');
            });

            var ins = inject.inject(['myapp']);
            expect(ins.get('str')).to.be.eq('a');
        });

        it('3,配置函数',function(){
            var app = loader.module('myapp',[],function($provider){
                $provider.data('str','a');
            });
            var ins = inject.inject(['myapp']);
            expect(ins.get('str')).to.be.eq('a');
        });
    });

    describe('10),run',function(){
        var loader;
        var inject;

        beforeEach(function(){
            loader = new Loader();
            inject = new Injector();
        });

        it('1,run--data',function(){
            var app = loader.module('myapp', []);
            app.provider('a',{
                $get: function(){
                    return 1
                }
            });
            var str;
            app.run(function(a){
                str = a
            });

            inject.inject(['myapp']);
            expect(str).to.be.eq(1);
        });

    });

    describe('11),module函数',function(){
        var loader;
        var inject;

        beforeEach(function(){
            loader = new Loader();
            inject = new Injector();
        });

        it('1,function',function(){
            var m1 = function($provider){
                $provider.data('str', 'aa');
            }

            var app = loader.module('myapp', [m1]);
            app.data('a',1);
            
            var ins = inject.inject(['myapp']);
            expect(ins.get('str')).to.be.eq('aa');
        });

        it('2,array',function(){
            var fn = ['$provider', function($provider){
                $provider.data('str', 'aa');
            }];

            var app = loader.module('myapp', [fn]);

            var ins = inject.inject(['myapp']);
            expect(ins.get('str')).to.be.eq('aa');
        });

    });

    describe('12),factory',function(){
        var loader;
        var inject;

        beforeEach(function(){
            loader = new Loader();
            inject = new Injector();
        });

        it('1,注册factory函数',function(){
            var app = loader.module('myapp',[]);
            app.factory('a', function(){ return 12; });

            var ins = inject.inject(['myapp']);

            expect(ins.get('a')).to.eq(12);
        });

        it('2,注册factory函数依赖注入',function(){
            var app = loader.module('myapp',[]);
            app.factory('a', function(){ return 12; });
            app.factory('b', function(a){ return a; });

            var ins = inject.inject(['myapp']);

            expect(ins.get('b')).to.eq(12);
        });

        it('3,注册factory函数没有返回值',function(){
            var app = loader.module('myapp',[]);
            app.factory('a', function(){  });

            var ins = inject.inject(['myapp']);

            expect(function(){ins.get('a')}).to.throw(Error);
        });
    });

    describe('13),value',function(){
        var loader;
        var inject;

        beforeEach(function(){
            loader = new Loader();
            inject = new Injector();
        });

        it('1,value',function(){
            var app = loader.module('myapp',[]);
            app.value('a', 123);

            var ins = inject.inject(['myapp']);

            expect(ins.get('a')).to.eq(123);
        });

        it('2,value不能被provider,config使用',function(){
            var app = loader.module('myapp',[]);
            app.value('a', 123);
            app.provider('b',{
                $get: function(a){
                    return a
                }
            });
            var ins = inject.inject(['myapp']);
            expect(ins.get('b')).to.eq(123)
        });

    });

    describe('14),service',function(){
        var loader;
        var inject;

        beforeEach(function(){
            loader = new Loader();
            inject = new Injector();
        });

        it('1,service',function(){
            var app = loader.module('myapp',[]);
            app.service('myService',function(){
                this.str = 'aa';
                this.one = function(str){
                    return str;
                }
            });

            var ins = inject.inject(['myapp']);
            expect(ins.get('myService').str).to.eq('aa');
            expect(ins.get('myService').one('service')).to.eq('service');
        });
    });

});