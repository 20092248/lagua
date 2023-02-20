import { Component } from '@angular/core';
import { DictionaryService } from '../services/dictionary.service';

@Component({
  selector: 'app-dictionary',
  templateUrl: 'dictionary.page.html',
  styleUrls: ['dictionary.page.scss']
})
export class DictionaryPage {

  word: string = '';

  constructor(private dictionaryService: DictionaryService) {}

  searchWord() {
    console.log(this.word);
    this.dictionaryService.searchWord(this.word).then((data: any) => {
      console.log(data);
    });
  }

}
