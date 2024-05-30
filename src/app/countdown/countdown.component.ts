import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AnimationItem, AnimationOptions } from 'ngx-lottie/lib/symbols';
import { AudioService } from '../services/audio.service';

@Component({
  selector: 'app-countdown',
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.scss'],
})
export class CountdownComponent implements OnInit {

  countDownIsFinished: boolean = false;
  animation: AnimationItem = {} as AnimationItem;
  options: AnimationOptions = { path: 'assets/img/countdown.json', loop: true, name: 'countdown' };
  styles: Partial<CSSStyleDeclaration> = { background: 'rgb(238 241 238)' };
  @Output()
  activeEvent: EventEmitter<any> = new EventEmitter();

  constructor(private audioService: AudioService) { }

  ngOnInit() {}

  animationCreated(animation: any) {
    this.audioService.playAudio('countdown', 1000);
    this.animation = animation as AnimationItem;
    setTimeout(() => {
      console.log('force to hide countdown');
      this.countDownIsFinished = true;
      this.activeEvent.emit();
    }, 4500);
  }

  complete(event: any) {
    this.countDownIsFinished = true;
    console.log('hide countdown');
    this.animation.destroy('countdown');
    this.activeEvent.emit();
  }

}
