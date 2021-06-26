import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { SnackbarComponent } from '../shared/components/snackbar/snackbar.component';
import { AuthUserService } from '../shared/services/auth-user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  timer: any;
  @ViewChild(SnackbarComponent) private snackbar: SnackbarComponent;
  theme: string | null;

  constructor(private authService: AuthUserService, private router: Router) {}

  ngOnInit(): void {
    //Creating Form
    this.theme = localStorage.getItem('theme');
    if (!this.theme) {
      this.theme = 'light-theme';
      localStorage.setItem('theme', 'light-theme');
      document.body.classList.add(this.theme);
    }
    if (this.theme === 'dark-theme') {
      this.theme = 'light-theme';
      localStorage.setItem('theme', 'light-theme');
      document.body.classList.remove('dark-theme');
      document.body.classList.add('light-theme');
    }

    document.body.classList.add(this.theme);
    this.loginForm = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(environment.emailPatt),
      ]),
      password: new FormControl('', [Validators.required]),
    });
  }

  async loginUser(credentials: any, loader: HTMLElement) {
    //Seting inputs to touched
    if (this.loginForm.invalid) {
      return Object.values(this.loginForm.controls).forEach((control) =>
        control.markAsDirty()
      );
    }
    //Handle of res of backend
    loader.classList.add('visible');
    try {
      const res = await this.authService._login_user(credentials);

      if (!res.message) {
        localStorage.setItem('access', res.access);
        localStorage.setItem('refresh', res.refresh);
        this.router.navigate(['/']);
        return;
      }

      if (this.timer) clearTimeout(this.timer);
      const message: string = res.message[0];
      this.snackbar.show(message);
      this.timer = setTimeout(() => {
        this.snackbar.close();
      }, 3000);
    } catch (error) {
      if (this.timer) clearTimeout(this.timer);
      const message: string = 'Server dosent respond';
      this.snackbar.show(message);
      this.timer = setTimeout(() => {
        this.snackbar.close();
      }, 3000);
    }

    loader.classList.remove('visible');
  }

  // Getters to handle messages of error in the form
  get reqEmail() {
    return (
      this.loginForm.get('email')?.hasError('required') &&
      this.loginForm.get('email')?.dirty
    );
  }

  get invalidEmail() {
    return (
      this.loginForm.get('email')?.hasError('pattern') &&
      this.loginForm.get('email')?.touched
    );
  }

  get reqPass() {
    return (
      this.loginForm.get('password')?.hasError('required') &&
      (this.loginForm.get('password')?.touched ||
        this.loginForm.get('password')?.dirty)
    );
  }
}
