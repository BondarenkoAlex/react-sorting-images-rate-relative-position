'use strict';

const NODE_ENV          = process.env.NODE_ENV || 'development';
//const webpack = require('webpack');
const path              = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');


module.exports = {
    devtool: "cheap-inline-module-source-map",
    context: path.resolve(__dirname, './src'),
    entry  : {
        index: "./js/index"
    },
    output : {
        path      : path.resolve(__dirname, './dist'),
        publicPath: '/', //   /js/app.js //интернет путь к нашей сборкое, возможен вариант с http:\\... в конце слеш обязателен
        filename  : "[name].js",
        //library: "[name]" //модуль, который мы собираем поместится в эту переменную, чтобы можно было использовать его где-то еще
        //chunks: ["./home", "./about"] //только из этих модулей выносить общую часть
    },
    devServer: {
        contentBase: './dist',
        outputPath: path.resolve(__dirname, 'dist'),
    },
/*    resolve: {
        root: [
            path.resolve(__dirname),
        ],
        modulesDirectories: [
            'node_modules'
        ]
    },*/
    module : {
        loaders: [
            {
                test   : /\.js$/,
                exclude: /node_modules/,
                loaders: ['babel-loader'],
            },{
                test: /\.css$/,
                exclude: /node_modules/,
                //loader: ExtractTextPlugin.extract('style', 'css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!resolve-url-loader')

                loader: ExtractTextPlugin.extract('style', 'css!resolve-url-loader')
            },{
                test: /\.(jpe?g|jpg|png|gif|svg)$/i,
                exclude: /node_modules/,
                loaders: [
                    'file?name=[path][name].[ext]'/*,
                    'image-webpack?name=[path][name].[ext]&bypassOnDebug&optimizationLevel=7&interlaced=false'*/
                ]
            }
        ],
    },
    plugins: [
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, './src/*.html'),
                to: path.resolve(__dirname, './dist/[name].[ext]' )
            }
        ], {
            // By default, we only copy modified files during
            // a watch or webpack-dev-server build. Setting this
            // to `true` copies all files.
            copyUnmodified: false
        }),
        new ExtractTextPlugin('styles.css', {
            allChunks: true
        }),
        /*new CleanWebpackPlugin(['dist'], {
            root: path.resolve(__dirname)
        })*/
    ]

};