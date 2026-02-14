import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrl: './button.component.css',
  standalone: true
})
export class ButtonComponent {

  type = input<'warning' | 'info' | 'error' | 'success' | 'primary' | 'secondary'  >('info');
  title = input<string>("");
  click = input<() => void>();

  buttonClass = computed(() => {
    return `btn btn-${this.type()}`;
  });


  handleClick() {
    this.click()?.(); 
  }
}
