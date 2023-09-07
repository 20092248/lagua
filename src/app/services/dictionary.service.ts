import { Injectable } from '@angular/core';
import { Firestore, getFirestore } from '@angular/fire/firestore';
import { doc, getDoc, getDocs, addDoc, collection, query, where, updateDoc, orderBy } from '@firebase/firestore';
import { Word } from '../model/word.model';
import { FirebaseWord } from '../model/wordFirebase.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DictionaryService {

  constructor(private _firestore: Firestore, private http: HttpClient) { }
  collection = 'shikomori_francais_r'; //ATTENTION METTRE en --disable-web-security --> chrome.exe --user-data-dir="C://Chrome dev session" --disable-web-security

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'disableTokenValidation': 'true',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    })
  };

  async updateDictionary(word: any): Promise<string> {
    const firstLetter = word.text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9,]/g, '').substring(0, 1).toLocaleLowerCase();
    const firebaseWord: FirebaseWord = {
      text: word.text.split(','),
      translate: word.translate.split(','),
      originalText: word.text,
      originalTranslate: word.translate,
      description: word.description,
      examples: word.examples,
      phoneticText: word.text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9,]/g, '').toLocaleLowerCase().split(','),
      phoneticTranslate: word.index.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9,]/g, '').toLocaleLowerCase().split(','),
    };
    if (word.link) { firebaseWord.link = word.link; }
    const dictionayRef = await addDoc(collection(getFirestore(), 'shindzuani_francais_' + firstLetter), firebaseWord);
    return dictionayRef.id;
  }

  async updateShikomoriDictionary(word: any): Promise<string> {
    const firstLetter = word.text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zɓɗA-ZƁƊ]/g, '').substring(0, 1).toLocaleLowerCase();
    const firebaseWord: FirebaseWord = {
      text: word.text.split(';'),
      pluralText: word.pluralText ? word.pluralText.split(';') : '',
      translate: word.translate.split(';'),
      originalText: word.text,
      originalPluralText: word.pluralText ? word.pluralText : '',
      originalTranslate: word.translate,
      description: word.description ? word.description : '',
      examples: word.examples ? word.examples : [],
      phoneticText: word.text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zɓɗA-ZƁƊ0-9-,;() ]/g, '').replace('-a ', '').replace('-', '').replace(/\(.[^(]*\)/g, '').replaceAll('ɓ', 'b').replaceAll('ɗ', 'd').toLocaleLowerCase().split(';'),
      phoneticTranslate: word.translate.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9'-,;() ]/g, '').replace(/\(.[^(]*\)/g, '').replaceAll(' ', ';').toLocaleLowerCase().split(';'),
    };
    if (word.link) { firebaseWord.link = word.link; }
    const dictionayRef = await addDoc(collection(getFirestore(), 'shikomori_francais_' + firstLetter), firebaseWord);
    this.getapi(word.text, firstLetter).subscribe(scraper => {
      this.updateScraperInfo(scraper, dictionayRef.id);
    }, () => {
      console.error(word.text);
    });
    return dictionayRef.id;
  }

  updateScraperInfo(scrapper: any, id: string) {
    const dictionayRef = doc(getFirestore(), this.collection, id);
    updateDoc(dictionayRef, {
      scraper: scrapper
    });
  }

  updateDetailInfo(word: any, uid: string) {
    const firstLetter = word.text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zɓɗA-ZƁƊ]/g, '').substring(0, 1).toLocaleLowerCase();
    console.log(uid, word);
    const dictionayRef = doc(getFirestore(), 'shikomori_francais_' + firstLetter, uid);
    updateDoc(dictionayRef, {
      pluralText: word.plural ? word.plural.split(';') : [],
      originalPluralText: word.plural ? word.plural : '',
      symbol: word.symbol ? word.symbol : '',
      dialect: word.dialect ? word.dialect : '',
      description: word.description ? word.description : '',
      examples: word.examples ? word.examples : [],
      siblings: word.siblings ? word.siblings : []
    });
  }

  async addScrapperResponse() {
    const q = query(collection(getFirestore(), this.collection));
    const querySnapshot = await getDocs(q);
    console.log(querySnapshot.size);
    querySnapshot.forEach((doc) => {
      const data = doc.data() as any;
      if (data.scraper) {
        if (!data.scraper.response) {
          this.getbody(data.scraper.id).subscribe(scraperFull => {
            if (scraperFull.response) {
              console.log(data.originalText + ':' + data.scraper?.status, scraperFull.response);
              this.updateScraperInfo(scraperFull, doc.id);
            }
          });
        }
      }
    });
  }

  async resetScrapperApi() {
    const q = query(collection(getFirestore(), this.collection));
    const querySnapshot = await getDocs(q);
    console.log(querySnapshot.size);
    querySnapshot.forEach(async (doc) => {
      const data = doc.data() as any;
      if (data.scraper && !data.scraper.response) {
        const firstLetter = data.originalText.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zɓɗA-ZƁƊ]/g, '').substring(0, 1).toLocaleLowerCase();
        this.getapi(data.originalText, firstLetter).subscribe(scraper => {
          if (!data.scraper.response) {
            console.log(data.originalText + ':', scraper);
            this.updateScraperInfo(scraper, doc.id);
          }
        }, () => {
          console.error(data.originalText);
        });
      }
    });
  }

  async searchWord(word: string): Promise<FirebaseWord[]> {
    const firstLetter = word.normalize('NFD').replace(/[\u0300-\u036f]/g, '').substring(0, 1).toLocaleLowerCase();
    const q = query(collection(getFirestore(), 'shindzuani_francais_' + firstLetter), where('phoneticText', 'array-contains', word));
    const querySnapshot = await getDocs(q);
    const words: FirebaseWord[] = [];
    querySnapshot.forEach((doc) => words.push(doc.data() as FirebaseWord));
    return words;
  }

  async displayAlphabet(text: string | undefined, translate: string | undefined, alphabet: string): Promise<FirebaseWord[]> {
    const q = query(collection(getFirestore(), text + '_' + translate + '_' + alphabet), orderBy('originalText', 'asc'));
    const querySnapshot = await getDocs(q);
    const words: FirebaseWord[] = [];
    querySnapshot.forEach((doc) => {
      const word = doc.data() as FirebaseWord;
      word.uid = doc.id;
      words.push(word);
      this.getMoreDetail(word);
    });
    return words;
  }

  async displayWord(text: string | undefined, translate: string | undefined, alphabet: string, uid: string): Promise<FirebaseWord> {
    const docRef = doc(getFirestore(), text + '_' + translate + '_' + alphabet, uid);
    const docSnap = await getDoc(docRef);
    try {
      if (docSnap.exists()) {
        return docSnap.data() as FirebaseWord;
      } else {
        throw new Error('Impossible de retrouver le mot recherché.');
      }
    } catch (error: any) {
      throw Error(error.message);
    }
  }

  getapi(name: string, letter: string): Observable<any> {
    return this.http.post<any>('https://async.scraperapi.com/jobs', {
      apiKey: '66c080c6eb03a87751efe5975e948f17',
      url: 'https://orelc.ac/academy/ShikomoriWords/viewWord/' + name + '?letter=' + letter
    }, this.httpOptions).pipe(
      catchError(e => e));
  }

  getbody(api: string) {
    return this.http.get<any>('https://async.scraperapi.com/jobs/' + api, this.httpOptions).pipe(
      catchError(e => e));
  }

  getMoreDetail(word: FirebaseWord) {
    if (word.scraper && word.scraper.response.body) {
      const body = word.scraper.response.body;

      var parser = new DOMParser();
      var documentWord = parser.parseFromString(word.scraper.response.body, "text/html");
      const text = documentWord.querySelectorAll('div.col-xs-8.col-sm-8')[1].querySelector('span[name="word_selection"]')?.innerHTML;
      const plural = this.getPlural(documentWord);
      const symbol = documentWord.querySelectorAll('div.col-xs-8.col-sm-8')[1].querySelector('span[style=""]') ? documentWord.querySelectorAll('div.col-xs-8.col-sm-8')[1].querySelector('span[style=""]')?.innerHTML?.replace(/\<.[^(]*\>/g, '').trim() : '';
      const dialect = this.getDialect(documentWord);
      const translates = this.getTranslates(documentWord);
      const description = documentWord.querySelector('div.col-xs-8.col-sm-8 span[style="background-color:#ffea00;"]')?.innerHTML?.trim();
      const examples = this.getExamples(documentWord);
      const siblings = this.getSiblings(documentWord);
      const w = { 'text': text, 'plural': plural, 'symbol': symbol, 'dialect': dialect, 'translates': translates, 'description': description, 'examples': examples, 'siblings': siblings };
      this.updateDetailInfo(w, word.uid ? word.uid : '');
    }
  }

  getSiblings(docWord: any) {
    const ss: any = [];
    const ssContainer = docWord.querySelector('div.col-xs-12.col-sm-12.infos_examples:not(.separator)')
    if (ssContainer) {
      const ssArray = ssContainer.innerText?.replace(' Synonymes et/ou mots transparents :· ', '').replaceAll(' ', '').split('·');
      if (ssArray) {
        ssArray.forEach((s: any) => {
          const texts = this.getTexts(s.split(':')[1]);
          const translate = s.split(':')[0];
          ss.push({ texts: texts, translate: translate });
        });
      }
    }
    return ss;
  }

  getTexts(textValue: string) {
    const texts: any[] = [];
    textValue?.split(';').forEach(t => {
      if (t) {
        const text = t?.substring(0, t.length - 1);
        const dialect = this.transFormDialect(t?.substring(t.length - 1));
        texts.push({ text: text, dialect: dialect });
      }
    });
    return texts;
  }

  getExamples(docWord: any) {
    const ex: any = [];
    const examplesText = docWord.querySelectorAll('div.col-xs-8.col-sm-8 span[style="background-color:#c0ffc0;font-style: italic;"]');
    const examplesTranslate = docWord.querySelector('div.col-xs-8.col-sm-8 span[style="background-color:#c0e2ff;font-style: italic;"]')?.innerText;
    if (examplesText) {
      examplesText.forEach((e: any) => {
        const text = e?.innerText.replaceAll(/\..[^(]*/g, '.') || '';
        const dialect = this.transColorDialect(e?.querySelector('span').style.color) || '';
        const translate = examplesTranslate || '';
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
        const translate = t.querySelector('a span [style="font-weight:bold;"]')?.innerHTML || '';
        const symbol = t.querySelector('a span span[style="color:#333333;"]')?.innerText || '';
        const info = t.querySelector('div i span')?.innerText || '';
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

  async renammeCollection(oldCollection: string, newCollection: string) {
    const q = query(collection(getFirestore(), oldCollection));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (doc) => {
      const newCollectionId = await addDoc(collection(getFirestore(), newCollection), doc);
      console.log(newCollectionId);
    });
  }

}
