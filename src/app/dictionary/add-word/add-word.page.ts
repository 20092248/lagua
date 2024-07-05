import { Component, OnInit } from '@angular/core';
import { FirebaseWord } from 'src/app/model/wordFirebase.model';

@Component({
  selector: 'app-add-word',
  templateUrl: './add-word.page.html',
  styleUrls: ['./add-word.page.scss'],
})
export class AddWordPage implements OnInit {

  category: string = 'FR';
  segments: string[] = ['FR', 'KM'];
  wordToUpdate: any = {text: '', pluralText: '', translate:'', description: '', examples: [], siblings: []};

  constructor() { }

  ngOnInit() {
  }

  update(word: any) {
  const firebaseWord: any = {
    text: word.text.split(';'),
    pluralText: word.pluralText ? word.pluralText.split(';') : '',
    translate: word.translate.split(';'),
    originalText: word.text,
    originalPluralText: word.pluralText ? word.pluralText : '',
    originalTranslate: word.translate,
    description: word.description ? word.description : '',
    examples: word.examples ? word.examples : [],
    siblings: [],
    phoneticText: word.text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zɓɗA-ZƁƊ0-9-,;() ]/g, '').replace('-a ', '').replace('-', '').replace(/\(.[^(]*\)/g, '').replaceAll('ɓ', 'b').replaceAll('ɗ', 'd').toLocaleLowerCase().split(';'),
    phoneticTranslate: word.translate.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9'-,;() ]/g, '').replace(/\(.[^(]*\)/g, '').replaceAll(' ', ';').toLocaleLowerCase().split(';'),
  };

}
}
