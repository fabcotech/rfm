module.exports = {
  //preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
  testEnvironment: 'node',
  transform: {
    '^.+\\.(js|jsx)?$': 'babel-jest',
    '^.+\\.ts?$': 'ts-jest',
    //"\\.ts$": ['ts-jest']
  },
  transformIgnorePatterns: ['@/node_modules/'],
};
