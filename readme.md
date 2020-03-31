## 起步

[ES2015](https://babel.docschina.org/docs/en/learn/) 中的 [`import`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) 和 [`export`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export) 语句已经被标准化，并且 [多数浏览器已经能够支持](https://caniuse.com/#search=modules)。一些旧版本浏览器虽然无法支持它们，但是通过 webpack 开箱即用的模块支持，我们也可以使用这些ES2015 模块标准。

在幕后，webpack 实际上会将代码进行 transpile(转译)，因此旧版本浏览器也可以执行。如果检查 `dist/main.js`，你就可以看到 webpack 是如何实现，这是独创精巧的设计！除了 `import` 和 `export`，webpack 还能够很好地支持各种其他模块语法，更多信息请查看 [模块 API](https://webpack.docschina.org/api/module-methods)。

注意，webpack 不会更改代码中除 `import` 和 `export` 语句以外的部分。如果你在使用其它 [ES2015 特性](http://es6-features.org/)，请确保你在 webpack [loader 系统](https://webpack.docschina.org/concepts/loaders/) 中使用了一个像是 [Babel](https://babel.docschina.org/) 或 [Bublé](https://buble.surge.sh/guide/) 的 [transpiler(转译器)](https://webpack.docschina.org/loaders/#transpiling)。

## 管理资源

1. 加载css  

    为了在 JavaScript 模块中 `import` 一个 CSS 文件，你需要安装 [style-loader](https://webpack.docschina.org/loaders/style-loader) 和 [css-loader](https://webpack.docschina.org/loaders/css-loader)，并在 [`module` 配置](https://webpack.docschina.org/configuration/module) 中添加这些 loader： 

   ```
   npm install --save-dev style-loader css-loader
   ```

    webpack.config.js

   ```
   const path = require('path')
   module.exports = {
       entry: './src/index.js', //入口
       output: { //出口
           filename: 'bundle.js',
           path: path.resolve(__dirname, 'dist')
       },
       module: {
           rules: [{//css-loader配置
               test: /.css$/,
               use: ["style-loader", "css-loader"]
           }]
       }
   }
   ```

2. 加载image图片 

   ```
   npm install --save-dev file-loader
   ```

    webpack.config.js

   ```
   const path = require('path');
   
     module.exports = {
       entry: './src/index.js',
       output: {
         filename: 'bundle.js',
         path: path.resolve(__dirname, 'dist')
       },
       module: {
         rules: [
           {
             test: /\.css$/,
             use: [
               'style-loader',
               'css-loader'
             ]
           },
   +       {
   +         test: /\.(png|svg|jpg|gif)$/,
   +         use: [
   +           'file-loader'
   +         ]
   +       }
         ]
       }
     };
   ```

3. 加载fonts字体

    webpack.config.js

   ```
   const path = require('path')
   module.exports = {
       entry: './src/index.js', //入口
       output: { //出口
           filename: 'bundle.js',
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
           }, {//加载字体
               test: /\.(woff|woff2|eot|ttf|otf)$/,
               use: [
                   'file-loader'
               ]
           }]
       }
   }
   ```

## 管理输出

1.  设置 HtmlWebpackPlugin （*打包生成html文件 并且可以自动引入文件*）

    首先安装插件，并且调整 `webpack.config.js` 文件： 

   ```
   npm install --save-dev html-webpack-plugin
   ```

    webpack.config.js

   ```
   const path = require('path');
   + const HtmlWebpackPlugin = require('html-webpack-plugin');
   
     module.exports = {
       entry: {
         app: './src/index.js',
         print: './src/print.js'
       },
   +   plugins: [
   +     new HtmlWebpackPlugin({
   +       title: '管理输出'
   +     })
   +   ],
       output: {
         filename: '[name].bundle.js',
         path: path.resolve(__dirname, 'dist')
       }
     };
   ```

    在我们构建之前，你应该了解，虽然在 `dist/` 文件夹我们已经有了 `index.html` 这个文件，然而 `HtmlWebpackPlugin` 还是会默认生成它自己的 `index.html` 文件。也就是说，它会用新生成的 `index.html` 文件，替换我们的原有文件。我们看下执行 `npm run build` 后会发生什么： 

   ```
   ...
              Asset       Size  Chunks                    Chunk Names
    print.bundle.js     544 kB       0  [emitted]  [big]  print
      app.bundle.js    2.81 kB       1  [emitted]         app
         index.html  249 bytes          [emitted]
   ...
   ```

    如果在代码编辑器中打开 `index.html`，你会看到 `HtmlWebpackPlugin` 创建了一个全新的文件，所有的 bundle 会自动添加到 html 中。

2.  清理-dist-文件夹 

   [`clean-webpack-plugin`](https://www.npmjs.com/package/clean-webpack-plugin) 是一个流行的清理插件，安装和配置它。

   ```
   npm install --save-dev clean-webpack-plugin
   ```

    webpack.config.js

   ```
   const path = require('path');
     const HtmlWebpackPlugin = require('html-webpack-plugin');
   + const CleanWebpackPlugin = require('clean-webpack-plugin');
   
     module.exports = {
       entry: {
         app: './src/index.js',
         print: './src/print.js'
       },
       plugins: [
   +     new CleanWebpackPlugin(),
         new HtmlWebpackPlugin({
           title: '管理输出'
         })
       ],
       output: {
         filename: '[name].bundle.js',
         path: path.resolve(__dirname, 'dist')
       }
     };
   ```

    现在，执行 `npm run build`，检查 `/dist` 文件夹。如果一切顺利，现在只会看到构建后生成的文件，而没有旧文件！ 