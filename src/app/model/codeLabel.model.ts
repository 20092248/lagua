import { CodeLabelMin } from "./codeLabelMin.model";

export class CodeLabel extends CodeLabelMin {
    src: string;

    constructor(code: string, label: string, src: string) {
        super(code, label);
        this.src = src;
    }
}
