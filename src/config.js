export const SCHEMA = {
  type: `object`,
  title: `UnusedFilesWebpackPlugin options`,
  properties: {
    failOnUnused: {
      type: `boolean`
    },
    excludePaths: {
      type: `array`,
      items: {
        type: `string`,
        minLength: 1
      }
    },
    excludePatterns: {
      type: `array`,
      items: {
        instanceof: `RegExp`
      }
    },
    logFile: {
      anyOf: [
        { type: `string` },
        { type: `boolean` }
      ]
    }
  }
}

export const DEFAULT_LOG_FILE = 'unused.json';

export const DEFAULT_EXCLUDED_PATHS = [
  `node_modules`,
  `dist`,
  `build`,
  DEFAULT_LOG_FILE
];

export const DEFAULT_EXCLUDED_PATTERNS = [
  /^package(-lock)?.json$/,
  /^yarn.*\..*/,
  /^\..*/,
  /^webpack.config/,
];
