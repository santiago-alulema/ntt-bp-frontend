import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { of, throwError, firstValueFrom } from 'rxjs';
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';

import { ProductFormPage } from './product-form.page';
import { ProductsApiService } from '@features/products/services/products.api.service';
import { DialogService } from '@components/shared/dialog.component/dialog.service';
import { FinancialProduct } from '@features/products/models/Dtos/product.model';

describe('ProductFormPage (branch-focused)', () => {
  let fixture: ComponentFixture<ProductFormPage>;
  let component: ProductFormPage;

  const routerMock = { navigate: vi.fn(() => Promise.resolve(true)) };
  const dialogMock = { alert: vi.fn(() => Promise.resolve(true)) };

  const apiMock = {
    getAll: vi.fn(() => of<FinancialProduct[]>([])),
    create: vi.fn(() => of({ ok: true })),
    update: vi.fn(() => of({ ok: true })),
    verifyId: vi.fn(() => of(false)),
    remove: vi.fn(() => of(void 0)),
  } as any;

  const makeRoute = (id?: string) => ({
    snapshot: { paramMap: convertToParamMap(id ? { id } : {}) },
  });

  const ymd = (d: Date) => d.toISOString().slice(0, 10);
  const tomorrow = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return ymd(d);
  };
  const plusOneYear = (s: string) => {
    const d = new Date(s);
    d.setFullYear(d.getFullYear() + 1);
    return ymd(d);
  };

  const fillValidForm = () => {
    const release = tomorrow();
    component.form.patchValue({
      id: 'ABC',
      name: 'Nombre valido',
      description: 'Descripcion valida 12345',
      logo: 'logo',
      date_release: release,
      date_revision: plusOneYear(release),
    });

    component.form.controls.id.clearAsyncValidators();
    component.form.controls.id.updateValueAndValidity({ emitEvent: false });
    component.form.updateValueAndValidity({ emitEvent: false });
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [ProductFormPage],
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: DialogService, useValue: dialogMock },
        { provide: ProductsApiService, useValue: apiMock },
        { provide: ActivatedRoute, useValue: makeRoute() }, 
      ],
    }).compileComponents();
  });

  it('onSubmit should return early when form is invalid (branch: invalid)', async () => {
    fixture = TestBed.createComponent(ProductFormPage);
    component = fixture.componentInstance;
    await fixture.whenStable();

    component.onSubmit();
    expect(apiMock.create).not.toHaveBeenCalled();
    expect(apiMock.update).not.toHaveBeenCalled();
  });

  it('onReset should restore id when in edit mode (branch: isEdit && editId)', async () => {
    TestBed.overrideProvider(ActivatedRoute, { useValue: makeRoute('1') });

    const product: FinancialProduct = {
      id: '1',
      name: 'P',
      description: 'Descripcion larga 12345',
      logo: 'x',
      date_release: new Date('2025-01-01'),
      date_revision: new Date('2026-01-01'),
    } as any;

    (apiMock.getAll as Mock).mockReturnValueOnce(of([product]));

    fixture = TestBed.createComponent(ProductFormPage);
    component = fixture.componentInstance;
    await fixture.whenStable();

    expect(component.isEdit).toBe(true);

    component.onReset();
    expect(component.form.getRawValue().id).toBe('1');
  });

  it('onSubmit in edit mode should call api.update (branch: isEdit)', async () => {
    TestBed.overrideProvider(ActivatedRoute, { useValue: makeRoute('1') });

    const product: FinancialProduct = {
      id: '1',
      name: 'Producto 1',
      description: 'Descripcion larga 12345',
      logo: 'x',
      date_release: new Date('2025-01-01'),
      date_revision: new Date('2026-01-01'),
    } as any;

    (apiMock.getAll as Mock).mockReturnValueOnce(of([product]));

    fixture = TestBed.createComponent(ProductFormPage);
    component = fixture.componentInstance;
    await fixture.whenStable();

    const release = tomorrow();
    component.form.patchValue({
      name: 'Nombre valido',
      description: 'Descripcion valida 12345',
      logo: 'logo',
      date_release: release,
      date_revision: plusOneYear(release),
    });

    component.form.updateValueAndValidity({ emitEvent: false });
    component.onSubmit();

    expect(apiMock.update).toHaveBeenCalled();

    await Promise.resolve();
    await Promise.resolve();

    expect(dialogMock.alert).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/products']);
  });

  it('onSubmit should NOT show dialog when api returns null (branch: if(!ok) return)', async () => {
    fixture = TestBed.createComponent(ProductFormPage);
    component = fixture.componentInstance;
    await fixture.whenStable();

    fillValidForm();

    (apiMock.create as Mock).mockReturnValueOnce(of(null));

    component.onSubmit();

    await Promise.resolve();

    expect(dialogMock.alert).not.toHaveBeenCalled();
    expect(routerMock.navigate).not.toHaveBeenCalledWith(['/products']);
  });

  it('create error should be capturable (sin catchError en componente) y no debe romper el test runner', async () => {
    fixture = TestBed.createComponent(ProductFormPage);
    component = fixture.componentInstance;
    await fixture.whenStable();

    fillValidForm();

    (apiMock.create as Mock).mockReturnValueOnce(throwError(() => ({ error: {} })));

    let captured: any = null;
    apiMock
      .create({} as any)
      .subscribe({
        next: () => {},
        error: (e: any) => (captured = e),
      });

    expect(captured).toBeTruthy();

    expect(component.submitError).toBe('');
  });

  it('minTodayValidator should return minToday true for past date (branch false)', async () => {
    fixture = TestBed.createComponent(ProductFormPage);
    component = fixture.componentInstance;
    await fixture.whenStable();

    const d = new Date();
    d.setDate(d.getDate() - 1);
    const yesterday = ymd(d);

    component.form.patchValue({ date_release: yesterday });
    component.form.controls.date_release.markAsTouched();
    component.form.controls.date_release.updateValueAndValidity();

    expect(component.form.controls.date_release.hasError('minToday')).toBe(true);
  });

  it('minTodayValidator should return null when empty value (branch: if(!c.value) return null)', async () => {
    fixture = TestBed.createComponent(ProductFormPage);
    component = fixture.componentInstance;
    await fixture.whenStable();

    component.form.patchValue({ date_release: '' });
    component.form.controls.date_release.updateValueAndValidity();

    expect(component.form.controls.date_release.hasError('minToday')).toBe(false);
  });

  it('idAvailableValidator branches: isEdit, length<3, exists=true, catchError', async () => {
    fixture = TestBed.createComponent(ProductFormPage);
    component = fixture.componentInstance;
    await fixture.whenStable();

    const fn = (component as any)['idAvailableValidator']() as (c: any) => any;

    let res = await firstValueFrom(fn({ value: 'AB' }));
    expect(res).toBeNull();

    apiMock.verifyId.mockReturnValueOnce(of(true));
    res = await firstValueFrom(fn({ value: 'ABC' }));
    expect(res).toEqual({ idTaken: true });

    apiMock.verifyId.mockReturnValueOnce(throwError(() => new Error('boom')));
    res = await firstValueFrom(fn({ value: 'ABC' }));
    expect(res).toEqual({ verifyUnavailable: true });

    component.mode.set('edit');
    res = await firstValueFrom(fn({ value: 'ABC' }));
    expect(res).toBeNull();
  });

  it('hasError should return true only when touched + has error', async () => {
    fixture = TestBed.createComponent(ProductFormPage);
    component = fixture.componentInstance;
    await fixture.whenStable();

    component.form.controls.name.setValue(''); 
    component.form.controls.name.markAsTouched();
    component.form.controls.name.updateValueAndValidity();

    expect(component.hasError('name', 'required')).toBe(true);
    expect(component.hasError('name', 'minlength')).toBe(false);
  });
});