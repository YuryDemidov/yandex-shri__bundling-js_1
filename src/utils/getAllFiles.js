import path from 'path';
import { readdir } from 'fs/promises';

export default async function getAllFiles(dirPath, excludedPaths, excludedPatterns, filesArray = []) {
  for (let i = 0; i < excludedPaths.length; i++) {
    if (dirPath.includes(excludedPaths[i])) {
      return filesArray;
    }
  }

  try {
    const files = await readdir(dirPath, { withFileTypes: true });

    for (let i = 0; i < files.length; i++) {
      const filePath = path.join(dirPath, files[i].name);

      if (files[i].isDirectory()) {
        filesArray = await getAllFiles(filePath, excludedPaths, excludedPatterns, filesArray);
      } else {
        const isFileExcluded = excludedPatterns.some(regexp => {
          if (!regexp.test) {
            throw new Error(`1`);
          }
          return regexp.test(path.relative(dirPath, filePath));
        });

        if (excludedPaths.indexOf(filePath) === -1 && !isFileExcluded) {
          filesArray.push(filePath);
        }
      }
    }

    return filesArray;
  } catch (error) {
    if (error.message === `1`) {
      throw new Error(`UnusedFilesWebpackPlugin. Invalid options object. UnusedFilesWebpackPlugin has been initialized using an options object that does not match the API schema.
      - options.excludedPatterns should be an array of RegExps`)
    }
    console.error(error);
  }
}
