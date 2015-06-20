var path = require('path');
var webpack = require('webpack');

var config = module.exports = {
  context: __dirname,
  entry: './client/client.js',
  output: {
    path: path.join(__dirname, 'app', 'assets', 'javascripts'),
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: require.resolve('./client/client'),
        loader: 'expose?Client'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        query: { optional: ['runtime']},
        include: [
          path.resolve(__dirname, 'client'),
          path.resolve(__dirname, 'node_modules/po-go')
        ]
      }
    ]
  },
  node: { 'fs': 'empty' }
};
