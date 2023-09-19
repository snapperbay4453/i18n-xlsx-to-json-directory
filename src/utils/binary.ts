import { getZipBuilder } from './zip';

export const convertBlobToArrayBuffer = async (
  blob: Blob,
) => {
  const promise: (() => Promise<ArrayBuffer>) = () => new Promise((resolve, reject) => {
    try {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(blob);
      fileReader.onload = async (event) => {
        if (!event.target) reject(event);
        const arrayBuffer = event.target.result as ArrayBuffer;
        resolve(arrayBuffer);
      };
    } catch(error) {
      reject(error);
    }
  });
  const result = await promise();
  return result;
};
export const convertArrayBufferToBlob = async (
  arrayBuffer: ArrayBuffer
) => {
  return new Blob([arrayBuffer], { type: 'application/octet-stream' });
};

export const convertArrayBufferToZip = async (arrayBuffer: ArrayBuffer) => {
  const zipBuilder = getZipBuilder();
  const zip = await zipBuilder.loadAsync(arrayBuffer);
  return zip;
};
