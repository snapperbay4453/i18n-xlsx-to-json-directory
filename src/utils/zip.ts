import JSZip from 'jszip/dist/jszip';

export interface ZipFile {
  name: string;
  dir: boolean;
  async: (_type: string) => Promise<any>
}
export interface ZipFiles {
  files: ZipFile[];
}
export interface GroupifiedZipFiles {
  files: ZipFile[];
  directories: ZipFile[];
}

export const getZipBuilder = () => new JSZip();
