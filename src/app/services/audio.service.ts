import { Injectable } from '@angular/core';
import { Vibration } from '@awesome-cordova-plugins/vibration/ngx';
import { Platform } from '@ionic/angular';
import { AndroidSettings } from 'capacitor-native-settings';
import { NativeAudio } from '@capacitor-community/native-audio';
import { AlertService } from './alert.service';
import { OpenNativeSettings } from '@awesome-cordova-plugins/open-native-settings/ngx';

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
  constructor(private alertService: AlertService, private platform: Platform, private nativeSettings: OpenNativeSettings,private vibration: Vibration) {
  }
  preload(key: string, asset: string): void {
    if (this.platform.is('capacitor')) {
      NativeAudio.preload({ assetId: key, assetPath: asset, audioChannelNum: 1, isUrl: false });
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
    if (this.platform.is('capacitor')) {
      NativeAudio.play({ assetId: key });
      console.log('-------->', AndroidSettings.Sound);
      this.nativeSettings.open('sound').then( res => { console.log(res); }).catch( err => { console.log(err); });
      this.vibration.vibrate(timeToVibrate);
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