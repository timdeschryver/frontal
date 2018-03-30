import { Component } from '@angular/core';
import { trigger, transition, query, style, animate, stagger, keyframes } from '@angular/animations';
import { heroes, filter, toString, toJson, Hero } from '../../data/hero';

@Component({
  selector: 'frontal-simple',
  template: `
    <frontal [itemToString]="heroToString">
      <ng-template let-value="inputValue" let-isOpen="isOpen" let-highlightedIndex="highlightedIndex" let-selectedItem="selectedItem">
        <label frontalLabel>Select your hero!</label>
        <input type="text" frontalInput/>

        <ul *ngIf="isOpen" class="menu" [@listAnimation]="filteredHeroes(value).length">
          <li *ngFor="let hero of filteredHeroes(value); trackBy:trackHeroById; let index=index;"
            [class.highlight]="highlightedIndex === index">
            <div frontalItem [value]="hero">{{hero.name}}</div>
          </li>
        </ul>

        <div *ngIf="isOpen && filteredHeroes(value).length > 0">
          No heroes found...
        </div>

        <h4>Selected hero:</h4>
        <input type="hidden" id="selected" [value]="heroToJson(selectedItem)">
        <pre>{{selectedItem | json}}</pre>
      </ng-template>
    </frontal>
  `,
  animations: [
    trigger('listAnimation', [
      transition('* => *', [
        query('li:enter', style({ opacity: 0 }), { optional: true }),
        query(
          'li:enter',
          stagger('50ms', [
            animate(
              '200ms ease-in',
              keyframes([
                style({ opacity: 0, transform: 'translateX(-75%)', offset: 0 }),
                style({ opacity: 0.5, transform: 'translateX(35px)', offset: 0.3 }),
                style({ opacity: 1, transform: 'translateX(0)', offset: 1.0 }),
              ]),
            ),
          ]),
          { optional: true },
        ),
      ]),
    ]),
  ],
})
export class SimpleComponent {
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
}
