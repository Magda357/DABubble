import { Component } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { SharedComponent } from '../shared/shared.component';

@Component({
  selector: 'app-main-content',
  imports: [HeaderComponent, SharedComponent],
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.scss',
})
export class MainContentComponent {}
