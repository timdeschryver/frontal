import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FrontalModule } from 'frontal/frontal.module';
import { AppComponent } from './app.component';
import { SimpleComponent } from './components/simple';
import { DropdownComponent } from './components/dropdown';
import { ModelComponent } from './components/model';
import { ReactiveComponent } from './components/reactive';
import { BootstrapComponent } from './components/bootstrap';

const routes: Routes = [
  {
    path: 'simple',
    component: SimpleComponent,
  },
  {
    path: 'dropdown',
    component: DropdownComponent,
  },
  {
    path: 'model',
    component: ModelComponent,
  },
  {
    path: 'reactive',
    component: ReactiveComponent,
  },
  {
    path: 'bootstrap',
    component: BootstrapComponent,
  },
];

@NgModule({
  declarations: [
    AppComponent,
    SimpleComponent,
    DropdownComponent,
    ModelComponent,
    ReactiveComponent,
    BootstrapComponent,
  ],
  imports: [BrowserModule, FormsModule, ReactiveFormsModule, FrontalModule, RouterModule.forRoot(routes)],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
