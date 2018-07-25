import { Rule, SchematicContext, Tree, SchematicsException } from '@angular-devkit/schematics';

/* istanbul ignore next */
export default function(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const pkgPath = '/package.json';
    const buffer = tree.read(pkgPath);
    if (buffer == null) {
      throw new SchematicsException('Could not read package.json');
    }
    const content = buffer.toString();
    const pkg = JSON.parse(content);

    if (pkg === null || typeof pkg !== 'object' || Array.isArray(pkg)) {
      throw new SchematicsException('Error reading package.json');
    }

    if (!pkg.dependencies) {
      pkg.dependencies = {};
    }

    if (pkg.dependencies['frontal']) {
      const firstChar = pkg.dependencies['frontal'][0];
      const suffix = match(firstChar, '^') || match(firstChar, '~');

      pkg.dependencies['frontal'] = `${suffix}2.0.0`;
      tree.overwrite(pkgPath, JSON.stringify(pkg, null, 2));
    }

    return tree;
  };
}

function match(value: string, test: string) {
  return value === test ? test : '';
}
