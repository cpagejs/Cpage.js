export interface lexerAction {
    lex(text: string):Array<string>;
}