import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl, ValidationErrors, AsyncValidatorFn } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { ProductsApiService } from 'src/app/features/products/services/products.api.service';
import { FinancialProduct } from 'src/app/features/products/models/Dtos/product.model';
import { ButtonComponent } from "@components/shared/button.component/button.component";
import { DialogService } from '@components/shared/dialog.component/dialog.service';
import { LoadingService } from '@core/services/loading.service';
import { FormSkeletonComponent } from "@components/shared/form-skeleton.component/form-skeleton.component";

@Component({
  selector: 'app-product-form.page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, FormSkeletonComponent],
  templateUrl: './product-form.page.html',
  styleUrl: './product-form.page.css',
})
export class ProductFormPage implements OnInit {
  private fb = inject(FormBuilder);
  private api = inject(ProductsApiService);
  private router = inject(Router);
  private dialog = inject(DialogService);
  private route = inject(ActivatedRoute);
  loadingEditData = signal(false);

  loading = false;
  submitError = '';
  mode = signal<'create' | 'edit'>('create');
  editId = signal<string | null>(null);

  constructor() {
  }

  form = this.fb.group(
    {
      id: this.fb.control('', {
        validators: [Validators.required, Validators.minLength(3), Validators.maxLength(10)],
        asyncValidators: [this.idAvailableValidator()],
        updateOn: 'blur',
        nonNullable: true,
      }),
      name: this.fb.control('', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]),
      description: this.fb.control('', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]),
      logo: this.fb.control('', [Validators.required]),
      date_release: this.fb.control('', [Validators.required, this.minTodayValidator()]),
      date_revision: this.fb.control('', [Validators.required]),
    },
    { validators: [this.revisionOneYearValidator()] }
  );


  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) { return }
    this.mode.set('edit');
    this.loadingEditData.set(true);
    this.api.getAll().subscribe({
      next: (data) => {
        const found = data.find(x => String(x.id) === String(id));
        if (!found) {
          this.router.navigate(['/not-found'], { replaceUrl: true });
          return
        }
        this.editId.set(id);
        this.form.controls.id.disable();
        this.loadData(found);
        this.loadingEditData.set(false);
      }
    });
  }

  loadData = (product: FinancialProduct) => {
    this.form.patchValue({
      id: product.id,
      name: product.name,
      description: product.description,
      logo: product.logo,
      date_release: String(product.date_release),
      date_revision: String(product.date_revision),
    });
  }

  get isEdit(): boolean {
    return this.mode() === 'edit';
  }

  get todayStr(): string {
    return new Date().toISOString().slice(0, 10);
  }

  onReset(): void {
    this.submitError = '';
    this.form.reset();

    if (this.isEdit && this.editId) {
      this.form.patchValue({ id: this.editId() ?? '' });
    }
  }

  onSubmit(): void {
    this.submitError = '';
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.loading = true;
    const raw = this.form.getRawValue();

    const req$ = this.isEdit
      ? this.api.update(raw.id, {
        name: raw.name ?? "",
        description: raw.description ?? "",
        logo: raw.logo ?? "",
        date_release: raw.date_release ?? "",
        date_revision: raw.date_revision ?? "",
      })
      : this.api.create({
        id: raw.id,
        name: raw.name ?? "",
        description: raw.description ?? "",
        logo: raw.logo ?? "",
        date_release: raw.date_release ?? "",
        date_revision: raw.date_revision ?? "",
      });

    req$.subscribe(async ok => {
      if (!ok) return;
      this.loading = false;
      await this.dialog.alert({
        title: this.isEdit ? "Actualizado" : "Guardado",
        message: `Producto se ${this.isEdit ? "actualizo" : "grabo"}  correctamente`,
        type: 'success',
      });
      this.router.navigate(['/products']);
    },
    );
  }

  private minTodayValidator() {
    return (c: AbstractControl): ValidationErrors | null => {
      if (!c.value) return null;
      const today = new Date(); today.setHours(0, 0, 0, 0);
      const d = new Date(c.value); d.setHours(0, 0, 0, 0);
      return d >= today ? null : { minToday: true };
    };
  }

  private revisionOneYearValidator() {
    return (group: AbstractControl): ValidationErrors | null => {
      const release = group.get('date_release')?.value;
      const revision = group.get('date_revision')?.value;
      if (!release || !revision) return null;

      const expected = new Date(release);
      expected.setFullYear(expected.getFullYear() + 1);

      const toYmd = (x: Date) => x.toISOString().slice(0, 10);
      return toYmd(new Date(revision)) === toYmd(expected) ? null : { revisionNotOneYear: true };
    };
  }

  private idAvailableValidator(): AsyncValidatorFn {
    return (c: AbstractControl) => {
      if (this.isEdit) return of(null);
      const id = (c.value ?? '').trim();
      if (id.length < 3) return of(null);

      return this.api.verifyId(id).pipe(
        map(exists => (exists ? { idTaken: true } : null)),
        catchError(() => of({ verifyUnavailable: true }))
      );
    };
  }

  hasError(name: string, err: string): boolean {
    const c = this.form.get(name);
    return !!c && c.touched && c.hasError(err);
  }
}
