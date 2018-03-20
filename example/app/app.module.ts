import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FrontalModule } from 'frontal';

import { AppComponent } from './app.component';
import { SimpleComponent } from './components/simple';
import { DropdownComponent } from './components/dropdown';
import { ModelComponent } from './components/model';
import { ReactiveComponent } from './components/reactive';
import { BootstrapComponent } from './components/bootstrap';
import { ReducerComponent } from './components/reducer';

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
  {
    path: 'reducer',
    component: ReducerComponent,
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
    ReducerComponent,
  ],
  imports: [BrowserModule, FormsModule, ReactiveFormsModule, FrontalModule, RouterModule.forRoot(routes)],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
