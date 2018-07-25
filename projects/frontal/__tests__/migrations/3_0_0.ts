import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import * as path from 'path';

const packagePath = '/package.json';
const collectionPath = path.join(__dirname, '../../migrations/migration.json');

function setup(prefix: string, version: string) {
  const tree = Tree.empty() as UnitTestTree;
  tree.create(
    packagePath,
    `{
        "dependencies": {
          "frontal": "${prefix}${version}"
        }
      }`,
  );

  return {
    tree,
    runner: new SchematicTestRunner('schematics', collectionPath),
  };
}

const versions = ['1.0.0', '2.0.0'];
const prefixes = ['~', '^', ''];
versions.forEach(version => {
  prefixes.forEach(prefix => {
    test(`installs version ${prefix}3.0.0 when ${version} is installed`, () => {
      const { runner, tree } = setup(prefix, version);
      const updatedTree = runner.runSchematic('frontal-migration-03', {}, tree);
      const pkg = JSON.parse(updatedTree.readContent(packagePath));
      expect(pkg.dependencies['frontal']).toBe(`${prefix}3.0.0`);
    });
  });
});
