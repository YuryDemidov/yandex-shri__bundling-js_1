import path from 'path';
import webpack from 'webpack';
import { describe, it, expect } from '@jest/globals';
import { UnusedFilesWebpackPlugin } from '../src';

const EXPECTED_OUTPUT_FILES = [
  `components/component3/index.js`,
  `log/log.txt`,
  `unused-excluded-by-pattern.js`
];

const config = {
  entry: path.resolve(`example`, `index.js`),
  output: {
    filename: `index.js`,
    path: path.resolve(`example`, `dist`),
  },
  context: path.resolve(`example`),
  mode: `production`
};

describe(`UnusedFilesWebpackPlugin module`, () => {
  it(
    `Should show only unused files`,
    done => {
      config.plugins = [new UnusedFilesWebpackPlugin()];
      const compiler = webpack(config);

      compiler.run((error, stats) => {
        expect(error).toBeFalsy();

        const [unusedFilesError] = stats.compilation.warnings;
        const { message } = unusedFilesError;
        const markedFiles = message.split(`\n`).slice(2);

        expect(markedFiles).toEqual(EXPECTED_OUTPUT_FILES);

        compiler.close((closeErr) => {
          closeErr && console.log(closeErr);
        });

        done();
      });
    },
    10000
  );

  it(
    `Should show warning when failOnUnused is set to false`,
    done => {
      config.plugins = [new UnusedFilesWebpackPlugin()];
      const compiler = webpack(config);

      compiler.run((error, stats) => {
        expect(error).toBeFalsy();

        const { warnings } = stats.compilation;
        expect(warnings).toHaveLength(1);

        const [unusedFilesError] = warnings;
        expect(unusedFilesError).toBeInstanceOf(Error);
        expect(/UnusedFilesWebpackPlugin/.test(unusedFilesError.message)).toBeTruthy();

        compiler.close((closeErr) => {
          closeErr && console.log(closeErr);
        });

        done();
      });
    },
    10000
  );

  it(
    `Should raise the error when failOnUnused is set to true`,
    done => {
      config.plugins = [new UnusedFilesWebpackPlugin({ failOnUnused: true })];
      const compiler = webpack(config);

      compiler.run((error, stats) => {
        expect(error).toBeFalsy();

        const { errors } = stats.compilation;
        expect(errors).toHaveLength(1);

        const [unusedFilesError] = errors;
        expect(unusedFilesError).toBeInstanceOf(Error);
        expect(/UnusedFilesWebpackPlugin/.test(unusedFilesError.message)).toBeTruthy();

        compiler.close((closeErr) => {
          closeErr && console.log(closeErr);
        });

        done();
      });
    },
    10000
  );

  it(
    `Should work properly when excludePaths option is set`,
    done => {
      config.plugins = [new UnusedFilesWebpackPlugin({ excludePaths: [`log`] })];
      const compiler = webpack(config);

      compiler.run((error, stats) => {
        expect(error).toBeFalsy();

        const [unusedFilesError] = stats.compilation.warnings;
        const { message } = unusedFilesError;
        const markedFiles = message.split(`\n`).slice(2);

        expect(markedFiles).toEqual(EXPECTED_OUTPUT_FILES.filter((file, i) => i !== 1));

        compiler.close((closeErr) => {
          closeErr && console.log(closeErr);
        });

        done();
      });
    },
    10000
  );

  it(
    `Should work properly when excludePatterns option is set`,
    done => {
      config.plugins = [new UnusedFilesWebpackPlugin({ excludePatterns: [/.*excluded-by-pattern.*/] })];
      const compiler = webpack(config);

      compiler.run((error, stats) => {
        expect(error).toBeFalsy();

        const [unusedFilesError] = stats.compilation.warnings;
        const { message } = unusedFilesError;
        const markedFiles = message.split(`\n`).slice(2);

        expect(markedFiles).toEqual(EXPECTED_OUTPUT_FILES.filter((file, i) => i !== 2));

        compiler.close((closeErr) => {
          closeErr && console.log(closeErr);
        });

        done();
      });
    },
    10000
  );
});
