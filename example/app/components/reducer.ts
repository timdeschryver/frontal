import { Component } from '@angular/core';
import { State, Action, StateChanges } from 'frontal';
import { heroes, filter, toString, toJson, Hero } from '../../data/hero';

@Component({
  selector: 'app-reducer',
  template: `
    <frontal [itemToString]="heroToString" [reducer]="reducer">
      <ng-template let-value="inputValue" let-open="open" let-highlightedIndex="highlightedIndex" let-selectedItem="selectedItem">
        <label frontalLabel>Select your hero!</label>
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
        <input type="hidden" id="selected" [value]="heroToJson(selectedItem)">
        <pre>{{selectedItem | json}}</pre>
      </ng-template>
    </frontal>
  `,
})
export class ReducerComponent {
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

  reducer(state: State, action: Action) {
    console.log(action);

    switch (action.type) {
      case StateChanges.InputKeydownArrowDown:
      case StateChanges.InputKeydownArrowUp:
        return {
          ...action,
          payload: {
            ...action.payload,
            inputText: toString(filter(state.inputValue)[action.payload.highlightedIndex]),
          },
        };
      case StateChanges.ItemMouseEnter:
      case StateChanges.ItemMouseLeave:
        return {
          ...action,
          payload: {
            ...action.payload,
            highlightedIndex: state.highlightedIndex,
          },
        };
      case StateChanges.ItemMouseClick:
      case StateChanges.InputBlur:
        return {
          ...action,
          payload: {},
        };
      default:
        return action;
    }
  }
}
