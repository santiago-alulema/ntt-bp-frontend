import { Component } from '@angular/core';
import { SkeletonComponentTs } from '../skeleton.component.ts/skeleton.component.ts';

@Component({
  selector: 'app-product-list-skeletons',
  imports: [SkeletonComponentTs],
  templateUrl: './product-list-skeleton.component.ts.html',
  styleUrl: './product-list-skeleton.component.ts.css',
})
export class ProductListSkeletonComponentTs {
  rows = Array(5);
  cols = Array(5);
  headers = Array(5);
}
