import {
  createTemplateXlsxBlob,
  convertWorkbookJsonToXlsxBlob,
  convertWorkbookJsonToZipBlob,
  convertXlsxBlobToWorkbookJson,
  convertZipBlobToWorkbookJson,
} from '@/utils/sheet';
import {
  convertBlobToZipBlob,
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
  const workbookJson = await convertXlsxBlobToWorkbookJson(blob);
  const zipBlob = await convertWorkbookJsonToZipBlob(workbookJson, { defaultExportFileType });
  await downloadFileViaBrowser(zipBlob, `i18n_${formatTimestamp()}.zip`);
  return zipBlob;
};

export const convertZipToXlsx = async (blob: Blob) => {
  const zipBlob = await convertBlobToZipBlob(blob);
  const workbookJson = await convertZipBlobToWorkbookJson(zipBlob);
  const xlsxBlob = await convertWorkbookJsonToXlsxBlob(workbookJson);
  await downloadFileViaBrowser(xlsxBlob, `i18n_${formatTimestamp()}.xlsx`);
  return xlsxBlob;
};
