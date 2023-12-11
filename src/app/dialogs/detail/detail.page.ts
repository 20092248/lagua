import { Component, OnInit } from '@angular/core';
import { CHAT } from 'src/app/dictionary/add/chat';
import { User } from 'src/app/model/user.model';
import { DialogService } from 'src/app/services/dialog.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {

  user: User = {} as User;
  chats: any[] = [];
  chat: any = { date: '', userId: '', userName: '', senderId: '', senderName: '', translate: '', text: { shindzuani: '', shingazidja: '', shimwali: '', shimaore: '', } };
  paramModifyReview: string = '';
  constructor(private dialogService: DialogService) { }

  ngOnInit() {
    this.chats = CHAT;
  }

}
