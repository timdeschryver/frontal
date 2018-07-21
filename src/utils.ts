let _frontalId = 0;

export function generateId() {
  return `${_frontalId++}`;
}

export function resetId() {
  _frontalId = 0;
}

export const createFrontalInputId = (id: string) => `frontal-input-${id}`;

export const createFrontalButtonId = (id: string) => `frontal-button-${id}`;

export const createFrontalLabelId = (id: string) => `frontal-label-${id}`;

export const createFrontalListId = (id: string) => `frontal-list-${id}`;

export const createFrontalItemId = (frontalId: string, id: string) => `frontal-item-${frontalId}-${id}`;
