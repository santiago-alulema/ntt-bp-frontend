import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';

import { httpErrorInterceptor } from './http-error.interceptor';
import { DialogService } from '@components/shared/dialog.component/dialog.service';

describe('httpErrorInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;

  const dialogMock = {
    alert: vi.fn(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: DialogService, useValue: dialogMock },
        provideHttpClient(withInterceptors([httpErrorInterceptor])),
        provideHttpClientTesting(),
      ],
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    vi.clearAllMocks();
  });

  it('should call dialog.alert with backend message when error.error is string', () => {
    http.get('/bp/products').subscribe({ error: () => {} });

    const req = httpMock.expectOne('/bp/products');
    req.flush('CORS/Backend error', { status: 500, statusText: 'Server Error' });

    expect(dialogMock.alert).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Error',
        type: 'error',
        message: 'CORS/Backend error',
      })
    );
  });

  it('should call dialog.alert with error.error.message when error body is object', () => {
    http.get('/bp/products').subscribe({ error: () => {} });

    const req = httpMock.expectOne('/bp/products');
    req.flush(
      { message: 'Not product found with that identifier' },
      { status: 404, statusText: 'Not Found' }
    );

    expect(dialogMock.alert).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Not product found with that identifier',
      })
    );
  });

  it('should show default message for non-HttpErrorResponse errors', () => {
    http.get('/bp/products').subscribe({ error: () => {} });

    const req = httpMock.expectOne('/bp/products');
    req.error(new ProgressEvent('error')); 

    expect(dialogMock.alert).toHaveBeenCalled();
    const arg = dialogMock.alert.mock.calls[0][0];
    expect(arg.title).toBe('Error');
    expect(arg.type).toBe('error');
    expect(typeof arg.message).toBe('string');
  });
});