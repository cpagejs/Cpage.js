import Cpage,  { Component } from 'capge';

export default class About extends Component {
    constructor(){
        super();
        this.name = 'about';
        this.template = `
            <div class="about">
                about
            </div>
        `;
        this.style = `
            .about {
                color: #f90
            }
        `;
        this.data = {};
    }

    render(){
        console.log('about',this.$router.params)
    }
}