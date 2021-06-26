import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthUserService } from '../shared/services/auth-user.service';
import { ChatServiceService } from '../shared/services/chat-service.service';
import { PusherService } from '../shared/services/pusher.service';
import { ModalNewChatComponent } from './components/modal-new-chat/modal-new-chat.component';
import { YesChatComponent } from './components/yes-chat/yes-chat.component';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  @ViewChild(YesChatComponent) private yesChatView: YesChatComponent | null;
  @ViewChild(ModalNewChatComponent) private modalChat: ModalNewChatComponent;
  devices: RegExp[] = [
    /Android/i,
    /webOS/i,
    /iPhone/i,
    /iPad/i,
    /iPod/i,
    /BlackBerry/i,
    /Windows Phone/i,
  ];

  loading: boolean = true;
  theme: string | null;
  user: any;
  chats: any[];
  chat: any;
  chat_selected: any;
  modalVisible: undefined | boolean = false;

  match: boolean = false;
  constructor(
    private router: Router,
    private _authSrv: AuthUserService,
    private _chatSrv: ChatServiceService,
    private _pusherSrv: PusherService
  ) {}

  async ngOnInit(): Promise<void> {
    //Setting a theme if theme variables dosent exist
    this.theme = localStorage.getItem('theme');
    if (!this.theme) {
      this.theme = 'light-theme';
      localStorage.setItem('theme', 'light-theme');
    }
    if (this.theme === 'light-theme') {
      document.body.classList.add('light-theme');
    }

    if (this.theme === 'dark-theme') {
      document.body.classList.add('dark-theme');
    }
    this.loading = true;
    this.match = this.devices.some((device) => {
      return navigator.userAgent.match(device);
    });

    //Get data of user's chats

    this.chats = await this._chatSrv._getChats();

    await this.getUserLogged();

    this.loading = false;

    this._pusherSrv.channel.bind('new-chat', async (data: any) => {
      this.chats.push(data.chat);
    });
  }

  //Handler for switch theme

  switchTheme(toggle: HTMLDivElement) {
    toggle.classList.toggle('active');
    this.theme = localStorage.getItem('theme');
    if (this.theme === 'light-theme') {
      document.body.classList.remove(this.theme);
      this.theme = 'dark-theme';
      localStorage.setItem('theme', this.theme);
      document.body.classList.add(this.theme);
      return;
    }
    if (this.theme === 'dark-theme') {
      document.body.classList.remove(this.theme);
      this.theme = 'light-theme';
      localStorage.setItem('theme', this.theme);

      document.body.classList.add(this.theme);
    }
  }

  async logout() {
    await this._authSrv._logout_user();
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    this.router.navigate(['/login']);
    if (this.theme === 'dark-theme') {
      document.body.classList.remove('dark-theme');

      localStorage.setItem('theme', 'light-theme');
      document.body.classList.add('light-theme');
    }
  }

  async setChat(chat?: any) {
    this.chat_selected = chat;
    this.yesChatView?.setChat(chat.id, this.user);
  }

  async newMessage(e: string) {
    this.chats = await this._chatSrv._getChats();
  }

  async getUserLogged() {
    try {
      const user = await this._authSrv._getUserLogged();
      this.user = user;
    } catch (err) {
      if (err.status === 401) {
        const token = await this._authSrv._refreshToken();
        localStorage.setItem('access', token.access);
        this.user = await this._authSrv._getUserLogged();
      }
    }
  }

  openModal() {
    this.modalChat.modalActive = true;
  }

  get darkActive() {
    return this.theme === 'dark-theme';
  }
}
