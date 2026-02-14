import { Component, HostListener, input } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
})
export class ModalComponent {

  readonly isOpen = input<boolean>(false);
  readonly onClose = input<(() => void) | null>(null);

  close(): void {
    this.onClose()?.();
  }

  @HostListener('document:keydown.escape')
  onEsc(): void {
    if (this.isOpen()) {
      this.close();
    }
  }

  onBackdropClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.close();
    }
  }
}
