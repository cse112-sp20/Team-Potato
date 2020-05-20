const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const config = {
  context: __dirname,
  entry: {
    popupRender: './src/popupRender.js',
    menuRender: './src/menuRender.js',
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].bundle.js',
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: [
            '@babel/preset-env',
            '@babel/preset-react',
            {
              plugins: ['@babel/plugin-proposal-class-properties'],
            },
          ],
        },
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        ignore: ['.DS_Store'],
        from: path.resolve(__dirname, 'public'),
        to: path.resolve(__dirname, 'build'),
      },
    ]),
  ],
};

if (process.env.NODE_ENV === 'production') {
  config.entry = path.resolve(__dirname, 'src/popupRender.js');
  config.devtool = false;
}

if (process.env.NODE_ENV === 'test') {
  config.entry = {
    popupRender: './instrumented/popupRender.js',
    menuRender: './instrumented/menuRender.js',
  };
}

module.exports = config;
