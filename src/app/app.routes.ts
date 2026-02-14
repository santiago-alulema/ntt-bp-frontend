import { Routes } from '@angular/router';
import { NotFoundPage } from '@core/pages/not-found/not-found.page';
import { ProductFormPage } from '@features/products/pages/product-form.page/product-form.page';
import { ListPage } from 'src/app/features/products/pages/list.page/list.page';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'products',
        pathMatch: 'full'
    },

    {
        path: 'products',
        component: ListPage,
        pathMatch: 'full'
    },

    {
        path: 'product/create',
        component: ProductFormPage
    },


    {
        path: 'product/edit/:id',
        component: ProductFormPage
    },

    {
        path: 'not-found',
        component: NotFoundPage
    },

    {
        path: '**',
        redirectTo: 'not-found'
    }
];
