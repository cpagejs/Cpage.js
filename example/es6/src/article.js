import Cpage,  { Component } from '../../../dist/bundle';

import html from './article.html';

export default class Article extends Component {
    constructor(){
        super();
        this.name = 'article';
        // this.template = `
        //     <div>
        //         article
        //         <button c-click="goAbout()">前往about</button>
        //     </div>
        // `;
        this.templateUrl = html;
        this.data = {};
    }

    goAbout(){alert()
        this.$router.go({
            path: '/about',
            params: {
                id: 123,
                key: 'af'
            },
            query: {
                id: 123,
                key: 'af'
            }
        });
    }

    render(){
        // console.log('article',this.$router)
    }
}