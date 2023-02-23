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

  constructor(private dictionaryService: DictionaryService) { }

  searchWord() {
    this.wordsFound = [];
    this.dictionaryService.searchWord(this.word).then((words: FirebaseWord[]) => {
      if(words && words.length){
        words.forEach((w: FirebaseWord)=>{
          this.wordsFound.push(new Word(w.text.join(', '), w.translate.join(', '), w.description, w.examples));
        });
        console.log(this.wordsFound);
      }
    });
  }

}
