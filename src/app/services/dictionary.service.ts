import { Injectable } from '@angular/core';
import { Firestore, getFirestore } from '@angular/fire/firestore';
import { doc, getDocs, addDoc, collection, query, where, DocumentData } from '@firebase/firestore';
import { Word } from '../model/word.model';
import { FirebaseWord } from '../model/wordFirebase.model';

@Injectable({
  providedIn: 'root'
})
export class DictionaryService {

  constructor(private _firestore: Firestore) { }

  async updateDictionary(word: any): Promise<string> {
    word.translate = word.translate.split(',');
    word.text = word.text.split(',');
    word.phonetic = word.text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\w\s]|_/g, '');
    word.examples = word
    const firstLetter = word.text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').substring(0, 1).toLocaleLowerCase();
    const dictionayRef = await addDoc(collection(getFirestore(), 'shindzuani_francais_' + firstLetter), word);
    return dictionayRef.id;
  }

  async searchWord(word: string): Promise<FirebaseWord[]> {
    const firstLetter = word.normalize('NFD').replace(/[\u0300-\u036f]/g, '').substring(0, 1).toLocaleLowerCase();
    const q = query(collection(getFirestore(), 'shindzuani_francais_' + firstLetter), where('phonetic', 'array-contains', word));
    const querySnapshot = await getDocs(q);
    const words: FirebaseWord[] = [];
    querySnapshot.forEach((doc) => words.push(doc.data() as FirebaseWord));
    return words;
  }

}