import { Component, OnInit } from '@angular/core';
import { User } from '../model/user.model';
import { Word } from '../model/word.model';
import { FirebaseWord } from '../model/wordFirebase.model';
import { AuthentificationService } from '../services/authentification.service';
import { DictionaryService } from '../services/dictionary.service';
import { CONSTANTS } from '../utils/constants';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { LoadingService } from '../services/loading.service';
import { DialectEnum } from '../model/dialect.enum';
import { Dialect } from '../model/dialect.model';
import { Utils } from '../utils/utils';
import { SettingService } from '../services/setting.service';

@Component({
  selector: 'app-dictionary',
  templateUrl: 'dictionary.page.html',
  styleUrls: ['dictionary.page.scss']
})
export class DictionaryPage implements OnInit {

  word: string = '';
  wordsFound: Word[] = [];
  alphabet: string[] = ['a', 'b', 'ɓ', 'c', 'd', 'ɗ', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'r', 's', 't', 'u', 'v', 'w', 'y', 'z'];
  letterSelected: string = 'a';
  isResultDisplay: boolean | undefined;
  isDetailDisplay: boolean | undefined;
  user: User = {} as User;
  dialect: DialectEnum = DialectEnum.SHGC;
  userDialect: Dialect = {} as Dialect;
  words: FirebaseWord[] = [];
  translate: string = 'francais';
  text: string = '';
  linkInfo: FirebaseWord = {} as FirebaseWord;
  wordsLoaded: boolean = false;
  wordsLength: number[] = Array(8).fill(undefined, 0, 8).map((x, i) => i);

  constructor(private dictionaryService: DictionaryService, private authentificationService: AuthentificationService, private loadingService: LoadingService, private settingService: SettingService) { }

  get isOverlay(){
    return this.settingService.isOverlay;
  }  

  ngOnInit(): void {
    Utils.customCapacitorTabs(this.settingService);
    this.user = this.authentificationService.user;
    this.dialect = this.authentificationService.dialect;
    this.userDialect = this.user.dialects[this.dialect];
    this.text = this.user.dialectSelected.text;
    this.loadingService.present('Chargement...');
    const text = this.translate === 'francais' ? 'shikomori' : 'francais';
    const translate = this.translate === 'francais' ? 'francais' : 'shikomori';
    this.dictionaryService.displayAlphabet(text, translate, this.letterSelected, false).then((words: FirebaseWord[]) => {
      this.loadingService.dismiss();
      this.wordsLoaded = true;
      this.words = words;
    });
  }

  searchWord() {
    this.isResultDisplay = true;
    this.wordsFound = [];
    this.dictionaryService.searchWord(this.word.toLocaleLowerCase()).then((words: FirebaseWord[]) => {
      if (words && words.length) {
        words.forEach((w: FirebaseWord) => {
          this.wordsFound.push(new Word(w.text.join(', '), w.translate.join(', '), w.description, w.examples, w.link ? w.link : ''));
        });
      }
    });
  }

  changeLetter(letter: string) {
    this.wordsLoaded = false;
    this.letterSelected = letter;
    const text = this.translate === 'francais' ? 'shikomori' : 'francais';
    const translate = this.translate === 'francais' ? 'francais' : 'shikomori';
    this.dictionaryService.displayAlphabet(text, translate, this.letterSelected, false).then((words: FirebaseWord[]) => {
      this.wordsLoaded = true;
      this.words = words;
    });
  }

  seeDetail(word: FirebaseWord) {
    const firstLetter = word.phoneticTranslate[0].normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9,]/g, '').substring(0, 1).toLocaleLowerCase();
    this.dictionaryService.displayWord(this.userDialect?.learn?.text.toLocaleLowerCase(), this.translate, firstLetter, word.link ? word.link : '').then((linkInfo: FirebaseWord) => {
      this.isDetailDisplay = true;
      this.linkInfo = linkInfo;
    });
  }

  onIonInfinite(ev: any) {
    const text = this.translate === 'francais' ? 'shikomori' : 'francais';
    const translate = this.translate === 'francais' ? 'francais' : 'shikomori';
    this.dictionaryService.nextWords(text, translate, this.letterSelected).then((words: FirebaseWord[]) => {
      this.words = words;
    });
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }

  changeDictionary() {
    this.letterSelected = this.verifyLetterSelected();
    this.wordsLoaded = false;
    if (this.translate === 'francais') {
      this.text = 'francais';
      this.translate = this.user.dialectSelected.text;
    } else {
      this.text = this.user.dialectSelected.text;
      this.translate = 'francais';
    }
    const text = this.translate === 'francais' ? 'shikomori' : 'francais';
    const translate = this.translate === 'francais' ? 'francais' : 'shikomori';
    this.dictionaryService.displayAlphabet(text , translate, this.letterSelected, false).then((words: FirebaseWord[]) => {
      this.wordsLoaded = true;
      this.words = words;
    });
  }

  verifyLetterSelected() {
    if (this.letterSelected === 'ɓ') {
      return 'b';
    } else if (this.letterSelected === 'ɗ') {
      return 'd';
    } else {
      return this.letterSelected;
    }
  }

  closeModal() {
    this.isResultDisplay = false;
    this.isDetailDisplay = false;
  }

}
