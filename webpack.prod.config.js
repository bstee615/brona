const CopyPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

module.exports = {
    mode: 'production',
    output: {
      path: path.join(__dirname, 'public'),
      filename: 'main.js',
      publicPath: '/public/'
    },
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
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
    },
    plugins: [
        new CopyPlugin([
        { from: 'images', to: 'images' },
        { from: 'index.html', to: 'index.html' },
        ]),
        new webpack.DefinePlugin({
          'process.env': {
            'BASE_URL': JSON.stringify('http://benjijang.com/brona/public'),
            'NODE_ENV': JSON.stringify('production')
          }
        })
    ],
    devtool: 'inline-source-map',
};