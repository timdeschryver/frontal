import { Component, ChangeDetectionStrategy } from '@angular/core';
import { heroes, toString, toJson, Hero } from '../../data/hero';

@Component({
  selector: 'frontal-dropdown',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <frontal #frontal [itemToString]="heroToString" [isOpen]="true" on-select="onSelect($event)">
      <ng-template>
        <button frontalButton>
          {{ frontal.state.value.selectedItem ? frontal.state.value.selectedItem.name : 'Select your hero' }}
        </button>

        <ul *ngIf="frontal.state.value.isOpen" frontalList>
          <li *ngFor="let hero of heroes; let index=index;" frontalItem [value]="hero" [class.highlight]="frontal.state.value.highlightedIndex === index">
            {{ hero.name }}
          </li>
        </ul>

        <h4>Selected hero:</h4>
        <pre data-test="selected-item">{{ frontal.state.value.selectedItem | json }}</pre>
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
