import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DialogHostComponent } from "@components/shared/dialog.component/dialog-host.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, DialogHostComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('ntt-bp-frontend');
}
