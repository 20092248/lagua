import { Injectable } from '@angular/core';
import { Firestore, getFirestore } from '@angular/fire/firestore';
import { doc, getDocs, addDoc, collection, query, where, DocumentData, orderBy } from '@firebase/firestore';
import { Word } from '../model/word.model';
import { FirebaseWord } from '../model/wordFirebase.model';

const THEME_KEY = 'selected-app-theme';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  themeMode: string | undefined;

  constructor() {
    this.themeMode = this.themeMode ? this.themeMode : 'moon';
   }

  setAppTheme(theme: string | undefined) {
    if (theme === 'moon') {
      this.themeMode = 'sunny';
      document.body.classList.add('dark');
    } else {
      this.themeMode = 'moon';
      document.body.classList.remove('dark');
    }
    localStorage.setItem(THEME_KEY, theme === 'moon' ? 'moon' : 'sunny');
  }

}
