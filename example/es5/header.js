var header = Cpage.component({
    name: 'header',
    components: [],
    template: `<div style="color:{{color}}">{{header}}--{{height}}</div>`,
    data: {
        header: 'this is header'
    },
    props: {
        height: {
            default: 10,
            type: 'number'
        },
        color: {
            default: '#f60',
            type: 'string'
        }
    },
    beforeRender() {
        
    },
    render() {

    }
});
