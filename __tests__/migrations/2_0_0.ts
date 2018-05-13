import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import * as path from 'path';

const packagePath = '/package.json';
const collectionPath = path.join(__dirname, '../../migrations/migration.json');

function setup(prefix: string) {
  const tree = Tree.empty() as UnitTestTree;
  tree.create(
    packagePath,
    `{
        "dependencies": {
          "frontal": "${prefix}1.0.0"
        }
      }`,
  );

  return {
    tree,
    runner: new SchematicTestRunner('schematics', collectionPath),
  };
}

const prefixes = ['~', '^', ''];
prefixes.forEach(prefix => {
  test(`installs version ${prefix}2.0.0`, () => {
    const { runner, tree } = setup(prefix);
    const updatedTree = runner.runSchematic('frontal-migration-01', {}, tree);
    const pkg = JSON.parse(updatedTree.readContent(packagePath));
    expect(pkg.dependencies['frontal']).toBe(`${prefix}2.0.0-beta.1`);
  });
});
