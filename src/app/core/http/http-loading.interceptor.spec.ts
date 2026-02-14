import { loadingInterceptor } from '@core/http/http-loading.interceptor';
import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { LoadingService } from '@core/services/loading.service';

describe('httpLoadingInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;

  const loadingMock = {
    show: vi.fn(),
    hide: vi.fn(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: LoadingService, useValue: loadingMock },
        provideHttpClient(withInterceptors([loadingInterceptor])),
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

  it('should call show() on request and hide() on success', () => {
    http.get('/bp/products').subscribe();

    expect(loadingMock.show).toHaveBeenCalledTimes(1);

    const req = httpMock.expectOne('/bp/products');
    req.flush({ data: [] });

    expect(loadingMock.hide).toHaveBeenCalledTimes(1);
  });

  it('should call hide() on error too', () => {
    http.get('/bp/products').subscribe({ error: () => {} });

    expect(loadingMock.show).toHaveBeenCalledTimes(1);

    const req = httpMock.expectOne('/bp/products');
    req.flush({ message: 'boom' }, { status: 500, statusText: 'Server Error' });

    expect(loadingMock.hide).toHaveBeenCalledTimes(1);
  });
});