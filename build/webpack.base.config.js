const path = require('path');
const os = require('os');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HappyPack = require('happypack');
var happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });


function resolve (dir) {
    return path.join(__dirname, dir);
}


module.exports = {
    entry: {
        main: '@/main',
        'vender-base': '@/vendors/vendors.base.js',
        'vender-exten': '@/vendors/vendors.exten.js'
    },
    output: {
        path: path.resolve(__dirname, '../dist'),
    },	
    
	module: {
        rules: [
            { test: /\.vue$/, loader: 'vue-loader', options: {  loaders: {css: 'vue-style-loader!css-loader',less: 'vue-style-loader!css-loader!less-loader'},postLoaders: {html: 'babel-loader'}  } },
            { test: /iview\/.*?js$/, loader: 'happypack/loader?id=happybabel', exclude: /node_modules/ },
            { test: /\.js$/,loader: 'happypack/loader?id=happybabel', exclude: /node_modules/ },			
            { test: /\.js[x]?$/, include: [resolve('src')], exclude: /node_modules/, loader: 'happypack/loader?id=happybabel' }, //include 表示哪些目录中的 .js 文件需要进行 babel-loader
            { test: /\.css$/, use: ExtractTextPlugin.extract({ use: ['css-loader?minimize', 'autoprefixer-loader'], fallback: 'style-loader' })},
            { test: /\.less$/, use: ExtractTextPlugin.extract({ use: ['css-loader?minimize','autoprefixer-loader', 'less-loader'], fallback: 'style-loader' })},
            { test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/, loader: "file-loader?limit=1024&name=img/[hash:8].[name].[ext]" },
            { test: /\.(html|tpl)$/, loader: 'html-loader'}
        ]
    },	
	
    plugins: [
		//new webpack.ProvidePlugin({
			//wx : 'utils/weixin/jweixin-1.0.0.js'
		//}),
        new HappyPack({
            id: 'happybabel',
            loaders: ['babel-loader'],
            threadPool: happyThreadPool,
            verbose: true
        })
    ],
	
    resolve: {
        extensions: ['.js', '.vue'],
        alias: {
            'vue': 'vue/dist/vue.esm.js',
            '@': path.resolve(__dirname, '../src')
        }
    }
};