import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, FacebookAuthProvider, getAuth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, signOut } from '@angular/fire/auth';
import { doc, Firestore, getFirestore, onSnapshot, setDoc, updateDoc } from '@angular/fire/firestore';
import { CodeLabel } from '../model/codeLabel.model';
import { CodeTextTranslate } from '../model/codeTextTranslate.model';
import { User } from '../model/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {

  user: User = {};

  constructor(private _auth: Auth, private _firestore: Firestore) { }

  checkUserState() {
    // if(getAuth() && getAuth().currentUser){
    //   const user = getAuth().currentUser;
    //   this.user.uid = user?.uid;
    //   this.user.email = user?.email;
    //   this.user.displayName = user?.displayName;
    //   this.user.photoURL = user?.photoURL;
    //   if(user){
    //     this.getInfoUser(user.uid);
    //   }
    // }
    return true; //getAuth() && getAuth().currentUser;
  }

  getInfoUser(uid: string) {
    onSnapshot(doc(getFirestore(), 'users', uid), (doc) => {
      const data = doc.data() as User;
      this.user.age = data.age;
      this.user.learn = data.learn as CodeTextTranslate;
      this.user.why = data.why as CodeLabel;
      this.user.time = data.time as CodeLabel;
      this.user.level = data.level as CodeLabel;
    });
  }

  addInfoUser(uid: string) {
    setDoc(doc(getFirestore(), 'users', uid), {
      age : this.user.age,
      learn : this.user.learn,
      why : this.user.why,
      time : this.user.time,
      level : this.user.level,
    }, { merge: true });
  }

  async login(email: string, password: string) {
    signInWithEmailAndPassword(getAuth(), email, password).then((userCredential) => {
      const user = userCredential.user;
      this.getInfoUser(user?.uid);
    })
      .catch((error) => {
        console.error(error.code + ' : ' + error.message);
      }); //connexion
  }

  async createUser(name: string, email: string, password: string) {
    let response = await createUserWithEmailAndPassword(getAuth(), email, password)
      .then((userCredential) => {
        this.user.email = userCredential?.user?.email;
        this.user.uid = userCredential?.user?.uid;
        setDoc(doc(getFirestore(), 'users', this.user.uid), this.user);
        this.login(email, password);
        return true;
      })
      .catch((error) => {
        console.error(error);
        return false;
      });
    return response;
  }

  async loginwithgoogle(): Promise<boolean> {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    let response = await signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential ? credential.accessToken : null;
        // The signed-in user info.
        this.user = result.user as User;
        this.getInfoUser(result.user?.uid);
        return true;
      }).catch((error) => {
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.error(error);
        return false;
      });
    return response;
  }

  async signinwithgoogle(): Promise<boolean> {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    let response = await signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential ? credential.accessToken : null;
        // The signed-in user info.
        const userData = result.user as User;
        this.user.uid = userData.uid;
        this.user.email = userData.email;
        this.user.displayName = userData.displayName;
        this.user.photoURL = userData.photoURL;
        this.addInfoUser(result.user?.uid);
        return true;
      }).catch((error) => {
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.error(error);
        return false;
      });
    return response;
  }

  async loginwithfacebook(): Promise<boolean> {
    const provider = new FacebookAuthProvider();
    provider.setDefaultLanguage('fr');
    provider.addScope('user_birthday');
    // provider.setCustomParameters({
    //   'display': 'popup'
    // });
    const auth = getAuth();
    let response = await signInWithPopup(auth, provider)
      .then((result) => {
        // The signed-in user info.
        this.user = result.user as User;
        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        const credential = FacebookAuthProvider.credentialFromResult(result);
        const accessToken = credential ? credential.accessToken : null;
        this.getInfoUser(result.user?.uid);
        return true;
      })
      .catch((error) => {
        // The AuthCredential type that was used.
        const credential = FacebookAuthProvider.credentialFromError(error);
        console.error(error);
        return false;
      });
    return response;
  }

  async signinwithfacebook(): Promise<boolean> {
    const provider = new FacebookAuthProvider();
    provider.setDefaultLanguage('fr');
    provider.addScope('user_birthday');
    // provider.setCustomParameters({
    //   'display': 'popup'
    // });
    const auth = getAuth();
    let response = await signInWithPopup(auth, provider)
      .then((result) => {
        // The signed-in user info.
        const userData = result.user as User;
        this.user.uid = userData.uid;
        this.user.email = userData.email;
        this.user.displayName = userData.displayName;
        this.user.photoURL = userData.photoURL;
        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        const credential = FacebookAuthProvider.credentialFromResult(result);
        const accessToken = credential ? credential.accessToken : null;
        this.addInfoUser(result.user?.uid);
        return true;
      })
      .catch((error) => {
        // The AuthCredential type that was used.
        const credential = FacebookAuthProvider.credentialFromError(error);
        console.error(error);
        return false;
      });
    return response;
  }

  async logout() {
    return signOut(getAuth()).then(() => {
      this.user = {};
      console.log('sign-out successful.');
    }).catch((error) => {
      console.error(error);
    });
  }

}