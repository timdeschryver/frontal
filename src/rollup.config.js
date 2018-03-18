const globals = {
  '@angular/core': 'ng.core',
  '@angular/common': 'ng.common',
  '@angular/forms': 'ng.forms',
};

export default {
  input: './dist/frontal.js',
  output: {
    name: 'frontal',
    file: './dist/bundles/frontal.umd.js',
    format: 'umd',
    sourceMap: false,
    globals,
  },
  external: Object.keys(globals),
};
