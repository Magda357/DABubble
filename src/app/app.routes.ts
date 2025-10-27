import { Routes } from '@angular/router';
import { SplashAnimationComponent } from './splash-animation/splash-animation.component';
import { LoginComponent } from './auth/login/login.component';
import { SharedComponent } from './shared/shared.component';

export const routes: Routes = [
  { path: '', component: SharedComponent },
  { path: 'splash', component: SplashAnimationComponent },
  { path: 'login', component: LoginComponent },
];
