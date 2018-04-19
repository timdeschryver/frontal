let frontalId = 0;

export function generateId() {
  return `${frontalId++}`;
}

export function resetId() {
  frontalId = 0;
}
