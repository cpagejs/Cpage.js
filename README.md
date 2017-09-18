## Cpage.js
Cpage.js是一款轻量级的Mvvm框架，使用TypeScript开发，可以方便地进行组件化开发，语法统一、简介明了，不依赖于第三方框架，适合中小项目开发。框架同时支持es5与es6语法，可参考example中示例。

## 安装
    es6  npm install cpage
         import Cpage,  { Component } from 'cpage'; 
    es5  <script src="https://chenhaozhi.github.io/cpage/1.0.3/Cpage-1.0.3.min.js"></script>

## 组件（es5）
```
var app = Cpage.component({
    name: 'app',
    components: [],
    template: `<div>{{header}}--{{height}}</div>`,
    data: {
        header: 'this is header'
    },
    props: {
        height: {
            default: 10
        }
    },
    beforeRender() {
        console.log('beforeRender')
    },
    render() {
        console.log('render')
    }
});
Cpage.bootstrap("#app", app);
```

## 组件（es6）
```
import Cpage,  { Component } from 'cpage';
const html = require('./app.html');

export default class App extends Component {
    constructor(){
        super();
        this.name = 'app';
        this.data = {};
        this.templateUrl = html;
    }
    handelC(event){
        this.$event.trigger('header-event', 'header');
    }

    render(){
        
    }
}
Cpage.bootstrap('#app', App);
```

## 路由
| 方法名 | 用法 |
| :------ | :------ |
| go() | this.$router.go({path='', params={}})，跳转到已存在的路由页面 |
| hash() | this.$router.hash(str)，此方法可以更改页面的hash路由 |
| reflesh() | this.$router.reflesh()，刷新当前路由 |
| back() | this.$router.back()，返回 |
路由示例
```
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
```
注册路由之后，可以在组件内使用路由相关函数。


## 属性
| 属性名 | 是否必须 | 类型 | 用途 |
| :------ | :------: | :------ | :------ |
| name | 是 | 字符串 | 组件名称 |
| components | 是 | 数组 | 子组件名称集合 |
| data | 否 | 对象 | 组件属性 |
| props | 否 | 对象 | 用于子组件与父组件之间的数据传递 |
| style | 否 | 字符串 | 组件样式 |
| styleId | 否 | 字符串，id选择符 | 组件样式，es5语法 |
| styleUrl | 否 | 数组或对象 | 组件样式，es6语法，支持import * as css from ''; 或者require('../style.css')，需要引入css-loader |
| template | 否 | 字符串 | 组件模板，es5,es6通用 |
| templateId | 否 | 字符串，id选择符 | 组件模板，es5语法 |
| templateUrl | 否 | 数组或对象 | 组件模板，es6语法，支持import * as html from ''; 或者require('../xx.html')，需要引入html-loader |

## 方法
| 方法名 | 是否必须 | 用途 |
| :------ | :------: | :------ |
| beforeRender | 否 | 组件完成渲染之前执行 |
| render | 是 | 组件完成渲染之后执行 |
| bootstrap | 是 | Cpage对象的静态方法，用于将组件渲染到dom中 |

## 表达式
支持文字，运算符，变量
{{1+2}}  或者 {{text}}
表达式的变量与组件的data或props属性对应

## 指令
| 指令名 | 用法 | 用途 |
| :------ | :------: | :------ |
| c-事件名 | c-event="handel()" event可以为click,mouseover... | 用于dom的事件绑定 |
| c-for | c-for="item in items" | 用于循环输出指定次数的 HTML 元素，表达式必须是数组 |
| c-if | c-if="{{id>10}}" | 表达式为true，则渲染节点；否则不渲染 |
| c-show | c-show="{{id>10}}" | 表达式为true，则显示节点；否则隐藏 |
| c-ref | c-ref="btn" | 节点标识符 |
| c-html | c-html="<span>span</span>" | 将表达式内的字符替换节点的html |

## 组件操作
| 方法名 | 应用范围 | 用途 |
| :------ | :------: | :------ |
| $data | 整个组件生命周期 | 修改组件的data属性，例：this.$data('text', 'new text') |
| $el | 组件渲染完毕之后才能使用 | 组件节点 |
| $refs | 组件渲染完毕之后才能使用 | 单个dom节点，例：this.$refs['the-ele']，需要配合c-ref使用 |
| $http | 整个组件生命周期 | 操作http，例：this.$http.ajax({})。支持ajax(),get(),post()等操作 |
| $event | 整个组件生命周期 | 事件触发和监听，例：this.$event.trigger(事件名,信息) this.$event.listen(事件名, 回调函数) |

## DOM操作
Cpage.js提供建议的dom操作方式
es6语法
```
import { Dom } from 'cpage';

Dom('body').css('width')
Dom('body').width('100px')
Dom('body').hasClass('dom')
```

## cookie操作
Cpage.js提供建议的dom操作方式
es6语法
```
import { Cookie } from 'cpage';
```
es5 可以直接使用Cookie对象
#### 是否支持cookie
    Cookie.support()
#### 添加cookie
    Cookie.set(name,value,{hours,path,domain,secure})
#### 获取cookie
    Cookie.get(name:string)
#### 移除cookie
    Cookie.remove(name:string, path?:string)