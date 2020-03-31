const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin'); //*打包生成html文件 并且可以自动引入文件*
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
module.exports = {
    mode: 'development',
    entry: {
        app: './src/index.js',
        print: './src/print.js'
    }, //入口
    // devtool: 'inline-source-map',
    devServer: {
        contentBase: './dist'
    },
    output: { //出口
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [{
            test: /.css$/,
            use: ["style-loader", "css-loader"]
        }, {
            test: /\.(png|svg|jpg|gif)$/,
            use: [
                'file-loader'
            ]
        }, {
            test: /\.(woff|woff2|eot|ttf|otf)$/,
            use: [
                'file-loader'
            ]
        }]
    },
    plugins: [ //打包生成html文件 并且可以自动引入文件
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({ title: "管理输出" })
    ]
}