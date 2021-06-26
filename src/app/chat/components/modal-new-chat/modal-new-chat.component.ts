import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SnackbarComponent } from 'src/app/shared/components/snackbar/snackbar.component';
import { AuthUserService } from 'src/app/shared/services/auth-user.service';
import { ChatServiceService } from 'src/app/shared/services/chat-service.service';

@Component({
  selector: 'app-modal-new-chat',
  templateUrl: './modal-new-chat.component.html',
  styleUrls: ['./modal-new-chat.component.scss'],
})
export class ModalNewChatComponent implements OnInit {
  newChatForm: FormGroup;

  @Input() modalActive: undefined | boolean = false;
  @ViewChild(SnackbarComponent) snackbar: SnackbarComponent;
  users: any[];
  timer: any;
  user: any;
  constructor(
    private chatSrv: ChatServiceService,
    private authSrv: AuthUserService
  ) {}

  async ngOnInit() {
    this.newChatForm = new FormGroup({
      search: new FormControl('', [Validators.required]),
    });

    this.user = await this.authSrv._getUserLogged();
  }

  closeModal(e: Event) {
    const modal = document.querySelector<HTMLDivElement>(
      '.new-chat-modal-container'
    );

    if (e.target === modal) {
      this.users = [];
      this.modalActive = false;
      this.newChatForm.get('search')?.reset();
      return;
    }
  }

  async serchingUser() {
    const res = await this.chatSrv._filterUsers(this.newChatForm.value);
    this.users = res.slice(0, 5);
    const index = this.users.findIndex((user) => {
      return user.id === this.user?.id;
    });

    if (index > 0) this.users.splice(index, 1);
    if (this.newChatForm.get('search')?.value === '') {
      this.users = [];
    }
  }

  async createChat(user?: any) {
    this.modalActive = false;
    this.newChatForm.get('search')?.reset();
    if (user?.id === this.user.id || this.users[0]?.id === this.user.id) {
      this.users = [];

      return this.showSnackBar();
    }
    if (user) {
      await this.chatSrv._createChat(user?.id);
      this.users = [];

      return;
    }
    await this.chatSrv._createChat(this.users[0].id);
    this.users = [];
  }

  showSnackBar() {
    if (this.timer) clearTimeout(this.timer);
    this.snackbar.show('You cant create a chat with you');
    this.timer = setTimeout(() => {
      this.snackbar.close();
    }, 3000);
  }
}
