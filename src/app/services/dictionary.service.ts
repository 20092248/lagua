import { Injectable } from '@angular/core';
import { Firestore, getFirestore } from '@angular/fire/firestore';
import { doc, getDoc, getDocs, addDoc, collection, query, where, DocumentData, orderBy } from '@firebase/firestore';
import { Word } from '../model/word.model';
import { FirebaseWord } from '../model/wordFirebase.model';

@Injectable({
  providedIn: 'root'
})
export class DictionaryService {

  constructor(private _firestore: Firestore) { }

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
    if(word.link) { firebaseWord.link = word.link; }
    const dictionayRef = await addDoc(collection(getFirestore(), 'shindzuani_francais_' + firstLetter), firebaseWord);
    return dictionayRef.id;
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

}
