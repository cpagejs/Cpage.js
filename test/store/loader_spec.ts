import 'mocha';
import { expect } from 'chai';
import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonchai from 'sinon-chai';
chai.use(sinonchai);

import Loader from '../../built/store/loader/index';

const loader = new Loader();

describe('loader测试',function(){

    it('1,module',function(){
        var m = loader.module('li', []);

        expect(m.name).to.eq('li');
    });
});