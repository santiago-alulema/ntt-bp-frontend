import { ProductsApiService } from 'src/app/features/products/services/products.api.service';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';


describe('ProductsApiService', () => {
  let service: ProductsApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProductsApiService,
        provideHttpClient(),
        provideHttpClientTesting()
      ],
    });

    service = TestBed.inject(ProductsApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should get products', () => {
    const mockResponse = {
      data: [{ id: '1', name: 'Cuenta', description: 'desc', logo: '', date_release: '2025-01-01', date_revision: '2026-01-01' }]
    };

    service.getAll().subscribe(res => {
      expect(res.length).toBe(1);
      expect(res[0].id).toBe('1');
    });

    const req = httpMock.expectOne('/bp/products');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should create product', () => {
    const dto: any = { id: '2' };

    service.create(dto).subscribe(res => {
      expect(res).toBeTruthy();
    });

    const req = httpMock.expectOne('/bp/products');
    expect(req.request.method).toBe('POST');
    req.flush({ message: 'ok' });
  });

  it('should update product', () => {
    const dto: any = { name: 'edit' };

    service.update('1', dto).subscribe(res => {
      expect(res).toBeTruthy();
    });

    const req = httpMock.expectOne('/bp/products/1');
    expect(req.request.method).toBe('PUT');
    req.flush({ message: 'ok' });
  });

  it('should delete product', () => {
    service.remove('1').subscribe(res => {
    expect(res).toBeUndefined(); 
  });

  const req = httpMock.expectOne('/bp/products/1');
  expect(req.request.method).toBe('DELETE');
  req.flush({ message: 'ok' });
  });
});