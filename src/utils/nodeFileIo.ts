import { existsSync, readFileSync, mkdirSync, writeFileSync } from 'fs';
import { dirname } from 'path';

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
