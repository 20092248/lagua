import { CodeTextTranslateMin } from "./codeTextTranslateMin.model";

export class CodeTextTranslate extends CodeTextTranslateMin {
    src: string;

    constructor(code: string, text: string, translate: string, src: string) {
        super(code, text, translate);
        this.src = src;
    }
}
