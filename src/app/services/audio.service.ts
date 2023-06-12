import { Injectable } from '@angular/core';
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
  constructor(private platform: Platform) {
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
  play(key: string): void {
    let soundToPlay = this.sounds.find((sound) => {
      return sound.key === key;
    });
    this.audioPlayer.src = soundToPlay?.asset ? soundToPlay.asset : '';
    this.audioPlayer.play();
  }
}