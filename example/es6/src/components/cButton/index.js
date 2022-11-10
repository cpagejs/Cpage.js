import Cpage,  { Component } from 'capge';
const html = require('./index.html');

export default class cButton extends Component {
    constructor(){
      super();
      this.name = 'cButton';
      this.templateUrl = html;
    }

    beforeRender(){
      
    }

    render(){
      console.log('cButton')
    }
}