import 'mocha';
import { expect } from 'chai';
import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonchai from 'sinon-chai';
chai.use(sinonchai);

import Injector from '../../built/store/injector/index';
import Loader from '../../built/store/loader/index';
import Store from '../../built/store/index';

describe('index',function(){
    var so;
    before(function(){
        so = new Store();
    });

    describe('1),data',function(){
        it('1,data', function(){
            so.data('one', 'testOne');

            expect(so.has('one')).to.eq(true);
            expect(so.get('one')).to.eq('testOne');
        });

        it('2,provider', function(){
            so.data('a',1);
            so.provider('tt',{
                $get: function(a){
                    return a+1
                }
            });

            expect(so.has('tt')).to.eq(true);
            expect(so.get('tt')).to.eq(2);
        });
    });

    // describe('1),pipe',function(){
    //     it('1,pipe',function(){
    //         var ins = inject.inject(['c']);
    //         expect(ins.has('$pipe')).to.eq(true);
    //     });

    //     it('2,pipe函数',function(){
    //         function pipe1(){}
    //         var ins = inject.inject(['c', function($pipeProvider){
    //             $pipeProvider.register('my', function(){ return pipe1; });
    //         }]);
    //         var $pipe = ins.get('$pipe');
    //         expect($pipe('my')).to.eq(pipe1);
    //         expect(ins.has('myPipe')).to.eq(true);
    //     });

    //     it('3,pipe链式操作',function(){
    //         function pipe1(){}
    //         var app = loader.module('myapp', [])
    //                     .pipe('my', function(){
    //                         return pipe1;
    //                     });
    //         var ins = inject.inject(['c','myapp']);

    //         expect(ins.has('myPipe')).to.eq(true);
    //     });
    // });

    
});