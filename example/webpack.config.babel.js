import path from 'path';
import { UnusedFilesWebpackPlugin } from '../dist/index.js';

export default {
  entry: path.resolve(`index.js`),
  output: {
    filename: `index.js`,
    path: path.resolve(`dist`),
  },
  plugins: [
    new UnusedFilesWebpackPlugin({
      excludePaths: [`log`],
      excludePatterns: [/.*excluded-by-pattern.*/],
      failOnUnused: true
    })
  ]
}
