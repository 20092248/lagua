import { Observable, ReplaySubject } from "rxjs";
import { ReviewGroup } from "../model/reviewGroup.model";
import { User } from "../model/user.model";
import { DialectEnum } from "../model/dialect.enum";

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

  static getLevelDialog(categories: any[], code: string | undefined) {
    if (code && categories && categories.length) {
      const category = categories.find(c => c.code === code);
      return category?.label;
    }
    return '';
  }

  static async convertFileToDataUri(file: File) {
    // var fileReader = new FileReader();
    // const fileInfo = fileReader.readAsDataURL(file);
    const dataUri = new Promise((resolve, reject) => {
      var reader = new FileReader();
      reader.readAsBinaryString(file);
      reader.onload = () => {
        resolve("data:" + file.type + ";base64," + btoa(reader.result as string));
      };
      reader.onerror = function (error) {
        console.warn(error);
        reject('Erreur lors de la convertion de la pièce jointe.');
      };
    });
    const fileInfo = await Promise.resolve(dataUri);
    return fileInfo;
  }

  static generateAttachnment(attachment: File) {
    var fileURL = window.URL.createObjectURL(attachment);
    window.open(fileURL);
    return fileURL;
  }

  static addUserInfo(user: User) {
    return user ? '\n\nUserId : ' + user.uid + '\nNom : ' + user.displayName + '\nEmail' + user.email : '';
  }

  static findDialect(key: string) {
    return key && (key === 'SHAN' || key === 'SHAN' || key === 'SHAN' || key === 'SHAN') ? DialectEnum[key] : DialectEnum['SHGC'];
  };

  static valueNotNull(value: string | null) {
    return value ? value : '';
  }

}