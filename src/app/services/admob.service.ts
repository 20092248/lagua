import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AdMob, AdMobRewardItem, AdOptions, BannerAdOptions, BannerAdPosition, BannerAdSize, RewardAdOptions, RewardAdPluginEvents } from '@capacitor-community/admob';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class AdMobService {

  constructor(private router: Router, private platform: Platform, _auth: Auth) {
    this.initializeAnalytics();
  }

  async initializeAnalytics() {
    if (this.platform.is('capacitor')) {
      const { status } = await AdMob.trackingAuthorizationStatus();
      if (status === 'notDetermined') {
        console.log('Display information before ads load first time');
      }
      AdMob.initialize({
        requestTrackingAuthorization: true,
        testingDevices: ['YOURTESTDEVICECODE'],
        initializeForTesting: true
      })
    }
  }

  async showBanner() {
    if (this.platform.is('capacitor')) {
      const options: BannerAdOptions = {
        adId: 'ca-app-pub-2159881532224833/5637670566',
        adSize: BannerAdSize.ADAPTIVE_BANNER,
        position: BannerAdPosition.BOTTOM_CENTER,
        margin: 0,
        isTesting: true,
        // npa: true
      }
      await AdMob.showBanner(options);
    }
  }

  async showInterstitial() {
    if (this.platform.is('capacitor')) {
      const options: AdOptions = {
        adId: 'ca-app-pub-2159881532224833/3515792301',
        isTesting: true,
        // npa: true
      }
      await AdMob.prepareInterstitial(options);
      await AdMob.showInterstitial();
    }
  }

  async showRewardVideo() {
    if (this.platform.is('capacitor')) {
      AdMob.addListener(RewardAdPluginEvents.Rewarded,
        (reward: AdMobRewardItem) => {
          console.log(reward);
        });
      const options: RewardAdOptions = {
        adId: 'ca-app-pub-2159881532224833/2989974852',
        isTesting: true,
        // npa: true
      }
      await AdMob.prepareRewardVideoAd(options);
      await AdMob.showRewardVideoAd();
    }
  }

}
