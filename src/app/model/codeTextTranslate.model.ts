export class CodeTextTranslate {
    code: string;
    text: string;
    translate: string;
    flag: string;

    constructor(code: string, text: string, translate: string, flag: string) {
        this.code = code;
        this.text = text;
        this.translate = translate;
        this.flag = flag;
    }
}
