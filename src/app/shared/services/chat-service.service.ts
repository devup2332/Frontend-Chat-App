import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ChatServiceService {
  constructor(private router: HttpClient) {}

  _getChats() {
    const access = localStorage.getItem('access');
    return this.router
      .get(`${environment.backend_uri}api/get-chats`, {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      })
      .toPromise<any>();
  }

  //Get the chat's information
  _getChat(id: number) {
    const access = localStorage.getItem('access');
    return this.router
      .get(`${environment.backend_uri}api/get-chat/${id}`, {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      })
      .toPromise<any>();
  }

  _sendMesage(message: { [key: string]: string }, id: string) {
    const access = localStorage.getItem('access');
    return this.router
      .post(
        `${environment.backend_uri}api/new-message`,
        {
          message,
          id,
        },
        {
          headers: {
            Authorization: `Bearer ${access}`,
          },
        }
      )
      .toPromise<any>();
  }

  _filterUsers(message: { [key: string]: string }) {
    const search = message.search.split(/[ ,]+/);

    const access = localStorage.getItem('access');

    return this.router
      .post(
        `${environment.backend_uri}api/search-user`,
        { search },
        {
          headers: {
            Authorization: `Bearer ${access}`,
          },
        }
      )
      .toPromise<any>();
  }

  _createChat(id: string) {
    const access = localStorage.getItem('access');
    return this.router
      .post(
        `${environment.backend_uri}api/create-chat`,
        { id },
        {
          headers: {
            Authorization: `Bearer ${access}`,
          },
        }
      )
      .toPromise<any>();
  }
}
