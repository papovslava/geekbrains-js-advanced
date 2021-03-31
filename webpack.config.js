const { VueLoaderPlugin } = require('vue-loader');
// const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    // path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      // { test: /ignore\.(png|jpg|gif|svg)$/, loader: 'ignore-loader' },
      { 
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader', 
        options: { 
          outputPath: 'img', 
          name: '[name].[ext]' 
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.css$/,
        use: [ 
          'vue-style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.html$/i,
        loader: 'html-loader'
      }
    ]
  },
  plugins: [
    // make sure to include the plugin!
    new VueLoaderPlugin()
  ]
}
