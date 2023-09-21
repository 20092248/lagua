import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { collection, doc, getDoc, getFirestore } from 'firebase/firestore';

const THEME_KEY = 'selected-app-theme';

@Injectable({
  providedIn: 'root'
})
export class TopicService {

  themeMode: string | undefined;

  constructor(private _firestore: Firestore) { }

  async getTopic(document: string) {
    const topic = await getDoc(doc(getFirestore(), 'shingazidza_francais_topics', document));
    return topic.exists() ? topic.data() : undefined;
  }

}
