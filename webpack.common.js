 const path = require('path');
 const VueLoaderPlugin = require('vue-loader/lib/plugin')

 const HtmlWebpackPlugin = require('html-webpack-plugin');

 module.exports = {
     entry: {
         app: './src/main.js'
     },
     plugins: [
         new HtmlWebpackPlugin({
             template: path.join(__dirname, './src/index.html'), // 指定模板文件路径
             filename: 'index.html' // 设置生成的内存页面的名称
         }),
         // 请确保引入这个插件！
         new VueLoaderPlugin()
     ],
     output: {
         filename: '[name].bundle.js',
         path: path.resolve(__dirname, 'dist')
     },
     resolve: {
         alias: {
             common: path.resolve(__dirname, 'src/common/'),
             components: path.resolve(__dirname, 'src/components/'),
             base: path.resolve(__dirname, 'src/base/'),
             api: path.resolve(__dirname, 'src/api/')
         }
     },
     module: {
         rules: [{
             test: /\.js$/,
             loader: 'babel-loader',
             exclude: file => (
                 /node_modules/.test(file) &&
                 !/\.vue\.js/.test(file)
             )
         }, {
             test: /\.(woff|woff2|eot|ttf|otf)$/,
             use: [
                 'file-loader'
             ]
         }, {
             test: /\.vue$/,
             loader: 'vue-loader'
         }]
     },
 };