var header = Cpage.component({
    name: 'header',
    components: [],
    template: `<div>{{header}}--{{height}}</div>`,
    data: {
        header: 'this is header'
    },
    props: {
        height: {
            default: '10'
        }
    },
    beforeRender() {
        
    },
    render() {

    }
});
