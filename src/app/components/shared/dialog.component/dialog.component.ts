import { Component, input } from '@angular/core';
import { ModalComponent } from '../modal.component/modal.component';
import { ButtonComponent } from '../button.component/button.component';

export type DialogType = 'error' | 'success' | 'warning';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [ModalComponent, ButtonComponent],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.css',
})
export class DialogComponent {
  title = input<string>('');
  message = input<string>('');
  type = input<DialogType>('success');

  isOpen = input<boolean>(false);

  onAccept = input<(() => void) | null>(null);
  onCancel = input<(() => void) | null>(null);
  onClose = input<(() => void) | null>(null);

  close() {
    this.onClose()?.();
  }
}
