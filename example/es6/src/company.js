import Cpage,  { Component } from '../../../dist/bundle';

export default class Company extends Component {
    constructor(){
        super();
        this.name = 'company';
        this.template = `
            <div>
            company
            </div>
        `;
        this.data = {};
    }

    render(){

    }
}