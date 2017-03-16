import path from 'path';
export default {
  context: __dirname,
  // Don't attempt to continue if there are any errors.
  bail: true,
  entry: {

    app: [
      require.resolve('../config/polyfills'),
      path.resolve(__dirname, './app')
    ]
  },
  module: {
    rules: [
      {
        include: path.resolve(__dirname, './app'),
        loader: 'babel-loader',
        test: /\.js$/
      }
    ]
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, './dist')
  }
};
