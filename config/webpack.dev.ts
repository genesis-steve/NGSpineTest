import * as Path from 'path';
import * as Merge from 'webpack-merge';
import * as Common from './webpack.common';

module.exports = Merge( Common, {
	devtool: 'inline-source-map',
	mode: 'none',

	devServer: {
		contentBase: Path.join( __dirname, '../src' ),

		port: 8018,

		host: '127.0.0.1',

		hot: true
	}
} );