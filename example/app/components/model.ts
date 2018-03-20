import { Component } from '@angular/core';
import { heroes, filter, toString, toJson, Hero } from '../../data/hero';

@Component({
  selector: 'app-model',
  template: `
    <frontal [(ngModel)]="hero" [itemToString]="heroToString">
      <ng-template let-value="inputValue" let-open="open" let-highlightedIndex="highlightedIndex">
        <label>Select your hero!</label>
        <input type="text" frontalInput/>

        <ul *ngIf="open" class="menu">
          <li *ngFor="let hero of filteredHeroes(value); trackBy:trackHeroById; let index=index;"
            [class.highlight]="highlightedIndex === index">
            <div frontalItem [value]="hero">{{hero.name}}</div>
          </li>

          <div *ngIf="!filteredHeroes(value).length">
            No heroes found...
          </div>
        </ul>

        <h4>Selected hero:</h4>
        <input type="hidden" id="selected" [value]="heroToJson(hero)">
        <pre>{{hero | json}}</pre>
      </ng-template>
    </frontal>
    <button id="reset" (click)="reset()">Change hero</button>
  `,
  styles: [
    `
      .highlight {
        background: yellow;
      }
    `,
  ],
})
export class ModelComponent {
  heroes = heroes;
  hero = heroes[3];

  filteredHeroes(query: string) {
    return filter(query);
  }

  trackHeroById(index: number, hero: Hero) {
    return hero.id;
  }

  heroToString(hero: Hero) {
    return toString(hero);
  }

  heroToJson(hero: Hero) {
    return toJson(hero);
  }

  reset() {
    this.hero = this.heroes[3];
  }
}
