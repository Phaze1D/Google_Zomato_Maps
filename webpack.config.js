var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');



var config = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  resolve: {
    modules: [
      'node_modules',
      'src'
    ],
    extensions: ['.js']
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: [{
        loader: 'babel-loader',
        options: {
          presets: ['es2015'],
          plugins: ["transform-decorators-legacy"]
        }
      }]
    },{
      test: /\.sass$/,
      use: [
        'style-loader',
        'css-loader',
        'sass-loader'
      ]
    },{
      test: /\.html$/,
      use: [{
        loader: 'html-loader',
        options: {
          minimize: false
        }
      }]
    }]
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'src'),
  },
  plugins: []
}

if(process.env.NODE_ENV === 'production'){
  config.plugins.push(new webpack.optimize.UglifyJsPlugin({ output: { comments: false } }))
  config.plugins.push(new HtmlWebpackPlugin({
      inject: 'head',
      filename: 'index.html',
      template: 'src/index.html'
    }))
  config.watch = false
}

module.exports = config
