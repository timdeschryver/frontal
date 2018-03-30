import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { FrontalModule } from 'frontal';

import { AppComponent } from './app.component';
import { SimpleComponent } from './components/simple';
import { DropdownComponent } from './components/dropdown';
import { ModelComponent } from './components/model';
import { ReactiveComponent } from './components/reactive';
import { BootstrapComponent } from './components/bootstrap';
import { ReducerComponent } from './components/reducer';
import { HttpComponent, GitHubService } from './components/http';

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
  {
    path: 'http',
    component: HttpComponent,
  },
  {
    path: '**',
    redirectTo: 'simple',
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
    HttpComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    FrontalModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
  ],
  providers: [GitHubService],
  bootstrap: [AppComponent],
})
export class AppModule {}
