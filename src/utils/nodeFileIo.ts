import { existsSync, readdirSync, readFileSync, mkdirSync, statSync, writeFileSync } from 'fs';
import { dirname, join, relative, resolve } from 'path';

const getDirectoryFilePathListRecursively = (directoryPath: string) => {
  // https://github.com/Stuk/jszip/issues/386
  const list = readdirSync(directoryPath);
  const directoryFilePathList = list.map((file) => {
    const fullPath = resolve(directoryPath, file);
    const _stat = statSync(fullPath);
    if (_stat && _stat.isDirectory()) {
      return getDirectoryFilePathListRecursively(fullPath);
    }
    return fullPath;
  }).flat(Infinity);

  return directoryFilePathList;
};

export const getDirectoryFileArrayBufferMap = async (directoryPath: string) => {
  const directroyFilePathList = getDirectoryFilePathListRecursively(directoryPath);
  const directoryFileMapWithAbsolutePath = new Map();
  directroyFilePathList.forEach((path: string) => {
    let data = readFileSync(path);
    directoryFileMapWithAbsolutePath.set(path, data);
  });
  
  const directoryFileMap= new Map();
  for(const [path, arrayBuffer] of directoryFileMapWithAbsolutePath.entries()) {
    const newPath = relative(join(process.cwd(), directoryPath), path);
    directoryFileMap.set(newPath, arrayBuffer);
  }

  return directoryFileMap;
};

export const readFileViaNode = async (path: string) => {
  const buffer = readFileSync(path).buffer;
  return new Uint8Array(buffer);
};

export const writeFileViaNode = async (path: string, arrayBuffer: ArrayBuffer) => {
  const targetDirectory = dirname(path);
  const isDirectoryExists = existsSync(targetDirectory);
  if(!isDirectoryExists) mkdirSync(targetDirectory, { recursive: true });

  writeFileSync(path, Buffer.from(arrayBuffer));
};
