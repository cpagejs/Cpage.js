import Cpage,  { Component } from '../../../dist/bundle';

export default class Footer extends Component {
    constructor(){
        super();
        this.name = 'footer';
        this.template = `<h1>footer</h1>`;
    }

    beforeRender(){
        console.log('footer beforeRender')
    }

    render(){
        
    }
}