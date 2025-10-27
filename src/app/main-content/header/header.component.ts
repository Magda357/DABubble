import { Component } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgIf, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  showUserMenu = false;

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
    if (this.showUserMenu) {
      document.body.classList.add('user-menu-open');
    } else {
      document.body.classList.remove('user-menu-open');
    }
  }

  closeUserMenu() {
    this.showUserMenu = false;
    document.body.classList.remove('user-menu-open');
  }
  openProfile() {
    // Logik zum Öffnen des Profils
    console.log('Profil geöffnet');
    this.showUserMenu = false; // Menü schließen
  }

  logOut() {
    this.showUserMenu = false; // Menü schließen
    // Logik zum Ausloggen
    console.log('Ausgeloggt');
  }
}
