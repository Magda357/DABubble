import { Component } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';

import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule, NgClass],
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  email: any;
  password: any;
  passwordVisible = false;

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }
  login() {
    throw new Error('Method not implemented.');
  }
}
