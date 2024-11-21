import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss'],
})
export class AccordionComponent implements OnInit {

  @Input() contents: any[] = [];

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit() { }

  convertToHtml(value: string) {
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }

}
