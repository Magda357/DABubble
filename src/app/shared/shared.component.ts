import { Component } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-shared',
  imports: [NgIf],
  standalone: true,
  templateUrl: './shared.component.html',
  styleUrl: './shared.component.scss'
})
export class SharedComponent {
isWorkspaceOpen = false;

toggleWorkspace() {
  this.isWorkspaceOpen = !this.isWorkspaceOpen;
}
}