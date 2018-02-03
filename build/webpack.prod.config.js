'use strict'
var path = require('path');
var webpack = require('webpack');
const os = require('os');
const fs = require('fs');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin'); //html模板
const CopyWebpackPlugin = require('copy-webpack-plugin');
const cleanWebpackPlugin = require('clean-webpack-plugin');

const merge = require('webpack-merge');
const webpackBaseConfig = require('./webpack.base.config.js');
 
//const UglifyJsParallelPlugin = require('webpack-uglify-parallel');

//https://github.com/fouber/blog/issues/6
module.exports = merge(webpackBaseConfig, {
	
    output: {
		publicPath: 'dist/',
		//publicPath: 'http://ads.vue.tanwan.com/dist/',
        filename: '[name].js',
        chunkFilename: '[name].chunk.js'
    },
	
	plugins: [
	
		new cleanWebpackPlugin(['dist/*'], {
            root: path.resolve(__dirname, '../')
        }),
		
		//代码压缩
		new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
		
		new ExtractTextPlugin({
            filename: '[name].[hash].css',
            allChunks: true
        }),
		
		new HtmlWebpackPlugin({
			filename: '../index.html',
			template: path.resolve(__dirname, '../src/template/index.html'),
			chunks: ['vender-base','vender-exten','main'],
			inject: 'body',
			title:'贪玩游戏'
		}),	 //http://www.bubuko.com/infodetail-1847157.html
		
		//new webpack.optimize.CommonsChunkPlugin('vendor',  'vendor.js')
	]	
});