'use strict';

const path = require('path');

module.exports = {
    entry: path.resolve(__dirname, 'src/index.js'),
    output: {
        path: path.resolve(__dirname, 'assets'),
        filename: 'bundle.js'
    },
    resolveLoader: {
        modules: ['/usr/share/nodejs', 'node_modules'],
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            }
        ]
    }
};
