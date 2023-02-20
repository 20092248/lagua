import { Component, OnInit } from '@angular/core';
import { DictionaryService } from 'src/app/services/dictionary.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.page.html',
  styleUrls: ['./add.page.scss']
})
export class AddPage implements OnInit {

  word: any = { text: '', translate: '', description: '', examples: [{ text: '', translate: '' }] };
  examplesCount: number = 1;

  constructor(private dictionaryService: DictionaryService) { }

  ngOnInit() {
    console.log(this.word.examples.length);
  }

  addWord() {
    console.log(this.word);
    this.dictionaryService.updateDictionary(this.word).then((data: any) => {
      console.log(data);
    });
  }

  addExample(index: number) {
    this.word.examples.splice(index + 1, 0, { text: '', translate: '' });
  }

  removeExample(index: number) {
    this.word.examples.splice(index, 1);
  }

}