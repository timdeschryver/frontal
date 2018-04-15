import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  FrontalComponent,
  FrontalInputDirective,
  FrontalLabelDirective,
  FrontalItemDirective,
  FrontalButtonDirective,
  FrontalListDirective,
} from './frontal.component';
import { StatusMessagePipe } from './status.pipe';

const components = [
  FrontalComponent,
  FrontalInputDirective,
  FrontalLabelDirective,
  FrontalItemDirective,
  FrontalButtonDirective,
  FrontalListDirective,
  StatusMessagePipe,
];

@NgModule({
  imports: [CommonModule],
  declarations: components,
  exports: components,
})
export class FrontalModule {}
