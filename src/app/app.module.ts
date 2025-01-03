import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideDatabase, getDatabase } from '@angular/fire/database';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { getAnalytics, provideAnalytics } from '@angular/fire/analytics';
import { HttpClientModule } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { CrashlyticsErrorHandler } from './utils/crashlytics-handler';
import { AdsenseModule } from 'ng2-adsense';
import { LottieModule } from 'ngx-lottie';
import player from 'lottie-web';
import { Vibration } from '@awesome-cordova-plugins/vibration/ngx';
import { NativeAudio } from '@awesome-cordova-plugins/native-audio/ngx';
import { NgxPayPalModule } from 'ngx-paypal';
import { GooglePayButtonModule } from '@google-pay/button-angular';

export function playerFactory() { return player; }

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgxPayPalModule,
    GooglePayButtonModule,
    AdsenseModule.forRoot({adClient: 'ca-pub-2159881532224833'}),
    LottieModule.forRoot({player: playerFactory}),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore(initializeApp(environment.firebase))),
    provideDatabase(() => getDatabase(initializeApp(environment.firebase))),
    provideStorage(() => getStorage(initializeApp(environment.firebase))), 
    provideAuth(() => getAuth(initializeApp(environment.firebase))),
    provideAnalytics(() => getAnalytics(initializeApp(environment.firebase))),
  ],
  providers: [Vibration, NativeAudio, { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, { provide: ErrorHandler, useClass: CrashlyticsErrorHandler }],
  bootstrap: [AppComponent],
})
export class AppModule {}
