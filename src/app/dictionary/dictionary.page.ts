import { Component } from '@angular/core';
import { Word } from '../model/word.model';
import { FirebaseWord } from '../model/wordFirebase.model';
import { DictionaryService } from '../services/dictionary.service';

@Component({
  selector: 'app-dictionary',
  templateUrl: 'dictionary.page.html',
  styleUrls: ['dictionary.page.scss']
})
export class DictionaryPage {

  word: string = '';
  wordsFound: Word[] = [];
  alphabet: string[] = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

  constructor(private dictionaryService: DictionaryService) { }

  searchWord() {
    this.wordsFound = [];
    this.dictionaryService.searchWord(this.word.toLocaleLowerCase()).then((words: FirebaseWord[]) => {
      if(words && words.length){
        words.forEach((w: FirebaseWord)=>{
          this.wordsFound.push(new Word(w.text.join(', '), w.translate.join(', '), w.description, w.examples));
        });
      }
    });
  }

}
