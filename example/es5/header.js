var header = Cpage.component({
    name: 'cHeader',
    components: [],
    template: `
    <div style="color:{{color}}" c-click="invokeClick()">{{title}}--{{height}}</div>
    `,
    data: {
        
    },
    props: {
        title: {
            type: 'string'
        },
        height: {
            default: 10,
            type: 'number'
        },
        color: {
            default: '#f60',
            type: 'string'
        },
    },
    invokeClick() {
        console.log('cHeader click',this.$props)
        this.$event.emit("headerClick", "info");
    },
    beforeRender() {
        
    },
    render() {
        // let ele = (<div>html jsx</div>)
        // console.log(ele)
    }
});
