module.exports = {
  mode: 'development',
  entry: './src/index.tsx',
  output: {
    filename: 'index.js',
    path: __dirname + '/dist',
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    fallback: {
      os: require.resolve('os-browserify/browser'),
      https: require.resolve('https-browserify'),
      http: require.resolve('stream-http'),
      stream: require.resolve('stream-browserify'),
      crypto: require.resolve('crypto-browserify'),
    },
  },
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react',
              '@babel/preset-typescript',
            ],
          },
        },
      },
      {
        test: /\.css$/i,
        use: ['css-loader'],
        exclude: /node_modules/,
      },
      {
        test: /\.s[ac]ss$/i,
        use: ['css-loader', 'sass-loader'],
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpg)$/,
        use: ['file-loader'],
      },
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader',
      },
    ],
  },
  devServer: {
    port: 8080,
    contentBase: './',
    publicPath: '/dist',
  },
};
