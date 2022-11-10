import { Component } from 'capge';
const html = require('./index.html');
import css from './index.css';

export default class Header extends Component {
    constructor(){
        super();
        this.name = 'cHeader';
        this.templateUrl = html;
        this.styleUrl = css;
        this.props = {
            title: {
                type: "string",
                default: "header"
            }
        };
    }

    handelC(event){
        this.$event.trigger('header-event', 'header');
    }

    beforeRender(){
        console.log('Header beforeRender')
    }

    render(){
        
    }
}