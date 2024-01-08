export class CodeTextTranslate {
    code: string;
    text: string;
    translate: string;
    src: string;

    constructor(code: string, text: string, translate: string, src: string) {
        this.code = code;
        this.text = text;
        this.translate = translate;
        this.src = src;
    }
}
