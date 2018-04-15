import { Pipe, PipeTransform } from '@angular/core';
import { State } from './state';

@Pipe({ name: 'statusMessage' })
export class StatusMessagePipe implements PipeTransform {
  transform(state: State): string {
    if (state.isOpen) {
      if (state.highlightedItem !== null) {
        return state.itemToString(state.highlightedItem);
      } else if (state.itemCount) {
        return `${state.itemCount} ${
          state.itemCount === 1 ? 'result is' : 'results are'
        } available, use up and down arrow keys to navigate.`;
      }
      return 'No results.';
    }

    if (state.selectedItem) {
      return state.itemToString(state.selectedItem);
    } else {
      return '';
    }
  }
}
