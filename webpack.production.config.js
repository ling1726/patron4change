/* eslint no-var: 0 */
// no-var: webpack configuration must be interpretable in non-es6 environments

var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {

  context: __dirname,

  // devtool: 'eval',

  entry: [
  	// 'webpack-hot-middleware/client', // for hot reload
  	'./client/index.js' // entry point for the client app
  ],

  output: {
  	path: path.join(__dirname, 'public'),
  	filename: 'bundle.js',
  	publicPath: '/public/'
  },

  plugins: [
  	new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
  	// new webpack.HotModuleReplacementPlugin(),
  	new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
        'process.env': {
            BROWSER: JSON.stringify(true),
            NODE_ENV: JSON.stringify('production')
        }
    }),
    new ExtractTextPlugin('app.css', {
      allChunks: true
    })
  ],

  sassLoader: {
    data: '@import "theme/_theme.scss";',
    includePaths: [path.resolve(__dirname, './client/css')]
  },

  resolve: {
  	alias: {
  	},
  	extensions: ['', '.js', '.json'],
    modulesDirectories: [
      'node_modules',
      path.resolve(__dirname, './node_modules')
    ]
  },

  module: {
  	loaders: [
  		{
  		  test: /\.js$/,
  		  loader: 'babel',
  		  exclude: /node_modules/,
  		  include: __dirname
  		}, {
        test: /\.scss$/,
        loader: 'style!css?sourceMap&modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!sass',
				include: [
          path.resolve(__dirname, 'node_modules/react-toolbox'),
          path.resolve(__dirname, 'common'),
          path.resolve(__dirname, 'client')
        ]
      }, {
				test: /\.css$/,
				loader: ExtractTextPlugin.extract('style-loader', 'css-loader?modules'),
				include: /flexboxgrid/
			}
  	]
  }
};
