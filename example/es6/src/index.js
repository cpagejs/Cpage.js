import Cpage,  { Component, Dom, Cookie } from '../../../dist/bundle';

import Header from './header';
import Article from './article';
import ArticleDetail from './articleDetail';
import About from './about';
import Company from './company';
import Footer from './footer';

import * as css from './style.css';

export default class Main extends Component {
    constructor(){
        super();
        this.components = [Header, Article, ArticleDetail, Footer, About, Company];
        this.name = 'myApp';
        // this.styleUrl = require('./style.css');
        this.styleUrl = css;
        // this.style = `
        //     #main-app{
        //         color: #f90;
        //     }
        // `;
        this.template = `
            <div>
                <div id="main-app" c-ref="add-ref">{{json.title}}--{{text}}</div>
                <div class="repeat" c-for="item in items"><p c-click="handleItem({{item.id}})">{{item.name}}</p></div>
                <button c-click="handelClick()">点击</button>
                <div c-if="{{isShow}}"><header></header></div>
                <header></header>
                <div c-show="{{a>10}}">show2</div>
                <br/>
                <a href="#/article">article</a>
                <a href="#/company">company</a>
                <a href="#/about">about</a>
                <div c-view></div>
                <footer></footer>
            </div>
        `;
        this.data = {
            text: 'text',
            isShow: false,
            a: 5,
            items: [
                {id:1,name:'橘子'}, {id:2,name:'苹果'}, {id:3,name:'香蕉'}
            ],
            json: {
                title: '123'
            }
        };
    }

    handleItem(msg){
        console.log(msg)
    }

    handelClick(){
        this.$data('json', {'title':'aaaa'});
        this.$data('isShow', !this.data.isShow);
        this.$data('a', 20);
    }

    beforeRender(){
        let self = this;
        this.$http.ajax({
            type: 'get',
            url: './mock/test.json'
        }).then(function(json) {
            self.$data('json', json);
        }, function(error) {
            console.error('出错了', error);
        });

        this.$data('text', 'before render');
    }

    render(){
        this.$event.listen('header-event', function(msg){
            console.log('子组件广播事件--'+msg)
        });
        this.$data('text', 'after render');
        Dom('body').attr('data-aa', '456');
        console.log(Cookie.support())
        Cookie.set('mainjs', 'main-render');
    }
}

Cpage.router([
    // {
    //     path: '/',
    //     component: Home
    // },
    {
        path: '/article',
        component: Article,
        params: {
            id: 123
        },
        cache: true,
        delay: 200
    },
    {
        path: '/article/:id',
        component: ArticleDetail
    },
    {
        path: '/company',
        component: Company
    },
    {
        path: '/about',
        component: About,
        cache: true,
    },
]);

Cpage.bootstrap('#app', Main);