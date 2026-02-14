import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ModalComponent } from './modal.component';

describe('ModalComponent', () => {
  let fixture: ComponentFixture<ModalComponent>;
  let component: ModalComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('close should call onClose when provided', () => {
    const onClose = vi.fn();

    fixture.componentRef.setInput('onClose', onClose);
    fixture.detectChanges();

    component.close();
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('close should not throw when onClose is null', () => {
    fixture.componentRef.setInput('onClose', null);
    fixture.detectChanges();

    expect(() => component.close()).not.toThrow();
  });

  it('onEsc should close only when isOpen is true', () => {
    const onClose = vi.fn();
    fixture.componentRef.setInput('onClose', onClose);

    fixture.componentRef.setInput('isOpen', false);
    fixture.detectChanges();

    component.onEsc();
    expect(onClose).not.toHaveBeenCalled();

    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();

    component.onEsc();
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('onBackdropClick should close when target has modal-backdrop class', () => {
    const onClose = vi.fn();
    fixture.componentRef.setInput('onClose', onClose);
    fixture.detectChanges();

    const el = document.createElement('div');
    el.classList.add('modal-backdrop');

    component.onBackdropClick({ target: el } as any);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('onBackdropClick should NOT close when target is not modal-backdrop', () => {
    const onClose = vi.fn();
    fixture.componentRef.setInput('onClose', onClose);
    fixture.detectChanges();

    const el = document.createElement('div'); 
    component.onBackdropClick({ target: el } as any);

    expect(onClose).not.toHaveBeenCalled();
  });
});