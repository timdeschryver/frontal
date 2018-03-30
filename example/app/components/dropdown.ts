import { Component } from '@angular/core';
import { heroes, toString, toJson, Hero } from '../../data/hero';

@Component({
  selector: 'frontal-dropdown',
  template: `
    <frontal #frontal [itemToString]="heroToString" on-select="onSelect($event)">
      <ng-template>
        <button frontalButton>
          {{frontal.state.selectedItem ? frontal.state.selectedItem.name : 'Select your hero'}}
        </button>

        <ul *ngIf="frontal.state.isOpen" class="menu">
          <li *ngFor="let hero of heroes; trackBy:trackById; let index=index;" frontalItem [value]="hero"
            [class.highlight]="frontal.state.highlightedIndex === index">
            {{hero.name}}
          </li>
        </ul>

        <h4>Selected hero:</h4>
        <input type="hidden" id="selected" [value]="heroToJson(frontal.state.selectedItem)">
        <pre>{{frontal.state.selectedItem | json}}</pre>
      </ng-template>
    </frontal>
  `,
})
export class DropdownComponent {
  heroes = heroes;

  trackHeroById(index: number, hero: Hero) {
    return hero.id;
  }

  heroToString(hero: Hero) {
    return toString(hero);
  }

  heroToJson(hero: Hero) {
    return toJson(hero);
  }

  onSelect(hero: Hero) {
    alert(`${hero.name} selected!`);
  }
}
