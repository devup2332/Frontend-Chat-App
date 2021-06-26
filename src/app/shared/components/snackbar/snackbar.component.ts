import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-snackbar',
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.scss'],
})
export class SnackbarComponent implements OnInit {
  message: string | undefined;

  constructor() {}

  ngOnInit(): void {}

  show(message: string) {
    this.message = message;
  }

  close() {
    this.message = undefined;
  }
}
