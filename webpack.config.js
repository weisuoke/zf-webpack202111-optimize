const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const bootstrap = path.resolve(__dirname, 'node_modules/bootstrap/dist/css/bootstrap.css')
const SpeedMeasureWebpackPlugin = require('speed-measure-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const smw = new SpeedMeasureWebpackPlugin();

module.exports = smw.wrap({
  mode: 'development',
  devtool: false,
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js'
  },
  // 此处用来找普通模块
  resolve: {
    extensions: [".js", ".jsx", ".json"], // 指定要加载的模块的扩展名，尽可能把常用的往前放
    alias: {
      bootstrap
    },
    modules: [path.resolve("node_modules")],  // 指定去哪个目录中查找对应的模块
    mainFields: ['browser', 'module', 'main'],  // package.json 中的main字段
    mainFiles: ['main', 'index']
  },
  // 此处只用来找 loader
  resolveLoader: {

  },
  module: {
    // 不去分析这些模块的依赖，不可能有依赖，所以不去把它转成语法树，分析里面的依赖
    noParse: (moduleName) => {
      return /jquery|lodash/.test(moduleName)
    },
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {}
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    new webpack.IgnorePlugin({
      contextRegExp: /moment$/,  // 忽略 哪个模块
      resourceRegExp: /locale/, // 忽略模块内的哪些资源
    }),
    new BundleAnalyzerPlugin()
  ]
})