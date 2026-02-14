import { ActionConfig } from '@components/shared/models/ActionConfig.model';
import { FinancialProduct } from 'src/app/features/products/models/Dtos/product.model';
import { ProductListActionsDeps } from '../models/ProductListActionsDeps';

export function buildProductGridActions(
  deps: ProductListActionsDeps
): ActionConfig<FinancialProduct>[] {
  return [
    {
      tooltip: 'Editar',
      label: 'Editar',
      onClick: deps.openUpdateForm,
      hidden: false,
      sizeIcon: 'small',
      color: 'secondary',
    },
    {
      tooltip: 'Eliminar',
      label: 'Eliminar',
      onClick: deps.deleteProduct,
      hidden: false,
      sizeIcon: 'small',
      typeInput: 'icon',
      color: 'warning',
    },
  ];
}
