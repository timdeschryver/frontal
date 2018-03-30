import { Component, OnInit } from '@angular/core';
import { heroes, filter, toString, toJson, Hero } from '../../data/hero';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'frontal-reactive',
  template: `
    <form [formGroup]="form">
      <frontal [itemToString]="heroToString" formControlName="hero">
        <ng-template let-value="inputValue" let-isOpen="isOpen" let-highlightedIndex="highlightedIndex">
          <label frontalLabel>Select your hero:</label>
          <input type="text" frontalInput/>

          <ul *ngIf="isOpen" class="menu">
            <li *ngFor="let hero of filteredHeroes(value); trackBy:trackHeroById; let index=index;" frontalItem [value]="hero"
              [class.highlight]="highlightedIndex === index">
              {{hero.name}}
            </li>
          </ul>

          <div *ngIf="isOpen && filteredHeroes(value).length === 0" class="no-match">
            No heroes found...
          </div>

          <h4>Form value:</h4>
          <input type="hidden" id="selected" [value]="heroToJson(form.get('hero').value)">
          <pre>{{form.value | json}}</pre>
        </ng-template>
      </frontal>
    </form>
    <button id="reset" (click)="reset()">Reset hero</button>
  `,
})
export class ReactiveComponent implements OnInit {
  form: FormGroup;
  heroes = heroes;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.fb.group({
      hero: heroes[3],
    });
  }

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

  reset() {
    this.form.setValue({ hero: this.heroes[3] });
  }
}
