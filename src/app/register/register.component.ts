import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { SnackbarComponent } from '../shared/components/snackbar/snackbar.component';
import { AuthUserService } from '../shared/services/auth-user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  timer: any;
  theme: string | null;
  //Setting snackbar to implements messages to user
  @ViewChild(SnackbarComponent) snackbar: SnackbarComponent;

  constructor(private authSrv: AuthUserService, private router: Router) {}

  ngOnInit(): void {
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
    this.createForm();
  }

  //Create form
  createForm() {
    this.registerForm = new FormGroup(
      {
        first_name: new FormControl('', Validators.required),
        last_name: new FormControl('', Validators.required),
        email: new FormControl(
          '',
          [Validators.required, Validators.pattern(environment.emailPatt)],
          this.authSrv._validate_email()
        ),
        phone: new FormControl('', [
          Validators.required,
          Validators.pattern(environment.numberPatt),
        ]),
        password: new FormControl('', [
          Validators.required,
          Validators.minLength(9),
        ]),
        password_2: new FormControl(''),
      },
      {
        validators: this.authSrv._check_passwords('password', 'password_2'),
      }
    );
  }

  register_user(new_user: any) {
    if (this.registerForm.invalid) {
      return Object.values(this.registerForm.controls).forEach((control) => {
        control.markAsDirty();
      });
    }
    this.authSrv._register_user(new_user).subscribe(
      //Handle res of backend
      (res: any) => {
        localStorage.setItem('access', res.token.access);
        localStorage.setItem('refresh', res.token.refresh);
        this.router.navigate(['/']);
      },
      //Handle error
      () => {
        if (this.timer) clearTimeout(this.timer);
        const message: string = 'Server dosent respond';
        this.snackbar.show(message);
        this.timer = setTimeout(() => {
          this.snackbar.close();
        }, 3000);
      }
    );
  }

  //Getters to handle errors

  get name1Req() {
    return (
      this.registerForm.get('first_name')?.hasError('required') &&
      this.registerForm.get('first_name')?.dirty
    );
  }

  get name2Req() {
    return (
      this.registerForm.get('last_name')?.hasError('required') &&
      this.registerForm.get('last_name')?.dirty
    );
  }

  get emailReq() {
    return (
      this.registerForm.get('email')?.hasError('required') &&
      this.registerForm.get('email')?.dirty
    );
  }

  get emailInvalid() {
    return (
      this.registerForm.get('email')?.hasError('pattern') &&
      this.registerForm.get('email')?.touched
    );
  }

  get alreadyEmail() {
    return this.registerForm.get('email')?.hasError('exist');
  }

  get phoneReq() {
    return (
      this.registerForm.get('phone')?.hasError('required') &&
      this.registerForm.get('phone')?.dirty
    );
  }

  get phoneInvalid() {
    return (
      this.registerForm.get('phone')?.hasError('pattern') &&
      this.registerForm.get('phone')?.touched
    );
  }

  get passReq() {
    return (
      this.registerForm.get('password')?.hasError('required') &&
      this.registerForm.get('password')?.dirty
    );
  }

  get passwordIsNotEqual() {
    return (
      this.registerForm.hasError('notEqual') &&
      this.registerForm.get('password_2')?.touched
    );
  }

  get minLengthPass() {
    return (
      this.registerForm.get('password')?.hasError('minlength') &&
      this.registerForm.get('password')?.touched
    );
  }
}
