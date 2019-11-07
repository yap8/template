const path = require('path');
const webpack = require('webpack');

module.exports = {
	output: {
		filename: 'main.js',
		path: path.resolve(__dirname, 'src/js'),
	},
	mode: 'development',
	module: {
		rules: [
			{
				test: /\.m?js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env']
					}
				}
			}
		]
	}
};