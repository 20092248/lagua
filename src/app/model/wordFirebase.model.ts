import { Examples } from "./example.model";
import { Sibling } from "./sibling.model";

export interface FirebaseWord {
    uid?: string;
    text: string[];
    dialect?: string;
    pluralText?: string[];
    translate: string[];
    translates?: any[];
    originalText: string;
    originalPluralText?: string;
    originalTranslate: string;
    description: string;
    phoneticText: string[];
    phoneticTranslate: string[];
    link?: string;
    examples: Examples[];
    scraper?: any;
    siblings: Sibling[];
}
