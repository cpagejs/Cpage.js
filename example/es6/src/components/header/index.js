import { Component } from 'capge';
const html = require('./index.html');
import css from './index.css';

export default class Header extends Component {
    constructor(props){
        super(props);
        this.name = 'cHeader';
        this.templateUrl = html;
        this.styleUrl = css;
        this.props = {
            title: {
                type: "string",
                default: "header"
            },
            onclick: {
                type: "function",
                default: () => {}
            }
        };
    }

    handelC(event){
        this.$event.emit('header-event', 'header');
        console.log(this)
        this.props.onclick && this.props.onclick();
    }

    beforeRender(){
        console.log('Header beforeRender')
    }

    render(){
        
    }
}