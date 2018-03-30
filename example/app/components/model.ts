import { Component } from '@angular/core';
import { heroes, filter, toString, toJson, Hero } from '../../data/hero';

@Component({
  selector: 'frontal-model',
  template: `
    <frontal [(ngModel)]="hero" [itemToString]="heroToString">
      <ng-template let-value="inputValue" let-isOpen="isOpen" let-highlightedIndex="highlightedIndex">
        <label frontalLabel>Select your hero:</label>
        <input type="text" frontalInput/>

        <ul *ngIf="isOpen" class="menu">
          <li *ngFor="let hero of filteredHeroes(value); trackBy:trackHeroById; let index=index;" frontalItem [value]="hero"
            [class.highlight]="highlightedIndex === index">
            {{hero.name}}
          </li>
        </ul>

        <div *ngIf="isOpen && filteredHeroes(value).length === 0" class="no-match">
          No heroes found...
        </div>

        <h4>Selected hero:</h4>
        <input type="hidden" id="selected" [value]="heroToJson(hero)">
        <pre>{{hero | json}}</pre>
      </ng-template>
    </frontal>
    <button id="reset" (click)="reset()">Reset hero</button>
  `,
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
