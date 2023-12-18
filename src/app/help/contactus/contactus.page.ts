import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'src/app/services/alert.service';
import { EmailService } from 'src/app/services/email.service';
import { SettingService } from 'src/app/services/setting.service';

@Component({
  selector: 'app-contactus',
  templateUrl: './contactus.page.html',
  styleUrls: ['./contactus.page.scss'],
})
export class ContactusPage implements OnInit {

  selectedFiles: FileList = {} as FileList;
  filesIsSelected: boolean = false;
  icon: string = '';
  parameter: any = {};
  contactForm: FormGroup = {} as FormGroup;
  contact: any = {mail: '', question: null, subject: '', description: '', attachment: null};

  constructor(private formBuilder: FormBuilder, private emailService: EmailService, private alertService: AlertService, private settingService: SettingService) { }

  ngOnInit() {
    this.contactForm = this.formBuilder.group({
      'mail': ['', Validators.required],
      'question': ['', Validators.required],
      'subject': ['', Validators.required],
      'description': ['', Validators.required],
      'attachment': []
    });    this.parameter = this.settingService.parameter;
    if(JSON.stringify(this.parameter) === '{}'){
      this.settingService.getSetting('parameter').then(parameter => {
        this.parameter = parameter;
      })
    }
  }

  sendEmail() {
    this.emailService.sendEmail(this.contact);
  }

  onFileInput(event: any) {
    this.selectedFiles = this.selectFile(event);
    if (this.isSelectFilesDoc(this.selectedFiles[0])) {
      this.filesIsSelected = true;
      this.icon = this.getIcon(this.selectedFiles[0].type);
    } else {
      this.filesIsSelected = false;
      this.alertService.presentToast('Le format du document est invalide.', 3000, 'danger');
    }
  }

  private isSelectFilesDoc(doc: any) {
    return doc.type === 'application/pdf'
      || doc.type === 'application/msword'
      || doc.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      || doc.type === 'image/jpeg'
      || doc.type === 'image/png';
  }

  private selectFile(event: any) {
    return event.target.files;
  }

  getIcon(type: string) {
    if(type === 'application/pdf'){
      return this.parameter.icon.pdf;
    } else if(type === 'application/msword' ||type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'){
      return this.parameter.icon.doc;
    } else if(type === 'image/png'){
      return this.parameter.icon.png;
    } else if(type === 'image/jpeg'){
      return this.parameter.icon.jpg;
    }
  }

}
