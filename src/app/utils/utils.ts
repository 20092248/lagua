import { ReviewGroup } from "../model/reviewGroup.model";

export class Utils {

    static getInitial(displayName: string) {
        const name = displayName.split(' ');
        if (name.length > 1) {
            return displayName.split(" ").map(n => n[0]).join("").substring(0, 2).toLocaleUpperCase();
        } else {
            return displayName.substring(0, 2).toLocaleUpperCase();
        }
    }

    static getReviewsLength(reviewsInfo: ReviewGroup[]) {
        var length = 0;
        reviewsInfo.forEach(reviewInfo => {
          reviewInfo.reviews.forEach(() => {
            length += 1;
          })
        });
        return length;
      }

}