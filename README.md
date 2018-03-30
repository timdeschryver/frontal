# Frontal

> An Angular select/dropdown component

## Installation

Install `frontal` from [npm]:

`npm install frontal`

## Usage

Import the `FrontalModule`:

```ts
@NgModule({
  declarations: [
    ...
  ],
  imports: [
    ...
    FrontalModule,
  ],
})
export class AppModule {}
```

Use the frontal component and directives:

```html
<frontal [itemToString]="heroToString">
  <ng-template let-value="inputValue" let-isOpen="isOpen" let-highlightedIndex="highlightedIndex" let-selectedItem="selectedItem">
    <label frontalLabel>Select your hero!</label>
    <input type="text" frontalInput/>

    <ul *ngIf="isOpen">
      <li *ngFor="let hero of filteredHeroes(value); trackBy:trackHeroById; let index=index;"
        [class.highlight]="highlightedIndex === index">
        <div frontalItem [value]="hero">{{hero.name}}</div>
      </li>
    </ul>

    <div *ngIf="isOpen && filteredHeroes(value).length > 0">
      No heroes found...
    </div>

    <h4>Selected hero:</h4>
    <pre>{{selectedItem | json}}</pre>
  </ng-template>
</frontal>
```

## Example

A couple of implementations can be found on [StackBlitz][stackblitz-example].

## Inspiration

* [This talk][compound-components] about compound components by [Ryan Florence][ryan-florence]
* The [Downshift][downshift] library

By taking in all this information, I wondered how this would look like in Angular.

[stackblitz-example]: https://stackblitz.com/github/tdeschryver/frontal
[ryan-florence]: https://github.com/ryanflorence
[downshift]: https://github.com/paypal/downshift
[compound-components]: https://www.youtube.com/watch?v=hEGg-3pIHlE
[npm]: https://www.npmjs.com/package/frontal
