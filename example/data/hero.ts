export interface Hero {
  id: number;
  name: string;
  disabled: boolean;
}

export const heroes: Hero[] = [
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

export const filter = (query: string) =>
  heroes.filter(({ name }) => name.toLowerCase().startsWith(query.toLowerCase()));

export const toString = (hero: Hero) => hero.name;

export const toJson = (hero: Hero) => JSON.stringify(hero);
