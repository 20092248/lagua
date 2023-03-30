import { Injectable } from '@angular/core';
import { Auth, FacebookAuthProvider, getAuth, GoogleAuthProvider, signInWithPopup, signOut } from '@angular/fire/auth';
import { User } from '../model/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {

  user: User = {};

  constructor(private _auth: Auth) { }

  checkUserState() {
    return getAuth() && getAuth().currentUser;
  }

  async login() { }

  async signinwithgoogle(): Promise<boolean> {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    let response = await signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential ? credential.accessToken : null;
        // The signed-in user info.
        this.user = result.user as User;
        return true;
      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.error(error);
        return false;
      });
      return response;
  }

  async signinwithfacebook(): Promise<boolean> {
    const provider = new FacebookAuthProvider();
    provider.setDefaultLanguage('fr');
    provider.addScope('user_birthday');
    provider.setCustomParameters({
      'display': 'popup'
    });
    const auth = getAuth();
    let response = await signInWithPopup(auth, provider)
      .then((result) => {
        // The signed-in user info.
        this.user = result.user as User;
        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        const credential = FacebookAuthProvider.credentialFromResult(result);
        const accessToken = credential ? credential.accessToken : null;
        return true;
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
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