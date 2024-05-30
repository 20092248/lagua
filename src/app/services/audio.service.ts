import { Injectable } from '@angular/core';
import { Vibration } from '@awesome-cordova-plugins/vibration/ngx';
import { Platform } from '@ionic/angular';
import { AndroidSettings } from 'capacitor-native-settings';
import { ManagedConfigurations } from '@capawesome/capacitor-managed-configurations';
import { NativeAudio } from '@awesome-cordova-plugins/native-audio/ngx';
import { AlertService } from './alert.service';

interface Sound {
  key: string;
  asset: string;
  isNative: boolean
}
@Injectable({
  providedIn: 'root',
})
export class AudioService {
  private sounds: Sound[] = [];
  private audioPlayer: HTMLAudioElement = new Audio();
  constructor(private alertService: AlertService, private platform: Platform, private nativeAudio: NativeAudio, private vibration: Vibration) {
  }
  preload(key: string, asset: string): void {
    if (this.platform.is('capacitor')) {
      this.nativeAudio.preloadSimple(key, asset).then(() => console.log('preload ' + key + ' success.'), () => this.alertService.presentToast('Erreur lors du preload ' + key + '.', 3000, 'danger'));
    } else {
      let audio = new Audio();
      audio.src = asset;
      this.sounds.push({
        key: key,
        asset: asset,
        isNative: false
      });
      audio.load();
    }
  }

  playAudio(key: string, timeToVibrate: number) {
    // console.log(this.vibration);
    if (this.platform.is('capacitor')) {
      this.nativeAudio.play(key);
      console.log('-------->', AndroidSettings.Sound);
      const getString = async () => {
        const result = await ManagedConfigurations.getString({ key: 'server_url' });
        return result.value;
      };
      console.log('getString', getString);
      const getString2 = async () => {
        const result = await ManagedConfigurations.getString({ key: 'sound' });
        return result.value;
      };
      console.log('getString2', getString2);
      // this.audioManagement.getAudioMode().then((value) => {
      //   if (value.audioMode == 0 || value.audioMode == 1) { // this will cause vibration in silent mode as well
      //     this.vibration.vibrate(timeToVibrate);
      //   } else {
      //     this.play(key);
      //   }
      // }).catch((error) => {
      //   console.error(error);
      // });
    } else {
      this.play(key);
    }
  }

  play(key: string): void {
    let soundToPlay = this.sounds.find((sound) => {
      return sound.key === key;
    });
    this.audioPlayer.src = soundToPlay?.asset ? soundToPlay.asset : '';
    this.audioPlayer.play();
  }
}