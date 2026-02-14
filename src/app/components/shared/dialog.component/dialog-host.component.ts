import { Component, HostListener, inject } from '@angular/core';
import { DialogComponent } from './dialog.component';
import { DialogService } from './dialog.service';

@Component({
  selector: 'app-dialog-host',
  standalone: true,
  imports: [DialogComponent],
  template: `
    @if (vm(); as s) {
      <app-dialog
        [isOpen]="true"
        [type]="s.type ?? 'success'"
        [title]="s.title"
        [message]="s.message"
        [onAccept]="onAccept"
        [onClose]="onClose"
      />
    }
  `,
})
export class DialogHostComponent {
  private dialog = inject(DialogService);
  
  vm = this.dialog.state;

  onAccept = () => this.dialog.close(true);
  onClose = () => this.dialog.close(false);

  @HostListener('document:keydown.escape')
  onEsc() {
    if (this.vm()) this.dialog.close(false);
  }
}
