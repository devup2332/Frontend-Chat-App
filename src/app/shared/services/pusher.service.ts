import { Injectable } from '@angular/core';
import Pusher, { Channel } from 'pusher-js';

@Injectable({
  providedIn: 'root',
})
export class PusherService {
  channel: Channel;
  pusher: Pusher;

  constructor() {
    this.pusher = new Pusher('ac39880101ee89ff8d5a', {
      cluster: 'us2',
    });

    this.channel = this.pusher.subscribe('chat');
  }
}
