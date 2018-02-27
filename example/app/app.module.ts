import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { FrontalModule } from '../../src/frontal.module';
import { AppComponent } from './app.component';
import { SimpleComponent } from './components/simple';

const routes: Routes = [
  {
    path: 'simple',
    component: SimpleComponent,
  },
];

@NgModule({
  declarations: [AppComponent, SimpleComponent],
  imports: [BrowserModule, FrontalModule, RouterModule.forRoot(routes)],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
