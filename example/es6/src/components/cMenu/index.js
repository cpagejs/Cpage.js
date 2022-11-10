import Cpage,  { Component } from 'capge';
const html = require('./index.html');

export default class cMenu extends Component {
    constructor(){
      super();
      this.name = 'cMenu';
      this.templateUrl = html;
      this.props = {
        menus: {
          type: 'array',
          default: [{label: "menu1"}]
        }
      };
    }

    beforeRender(){
      
    }

    render(){
      console.log('cMenu')
    }
}