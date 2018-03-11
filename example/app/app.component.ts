import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <h1>Frontal</h1>
    <nav>
      <a routerLink="/simple">Simple</a>
      <a routerLink="/dropdown">Dropdown</a>
      <a routerLink="/model">Model</a>
      <a routerLink="/reactive">Reactive</a>
      <a routerLink="/bootstrap">Bootstrap</a>
    </nav>

    <router-outlet></router-outlet>
  `,
})
export class AppComponent {}
