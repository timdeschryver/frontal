import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div class="grid">
      <header>
        <h1>Frontal</h1>
      </header>
      <aside>
        <nav>
          <ul>
            <li><a routerLink="/simple" routerLinkActive="active">Simple</a></li>
            <li><a routerLink="/dropdown" routerLinkActive="active">Dropdown</a></li>
            <li><a routerLink="/model" routerLinkActive="active">Model</a></li>
            <li><a routerLink="/reactive" routerLinkActive="active">Reactive</a></li>
            <li><a routerLink="/bootstrap" routerLinkActive="active">Bootstrap</a></li>
            <li><a routerLink="/reducer" routerLinkActive="active">Reducer</a></li>
          </ul>
        </nav>
      </aside>
      <article>
        <router-outlet></router-outlet>
      </article>
    </div>
  `,
})
export class AppComponent {}
