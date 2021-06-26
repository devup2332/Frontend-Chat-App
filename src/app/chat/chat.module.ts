import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChatRoutingModule } from './chat-routing.module';
import { ChatComponent } from './chat.component';
import { NoDesktopComponent } from './components/no-desktop/no-desktop.component';
import { NoChatComponent } from './components/no-chat/no-chat.component';
import { YesChatComponent } from './components/yes-chat/yes-chat.component';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ModalNewChatComponent } from './components/modal-new-chat/modal-new-chat.component';

@NgModule({
  declarations: [
    ChatComponent,
    NoDesktopComponent,
    NoChatComponent,
    YesChatComponent,
    ModalNewChatComponent,
  ],
  imports: [CommonModule, ChatRoutingModule, SharedModule, ReactiveFormsModule],
})
export class ChatModule {}
