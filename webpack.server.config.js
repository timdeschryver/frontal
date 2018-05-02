const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'development',
  entry: {
    server: './server.ts',
    prerender: './prerender.ts',
  },
  resolve: { extensions: ['.js', '.ts'] },
  target: 'node',
  externals: [/(node_modules|main\..*\.js)/],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
  },
  module: {
    rules: [{ test: /\.ts$/, loader: 'ts-loader' }],
  },
  plugins: [
    new webpack.ContextReplacementPlugin(/(.+)?angular(\\|\/)core(.+)?/, path.join(__dirname, 'src'), {}),
    new webpack.ContextReplacementPlugin(/(.+)?express(\\|\/)(.+)?/, path.join(__dirname, 'src'), {}),
  ],
};
