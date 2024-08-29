import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SettingService } from '../services/setting.service';
import { AlertService } from '../services/alert.service';
import { EmailService } from '../services/email.service';
import { AuthentificationService } from '../services/authentification.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../model/user.model';

@Component({
  selector: 'app-contactus',
  templateUrl: './contactus.page.html',
  styleUrls: ['./contactus.page.scss'],
})
export class ContactusPage implements OnInit {

  homeSetting: any = {};
  selectedFiles: FileList = {} as FileList;
  filesIsSelected: boolean = false;
  icon: string = '';
  parameter: any = {};
  contactForm: FormGroup;
  contact: any = { mail: '', question: '', subject: '', description: '', attachment: null };
  user: User = {} as User;
  isOverlay: boolean | undefined;

  constructor(private router: Router, private settingService: SettingService, private formBuilder: FormBuilder, private authentificationService: AuthentificationService, private emailService: EmailService, private alertService: AlertService) { 
    this.contactForm = this.formBuilder.group({
      'mail': ['', [Validators.required, Validators.email]],
      'question': ['', Validators.required],
      'subject': ['', Validators.required],
      'description': ['', Validators.required]
    });
  }

  ngOnInit() {
    this.settingService.getSettings().then(setting => {
      this.homeSetting = setting.home;
    });
    this.isOverlay = this.settingService.isOverlay;
    this.user = this.authentificationService.user;
    this.parameter = this.settingService.parameter;
    if (JSON.stringify(this.parameter) === '{}') {
      this.settingService.getSetting('parameter').then(parameter => {
        this.parameter = parameter;
      })
    }
  }

  sendEmail() {
    console.log(this.contactForm.value);
    if (this.contactForm.valid) {
      this.emailService.sendEmailJs(this.contact, this.user, true);
    }
  }

  onFileInput(event: any) {
    this.selectedFiles = this.selectFile(event);
    if (this.isSelectFilesDoc(this.selectedFiles[0])) {
      this.filesIsSelected = true;
      this.contact.attachment = this.selectedFiles[0];
      this.icon = this.getIcon(this.selectedFiles[0].type);
    } else {
      this.filesIsSelected = false;
      this.contact.attachment = null;
      this.alertService.presentToast('Le format du document est invalide.', 3000, 'danger');
    }
  }

  isSelectFilesDoc(doc: any) {
    return doc.type === 'application/pdf'
      || doc.type === 'application/msword'
      || doc.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      || doc.type === 'image/jpeg'
      || doc.type === 'image/png';
  }

  removeAttachment() {
    this.filesIsSelected = false;
    this.contact.attachment = null;
  }

  selectFile(event: any) {
    return event.target.files;
  }

  getIcon(type: string) {
    if (type === 'application/pdf') {
      return this.parameter.icon.pdf;
    } else if (type === 'application/msword' || type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      return this.parameter.icon.doc;
    } else if (type === 'image/png') {
      return this.parameter.icon.png;
    } else if (type === 'image/jpeg') {
      return this.parameter.icon.jpg;
    }
  }

  goTo(route: string) {
    this.router.navigate([route]);
  }

}
