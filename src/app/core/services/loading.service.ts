import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoadingService {
    private _count = 0;
    readonly isLoading = signal(false);

    show() {
        this._count++;
        this.isLoading.set(true);
    }

    hide() {
        this._count = Math.max(0, this._count - 1);
        if (this._count === 0) this.isLoading.set(false);
    }
}
