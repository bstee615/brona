const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    plugins: [
        new CopyPlugin([
        { from: 'images', to: 'images' },
        { from: 'index.html', to: 'index.html' },
        ]),
    ],
};
