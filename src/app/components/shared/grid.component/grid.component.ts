import { Component, computed, effect, HostListener, input, signal } from '@angular/core';
import { ActionConfig } from '@components/shared/models/ActionConfig.model';
import { ButtonComponent } from "../button.component/button.component";
import { Column } from '@components/shared/models/Column.models';

@Component({
  selector: 'app-grid',
  imports: [ButtonComponent],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.css',
})
export class GridComponent<T = any> {

  constructor() {
    effect(() => {
      const first = this.numberItemsDisplay()?.[0] ?? 5;

      if (this.pageSize() === 0) {
        this.pageSize.set(first);
      }
    });
  }

  readonly columns = input<Column[]>([]);
  private readonly numberItemsInit = [5, 10, 20] as const;
  readonly numberItemsDisplay = input<number[]>([...this.numberItemsInit]);
  readonly rows = input<T[]>([]);
  readonly imageDefault: string = "assets/icons/image-not-found-icon.svg";
  readonly pageSize = signal(0);
  readonly openMenuRowIndex = signal<number | null>(null);
  readonly actions = input<ActionConfig<T>[]>([]);

  readonly validColum = computed(() => {
    const cols = this.columns();
    this.assertNoDuplicateName(cols)

    return cols.map(col => ({
      ...col,
      alignIcon: col.alignIcon ?? 'left'
    }));
  })

  readonly validNumberItemsDisplay = computed(() => {
    const values = this.numberItemsDisplay();
    this.assertNoDuplicateNumbers(values)

    return values;
  })

  toggleMenu(rowIndex: number, ev: MouseEvent): void {
    ev.stopPropagation();
    this.openMenuRowIndex.set(this.openMenuRowIndex() === rowIndex ? null : rowIndex);
  }

  closeMenu(): void {
    this.openMenuRowIndex.set(null);
  }

  isActionHidden(action: ActionConfig<T>, row: T): boolean {
    if (typeof action.hidden === 'function') return action.hidden(row);
    return !!action.hidden;
  }

  async runAction(action: ActionConfig<T>, row: T, ev: MouseEvent): Promise<void> {
    ev.stopPropagation();
    this.closeMenu();
    await action.onClick(row);
  }

  @HostListener('document:click')
  onDocClick() {
    this.closeMenu();
  }

  onPageSizeChange(ev: Event): void {
    const value = Number((ev.target as HTMLSelectElement).value);
    this.pageSize.set(value);
  }

  itemCountVisibleShow = computed(() => {
    return this.rows().slice(0, this.pageSize())
  })

  private assertNoDuplicateNumbers(values: number[]): void {
    const seen = new Set<number>();

    for (const value of values) {
      if (seen.has(value)) {
        throw new Error(
          `Duplicate number detected in numberItemsDisplay: ${value}`
        );
      }
      seen.add(value);
    }
  }

  private assertNoDuplicateName(cols: Column[]): void {
    const seen = new Set<string>();
    for (const { name } of cols) {
      const trimmed = name?.trim();
      if (!trimmed) continue;

      if (seen.has(trimmed)) {
        throw new Error(
          `[GridComponent] Duplicate column 'name' detected: ${trimmed}.`
        );
      }
      seen.add(trimmed);
    }
  }

  isValidUrlFormat(value: any): boolean {
    if (!value || typeof value !== 'string') return false;

    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  }
}
