import Cpage,  { Component } from '../../../dist/bundle';

export default class ArticleList extends Component {
    constructor(){
        super();
        this.name = 'articleList';
        this.template = `
        <div>
            article-list-list
            <button c-click="reload()">reload</button>
            <button c-click="back()">back</button>
        </div>
        `;
        this.data = {};
    }

    reload(){
        this.$router.reflesh();
    }

    back(){
        this.$router.back();
    }

    beforeRender(){
        console.log('ArticleList')
    }

    render(){
        
    }
}