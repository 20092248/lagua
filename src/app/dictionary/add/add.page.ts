import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { Examples } from 'src/app/model/example.model';
import { DictionaryService } from 'src/app/services/dictionary.service';
import { DICO } from './dico';
import { AlertService } from 'src/app/services/alert.service';


@Component({
  selector: 'app-add',
  templateUrl: './add.page.html',
  styleUrls: ['./add.page.scss']
})
export class AddPage implements OnInit {

  wordForm: FormGroup;
  word: any = { text: '', translate: '', index: '', description: '', examples: [{ text: '', translate: '' }] };
  examplesCount: number = 1;

  constructor(private formBuilder: FormBuilder, private dictionaryService: DictionaryService, private alertService: AlertService) {
    this.wordForm = this.formBuilder.group({
      'text': ['', Validators.required],
      'translate': ['', Validators.required],
      'description': ['', Validators.required],
      'index': ['', Validators.required],
      'exampleText0': [], 'exampleTranslate0': [],
      'exampleText1': [], 'exampleTranslate1': [],
      'exampleText2': [], 'exampleTranslate2': [],
      'exampleText3': [], 'exampleTranslate3': [],
      'exampleText4': [], 'exampleTranslate4': [],
      'link': []
    });
  }

  ngOnInit() { }

  addWordInfo() {
    DICO.forEach(word => {
      if (word.text && word.translate) {
        word.text = word.text.trim();
        word.pluralText = word.pluralText ? word.pluralText.trim() : '';
        word.translate = word.translate.trim();
        this.dictionaryService.updateShikomoriDictionary(word).then(id => {
          console.log(id);
          console.log(word);
        })
      }
    });
    this.alertService.presentToast('Les mots ont été uploadé.', 1500, 'success');
  }

  updateWordInfo() {
    this.dictionaryService.addScrapperResponse().then(()=>{
      this.alertService.presentToast('La définition.', 1500, 'success');
    });
  }

  addWord() {
    this.controlExamples();
    this.dictionaryService.updateDictionary(this.word).then((data: any) => {
      this.wordForm.reset();
      this.alertService.presentToast('Le mots ont été mis a jour.', 1500, 'success');
      if (!this.word.examples.length) {
        this.word.examples.push({ text: '', translate: '' });
      }
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
        this.word.examples.splice(index, 1);
      }
    });
  }

  copierTexte(letter: string) {
    if (letter) {
      console.log(letter);
      navigator.clipboard.writeText(letter).then();
    }
  }

}