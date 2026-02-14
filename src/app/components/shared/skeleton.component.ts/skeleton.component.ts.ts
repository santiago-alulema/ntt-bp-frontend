import { Component, input } from '@angular/core';

@Component({
  selector: 'app-skeleton',
  imports: [],
  templateUrl: './skeleton.component.ts.html',
  styleUrl: './skeleton.component.ts.css',
})
export class SkeletonComponentTs {
  height = input<number>(16);
  width = input<number>(100);
}
