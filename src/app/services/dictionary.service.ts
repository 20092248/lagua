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
  collection = 'shikomori_francais_h'; //ATTENTION METTRE en --disable-web-security --> chrome.exe --user-data-dir="C://Chrome dev session" --disable-web-security

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
    const dictionayRef = await addDoc(collection(getFirestore(), 'shikomori_francais_'+firstLetter), firebaseWord);
    this.getapi(word.text, firstLetter).subscribe(scraper => {
      this.updateScraperInfo(scraper, dictionayRef.id);
    },() => {
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

  async addScrapperResponse(){
    const q = query(collection(getFirestore(), this.collection));
    const querySnapshot = await getDocs(q);
    console.log(querySnapshot.size);
    querySnapshot.forEach((doc) => {
      const data = doc.data() as any;
      if(data.scraper){
        if(!data.scraper.response){
        this.getbody(data.scraper.id).subscribe(scraperFull =>{
          console.log(scraperFull.response);
          this.updateScraperInfo(scraperFull, doc.id);
        });
      }
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
    querySnapshot.forEach((doc) => words.push(doc.data() as FirebaseWord));
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

  getapi(name: string, letter: string) : Observable<any> {
    return this.http.post<any>('https://async.scraperapi.com/jobs', {
      apiKey: '7429876eeaeae2d54b62f9fcf85cf50c',
      url: 'https://orelc.ac/academy/ShikomoriWords/viewWord/' + name + '?letter=' + letter
    }, this.httpOptions).pipe(
      catchError(e => e));
  }

  getbody(api: string) {
    return this.http.get<any>('https://async.scraperapi.com/jobs/'+api, this.httpOptions).pipe(
      catchError(e => e));
  }

}
