import ASTBuilder from './astBuilder';
import ASTCompile from './astCompile';

export default class Parser {
    public lexer;
    public astBuilder;
    public astCompile;

    constructor(lexer, pipes){
        this.lexer = lexer;
        this.astBuilder = new ASTBuilder(this.lexer);
        this.astCompile = new ASTCompile(this.astBuilder, pipes);
    }

    public parse(text){ 
        return this.astCompile.compile(text);
    }
}