import { Component } from '@angular/core';
import { StateChanges, Action } from '../../src/frontal';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  heroes: Hero[] = [
    { id: 11, name: 'Mr. Nice', disabled: false },
    { id: 12, name: 'Narco', disabled: false },
    { id: 13, name: 'Bombasto', disabled: true },
    { id: 14, name: 'Celeritas', disabled: false },
    { id: 15, name: 'Magneta', disabled: false },
    { id: 16, name: 'RubberMan', disabled: false },
    { id: 17, name: 'Dynama', disabled: true },
    { id: 18, name: 'Dr IQ', disabled: false },
    { id: 19, name: 'Magma', disabled: false },
    { id: 20, name: 'Tornado', disabled: false },
  ];

  filteredHeroes(filter: string) {
    return this.heroes.filter(({ name }) => name.toLowerCase().startsWith(filter.toLowerCase()));
  }

  trackById(index: number, hero: Hero) {
    return hero.id;
  }

  findIndex(hero: Hero, heroes: Hero[]) {
    return heroes.filter(p => !p.disabled).indexOf(hero);
  }

  heroToString(hero: Hero) {
    return hero.name;
  }

  heroToJson(hero: Hero) {
    return JSON.stringify(hero);
  }

  reducer(action: Action) {
    console.log(action);
    return action;
  }
}

interface Hero {
  id: number;
  name: string;
  disabled: boolean;
}
