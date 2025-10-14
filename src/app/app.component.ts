import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import{HeaderComponent } from './main-content/header/header.component';
import { SharedComponent } from './shared/shared.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,HeaderComponent,SharedComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'dabubble-app';
}
