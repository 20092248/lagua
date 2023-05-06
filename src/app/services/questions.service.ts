import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, FacebookAuthProvider, getAuth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, signOut } from '@angular/fire/auth';
import { doc, Firestore, getFirestore, onSnapshot, setDoc, updateDoc } from '@angular/fire/firestore';
import { CodeLabel } from '../model/codeLabel.model';
import { CodeTextTranslate } from '../model/codeTextTranslate.model';
import { User } from '../model/user.model';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  type: string | undefined;

  constructor(private _auth: Auth, private _firestore: Firestore) { }

}