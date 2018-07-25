import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { heroes, filter, toString, toJson, Hero } from '../../data/hero';

@Component({
  selector: 'frontal-reactive',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form [formGroup]="form">
      <frontal [itemToString]="heroToString" formControlName="hero">
        <ng-template let-value="inputValue" let-isOpen="isOpen" let-highlightedIndex="highlightedIndex">
          <label frontalLabel>Select your hero:</label>
          <input type="text" frontalInput/>

          <ng-container *ngIf="isOpen">
            <ul frontalList>
              <li *ngFor="let hero of filteredHeroes(value); trackBy:trackHeroById; let index=index;" frontalItem
                [value]="hero" [class.highlight]="highlightedIndex === index">
                {{ hero.name }}
              </li>
            </ul>

            <div *ngIf="filteredHeroes(value).length === 0">
              No heroes found...
            </div>
          </ng-container>

          <h4>Form value:</h4>
          <pre data-test="selected-item">{{ form.value?.hero | json }}</pre>
        </ng-template>
      </frontal>
    </form>
    <button data-test="reset" (click)="reset()">Reset hero</button>
  `,
})
export class ReactiveComponent implements OnInit {
  form!: FormGroup;
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
