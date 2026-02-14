import { Injectable, signal } from '@angular/core';
import { DialogType } from './dialog.component';

export interface DialogOptions {
  title: string;
  message: string;
  type?: DialogType; 
}

type DialogState =
  | null
  | (DialogOptions & {
      mode: 'alert' | 'confirm';
      resolve: (v: boolean) => void;
    });

@Injectable({ providedIn: 'root' })
export class DialogService {
  readonly state = signal<DialogState>(null);

  alert(opts: DialogOptions): Promise<void> {
    return new Promise<void>(resolve => {
      this.state.set({
        mode: 'alert',
        type: opts.type ?? 'success',
        title: opts.title,
        message: opts.message,
        resolve: () => resolve(),
      });
    });
  }

  confirm(opts: DialogOptions): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      this.state.set({
        mode: 'confirm',
        type: opts.type ?? 'warning',
        title: opts.title,
        message: opts.message,
        resolve,
      });
    });
  }

  close(result: boolean) {
    const s = this.state();
    if (!s) return;
    s.resolve(result);
    this.state.set(null);
  }
}
