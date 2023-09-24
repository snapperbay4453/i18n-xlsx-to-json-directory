import { templateCommonJsonArray, templatePageJsonArray } from '@/assets/template';
import { Workbook, WorkbookJson } from '@/models/workbook';
import { WorksheetJson } from '@/models/worksheet';
import { DEFAULT_COLUMN_NAME } from '@/consts/column';
import { convertArrayBufferToZip } from '@/utils/binary';
import {
  createEmptyWorkbook,
  createWorksheet,
  addWorksheetToWorkbook,
  convertXlsxArrayBufferToWorkbook,
  convertWorkbookToXlsxArrayBuffer,
  convertWorksheetToWorksheetJson,
  iterateWorksheet
} from '@/utils/sheet';
import { getZipBuilder } from '@/utils/zip';
import type { GroupifiedZipFiles, ZipFile } from '@/utils/zip';
import { ArrayBufferToString } from '@/utils/common';

/**
 * Creates index.js content of language directory.
 */
const createLanguageIndexJsString = (languageList: string[]) => {
  let lines = [];
  languageList.forEach((language: string) => lines.push(`import ${language} from './${language}';`));
  lines.push('');
  lines.push(`export { ${languageList.map((language: string) => `${language}`).join(', ')} };`);
  return lines.join('\n');
}

/**
 * Creates index.js content of namespace directory.
 */
const createNamespaceIndexJsString = (namespaceList: string[]) => {
  let lines = [];
  namespaceList.forEach((namespace: string) => lines.push(`import ${namespace} from './${namespace}.json';`));
  lines.push('');
  lines.push(`export { ${namespaceList.map((namespace: string) => `${namespace}`).join(', ')} };`);
  return lines.join('\n');
}

/**
 * Creates xlsx array buffer from template data.
 */
export const createTemplateXlsxArrayBuffer = async () => {
  const workbook: Workbook = createEmptyWorkbook();

  const templateCommonWorksheet = createWorksheet(templateCommonJsonArray);
  const templatePageWorksheet = createWorksheet(templatePageJsonArray);

  addWorksheetToWorkbook(workbook, templateCommonWorksheet, 'common');
  addWorksheetToWorkbook(workbook, templatePageWorksheet, 'page');
  
  const xlsxArrayBuffer = convertWorkbookToXlsxArrayBuffer(workbook);
  return xlsxArrayBuffer;
};

export const convertXlsxArrayBufferToWorkbookJson = async (
  arrayBuffer: ArrayBuffer,
) => {
  const workbook = convertXlsxArrayBufferToWorkbook(arrayBuffer);
  const workbookJson = new WorkbookJson();
  (workbook.SheetNames ?? []).forEach((worksheetName: string) => {
    const worksheet = workbook.Sheets[worksheetName];
    const newWorksheetJson = convertWorksheetToWorksheetJson(worksheet);

    newWorksheetJson.getRecordList().forEach((record: object) => {
      if(!workbookJson.hasWorksheet(worksheetName)) {
        workbookJson.setWorksheetJson(worksheetName, new WorksheetJson());
      }
      
      const key = record[DEFAULT_COLUMN_NAME.key];
      const worksheetJson = workbookJson.getWorksheetJson(worksheetName);
      if(!worksheetJson.hasRecord(key)) worksheetJson.appendRecord(record);
      else worksheetJson.updateRecord(key, record);
    })
  });
  return workbookJson;
};

export const convertWorkbookJsonToXlsxArrayBuffer = async (workbookJson: WorkbookJson) => {
  const worksheetNameList = workbookJson.getWorksheetJsonNameList();
  const workbook: Workbook = createEmptyWorkbook();

  for (const worksheetName of worksheetNameList) {
    const worksheetJson = workbookJson.getWorksheetJson(worksheetName);
    const worksheet = createWorksheet(worksheetJson.getRecordList());
    addWorksheetToWorkbook(workbook, worksheet, worksheetName);
  }

  const xlsxArrayBuffer = convertWorkbookToXlsxArrayBuffer(workbook);
  return xlsxArrayBuffer;
};

