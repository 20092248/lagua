import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { Examples } from 'src/app/model/example.model';
import { DictionaryService } from 'src/app/services/dictionary.service';
import { DICO } from './dico';
import { AlertService } from 'src/app/services/alert.service';
import { FirebaseWord } from 'src/app/model/wordFirebase.model';


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

  ngOnInit() {
    this.getMoreDetails();
  }

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
    this.dictionaryService.addScrapperResponse().then(() => {
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

  getMoreDetails() {
    this.dictionaryService.displayWord('shikomori', 'francais', 'f', 'GVHbsGLuIN3Injf1b0YD').then((word: FirebaseWord) => {
      if (word.scraper && word.scraper.response.body) {
        const body = word.scraper.response.body;

        var parser = new DOMParser();
        var documentWord = parser.parseFromString(word.scraper.response.body, "text/html");
        const text = documentWord.querySelectorAll('div.col-xs-8.col-sm-8')[1].querySelector('span[name="word_selection"]')?.innerHTML;
        console.log('text', text);
        const plural = this.getPlural(documentWord);
        console.log('plural', plural);
        const symbole = documentWord.querySelectorAll('div.col-xs-8.col-sm-8')[1].querySelector('span[style=""]') ? documentWord.querySelectorAll('div.col-xs-8.col-sm-8')[1].querySelector('span[style=""]')?.innerHTML?.replace(/\<.[^(]*\>/g, '').trim() : '';
        console.log('symbole', symbole);
        const dialect = this.getDialect(documentWord);
        console.log('dialect', dialect);
        const translates = this.getTranslates(documentWord);
        console.log('translates', translates);
        const description = documentWord.querySelector('div.col-xs-8.col-sm-8 span[style="background-color:#ffea00;"]')?.innerHTML?.trim();
        console.log('description', description);
        const examples = this.getExamples(documentWord);
        console.log('examples', examples);
        const siblings = this.getSiblings(documentWord);
        console.log('siblings', siblings);
      }
    });
  }

  getSiblings(docWord: any) {
    const ss: any = [];
    const ssContainer = docWord.querySelector('div.col-xs-12.col-sm-12.infos_examples:not(.separator)')
    if (ssContainer) {
      const ssArray = ssContainer.innerText?.replace(' Synonymes et/ou mots transparents :', '').replaceAll('· ', '').replaceAll(' ', '').split('\n');
      if (ssArray) {
        ssArray.forEach((s: any) => {
          const text = this.getTexts(s.split(':')[1]);
          const dialect = this.transFormDialect(s?.split(':')[0]);
          ss.push({ text: text, dialect: dialect });
        });
      }
    }
    return ss;
  }

  getTexts(textValue: string) {
    const texts: string[] = [];
    textValue.split(';').forEach(t => {
      const text = t?.substring(0, t.length - 1);
      const dialect = t?.substring(t.length - 1);
    })
  }

  getExamples(docWord: any) {
    const ex: any = [];
    const examplesText = docWord.querySelectorAll('div.col-xs-8.col-sm-8 span[style="background-color:#c0ffc0;font-style: italic;"]');
    const examplesTranslate = docWord.querySelector('div.col-xs-8.col-sm-8 span[style="background-color:#c0e2ff;font-style: italic;"]')?.innerText;
    if (examplesText) {
      examplesText.forEach((e: any) => {
        const text = e?.innerText.replaceAll(/\..[^(]*/g, '.');
        const dialect = this.transColorDialect(e?.querySelector('span').style.color);
        const translate = examplesTranslate;
        ex.push({ text: text, dialect: dialect, translate: translate });
      });
    }
    return ex;
  }

  getTranslates(docWord: any) {
    const ts: any = [];
    const translates = docWord.querySelectorAll('div.col-xs-4.col-sm-4>.col-xs-12.col-sm-12');
    if (translates) {
      translates.forEach((t: any) => {
        const translate = t.querySelector('a span [style="font-weight:bold;"]')?.innerHTML;
        const symbol = t.querySelector('a span span[style="color:#333333;"]')?.innerText;
        const info = t.querySelector('div i span')?.innerText;
        ts.push({ translate: translate, symbol: symbol, info: info });
      });
    }
    return ts;
  }

  getPlural(docWord: any) {
    if (docWord.querySelectorAll('div.col-xs-8.col-sm-8')[1]?.querySelector('span .word_plural')) {
      return '';
    } else {
      if (docWord.querySelectorAll('div.col-xs-8.col-sm-8')[1]?.querySelector('span .word_plural6 span')) {
        return docWord.querySelectorAll('div.col-xs-8.col-sm-8')[1]?.querySelector('span .word_plural6 span')?.innerHTML;
      } else if (docWord.querySelectorAll('div.col-xs-8.col-sm-8')[1]?.querySelector('span .word_plural2 span')) {
        return docWord.querySelectorAll('div.col-xs-8.col-sm-8')[1]?.querySelector('span .word_plural2 span')?.innerHTML;
      } else if (docWord.querySelectorAll('div.col-xs-8.col-sm-8')[1]?.querySelector('span .word_plural4 span')) {
        return docWord.querySelectorAll('div.col-xs-8.col-sm-8')[1]?.querySelector('span .word_plural4 span')?.innerHTML;
      } else if (docWord.querySelectorAll('div.col-xs-8.col-sm-8')[1]?.querySelector('span .word_plural8 span')) {
        return docWord.querySelectorAll('div.col-xs-8.col-sm-8')[1]?.querySelector('span .word_plural8 span')?.innerHTML;
      } else if (docWord.querySelectorAll('div.col-xs-8.col-sm-8')[1]?.querySelector('span .word_plural610 span')) {
        return docWord.querySelectorAll('div.col-xs-8.col-sm-8')[1]?.querySelector('span .word_plural10 span')?.innerHTML;
      } else {
        return '';
      }
    }
  }

  getDialect(docWord: any) {
    const color = docWord.querySelectorAll('div.col-xs-8.col-sm-8')[1]?.querySelector('span[style="text-align:right;"]>span').style.color;
    return this.transColorDialect(color);
  }

  transColorDialect(color: string) {
    if (color === 'green') {
      return 'ALL';
    } else if (color === 'red') {
      return 'SHINDZUANI';
    } else if (color === 'rgb(26, 163, 255)') {
      return 'SHINGAZIDZA';
    } else if (color === 'gray') {
      return 'SHIMAORE';
    } else if (color === 'rgb(255, 204, 0)') {
      return 'SHIMWALI';
    } else {
      return '';
    }
  }

  transFormDialect(color: string) {
    if (color === '●') {
      return 'ALL';
    } else if (color === '▲') {
      return 'SHINDZUANI';
    } else if (color === '◼') {
      return 'SHINGAZIDZA';
    } else if (color === '✧') {
      return 'SHIMAORE';
    } else if (color === '✽') {
      return 'SHIMWALI';
    } else {
      return '';
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