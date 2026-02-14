import { FinancialProduct } from "./Dtos/product.model";

export interface ProductListActionsDeps {
  openUpdateForm: (row: FinancialProduct) => void;
  deleteProduct: (row: FinancialProduct) => Promise<void>;
}