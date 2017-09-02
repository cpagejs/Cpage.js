import Cpage,  { Component, Dom, Cookie } from '../../../dist/bundle';

import Header from './header';
import Article from './article';
import ArticleList from './articleList';
import About from './about';
import Company from './company';
import Footer from './footer';

import * as css from './style.css';

export default class Main extends Component {
    constructor(){
        super();
        this.components = [Header,Article,ArticleList,Footer, About, Company];
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
                <div id="main-app" c-ref="add-ref">{{json.title}}--{{json.title}}--{{text}}</div>
                <div id="repeat" c-for="item in items">c-for</div>
                <span c-click="handelClick()">点击</span>
                <div c-if="{{isShow}}"><header></header></div>
                <div c-show="{{a>10}}">show2</div>
                <header></header>
                <a href="#/article?id=1&addr=aa">article</a>
                <a href="#/article/123">article-list</a>
                <a href="#/footer/oo">footer</a>
                <div c-view></div>
            </div>
        `;
        this.data = {
            text: 'text',
            isShow: false,
            a: 5,
            items: [
                'a', 'b', 'c'
            ],
            json: {
                title: '123'
            }
        };
    }

    handelClick(){
        this.$data('json', {'title':'aaaa'});
        this.$data('isShow', true);
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
    {
        path: '/',
        component: Header
    },
    {
        path: '/article',
        component: Article,
        params: {
            id: 123
        },
        cache: true,
        delay: 2000
    },
    {
        path: '/article/:id',
        component: ArticleList
    },
    {
        path: '/about',
        component: About,
        cache: true,
    },
    {
        path: '/footer/oo',
        component: Footer
    }
]);

Cpage.bootstrap('#app', Main);