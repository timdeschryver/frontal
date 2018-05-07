import { Component, ChangeDetectionStrategy } from '@angular/core';
import { heroes, filter, toString, toJson, Hero } from '../../data/hero';

@Component({
  selector: 'frontal-model',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <frontal [(ngModel)]="hero" [itemToString]="heroToString">
      <ng-template let-value="inputValue" let-isOpen="isOpen" let-highlightedIndex="highlightedIndex">
        <label frontalLabel>Select your hero:</label>
        <input type="text" frontalInput/>

        <ng-container *ngIf="isOpen">
          <ul frontalList>
            <li *ngFor="let hero of filteredHeroes(value); trackBy:trackHeroById; let index=index;"
              frontalItem [value]="hero" [index]="index" [class.highlight]="highlightedIndex === index">
              {{hero.name}}
            </li>
          </ul>

          <div *ngIf="filteredHeroes(value).length === 0">
            No heroes found...
          </div>
        </ng-container>

        <h4>Selected hero:</h4>
        <pre data-test="selected-item">{{hero | json}}</pre>
      </ng-template>
    </frontal>
    <button data-test="reset" (click)="reset()">Reset hero</button>
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
