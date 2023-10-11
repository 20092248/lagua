import { Component, OnInit } from '@angular/core';
import { User } from '../model/user.model';
import { Word } from '../model/word.model';
import { FirebaseWord } from '../model/wordFirebase.model';
import { AuthentificationService } from '../services/authentification.service';
import { DictionaryService } from '../services/dictionary.service';
import { CONSTANTS } from '../utils/constants';
import { InfiniteScrollCustomEvent } from '@ionic/angular';

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
  words: FirebaseWord[] = [];
  translate: string = 'francais';
  text: string = 'shikomori';
  linkInfo: FirebaseWord = {} as FirebaseWord;

  constructor(private dictionaryService: DictionaryService, private authentificationService: AuthentificationService) { }

  ngOnInit(): void {
    this.user = this.authentificationService.user;
    // this.text = this.user.learn.text;
    this.dictionaryService.displayAlphabet(/*this.user?.learn?.text.toLocaleLowerCase()*/this.text, this.translate, this.letterSelected, false).then((words: FirebaseWord[]) => {
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
    this.letterSelected = letter;
    this.dictionaryService.displayAlphabet(/*this.user?.learn?.text.toLocaleLowerCase()*/this.text, this.translate, this.letterSelected, false).then((words: FirebaseWord[]) => {
      this.words = words;
    });
  }

  seeDetail(word: FirebaseWord) {
    const firstLetter = word.phoneticTranslate[0].normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9,]/g, '').substring(0, 1).toLocaleLowerCase();
    this.dictionaryService.displayWord(this.user?.learn?.text.toLocaleLowerCase(), this.translate, firstLetter, word.link ? word.link : '').then((linkInfo: FirebaseWord) => {
      this.isDetailDisplay = true;
      this.linkInfo = linkInfo;
    });
  }

  onIonInfinite(ev: any) {
    this.dictionaryService.nextWords(/*this.user?.learn?.text.toLocaleLowerCase()*/this.text, this.translate, this.letterSelected).then((words: FirebaseWord[]) => {
      this.words = words;
    });
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }

  changeDictionary(){
    if(this.translate === 'francais'){
      this.text = 'francais';
      this.translate = 'shikomori'; //this.user.learn.text;
    } else {
      this.text = 'shikomori'; //this.user.learn.text;
      this.translate = 'francais';
    }
    this.dictionaryService.displayAlphabet(/*this.user?.learn?.text.toLocaleLowerCase()*/this.text, this.translate, this.letterSelected, false).then((words: FirebaseWord[]) => {
      this.words = words;
    });
  }

  closeModal() {
    this.isResultDisplay = false;
    this.isDetailDisplay = false;
  }

}
