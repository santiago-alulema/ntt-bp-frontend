import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DialogComponent } from './dialog.component';

describe('DialogComponent', () => {
  let fixture: ComponentFixture<DialogComponent>;
  let component: DialogComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DialogComponent);
    component = fixture.componentInstance;
  });

  it('close() should NOT throw when onClose is null (branch: optional chaining false)', () => {
    expect(() => component.close()).not.toThrow();
  });

  it('close() should call onClose when provided (branch: optional chaining true)', () => {
    const fn = vi.fn();

    (component as any).onClose = () => fn;

    component.close();
    expect(fn).toHaveBeenCalledTimes(1);
  });
});