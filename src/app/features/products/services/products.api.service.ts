import { Injectable } from "@angular/core";
import { PRODUCTS_ENDPOINTS } from './products.endpoints';
import { HttpClient } from "@angular/common/http";
import { map, Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { UpdateProduct } from "@features/products/models/Dtos/Out/update-product.out.model";
import { CreateProduct } from "@features/products/models/Dtos/Out/create-product.out.model";
import { FinancialProduct } from "@features/products/models/Dtos/product.model";
import { GetProductsResponse } from "@features/products/models/Dtos/In/get-products-response.in.model";

@Injectable({ providedIn: 'root' })
export class ProductsApiService {

    private readonly baseUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    getAll(): Observable<FinancialProduct[]> {
        return this.http.get<GetProductsResponse>(`${this.baseUrl}${PRODUCTS_ENDPOINTS.BASE}`)
            .pipe(map(response => response.data ?? []));
    }

    create(dto: CreateProduct) {
        return this.http.post(`${this.baseUrl}${PRODUCTS_ENDPOINTS.BASE}`, dto);
    }

    update(id: string, dto: UpdateProduct) {
        return this.http.put(`${this.baseUrl}${PRODUCTS_ENDPOINTS.BY_ID(id)}`, dto);
    }

    verifyId(id: string) {
        return this.http.get<boolean>(`${this.baseUrl}${PRODUCTS_ENDPOINTS.VERIFICATION(id)}`);
    }

    remove(id: string): Observable<void> {
        return this.http.delete(`${this.baseUrl}${PRODUCTS_ENDPOINTS.BY_ID(id)}`)
            .pipe(map(() => void 0));
    }
}