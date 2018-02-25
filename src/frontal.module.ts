import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FrontalComponent, FrontalInputDirective, FrontalItemDirective, FrontalButtonDirective } from './frontal';

@NgModule({
  declarations: [FrontalComponent, FrontalInputDirective, FrontalItemDirective, FrontalButtonDirective],
  imports: [BrowserModule],
  exports: [FrontalComponent, FrontalInputDirective, FrontalItemDirective, FrontalButtonDirective],
})
export class FrontalModule {}
