import path from 'path';
import { stat, writeFile } from 'fs/promises';
import { validate } from 'schema-utils';
import { DEFAULT_EXCLUDED_PATHS, DEFAULT_EXCLUDED_PATTERNS, DEFAULT_LOG_FILE, SCHEMA } from './config';
import getAllFiles from './utils/getAllFiles';

export class UnusedFilesWebpackPlugin {
  constructor(options= {}) {
    validate(SCHEMA, options);

    this.options = {
      failOnUnused: options.failOnUnused || false,
      excludePaths: [...DEFAULT_EXCLUDED_PATHS, ...(options.excludePaths || [])],
      excludePatterns: [...DEFAULT_EXCLUDED_PATTERNS, ...(options.excludePatterns || [])],
      logFile: ((options.logFile && options.logFile !== true) || options.logFile === false)
        ? options.logFile
        : DEFAULT_LOG_FILE
    };
  }

  apply(compiler) {
    compiler.hooks.afterEmit.tapPromise(`UnusedFilesWebpackPlugin`, async compilation => {
      try {
        const [allProjectFiles, usedFiles] = await Promise.all([
          this.getAllProjectFiles(compiler),
          this.getUsedFiles(compilation)
        ]);

        const unusedFiles = this.getUnusedFiles(compiler, allProjectFiles, usedFiles);

        if (unusedFiles.length !== 0) {
          this.options.logFile && await this.writeFilesToJson(compiler, unusedFiles);

          throw new Error(`UnusedFilesWebpackPlugin
There are some files which was not included in your final bundle, check them out:
${unusedFiles.join(`\n`)}`
          );
        }
      } catch (error) {
        if (this.options.failOnUnused && compilation.bail) {
          throw error;
        }
        const errorsList = this.options.failOnUnused ? compilation.errors : compilation.warnings;
        errorsList.push(error);
      }
    });
  }

  async getAllProjectFiles(compiler) {
    const excludedPaths = this.options.excludePaths.map(excludedPath => {
      return path.join(compiler.context, excludedPath);
    });

    return await getAllFiles(compiler.context, excludedPaths, this.options.excludePatterns);
  }

  async getUsedFiles(compilation) {
    const usedFiles = new Set();
    const dependencies = [...compilation.fileDependencies];

    for (let i = 0; i < dependencies.length; i++) {
      const fileStats = await stat(dependencies[i]);
      if (!fileStats.isDirectory()) {
        usedFiles.add(dependencies[i]);
      }
    }

    return usedFiles;
  }

  getUnusedFiles(compiler, allProjectFiles, usedFiles) {
    const unusedFiles = [];

    for (let i = 0; i < allProjectFiles.length; i++) {
      if (!usedFiles.has(allProjectFiles[i])) {
        unusedFiles.push(path.relative(compiler.context, allProjectFiles[i]));
      }
    }

    return unusedFiles;
  }

  async writeFilesToJson(compiler, files) {
    try {
      await writeFile(path.join(compiler.context, this.options.logFile), JSON.stringify(files));
    } catch (error) {
      if (error) {
        console.log(error);
      }
    }
  }
}
