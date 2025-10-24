import { Component } from '@angular/core';
import { NgIf, NgFor, CommonModule } from '@angular/common';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-shared',
  imports: [NgIf, CommonModule],
  standalone: true,
  templateUrl: './shared.component.html',
  styleUrl: './shared.component.scss',
})
export class SharedComponent {
  isWorkspaceOpen = false;
  showHiddenComponent = false;

  // Firebase Data
  channels: any[] = [];
  directMessages: any[] = [];
  users: any[] = [];

  // UI States
  showChannels = true;
  showDirectMessages = true;

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    this.loadChannels();
    this.loadDirectMessages();
    this.loadUsers();
  }

  loadChannels() {
    this.chatService.getChannels().subscribe((channels) => {
      this.channels = channels;
      console.log('Geladene Channels:', channels);

      // Debug: Zeige Channel-Namen in der Konsole
      channels.forEach((channel) => {
        console.log(`Channel ID: ${channel.id}, Name: ${channel.name}`);
      });
    });
  }

  loadDirectMessages() {
    this.chatService.getDirectMessages().subscribe((dms) => {
      this.directMessages = dms;
      console.log('Direct Messages loaded:', dms);
    });
  }

  loadUsers() {
    this.chatService.getUsers().subscribe((users) => {
      this.users = users;
      console.log('Users loaded:', users);
    });
  }

  toggleChannels() {
    this.showChannels = !this.showChannels;
  }

  toggleDirectMessages() {
    this.showDirectMessages = !this.showDirectMessages;
  }

  selectChannel(channel: any) {
    console.log('Channel selected:', channel);
    // Hier kannst du Event Emitter oder Service verwenden
  }

  selectUser(user: any) {
    console.log('User selected:', user);
    // Hier kannst du Event Emitter oder Service verwenden
  }

  toggleWorkspace(event?: Event) {
    // Event Propagation stoppen
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }

    this.isWorkspaceOpen = !this.isWorkspaceOpen;
    this.showHiddenComponent = !this.showHiddenComponent;

    console.log('Workspace toggled:', this.isWorkspaceOpen);
  }

  // Separate Methode für Container-Click (falls gewünscht)
  onWorkspaceContainerClick(event: Event) {
    // Nur reagieren wenn nicht auf das Icon geklickt wurde
    const target = event.target as HTMLElement;
    if (!target.closest('.workspace_menu_icon')) {
      this.toggleWorkspace(event);
    }
  }
}
