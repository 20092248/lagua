import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { collection, doc, getDoc, getDocs, setDoc, getFirestore, orderBy, query, updateDoc, where } from 'firebase/firestore';

const THEME_KEY = 'selected-app-theme';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  dialogs: any[] = [];
  chats: any = {};

  constructor(private _firestore: Firestore, private http: HttpClient) { }

  async getDialogs(category: string) {
    this.dialogs = [];
    const q = query(collection(getFirestore(), 'dialogs'), where('category', '==', category), orderBy('order', 'asc'));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => this.dialogs.push(doc.data()));
    return this.dialogs;
  }

  async getChats(collection: string, document: string): Promise<any> {
    this.chats = {};
    const chatRef = doc(getFirestore(), collection, document);
    const docSnap = await getDoc(chatRef);
    if (docSnap.exists()) {
      const chats = docSnap.data();
      this.chats = chats;
    }
    return this.chats;
  }

  async updateChats(collection: string, document: string, data: any[], situation: string): Promise<any> {
    const docRef = doc(getFirestore(), collection, document);
    await updateDoc(docRef, {
      situation: situation,
      chats: data
    });
  }

  async createChats(collection: string, document: string, data: any[], situation: string): Promise<any> {
    const docRef = doc(getFirestore(), collection, document);
    await setDoc(docRef, {
      situation: situation,
      chats: data
    });
  }

  updatebodyLinkFr(collection: string, document: string, text: string, situation: string, dialogExist: boolean) {
    const chats: any[] = [];
    var userNameOrigin = '';
    text.split('\n').filter(t => t).forEach((t, i) => {
      if(i === 0) {
        userNameOrigin = t.split(':')[0].trim();
      }
      if (t) {
        const chat = {
          userId: userNameOrigin === t.split(':')[0].trim() ? '1' : '2',
          userName: t.split(':')[0].trim(),
          translate: t.split(':')[1].trim(),
          text: {
            shindzuani: '',
            shingazidja: '',
            shimwali: '',
            shimaore: '',
          },
        }
        chats.push(chat);
      }
    });
    if(dialogExist){
      this.updateChats(collection, document, chats, situation);
    } else {
      this.createChats(collection, document, chats, situation);
    }
    return Promise.resolve(true);
    // return this.http.get(link, { responseType: 'text' }).subscribe(
    //   value => {
    //     console.log(value.replace(/.*?(<p>.*<\/p>).*/, "$1"));
    //     const article = "<p>" + value.split("<p>")[1].split("</p>")[0] + "<p>";
    //     console.log(article);
    //     var parser = new DOMParser();
    //     var documentWord = parser.parseFromString(article, "text/html");
    //     console.log(documentWord);
    //     const dialogs = document.querySelectorAll("article");
    //     dialogs.forEach((d, i) => {
    //       if (d && d.querySelector("b")) {
    //         const uid = !(i % 2) ? '1' : '2';
    //         const userName = d.querySelector("b")?.innerHTML.replace(":", "").trim();
    //         const translate = d.querySelector("span")?.innerHTML.replace(":", "").trim();
    //         console.log(uid);
    //         console.log(userName);
    //         console.log(translate);
    //       }
    //     })
    //     // document.querySelectorAll(".fusion-text.fusion-text-2 p")[13].querySelector("b")
    //   },
    //   error => console.log(error));
  }

}
