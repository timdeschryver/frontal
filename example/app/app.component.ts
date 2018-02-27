import { Component } from '@angular/core';
import { StateChanges, Action } from '../../src/frontal';
import { heroes, filter, toString, toJson, Hero } from '../data/hero';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  heroes = heroes;

  filteredHeroes(query: string) {
    return filter(this.heroes, query);
  }

  trackById(index: number, hero: Hero) {
    return hero.id;
  }

  findIndex(hero: Hero, heroes: Hero[]) {
    return heroes.filter(p => !p.disabled).indexOf(hero);
  }

  heroToString(hero: Hero) {
    return toString(hero);
  }

  heroToJson(hero: Hero) {
    return toJson(hero);
  }

  reducer(action: Action) {
    console.log(action);
    return action;
  }
}
