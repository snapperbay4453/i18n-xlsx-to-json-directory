import {
  createTemplateXlsxBlob,
  convertWorkbookJsonToXlsxBlob,
  convertWorkbookJsonToZipBlob,
  convertXlsxArrayBufferToWorkbookJson,
  convertZipArrayBufferToWorkbookJson,
} from '@/utils/sheet';
import {
  convertBlobToArrayBuffer,
  downloadFileViaBrowser,
} from '@/utils/file';
import { formatTimestamp } from '@/utils/datetime';

export const createTemplateXlsx = async () => {
  const xlsxBlob = await createTemplateXlsxBlob();
  await downloadFileViaBrowser(xlsxBlob, `template_i18n_${formatTimestamp()}.xlsx`);
  return xlsxBlob;
};

export const convertXlsxToZip = async (blob: Blob, {
  defaultExportFileType = undefined
} = {}) => {
  const arrayBuffer = await convertBlobToArrayBuffer(blob);
  const workbookJson = await convertXlsxArrayBufferToWorkbookJson(arrayBuffer);
  const zipBlob = await convertWorkbookJsonToZipBlob(workbookJson, { defaultExportFileType });
  await downloadFileViaBrowser(zipBlob, `i18n_${formatTimestamp()}.zip`);
  return zipBlob;
};

export const convertZipToXlsx = async (blob: Blob) => {
  const arrayBuffer = await convertBlobToArrayBuffer(blob);
  const workbookJson = await convertZipArrayBufferToWorkbookJson(arrayBuffer);
  const xlsxBlob = await convertWorkbookJsonToXlsxBlob(workbookJson);
  await downloadFileViaBrowser(xlsxBlob, `i18n_${formatTimestamp()}.xlsx`);
  return xlsxBlob;
};
