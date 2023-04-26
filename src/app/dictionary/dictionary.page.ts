import { Component, OnInit } from '@angular/core';
import { User } from '../model/user.model';
import { Word } from '../model/word.model';
import { FirebaseWord } from '../model/wordFirebase.model';
import { AuthentificationService } from '../services/authentification.service';
import { DictionaryService } from '../services/dictionary.service';

@Component({
  selector: 'app-dictionary',
  templateUrl: 'dictionary.page.html',
  styleUrls: ['dictionary.page.scss']
})
export class DictionaryPage implements OnInit {

  word: string = '';
  wordsFound: Word[] = [];
  alphabet: string[] = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
  letterSelected: string = 'a';
  isResultDisplay: boolean | undefined;
  user: User | undefined;
  words: FirebaseWord[] = [];
  translate: string = 'francais';

  constructor(private dictionaryService: DictionaryService, private authentificationService: AuthentificationService) { }

  ngOnInit(): void {
    this.user = this.authentificationService.user;
    this.dictionaryService.displayAlphabet(this.user?.learn?.text.toLocaleLowerCase(), this.translate, this.letterSelected).then((words : FirebaseWord[]) => {
      this.words = words;
    });
  }

  searchWord() {
    this.isResultDisplay = true;
    this.wordsFound = [];
    this.dictionaryService.searchWord(this.word.toLocaleLowerCase()).then((words: FirebaseWord[]) => {
      if (words && words.length) {
        words.forEach((w: FirebaseWord) => {
          this.wordsFound.push(new Word(w.text.join(', '), w.translate.join(', '), w.description, w.examples));
        });
      }
    });
  }

  changeLetter(letter: string) {
    this.letterSelected = letter;
    this.dictionaryService.displayAlphabet(this.user?.learn?.text.toLocaleLowerCase(), this.translate, this.letterSelected).then((words : FirebaseWord[]) => {
      this.words = words;
    });
  }

  closeModal() {
    this.isResultDisplay = false;
  }

}
