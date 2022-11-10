import Cpage, { Component, Dom } from 'capge';

import cHeader from './components/header';
import Footer from './components/footer';
import Article from './pages/article/article';
import ArticleDetail from './pages/article/articleDetail';
import About from './pages/about';
import Company from './pages/company';

import cMenu from './components/cMenu';

import css from './style.css';
export default class Main extends Component {
  constructor() {
    super();
    this.components = [cHeader, Article, ArticleDetail, Footer, About, Company, cMenu];
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
        <c-header title="这是自定义的header组件"></c-header>
        <a href="#/article">article</a>
        <a href="#/company">company</a>
        <a href="#/about">about</a>
        <div id="main-app" c-ref="add-ref">{{json.title}}--{{text}}</div>
        <div class="repeat" c-for="item in items">
          <p c-click="handleItem({{item.id}})">{{item.id}}-{{item.name}}</p>
        </div>
        <button c-click="handelClick()">点击</button>
        <div c-if="{{isShow}}">
            show
        </div>
        <div c-show="{{a>10}}">show2</div>
        <br/>
        <c-menu></c-menu>
        <div c-view></div>
        <footer></footer>
      </div>
    `;
    this.data = {
      text: 'text',
      isShow: false,
      a: 5,
      items: [
        { id: 1, name: '橘子' }, { id: 2, name: '苹果' }, { id: 3, name: '香蕉' }
      ],
      json: {
        title: '123'
      }
    };
  }

  handleItem(msg) {
    console.log(msg)
  }

  handelClick() {
    this.$data('json', { 'title': 'aaaa' });
    this.$data('isShow', !this.data.isShow);
    this.$data('a', 20);
    this.$data('items', [{ id: 10, name: '橘子10' }]);
  }

  beforeRender() {
    let self = this;
    this.$http.ajax({
      type: 'get',
      url: './mock/test.json'
    }).then(function (json) {
      self.$data('json', json);
    }, function (error) {
      console.error('出错了', error);
    });

    this.$data('text', 'before render');
  }

  render() {
    this.$event.listen('header-event', function (msg) {
      console.log(msg + '--子组件广播事件')
    });
    this.$data('text', 'after render');
    Dom('body').attr('data-aa', '456');
  }
}

Cpage.router([
  {
      path: '/',
      component: Article
  },
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