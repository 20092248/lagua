import { Observable, ReplaySubject, filter } from "rxjs";
import { ReviewGroup } from "../model/reviewGroup.model";
import { User } from "../model/user.model";
import { DialectEnum } from "../model/dialect.enum";
import { StatusBar, Style } from "@capacitor/status-bar";
import { NavigationBar } from "@mauricewegner/capacitor-navigation-bar";
import { SettingService } from "../services/setting.service";
import { AudioService } from "../services/audio.service";
import { ParamReview } from "../model/paramReview.model";
import { Platform } from "@ionic/angular";
import { Location } from "@angular/common";
import { App } from "@capacitor/app";
import { NavigationEnd, Router } from "@angular/router";
import { DomSanitizer } from '@angular/platform-browser';
import { Lesson } from "../model/lesson.model";
import { LessonMin } from "../model/lessonMin.model";
import { CodeTextTranslateMin } from "../model/codeTextTranslateMin.model";
import { CodeLabel } from "../model/codeLabel.model";
import { CodeTextTranslate } from "../model/codeTextTranslate.model";
import { CodeLabelMin } from "../model/codeLabelMin.model";
import { Review } from "../model/review.model";
import { ReviewMin } from "../model/reviewMin.model";

export class Utils {

  static previousUrl: string = '';
  static currentUrl: string = '';

  static paramReview(category: string, lesson: number, order: number): ParamReview {
    return { category: category, lesson: lesson, order: order };
  }

  static preloadAudio(audioService: AudioService) {
    console.log('preload');
    audioService.preload('rightAnswer', 'assets/audio/correct-choice.mp3');
    audioService.preload('wrongAnswer', 'assets/audio/wrong-choice.mp3');
    audioService.preload('successReview', 'assets/audio/success-review.mp3');
    audioService.preload('failReview', 'assets/audio/fail-review.mp3');
    audioService.preload('countdown', 'assets/audio/countdown.mp3');
    audioService.preload('click', 'assets/audio/click.mp3');
  }

  static customCapacitorApp(settingService: SettingService) {
    if (settingService.isCapacitor) {
      StatusBar.setOverlaysWebView({ overlay: false });
      StatusBar.setStyle({ style: Style.Dark });
      StatusBar.setBackgroundColor({ color: '#46895c' });
      NavigationBar.setColor({ color: '#74a884', darkButtons: false });
    }
  }

  static customCapacitorLoginSignInPage(settingService: SettingService) {
    if (settingService.isCapacitor) {
      StatusBar.setOverlaysWebView({ overlay: false });
      StatusBar.setStyle({ style: Style.Dark });
      StatusBar.setBackgroundColor({ color: '#46895c' });
      NavigationBar.setColor({ color: '#eef1ee', darkButtons: true });
    }
  }

  static customCapacitorTabs(settingService: SettingService) {
    if (settingService.isCapacitor) {
      StatusBar.setOverlaysWebView({ overlay: true });
      StatusBar.setStyle({ style: Style.Dark });
      NavigationBar.setColor({ color: '#ffffff', darkButtons: true });
      settingService.isOverlay = true;
    }
  }

  static customCapacitorQuestion(settingService: SettingService, color: string) {
    if (settingService.isCapacitor) {
      StatusBar.setStyle({ style: Style.Light });
      NavigationBar.setColor({ color: color, darkButtons: true });
    }
  }

  static customOverlayStatus(settingService: SettingService, overlay: boolean) {
    if (settingService.isCapacitor) {
      StatusBar.setOverlaysWebView({ overlay: overlay });
    }
  }

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

  static countdownMixOrRestart(type: string) {
    return !(type === 'M' || type === 'R');
  }

  static shuffledArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  static displayText(questions: any[]) {
    questions?.forEach(question => {
      if (question?.text.indexOf('$') !== -1) {
        const choice = question.choices.find((c: any) => c.answer)?.choice;
        question.text = question?.text.replace('$', choice);
      }
    });
    return questions;
  }

  static clearResultLessons(resultLessons: LessonMin[]) {
    resultLessons.map((obj) => {
      const lessonMin: LessonMin = { order: obj.order, code: obj.code, navigate: obj.navigate, title: obj.title, subTitle: obj.subTitle } 
      return Object.assign({}, lessonMin) 
    });
  }

  static convertToReviewMin(value: Review) {
    return {category: value.category, order: value.order, lesson: value.lesson, text: value.text } as ReviewMin;
  }

  static convertToLessonMin(value: Lesson | LessonMin) {
    return {order: value.order, code: value.code, navigate: value.navigate, title: value.title, subTitle: value.subTitle } as LessonMin;
  }

  static convertToCodeTextTranslateMin(value: CodeTextTranslate) {
    return {code: value.code, text: value.text, translate: value.translate } as CodeTextTranslateMin;
  }

  static convertToCodeLabelMin(value: CodeLabel) {
    return {code: value.code, label: value.label } as CodeLabelMin;
  }

}