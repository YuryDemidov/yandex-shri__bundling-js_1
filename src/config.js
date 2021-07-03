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
        instanceOf: `RegExp`
      }
    }
  }
}

export const DEFAULT_EXCLUDED_PATHS = [
  `node_modules`,
  `dist`,
  `build`
];

export const DEFAULT_EXCLUDED_PATTERNS = [
  /^package(-lock)?.json$/,
  /^yarn.*\..*/,
  /^\..*/,
  /^webpack.config/,
];
