import { Examples } from "./example.model";

export interface FirebaseWord {
    text: string[];
    translate: string[];
    description: string;
    phonetic: string[];
    examples: Examples[];
}
