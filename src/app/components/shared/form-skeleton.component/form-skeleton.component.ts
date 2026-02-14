import { Component } from '@angular/core';
import { SkeletonComponentTs } from "../skeleton.component.ts/skeleton.component.ts";

@Component({
  selector: 'app-form-skeleton',
  imports: [SkeletonComponentTs],
  templateUrl: './form-skeleton.component.html',
  styleUrl: './form-skeleton.component.css',
})
export class FormSkeletonComponent {

}
