import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-firstpage-desktop',
  templateUrl: './firstpage-desktop.component.html',
  styleUrls: ['./firstpage-desktop.component.scss'],
})
export class FirstpageDesktopComponent implements OnInit {

  isMobile: boolean = false;
  constructor() { }

  ngOnInit() {}

}
