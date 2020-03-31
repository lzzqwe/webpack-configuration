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

## 开发环境

 在开始前，我们先将 [`mode` 设置为 `'development'`](https://webpack.docschina.org/concepts/mode/#mode-development)。 

 webpack.config.js

```
const path = require('path');
  const HtmlWebpackPlugin = require('html-webpack-plugin');
  const CleanWebpackPlugin = require('clean-webpack-plugin');

  module.exports = {
+   mode: 'development',
    entry: {
      app: './src/index.js',
      print: './src/print.js'
    },
    plugins: [
      new CleanWebpackPlugin(['dist']),
      new HtmlWebpackPlugin({
        title: '开发环境'
      })
    ],
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist')
    }
  };
```

 使用 source map 

当 webpack 打包源代码时，可能会很难追踪到 error(错误) 和 warning(警告) 在源代码中的原始位置。例如，如果将三个源文件（`a.js`, `b.js` 和 `c.js`）打包到一个 bundle（`bundle.js`）中，而其中一个源文件包含一个错误，那么堆栈跟踪就会直接指向到 `bundle.js`。你可能需要准确地知道错误来自于哪个源文件，所以这种提示这通常不会提供太多帮助。

为了更容易地追踪 error 和 warning，JavaScript 提供了 [source map](http://blog.teamtreehouse.com/introduction-source-maps) 功能，可以将编译后的代码映射回原始源代码。如果一个错误来自于 `b.js`，source map 就会明确的告诉你。

source map 有许多 [可用选项](https://webpack.docschina.org/configuration/devtool)，请务必仔细阅读它们，以便可以根据需要进行配置。

对于本指南，我们将使用 `inline-source-map` 选项，这有助于解释说明示例意图（此配置仅用于示例，不要用于生产环境）：

 webpack.config.js

```
const path = require('path');
  const HtmlWebpackPlugin = require('html-webpack-plugin');
  const CleanWebpackPlugin = require('clean-webpack-plugin');

  module.exports = {
    mode: 'development',
    entry: {
      app: './src/index.js',
      print: './src/print.js'
    },
+   devtool: 'inline-source-map',
    plugins: [
      new CleanWebpackPlugin(['dist']),
      new HtmlWebpackPlugin({
        title: 'Development'
      })
    ],
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist')
    }
  };
```

### 选择一个开发工具

在每次编译代码时，手动运行 `npm run build` 会显得很麻烦。

webpack 提供几种可选方式，帮助你在代码发生变化后自动编译代码：

1. webpack watch mode(webpack 观察模式)
2. webpack-dev-server
3. webpack-dev-middleware

多数场景中，你可能需要使用 `webpack-dev-server`，但是不妨探讨一下以上的所有选项。

-  使用 watch mode(观察模式)  监控打包模式

  你可以指示 webpack "watch" 依赖图中所有文件的更改。如果其中一个文件被更新，代码将被重新编译，所以你不必再去手动运行整个构建。

  我们添加一个用于启动 webpack watch mode 的 npm scripts：

  **package.json**

  ```
  {
      "name": "development",
      "version": "1.0.0",
      "description": "",
      "main": "webpack.config.js",
      "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1",
  +     "watch": "webpack --watch",
        "build": "webpack"
      },
      "keywords": [],
      "author": "",
      "license": "ISC",
      "devDependencies": {
        "clean-webpack-plugin": "^0.1.16",
        "css-loader": "^0.28.4",
        "csv-loader": "^2.1.1",
        "file-loader": "^0.11.2",
        "html-webpack-plugin": "^2.29.0",
        "style-loader": "^0.18.2",
        "webpack": "^3.0.0",
        "xml-loader": "^1.2.1"
      }
    }
  ```

  