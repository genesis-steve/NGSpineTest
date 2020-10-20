import * as Path from 'path';
import * as HtmlPlugin from 'html-webpack-plugin';
import * as CopyWebpackPlugin from 'copy-webpack-plugin';
import * as ImageminPlugin from 'imagemin-webpack-plugin';

module.exports = {
	context: Path.join( __dirname, '../src' ),
	entry: [ './main.ts' ],
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
		],
	},
	resolve: {
		extensions: [ '.tsx', '.ts', '.js' ],
	},
	output: {
		filename: 'bundle.js',
		path: Path.resolve( __dirname, 'dist' ),
	},
	target: 'web',

	plugins: [
		new CopyWebpackPlugin( [
			{ from: 'assets/', to: 'assets/' }
		], {
			ignore: [],
			debug: 'debug',
			copyUnmodified: true
		} ),
		new ImageminPlugin.default( {
			test: /\.(jpe?g|png|gif|svg)$/i,
			pngquant: {
				verbose: true,
				quality: '80-90',
			}
		} )
		, new HtmlPlugin( {
			file: Path.join( __dirname, 'dist', 'index.html' ),
			template: './index.html'
		} )
	]
};