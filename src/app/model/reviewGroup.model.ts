import { Review } from "./review.model";

export interface ReviewGroup {
    category: string;
    lesson: number;
    order: number;
    data: Review[];
    title: string;
    subtitle: string;
    reviews: Review[];
}
