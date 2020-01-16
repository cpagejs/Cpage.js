import Cpage,  { Component } from '../../../dist/bundle';

export default class ArticleDetail extends Component {
    constructor(){
        super();
        this.name = 'article-detail';
        this.template = `
        <div>
            ArticleDetail
            <br/>
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
        console.log('ArticleDetail beforeRender')
    }

    render(){
        
    }
}