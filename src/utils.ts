let _frontalId = 0;

export function generateId() {
  return `${_frontalId++}`;
}
