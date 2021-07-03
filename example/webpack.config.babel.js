import path from 'path';
import UnusedFilesWebpackPlugin from '../src';

export default {
  entry: path.resolve(__dirname, 'index.js'),
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new UnusedFilesWebpackPlugin({
      excludePaths: ['log'],
      excludePatterns: [/.*excluded-by-pattern.*/],
      failOnUnused: true
    })
  ]
}
