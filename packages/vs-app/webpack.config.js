const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
mode: 'development',
  entry: './src/index.tsx',
  optimization: {
    minimize: false
  },
  output: {
    filename: 'js/[name].bundle.js'
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx']
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        loader: 'ts-loader'
      },
      { enforce: "pre", test: /\.js$/, use: ["source-map-loader"] },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'Development',
      template: 'index.html'
    }),
    new CopyPlugin({patterns: [
      {
        from: 'node_modules/@mp/bundle-sdk',
        to: 'bundle'
      },
      { from: 'assets', to: 'assets'}
    ]}),
  ],
  devServer: {
    port: 8000,
    devMiddleware: {
      writeToDisk: true
    }
  }
}
