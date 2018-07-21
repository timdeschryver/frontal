import { Component, ChangeDetectionStrategy } from '@angular/core';
import { heroes, filter, toString, toJson, Hero } from '../../data/hero';

@Component({
  selector: 'frontal-bootstrap',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <frontal [itemToString]="heroToString">
      <ng-template let-value="inputValue" let-isOpen="isOpen" let-highlightedIndex="highlightedIndex" let-selectedItem="selectedItem">
        <div class="form-group">
          <label frontalLabel>Select your hero:</label>
          <input type="text" class="form-control form-control-lg" frontalInput/>

          <ng-container *ngIf="isOpen">
            <ul class="list-group" frontalList>
              <li *ngFor="let hero of filteredHeroes(value); trackBy:trackHeroById; let index=index;"
                frontalItem [value]="hero" [index]="index" class="list-group-item" [class.active]="highlightedIndex === index">
                {{ hero.name }}
              </li>
            </ul>

            <div *ngIf="filteredHeroes(value).length === 0">
              No heroes found...
            </div>
          </ng-container>
        </div>

        <h4>Selected hero:</h4>
        <pre data-test="selected-item" [style.color]="'#fff'">{{ selectedItem | json }}</pre>
      </ng-template>
    </frontal>
  `,
  styleUrls: ['./bootstrap.scss'],
})
export class BootstrapComponent {
  heroes = heroes;

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
}
