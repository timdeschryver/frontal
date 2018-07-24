# Frontal

> An Angular select/dropdown accessible component

[![Build status][build-badge]][build]
[![Styled with prettier][prettier-badge]][prettier]
[![npm][npm-badge]][npm]
[![MIT License][license-badge]][license]
[![Code of Conduct][coc-badge]][coc]

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

Use the `frontal` component and directives:

```html
<frontal [itemToString]="heroToString">
  <ng-template let-value="inputValue" let-isOpen="isOpen" let-highlightedIndex="highlightedIndex"
   let-selectedItem="selectedItem">
    <label frontalLabel>Select your hero:</label>
    <input type="text" frontalInput/>

    <ul *ngIf="isOpen" frontalList>
      <li *ngFor="let hero of filteredHeroes(value); let index=index;" frontalItem
       [value]="hero" [class.highlight]="highlightedIndex === index">
        {{ hero.name }}
      </li>
    </ul>

    <div *ngIf="isOpen && filteredHeroes(value).length === 0">
      No heroes found...
    </div>

    <h4>Selected hero:</h4>
    <pre>{{ selectedItem | json }}</pre>
  </ng-template>
</frontal>
```

## API

### frontal

The `frontal` component is the container.

#### Input

##### `itemToString`

Used for converting the selected object to a string.

> Optional. Default: `(value: any) => value`

##### `isOpen`

The initial `isOpen` value,

> Optional. Default: `false`

##### `reducer`

For each action `frontal` will dispatch the current state with the dispatched action and the changes that will apply on the state.
Based on this it's possible to modify the changes to fit your own needs. These changes will then be applied to `frontal`'s state.
The actions can be found at [actions.ts](src/actions.ts)

> Optional. Default: `({ state: State; action: Action; changes: Partial<State> }) => Partial<State>`

#### Output

##### `change`

Event that is fired whenever the `inputValue` changes. The payload (`$event`) will be the `inputValue`.

##### `select`

Event that is fired whenever the `selectedItem` changes. The payload (`$event`) will be the `selectedItem`.

#### State

##### `id`

The unique id of a `frontal` component.

##### `selectedItem`

The selected item.

> default: `null`

##### `highlightedIndex`

The highlighted index.

> default: `null`

##### `highlightedItem`

The highlighted item.

> default: `null`

##### `inputValue`

The input value.

> default: `''`

##### `inputText`

The input text as shown in the input.

> default: `''`

##### `isOpen`

Decides if the menu is open or closed. Based on this `frontal` decides how to handle some actions or the value of some ARIA attributes. For example is the `isOpen` is `false`, the input keydown events wont be handled.

> default: `false`

##### `itemCount`

The number of `frontalItems` in the list.

> default: `0`

### frontalInput

`frontalInput` can be used as a directive to mark the input control. This will set the ARIA attributes as well as the `id`.

### frontalButton

`frontalButton` can be used as a directive to mark the toggle control. This will set the ARIA attributes as well as the `id`.

### frontalLabel

`frontalLabel` can be used as a directive to mark the label. This will set the `for` attribute as well as the `id`.

### frontalList

`frontalList` can be used as a directive to mark the list. This will set the ARIA attributes as well as the `id`.

### frontalItem

`frontalItem` can be used as a directive to mark a list item. This will set the ARIA attributes as well as the `id`.

#### Input

##### `value`

The value of the list item.

> Required. Any.

## Example

A couple of implementations can be found on [StackBlitz][stackblitz-example].

## Inspiration

- [This talk][compound-components] about compound components by [Ryan Florence][ryan-florence]
- The [Downshift][downshift] library

By taking in all this information, I wondered how this would look like in Angular.

## LICENSE

MIT

[build-badge]: https://circleci.com/gh/timdeschryver/frontal/tree/master.svg?style=shield
[build]: https://circleci.com/gh/timdeschryver/frontal/tree/master
[prettier-badge]: https://img.shields.io/badge/styled_with-prettier-ff69b4.svg
[prettier]: https://github.com/prettier/prettier
[npm-badge]: https://img.shields.io/npm/v/frontal.svg
[npm]: https://www.npmjs.com/package/frontal
[license-badge]: https://img.shields.io/npm/l/frontal.svg?style=flat-square
[license]: https://github.com/timdeschryver/frontal/blob/master/LICENSE
[coc-badge]: https://img.shields.io/badge/code%20of-conduct-ff69b4.svg?style=flat-square
[coc]: https://github.com/timdeschryver/frontal/blob/master/CODE_OF_CONDUCT.md
[stackblitz-example]: https://stackblitz.com/github/timdeschryver/frontal
[ryan-florence]: https://github.com/ryanflorence
[downshift]: https://github.com/paypal/downshift
[compound-components]: https://www.youtube.com/watch?v=hEGg-3pIHlE
