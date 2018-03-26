import { Component } from '@angular/core';
import { heroes, filter, toString, toJson, Hero } from '../../data/hero';

@Component({
  selector: 'app-bootstrap',
  template: `
    <frontal [itemToString]="heroToString">
      <ng-template let-value="inputValue" let-open="open" let-highlightedIndex="highlightedIndex" let-selectedItem="selectedItem">
        <div class="form-group">
          <label frontalLabel>Select your hero!</label>
          <input type="text" class="form-control form-control-lg" frontalInput/>

          <ul *ngIf="open" class="list-group menu">
            <li *ngFor="let hero of filteredHeroes(value); trackBy:trackHeroById; let index=index;"
              class="list-group-item" [class.active]="highlightedIndex === index">
              <div frontalItem [value]="hero">{{hero.name}}</div>
            </li>

            <div *ngIf="!filteredHeroes(value).length">
              No heroes found...
            </div>
          </ul>
        </div>
        <h4>Selected hero:</h4>
        <input type="hidden" id="selected" [value]="heroToJson(selectedItem)">
        <pre [style.color]="'#fff'">{{selectedItem | json}}</pre>
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
