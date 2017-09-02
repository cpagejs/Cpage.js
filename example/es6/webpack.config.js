var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {  
    entry: './src/main.js',  
    output: {  
        path:path.join(__dirname,'dist'),  
        filename: 'bundle.js',  
    },  
    module: {  
        loaders: [
            {  
                test: /\.js$/,  
                exclude: /node_modules/,  
                loader: 'babel-loader'
            },
            {  
                test: /\.css$/,  
                exclude: /node_modules/,  
                loader: [ 'css-loader' ]
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
    ]
}  