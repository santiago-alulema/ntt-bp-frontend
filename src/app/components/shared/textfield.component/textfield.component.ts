import { Component, computed, input, signal } from '@angular/core';

@Component({
  selector: 'app-textfield',
  standalone: true,
  templateUrl: './textfield.component.html',
  styleUrl: './textfield.component.css',
})
export class TextfieldComponent {

  label = input<string>('');
  placeholder = input<string>('');
  type = input<'text' | 'number' | 'password'>('text');

  value = signal<string>('');

  onChange = input<((value: string) => void) | null>(null);

  handleInput(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.value.set(val);
    this.onChange()?.(val);
  }

  handleEnter() {
    this.onChange()?.(this.value());
  }

  inputType = computed(() => this.type());
}
