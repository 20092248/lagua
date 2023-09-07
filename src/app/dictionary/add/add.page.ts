import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { Examples } from 'src/app/model/example.model';
import { DictionaryService } from 'src/app/services/dictionary.service';
import { DICO } from './dico';
import { AlertService } from 'src/app/services/alert.service';
import { FirebaseWord } from 'src/app/model/wordFirebase.model';
import { error } from 'console';


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
        }, () => console.error(word));
      }
    });
    this.alertService.presentToast('Les mots ont été uploadé.', 1500, 'success');
  }

  updateWordInfo() {
    this.dictionaryService.addScrapperResponse().then(() => {
      this.alertService.presentToast('L\'api a été mis à jour.', 1500, 'success');
    });
  }

  restartWordInfo() {
    this.dictionaryService.resetScrapperApi().then(() => {
      this.alertService.presentToast('Relancement des API.', 1500, 'success');
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

  // text : document.querySelectorAll('div.col-xs-8.col-sm-8')[1].querySelector('span[name="word_selection"]').innerHTML
  // non plural : document.querySelectorAll('div.col-xs-8.col-sm-8')[1].querySelector('span .word_plural').innerHTML
  // plural : document.querySelectorAll('div.col-xs-8.col-sm-8')[1].querySelector('span .word_plural6 span').innerHTML          ATTENTION PAS forcement word_plural6 2 4 6 8 10
  // textSymbole : document.querySelectorAll('div.col-xs-8.col-sm-8')[1].querySelector('span[style=""]').innerHTML.replaceAll(/\<.[^(]*\>/g, '').trim()
  // dialect : document.querySelectorAll('div.col-xs-8.col-sm-8')[1].querySelector('span[style="text-align:right;"]>span').style.color

  // translate : document.querySelectorAll('div.col-xs-4.col-sm-4 .wordDefinitionSmall span[style="font-weight:bold;"]')     ///LIST!!!!!!!!!
  // translateSymbole : document.querySelectorAll('div.col-xs-4.col-sm-4 .wordDefinitionSmall span[style="color:#333333;"]')        ///LIST!!!!!!!!!
  // translateInfo : document.querySelectorAll('div.col-xs-4.col-sm-4')[1].querySelectorAll('i[style="background-color:#FFB060;color:black;"]')    ///LIST!!!!!!!!!

  // description : document.querySelectorAll('div.col-xs-8.col-sm-8 span[style="background-color:#ffea00;"]')[0].innerHTML

  // example :
  //    text : document.querySelectorAll('div.col-xs-8.col-sm-8 span[style="background-color:#c0ffc0;font-style: italic;"]')[0].innerHTML.replaceAll(/\<.[^(]*\>/g, '').trim()
  //    dialect : document.querySelectorAll('div.col-xs-8.col-sm-8 span[style="background-color:#c0ffc0;font-style: italic;"] span')[0].style.color
  //    translate : document.querySelectorAll('div.col-xs-8.col-sm-8 span[style="background-color:#c0e2ff;font-style: italic;"]')[0].innerHTML

  // synonymes / mots transparents
  // siblingTranslate : document.querySelectorAll('div.col-xs-12.col-sm-12.infos_examples')[0].innerHTML.split('<br>')[i].replace(/\s*\<.*?\>\s*/g, '').split(':')[0]    //LIST!!!! à partir de 1
  // siblingTexts : document.querySelectorAll('div.col-xs-12.col-sm-12.infos_examples')[0].querySelectorAll('span:not([style])')   ---------------> LIST !!!!!!
  // siblingDialect : document.querySelectorAll('div.col-xs-12.col-sm-12.infos_examples')[0].querySelectorAll('span:not([style="color:#666666;"]):not(span[id])')   // LIST!!!!!!!!!


}