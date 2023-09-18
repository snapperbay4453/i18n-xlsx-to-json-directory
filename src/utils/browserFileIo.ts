import { saveAs } from 'file-saver-es';

export const writeFileViaBrowser = async (blob: Blob, blobFilename: string) => {
  await saveAs(blob, blobFilename);
};
