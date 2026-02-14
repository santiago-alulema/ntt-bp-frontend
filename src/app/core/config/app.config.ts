import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { loadingInterceptor } from '@core/http/http-loading.interceptor';
import { httpErrorInterceptor } from '@core/http/http-error.interceptor';
import { routes } from '@app.routes';

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes),
        provideHttpClient(
            withInterceptors([
                loadingInterceptor,
                httpErrorInterceptor,
            ])
        ),
    ],
};
