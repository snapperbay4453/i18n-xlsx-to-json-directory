import {
  createTemplateXlsxArrayBuffer,
  convertWorkbookJsonToXlsxArrayBuffer,
  convertWorkbookJsonToZipArrayBuffer,
  convertXlsxArrayBufferToWorkbookJson,
  convertZipArrayBufferToWorkbookJson,
} from '@/utils/sheet';
import {
  writeFileViaBrowser,
} from '@/utils/browserFileIo';
import {
  convertArrayBufferToBlob,
  convertBlobToArrayBuffer,
} from '@/utils/binary';
import { formatTimestamp } from '@/utils/datetime';

export const createTemplateXlsx = async () => {
  const xlsxArrayBuffer = await createTemplateXlsxArrayBuffer();
  const xlsxBlob = await convertArrayBufferToBlob(xlsxArrayBuffer);
  await writeFileViaBrowser(xlsxBlob, `template_i18n_${formatTimestamp()}.xlsx`);
  return xlsxBlob;
};

export const convertXlsxToZip = async (blob: Blob, {
  defaultExportFileType = undefined
} = {}) => {
  const arrayBuffer = await convertBlobToArrayBuffer(blob);
  const workbookJson = await convertXlsxArrayBufferToWorkbookJson(arrayBuffer);
  const zipArrayBuffer = await convertWorkbookJsonToZipArrayBuffer(workbookJson, { defaultExportFileType });
  const zipBlob = await convertArrayBufferToBlob(zipArrayBuffer);
  await writeFileViaBrowser(zipBlob, `i18n_${formatTimestamp()}.zip`);
  return zipBlob;
};

export const convertZipToXlsx = async (blob: Blob) => {
  const arrayBuffer = await convertBlobToArrayBuffer(blob);
  const workbookJson = await convertZipArrayBufferToWorkbookJson(arrayBuffer);
  const xlsxArrayBuffer = await convertWorkbookJsonToXlsxArrayBuffer(workbookJson);
  const xlsxBlob = await convertArrayBufferToBlob(xlsxArrayBuffer);
  await writeFileViaBrowser(xlsxBlob, `i18n_${formatTimestamp()}.xlsx`);
  return xlsxBlob;
};
