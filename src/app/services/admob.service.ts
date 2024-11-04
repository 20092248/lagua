import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AdMob, AdMobRewardItem, AdOptions, BannerAdOptions, BannerAdPosition, BannerAdSize, RewardAdOptions, RewardAdPluginEvents } from '@capacitor-community/admob';
import { AuthentificationService } from './authentification.service';
import { SettingService } from './setting.service';

@Injectable({
  providedIn: 'root',
})
export class AdMobService {

  constructor(private settingService: SettingService, _auth: Auth, private authentificationService: AuthentificationService) { }

  async initializeAdmob() {
    if (this.settingService.isCapacitor) {
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
    if (this.settingService.isCapacitor && this.authentificationService.getPremium()) {
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

  async hideBanner(){
    if (this.settingService.isCapacitor) {
      await AdMob.hideBanner();
    }
  }

  async removeBanner(){
    if (this.settingService.isCapacitor) {
      await AdMob.removeBanner();
    }
  }

  async showInterstitial() {
    if (this.settingService.isCapacitor && this.authentificationService.getPremium()) {
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
    if (this.settingService.isCapacitor && this.authentificationService.getPremium()) {
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
