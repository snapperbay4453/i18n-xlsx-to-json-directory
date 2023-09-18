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

/*
export const createTemplateWorkbook = _createTemplateWorkbook;

export const convertXlsxToZip = async (blob: Blob, {
  defaultExportFileType = undefined
} = {}) => {
  const xlsx = await convertBlobToXlsx(blob);
  const workbookJson = await convertXlsxToWorkbookJson(xlsx);
  const zip = await convertWorkbookJsonToZip(workbookJson, { defaultExportFileType });
  return zip;
};

export const convertZipToXlsx = async (blob: Blob) => {
  const workbookJson = await convertZipBlobToWorkbookJson(blob);
  const xlsx = await convertWorkbookJsonToXlsx(workbookJson);
  return xlsx;
};
*/
