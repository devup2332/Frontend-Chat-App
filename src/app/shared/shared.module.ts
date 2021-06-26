import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SnackbarComponent } from './components/snackbar/snackbar.component';
import { HttpClientModule } from '@angular/common/http';
import { NameUserPipePipe } from './pipes/name-user-pipe.pipe';

@NgModule({
  declarations: [SnackbarComponent, NameUserPipePipe],
  imports: [CommonModule, HttpClientModule],
  exports: [SnackbarComponent, NameUserPipePipe],
})
export class SharedModule {}
