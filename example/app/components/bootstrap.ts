import { Component } from '@angular/core';
import { heroes, filter, toString, toJson, Hero } from '../../data/hero';

@Component({
  selector: 'app-bootstrap',
  template: `
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
    <div class="container">
      <frontal [itemToString]="heroToString">
        <ng-template let-value="inputValue" let-open="open" let-highlightedIndex="highlightedIndex" let-selectedItem="selectedItem">
          <div class="form-group">
            <label>Select your hero!</label>
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
          <pre>{{selectedItem | json}}</pre>
        </ng-template>
      </frontal>
    </div>
  `,
  styles: [
    `
      .highlight {
        background: yellow;
      }
    `,
  ],
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
