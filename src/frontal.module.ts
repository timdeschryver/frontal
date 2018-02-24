import { NgModule } from '@angular/core';
import { FrontalComponent, FrontalInputDirective, FrontalItemDirective } from './frontal';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  declarations: [FrontalComponent, FrontalInputDirective, FrontalItemDirective],
  imports: [BrowserModule],
  exports: [FrontalComponent, FrontalInputDirective, FrontalItemDirective],
})
export class FrontalModule {}
