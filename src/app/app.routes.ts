import { Routes } from '@angular/router';
import { SplashAnimationComponent } from './splash-animation/splash-animation.component';
import { LoginComponent } from './auth/login/login.component';
import { MainContentComponent } from './main-content/main-content.component';
import { DatenschutzComponent } from './pages/datenschutz/datenschutz.component';
import { ImpressumComponent } from './pages/impressum/impressum.component';
export const routes: Routes = [
  { path: '', component: MainContentComponent },
  { path: 'login', component: LoginComponent },
  { path: 'splash', component: SplashAnimationComponent },
  { path: 'datenschutz', component: DatenschutzComponent },
  { path: 'impressum', component: ImpressumComponent },
  // weitere Seiten, die Header/Shared zeigen sollen
];
