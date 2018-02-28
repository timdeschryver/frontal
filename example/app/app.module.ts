import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { FrontalModule } from '../../src/frontal.module';
import { AppComponent } from './app.component';
import { SimpleComponent } from './components/simple';
import { DropdownComponent } from './components/dropdown';

const routes: Routes = [
  {
    path: 'simple',
    component: SimpleComponent,
  },
  {
    path: 'dropdown',
    component: DropdownComponent,
  },
];

@NgModule({
  declarations: [AppComponent, SimpleComponent, DropdownComponent],
  imports: [BrowserModule, FrontalModule, RouterModule.forRoot(routes)],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
