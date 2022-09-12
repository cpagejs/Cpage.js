---
title: es5语法
---
基本示例，先上demo，一睹为快！

声明一个hello组件
```
var Hello = Cpage.component({
    name: 'hello',
    components: [],
    template: `<div>{{hello}}</div>`,
    data: {
        hello: '这是hello组件'
    },
    props: {

    },
    beforeRender() {
        console.log('beforeRender')
    },
    render() {
        console.log('render')
    }
});
```
在根组件引用hello组件
```
var app = Cpage.component({
    name: 'app',
    components: [Hello],
    template: `<div>{{text}}</div>`,
    data: {
        text: 'es5 demo'
    },
    beforeRender() {
        
    },
    render() {
        
    }
});
Cpage.bootstrap("#app", app);
```