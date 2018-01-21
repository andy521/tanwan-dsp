const path = require('path');
const webpack = require('webpack');
const os = require('os');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const merge = require('webpack-merge');
const webpackBaseConfig = require('./webpack.base.config.js');
const fs = require('fs');
const package = require('../package.json');

const HappyPack = require('happypack');  ////让loader多进程去处理文件。
var happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });

function resolve (dir) {
    return path.join(__dirname, dir);
}

module.exports = merge(webpackBaseConfig, {
    output: {
        path: path.resolve(__dirname, '../dist'),
		publicPath: '/dist/',
        filename: '[name].js',
        chunkFilename: '[name].chunk.js'
    },	
    plugins: [
		//抽离css
        new ExtractTextPlugin({
            filename: '[name].css',
            allChunks: true
        }),
		
		// 打包公共代码
        new webpack.optimize.CommonsChunkPlugin({
            name: ['vender-exten', 'vender-base'],   //给这个包含公共代码的chunk命个名（唯一标识）。
            minChunks: Infinity  //公共代码的判断标准：某个js模块被多少个chunk加载了才算是公共代码。
			// chunks，表示需要在哪些chunk（也可以理解为webpack配置中entry的每一项）里寻找公共代码进行打包。不设置此参数则默认提取范围为所有的chunk。
			// filename，如何命名打包后生产的js文件，也是可以用上[name]、[hash]、[chunkhash]这些变量的
        }),
		
		
        new HtmlWebpackPlugin({
            title: '贪玩游戏后台' + package.version,
            filename: '../index.html',  //输出的 HTML 文件名，默认是 index.html, 也可以直接配置带有子目录。
			// template: 模板文件路径，支持加载器，比如 html!./index.html
			// hash: true | false, 如果为 true, 将添加一个唯一的 webpack 编译 hash 到所有包含的脚本和 CSS 文件，对于解除 cache 很有用。
			// cache: true | false，如果为 true, 这是默认值，仅仅在文件修改之后才会发布文件。
			// showErrors: true | false, 如果为 true, 这是默认值，错误信息会写入到 HTML 页面中
            inject: false //true | 'head' | 'body' | false  ,注入所有的资源到特定的 template 或者 templateContent 中，如果设置为 true 或者 body，所有的 javascript 资源将被放置到 body 元素的底部，'head' 将放置到 head 元素中。
        })	
    ],
});