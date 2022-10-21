---
title: es6语法
---

声明一个hello组件
```js
import Cpage,  { Component } from 'cpage';

export default class Hello extends Component {
    constructor(){
        super();
        this.name = 'hello';
        this.data = {};
        this.template = `hello`;
    }

    render(){
        
    }
}
```

在根组件引用hello组件
```js
import Cpage,  { Component } from 'cpage';
import Hello from './hello';
const html = require('./app.html');

export default class App extends Component {
    constructor(){
        super();
        this.name = 'app';
        this.data = {};
        this.templateUrl = html;
        this.components = [Hello];
    }
    handelC(event){
        this.$event.trigger('header-event', 'header');
    }

    render(){
        
    }
}
Cpage.bootstrap('#app', App);
```