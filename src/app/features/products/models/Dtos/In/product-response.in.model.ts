import { FinancialProduct } from "src/app/features/products/models/Dtos/product.model";

export interface ProductResponse {
    message: string;
    data: FinancialProduct;
}