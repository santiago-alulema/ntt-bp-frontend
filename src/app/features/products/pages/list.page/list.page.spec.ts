import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { ListPage } from './list.page';
import { ProductsApiService } from '@features/products/services/products.api.service';
import { DialogService } from '@components/shared/dialog.component/dialog.service';
import { Router } from '@angular/router';
import { LoadingService } from '@core/services/loading.service';
import { FinancialProduct } from '@features/products/models/Dtos/product.model';

describe('ListPage', () => {
  let fixture: ComponentFixture<ListPage>;
  let component: ListPage;

  const routerMock = {
    navigate: vi.fn(() => Promise.resolve(true)),
  };

  const apiMock = {
    getAll: vi.fn(() => of<FinancialProduct[]>([])),
    remove: vi.fn(() => of(void 0)),
  } as any;

  const dialogMock = {
    confirm: vi.fn(() => Promise.resolve(true)),
    alert: vi.fn(() => Promise.resolve(true)),
  };

  const loadingMock = {
    isLoading: vi.fn(() => false),
    show: vi.fn(),
    hide: vi.fn(),
  } as any;

  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [ListPage], 
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: ProductsApiService, useValue: apiMock },
        { provide: DialogService, useValue: dialogMock },
        { provide: LoadingService, useValue: loadingMock },
      ],
    }).compileComponents();
  });

  it('should load products on constructor (loadProducts)', async () => {
    apiMock.getAll.mockReturnValueOnce(
      of([
        { id: '1', name: 'P1', description: 'd', logo: 'x', date_release: '2025-01-01', date_revision: '2026-01-01' } as any,
      ])
    );

    fixture = TestBed.createComponent(ListPage);
    component = fixture.componentInstance;
    await fixture.whenStable();

    expect(apiMock.getAll).toHaveBeenCalled();
    expect(component.products()).toHaveLength(1);
  });

  it('openCreateForm should navigate to create page', async () => {
    fixture = TestBed.createComponent(ListPage);
    component = fixture.componentInstance;
    await fixture.whenStable();

    component.openCreateForm();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/product/create']);
  });

  it('openUpdateForm should navigate to edit page', async () => {
    fixture = TestBed.createComponent(ListPage);
    component = fixture.componentInstance;
    await fixture.whenStable();

    component.openUpdateForm({ id: '99' } as any);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/product/edit', '99']);
  });

  it('searchTable should update term and affect visibleProducts', async () => {
    fixture = TestBed.createComponent(ListPage);
    component = fixture.componentInstance;
    await fixture.whenStable();

    component.products.set([
      { id: '1', name: 'Cuenta', description: 'Producto bancario', logo: '', date_release: '2025-01-01', date_revision: '2026-01-01' } as any,
      { id: '2', name: 'Tarjeta', description: 'Plastico', logo: '', date_release: '2025-02-01', date_revision: '2026-02-01' } as any,
    ]);

    component.onChangeSearchTerm('bancario');
    expect(component.visibleProducts()).toHaveLength(1);
    expect(component.visibleProducts()[0].id).toBe('1');
  });

  it('deleteProduct should stop when user cancels (branch !ok)', async () => {
    dialogMock.confirm.mockResolvedValueOnce(false);

    fixture = TestBed.createComponent(ListPage);
    component = fixture.componentInstance;
    await fixture.whenStable();

    await component.deleteProduct({ id: '1', name: 'X' } as any);

    expect(dialogMock.confirm).toHaveBeenCalled();
    expect(apiMock.remove).not.toHaveBeenCalled();
    expect(dialogMock.alert).not.toHaveBeenCalled();
  });

  it('deleteProduct should stop when id is missing (branch !id)', async () => {
    dialogMock.confirm.mockResolvedValueOnce(true);

    fixture = TestBed.createComponent(ListPage);
    component = fixture.componentInstance;
    await fixture.whenStable();

    await component.deleteProduct({ id: '', name: 'X' } as any);

    expect(apiMock.remove).not.toHaveBeenCalled();
    expect(dialogMock.alert).not.toHaveBeenCalled();
  });

  it('deleteProduct should call remove, alert and reload when confirmed', async () => {
    dialogMock.confirm.mockResolvedValueOnce(true);
    apiMock.remove.mockReturnValueOnce(of(void 0));

    fixture = TestBed.createComponent(ListPage);
    component = fixture.componentInstance;

    const reloadSpy = vi.spyOn(component, 'loadProducts').mockImplementation(() => {});

    await fixture.whenStable();

    await component.deleteProduct({ id: '1', name: 'Prod' } as any);

    expect(apiMock.remove).toHaveBeenCalledWith('1');

    await Promise.resolve();
    await Promise.resolve();

    expect(dialogMock.alert).toHaveBeenCalled();
    expect(reloadSpy).toHaveBeenCalled();
  });
});