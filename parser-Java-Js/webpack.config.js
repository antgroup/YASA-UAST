module.exports = {
  entry: './src/main.ts',
  mode: 'production',
  output: {
    path: `${__dirname}/dist`,
    filename: 'bundle.js',
  },
  target: ['web', 'es5'],
  module: {
    rules: [
      {
        test: /\.(js|jsx|tsx|ts)$/,
        // exclude: /node_modules/,
        use: ['babel-loader', 'ts-loader']
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
};
