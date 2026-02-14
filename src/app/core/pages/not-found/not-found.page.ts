import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonComponent } from "@components/shared/button.component/button.component";

@Component({
  selector: 'app-not-found',
  imports: [ButtonComponent],
  templateUrl: './not-found.page.html',
  styleUrl: './not-found.page.css',
})
export class NotFoundPage {
  private router = inject(Router);
  goBack = () => this.router.navigate(['/products']);
}
