import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Examples } from 'src/app/model/example.model';
import { DictionaryService } from 'src/app/services/dictionary.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.page.html',
  styleUrls: ['./add.page.scss']
})
export class AddPage implements OnInit {

  word: any = { text: '', translate: '', description: '', examples: [{ text: '', translate: '' }] };
  examplesCount: number = 1;

  constructor(private dictionaryService: DictionaryService, private toastController: ToastController) { }

  ngOnInit() {
    console.log(this.word.examples.length);
  }

  addWord() {
    console.log(this.word);
    this.controlExamples();
    this.dictionaryService.updateDictionary(this.word).then((data: any) => {
      console.log(data);
      this.displayToast();
    });
  }

  addExample(index: number) {
    this.word.examples.splice(index + 1, 0, { text: '', translate: '' });
  }

  removeExample(index: number) {
    this.word.examples.splice(index, 1);
  }

  controlExamples() {
    this.word.examples.forEach((w: Examples, index: number) => {
      if (!(w.text && w.translate)) {
        this.word.examples.splice(index + 1, 1);
      }
    });
  }

  async displayToast() {
    const toast = await this.toastController.create({
      message: 'Le mot a été affiché dans le dictionnaire.',
      duration: 1500,
      position: 'bottom',
      color: 'success'
    });
    await toast.present();
  }

}