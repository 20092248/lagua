import { ReviewMin } from "./reviewMin.model";

export interface Review extends ReviewMin {
    contents: string[];
    content?: string;
    score: number;
}
