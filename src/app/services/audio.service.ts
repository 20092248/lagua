import { Injectable } from '@angular/core';
import { Vibration } from '@awesome-cordova-plugins/vibration/ngx';
import { NativeAudio } from '@awesome-cordova-plugins/native-audio/ngx';
import { SettingService } from './setting.service';

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
  constructor(private settingService: SettingService, private nativeAudio: NativeAudio, 
    private vibration: Vibration) {
  }
  preload(key: string, asset: string): void {
    if (this.settingService.isCapacitor) {
      this.nativeAudio.preloadSimple(key, asset);
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
    if (this.settingService.isCapacitor && timeToVibrate) {
      this.vibration.vibrate(timeToVibrate);
    }
    this.play(key);
  }

  play(key: string): void {
    let soundToPlay = this.sounds.find((sound) => {
      return sound.key === key;
    });
    this.audioPlayer.src = soundToPlay?.asset ? soundToPlay.asset : '';
    this.audioPlayer.play();
  }
}