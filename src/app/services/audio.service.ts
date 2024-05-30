import { Injectable } from '@angular/core';
import { Vibration } from '@awesome-cordova-plugins/vibration/ngx';
import { AudioManagement } from '@ionic-native/audio-management/ngx';
import { Platform } from '@ionic/angular';

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
  constructor(private platform: Platform, private audioManagement: AudioManagement, private vibration: Vibration) {
  }
  preload(key: string, asset: string): void {
    let audio = new Audio();
    audio.src = asset;
    this.sounds.push({
      key: key,
      asset: asset,
      isNative: false
    });
    audio.load();
  }
  
  playAudio(key: string, timeToVibrate: number) {
    console.log(this.audioManagement);
    console.log(this.vibration);
    if (this.platform.is('capacitor')) {
      this.audioManagement.getAudioMode().then((value) => {
        if (value.audioMode == 0 || value.audioMode == 1) { // this will cause vibration in silent mode as well
          this.vibration.vibrate(timeToVibrate);
        } else {
          this.play(key);
        }
      }).catch((error) => {
        console.error(error);
      });
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