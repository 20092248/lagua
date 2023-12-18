import { Observable, ReplaySubject } from "rxjs";
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

  static getCategoryExtended(category: string) {
    var categoryExtended = 'A1_A2';
    if (category === 'A1' || category == 'A2') {
      categoryExtended = 'A1_A2';
    } else if (category === 'B1' || category == 'B2') {
      categoryExtended = 'B1_B2';
    }
    return categoryExtended;
  }

  static getLevelDialog(categories: any[], code: string) {
    if (categories && categories.length) {
      const category = categories.find(c => c.code === code);
      return category?.label;
    }
    return '';
  }

  static async convertFile(file: File) {
    const result = new ReplaySubject<string>(1);
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (event) => {
      if (event?.target?.result) {
        result.next(btoa(event.target.result.toString()));
      }
    }
    return result;
  }

}