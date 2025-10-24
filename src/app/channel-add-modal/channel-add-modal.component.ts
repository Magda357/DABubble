import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-channel-add-modal',
  imports: [],
  templateUrl: './channel-add-modal.component.html',
  styleUrl: './channel-add-modal.component.scss',
})
export class ChannelAddModalComponent {
  @Output() close = new EventEmitter<void>();

  closeModal() {
    this.close.emit();
  }
}
