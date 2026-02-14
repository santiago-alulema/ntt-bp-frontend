import { Component, computed, inject, signal } from '@angular/core';
import { GridComponent } from '@components/shared/grid.component/grid.component';
import { Column } from '@components/shared/models/Column.models';
import { LoadingService } from '@core/services/loading.service';
import { PRODUCTS_GRID_COLUMNS } from 'src/app/features/products/config/product-grid-columns.config';
import { FinancialProduct } from 'src/app/features/products/models/Dtos/product.model';
import { ProductsApiService } from 'src/app/features/products/services/products.api.service';
import { ButtonComponent } from "@components/shared/button.component/button.component";
import { TextfieldComponent } from "@components/shared/textfield.component/textfield.component";
import { Router } from '@angular/router';
import { ActionConfig } from '@components/shared/models/ActionConfig.model';
import { filterProducts } from 'src/app/features/products/utils/products-search.util';
import { DialogService } from '@components/shared/dialog.component/dialog.service';
import { ProductListSkeletonComponentTs } from "@components/shared/product-list-skeleton.component.ts/product-list-skeleton.component.ts";
import { buildProductGridActions } from '../../config/product-grid-actions.config';

@Component({
  selector: 'app-list.page',
  imports: [GridComponent, ButtonComponent, TextfieldComponent, ProductListSkeletonComponentTs],
  templateUrl: './list.page.html',
  styleUrl: './list.page.css',
})
export class ListPage {

  private readonly api = inject(ProductsApiService);
  private readonly router = inject(Router);
  private readonly dialog = inject(DialogService);

  readonly columns = signal<Column[]>(PRODUCTS_GRID_COLUMNS)
  readonly products = signal<FinancialProduct[]>([]);
  private readonly termSearch = signal<string>("");


  openCreateForm = () => {
    this.router.navigate(['/product/create']);
  };

  readonly visibleProducts = computed(() => {
    return filterProducts(this.products(), this.termSearch());
  });

  readonly actions = signal<ActionConfig<FinancialProduct>[]>(
    buildProductGridActions({
      openUpdateForm: (row) => this.openUpdateForm(row),
      deleteProduct: (row) => this.deleteProduct(row),
    })
  );

  constructor(public readonly loadingService: LoadingService) {
    this.loadProducts();
  }

  openUpdateForm = (row: FinancialProduct): void => {
    this.router.navigate(['/product/edit', row.id]);
  };


  loadProducts(): void {
    this.api.getAll().subscribe({
      next: (data) => {
        this.products.set(data);
      }
    });
  }

  deleteProduct = async (item: FinancialProduct): Promise<void> => {
    const ok = await this.dialog.confirm({
      title: 'Confirmación',
      message: `¿Estas seguro de eliminar el producto <strong>${item.name}</strong>?`,
      type: 'warning',
    });

    if (!ok) return;
    const id = item?.id;
    if (!id) return;
    this.api.remove(id).subscribe({
      next: async () => {
        await this.dialog.alert({
          title: "Eliminado",
          message: `Producto se elimino correctamente`,
          type: 'success',
        });
        this.loadProducts()
      }
    });
  }

  onChangeSearchTerm = (term: string): void => {
    this.termSearch.set(term)
  };

}