export const convertZipArrayBufferToWorkbookJson = async (arrayBuffer: ArrayBuffer) => {
  const getLanguageAndNamespaceFromFilePath = (filePath: string) => {
    const splitedFilePath = filePath.replace(/\.json$/i, '').replace(/\\/g, '/').split('/');
    return {
      language: splitedFilePath[0],
      namespace: splitedFilePath[1],
    };
  };

  const zip = await convertArrayBufferToZip(arrayBuffer);
  const workbookJson = new WorkbookJson();

  const groupifiedZip = Object.values(zip.files).reduce((acc: GroupifiedZipFiles, file: ZipFile) => {
    if(file.dir) acc.directories.push(file);
    else if(file.name.endsWith('.json')) acc.files.push(file);
    return acc;
  }, {
    files: [],
    directories: [],
  });

  for await (const zipFile of groupifiedZip.files) {
    const { namespace } = getLanguageAndNamespaceFromFilePath(zipFile.name);
    if(!workbookJson.hasWorksheet(namespace)) workbookJson.setWorksheetJson(namespace, new WorksheetJson());

    const zipFileData = await zipFile.async('string');
    var parsedZipFileData = JSON.parse(zipFileData);
    
    Object.values(parsedZipFileData).forEach((record: object) => {
      const worksheetJson = workbookJson.getWorksheetJson(namespace);
      worksheetJson.updateRecord(record[DEFAULT_COLUMN_NAME.key], record);
    });
  }

  return workbookJson;
};

export const convertWorkbookJsonToZipArrayBuffer = async (
  workbookJson: WorkbookJson, {
    exportFileType = undefined,
  } = {}
) => {
  const zipBuilder = getZipBuilder();
  const languageList = workbookJson.getWorksheetJsonFieldList({ includeKey: false });

  for(const language of languageList) {
    zipBuilder.folder(language);

    const worksheetJsonNameList = workbookJson.getWorksheetJsonNameList();

    for await (const worksheetArrayBufferIterator of iterateWorksheet(workbookJson)) {
      zipBuilder.folder(language).file(
        `${worksheetArrayBufferIterator.name}.json`,
        worksheetArrayBufferIterator.arrayBuffer
      );
    }

    if(exportFileType) {
      const namespaceIndexArrayBuffer = createNamespaceIndexJsString(worksheetJsonNameList);
      zipBuilder.folder(language).file(`index.${exportFileType}`, namespaceIndexArrayBuffer);
    }
  }

  if(exportFileType) {
    const languageIndexArrayBuffer = createLanguageIndexJsString(languageList);
    zipBuilder.file(`index.${exportFileType}`, languageIndexArrayBuffer);
  }

  const zipArrayBuffer = await zipBuilder.generateAsync({ type: 'arraybuffer' });
  return zipArrayBuffer;
};

export const convertWorkbookJsonToDirectoryDescendantsArrayBufferMap = async (
  workbookJson: WorkbookJson, {
    exportFileType = undefined,
  } = {}
) => {
  const arrayBufferMap = new Map();
  const languageList = workbookJson.getWorksheetJsonFieldList({ includeKey: false });

  for(const language of languageList) {
    const worksheetJsonNameList = workbookJson.getWorksheetJsonNameList();

    for await (const worksheetArrayBufferIterator of iterateWorksheet(workbookJson)) {
      arrayBufferMap.set(
        `/${language}/${worksheetArrayBufferIterator.name}.json`,
        worksheetArrayBufferIterator.arrayBuffer
      );
    }

    if(exportFileType) {
      const namespaceIndexArrayBuffer = createNamespaceIndexJsString(worksheetJsonNameList);
      arrayBufferMap.set(
        `/${language}/index.${exportFileType}`,
        namespaceIndexArrayBuffer
      );
    }
  }

  if(exportFileType) {
    const languageIndexArrayBuffer = createLanguageIndexJsString(languageList);
    arrayBufferMap.set(
      `/index.${exportFileType}`,
      languageIndexArrayBuffer
    );
  }

  return arrayBufferMap;
};

export const convertDirectoryDescendantsArrayBufferMapToWorkbookJson = async (arrayBufferMap: Map<string, ArrayBuffer>) => {
  const getLanguageAndNamespaceFromFilePath = (filePath: string) => {
    const splitedFilePath = filePath.replace(/\.json$/i, '').replace(/\\/g, '/').split('/');
    return {
      language: splitedFilePath[0],
      namespace: splitedFilePath[1],
    };
  };

  const workbookJson = new WorkbookJson();

  for await (const [filePath, arrayBuffer] of arrayBufferMap.entries()) {
    if(!filePath.endsWith('.json')) continue;

    const { namespace } = getLanguageAndNamespaceFromFilePath(filePath);
    if(!workbookJson.hasWorksheet(namespace)) workbookJson.setWorksheetJson(namespace, new WorksheetJson());

    const parsedZipFileData = JSON.parse(ArrayBufferToString(arrayBuffer));
    
    Object.values(parsedZipFileData).forEach((record: object) => {
      const worksheetJson = workbookJson.getWorksheetJson(namespace);
      worksheetJson.updateRecord(record[DEFAULT_COLUMN_NAME.key], record);
    });
  }

  return workbookJson;
};
