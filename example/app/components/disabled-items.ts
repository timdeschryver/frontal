import { Component, ChangeDetectionStrategy } from '@angular/core';
import { heroes, filter, toString, toJson, Hero } from '../../data/hero';

@Component({
  selector: 'frontal-disabled',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <frontal [itemToString]="heroToString">
      <ng-template let-value="inputValue" let-isOpen="isOpen" let-highlightedIndex="highlightedIndex" let-selectedItem="selectedItem">
          <label frontalLabel>Select your hero:</label>
          <input type="text" frontalInput/>

          <ng-container *ngIf="isOpen">
            <ul frontalList *ngIf="filteredHeroes(value) as heroes">
              <li *ngFor="let hero of heroes; trackBy:trackHeroById; let index=index;">
                <ng-container *ngIf="hero.disabled; then disabled; else enabled">
                </ng-container>

                <ng-template #enabled>
                  <div frontalItem [value]="hero" [index]="index" [class.highlight]="highlightedIndex === findIndex(hero, heroes)">
                  {{ hero.name }}
                </div>
                </ng-template>

                <ng-template #disabled>
                  <div [style.color]="'#ccc'">
                    {{ hero.name }}
                  </div>
                </ng-template>
              </li>
            </ul>

            <div *ngIf="filteredHeroes(value).length === 0">
              No heroes found...
            </div>
        </ng-container>

        <h4>Selected hero:</h4>
        <pre data-test="selected-item">{{ selectedItem | json }}</pre>
      </ng-template>
    </frontal>
  `,
})
export class DisabledItemsComponent {
  heroes = heroes;

  filteredHeroes(text: string) {
    return filter(text);
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

  findIndex(hero: Hero, filteredHeroes: Hero[]) {
    return filteredHeroes.filter(p => !p.disabled).indexOf(hero);
  }
}
