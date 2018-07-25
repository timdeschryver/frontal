module.exports = {
  preset: 'jest-preset-angular',
  rootDir: '../../',
  roots: ['<rootDir>/projects/frontal'],
  setupTestFrameworkScriptFile: '<rootDir>/projects/frontal/test.ts',
  globals: {
    'ts-jest': {
      tsConfigFile: './projects/frontal/tsconfig.spec.json',
    },
    __TRANSFORM_HTML__: true,
  },
};
