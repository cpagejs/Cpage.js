var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
const resolve = dir => path.resolve(__dirname, dir);

module.exports = {  
    entry: './src/index.js',  
    output: {  
        path:path.join(__dirname,'dist'),  
        filename: 'bundle.js',  
    },  
    module: {  
        rules: [
            {  
                test: /\.js$/,  
                exclude: /node_modules/,  
                loader: 'babel-loader'
            },
            {  
                test: /\.css$/,  
                exclude: /node_modules/,  
                loader: 'css-loader'
            },
            {  
                test: /\.html$/,  
                exclude: /node_modules/,  
                loader: 'html-loader'
            }
        ]  
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'My App',
            template: './src/index.html'
        })
    ],
    resolve: {
        alias: {
            '@': resolve('src'),
            'capge': resolve('bundle/bundle.js')
        }
    },
    devServer: {
        port: 8080,
        open: true
    },
}  