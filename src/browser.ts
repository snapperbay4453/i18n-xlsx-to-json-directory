import {
  createTemplateXlsxArrayBuffer,
  convertWorkbookJsonToXlsxArrayBuffer,
  convertWorkbookJsonToZipArrayBuffer,
  convertXlsxArrayBufferToWorkbookJson,
  convertZipArrayBufferToWorkbookJson,
} from '@/services/sheet';
import {
  writeFileViaBrowser,
} from '@/utils/browserFileIo';
import {
  convertArrayBufferToBlob,
  convertBlobToArrayBuffer,
} from '@/utils/binary';
import { formatTimestamp } from '@/utils/datetime';

export const convertXlsxToJsonZip = async (blob: Blob, {
  exportFileType = undefined
} = {}) => {
  const arrayBuffer = await convertBlobToArrayBuffer(blob);
  const workbookJson = await convertXlsxArrayBufferToWorkbookJson(arrayBuffer);
  const zipArrayBuffer = await convertWorkbookJsonToZipArrayBuffer(workbookJson, { exportFileType });
  const zipBlob = await convertArrayBufferToBlob(zipArrayBuffer);
  await writeFileViaBrowser(zipBlob, `i18n_${formatTimestamp()}.zip`);
  return zipBlob;
};

export const convertJsonZipToXlsx = async (blob: Blob) => {
  const arrayBuffer = await convertBlobToArrayBuffer(blob);
  const workbookJson = await convertZipArrayBufferToWorkbookJson(arrayBuffer);
  const xlsxArrayBuffer = await convertWorkbookJsonToXlsxArrayBuffer(workbookJson);
  const xlsxBlob = await convertArrayBufferToBlob(xlsxArrayBuffer);
  await writeFileViaBrowser(xlsxBlob, `i18n_${formatTimestamp()}.xlsx`);
  return xlsxBlob;
};

export const createTemplateXlsx = async () => {
  const xlsxArrayBuffer = await createTemplateXlsxArrayBuffer();
  const xlsxBlob = await convertArrayBufferToBlob(xlsxArrayBuffer);
  await writeFileViaBrowser(xlsxBlob, `template_i18n_${formatTimestamp()}.xlsx`);
  return xlsxBlob;
};
