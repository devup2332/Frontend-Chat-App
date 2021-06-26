import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppGuardGuard } from './shared/guards/app-guard.guard';
import { LoginGuardGuard } from './shared/guards/login-guard.guard';
import { RegisterGuardGuard } from './shared/guards/register-guard.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./chat/chat.module').then((m) => m.ChatModule),
    canActivate: [AppGuardGuard],
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./login/login.module').then((m) => m.LoginModule),
    canActivate: [LoginGuardGuard],
  },

  {
    path: 'register',
    loadChildren: () =>
      import('./register/register.module').then((m) => m.RegisterModule),
    canActivate: [RegisterGuardGuard],
  },
  {
    path: '**',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
