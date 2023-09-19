import * as XLSX from 'xlsx';
import { templateCommonJsonArray, templatePageJsonArray } from '@/assets/template';
import { Workbook, WorkbookJson } from '@/models/workbook';
import { Worksheet, WorksheetJson } from '@/models/worksheet';
import { DEFAULT_COLUMN_NAME } from '@/consts/column';
import { getByteSize, stringToArrayBuffer } from './common';
import { convertArrayBufferToZip } from './binary';
import { getZipBuilder } from './zip';
import type { GroupifiedZipFiles, ZipFiles, ZipFile } from './zip';

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
 * Calculates worksheet column width based on worksheet data.
 */
export const autoFitWorksheetColumnWidth = (worksheet: Worksheet) => {
  // https://github.com/SheetJS/sheetjs/issues/1473#issuecomment-1291746676
  const [startLetter, endLetter] = worksheet['!ref']?.replace(/\d/, '').split(':')!;
  let numRegexp = new RegExp(/\d+$/g);
  let start = startLetter.charCodeAt(0), end = endLetter.charCodeAt(0) + 1, rows = +numRegexp.exec(endLetter)[0];
  let ranges: number[] = [];

  for(let i = start; i < end; i++) {
    ranges.push(i);
  }
  
  let objectMaxLength = [];
  ranges.forEach((c) => {
    const cell = String.fromCharCode(c);
    let maxCellLength = 0;
    for(let y = 1; y <= rows; y++) {
      let cellLength = getByteSize(worksheet[`${cell}${y}`].v) + 2;
      if(cellLength > maxCellLength) {
        maxCellLength = cellLength;
      }
    }
    objectMaxLength.push({ width: maxCellLength });
  });
  
  worksheet['!cols'] = objectMaxLength;
}

export const createEmptyWorkbook = () => {
  return XLSX.utils.book_new();
};

export const createWorksheet = (json: object[]) => {
  return XLSX.utils.json_to_sheet(json);
};

export const addWorksheetToWorkbook = (workbook: Workbook, worksheet: Worksheet, worksheetName: string) => {
  autoFitWorksheetColumnWidth(worksheet);
  XLSX.utils.book_append_sheet(workbook, worksheet, worksheetName);
};

export const convertWorkbookToXlsxArrayBuffer = (workbook: Workbook) => {
  const workbookOutput = XLSX.write(workbook, { bookType: 'xlsx',  type: 'binary' });
  return stringToArrayBuffer(workbookOutput);
};

export const createTemplateXlsxArrayBuffer = async () => {
  const workbook: Workbook = createEmptyWorkbook();

  const templateCommonWorksheet = createWorksheet(templateCommonJsonArray);
  const templatePageWorksheet = createWorksheet(templatePageJsonArray);

  addWorksheetToWorkbook(workbook, templateCommonWorksheet, 'common');
  addWorksheetToWorkbook(workbook, templatePageWorksheet, 'page');
  
  const xlsxArrayBuffer = convertWorkbookToXlsxArrayBuffer(workbook);
  return xlsxArrayBuffer;
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

export const convertXlsxArrayBufferToWorkbookJson = async (
  arrayBuffer: ArrayBuffer,
) => {
  const fileInformation = XLSX.read(arrayBuffer, {
    type: 'buffer',
    cellText: false,
    cellDates: true,
  });
  const worksheetNames = fileInformation.SheetNames;
  const workbookJson = new WorkbookJson();
  (worksheetNames ?? []).forEach((worksheetName: string) => {
    const rawData = fileInformation.Sheets[worksheetName];
    const data = XLSX.utils.sheet_to_json(rawData);

    data.map((record: object) => {
      const key = record[DEFAULT_COLUMN_NAME.key];
      if(!workbookJson.hasWorksheet(worksheetName)) {
        workbookJson.setWorksheetJson(worksheetName, new WorksheetJson());
      }
      const worksheet = workbookJson.getWorksheetJson(worksheetName);
      if(!worksheet.hasRecord(key)) worksheet.appendRecord(record);
      else worksheet.updateRecord(key, record);
    });
  });
  return workbookJson;
};

/**
 * Returns iterator of WorksheetJson objects from WorkbookJson object.
 */
export async function* iterateWorksheet(workbookJson: WorkbookJson) {
  const worksheetJsonNameList = workbookJson.getWorksheetJsonNameList();
  for(const worksheetJsonName of worksheetJsonNameList) {
    const worksheetJson = workbookJson.getWorksheetJson(worksheetJsonName);
    const worksheetArrayBuffer = JSON.stringify(worksheetJson.getRecordList(), null, 2);
    yield {
      name: worksheetJsonName,
      arrayBuffer: worksheetArrayBuffer,
    };
  };
};

export const convertWorkbookJsonToZipArrayBuffer = async (
  workbookJson: WorkbookJson, {
    defaultExportFileType = undefined,
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

    if(defaultExportFileType) {
      const namespaceIndexArrayBuffer = createNamespaceIndexJsString(worksheetJsonNameList);
      zipBuilder.folder(language).file(`index.${defaultExportFileType}`, namespaceIndexArrayBuffer);
    }
  };

  if(defaultExportFileType) {
    const languageIndexArrayBuffer = createLanguageIndexJsString(languageList);
    zipBuilder.file(`index.${defaultExportFileType}`, languageIndexArrayBuffer);
  }

  const zipArrayBuffer = await zipBuilder.generateAsync({ type: 'arraybuffer' });
  return zipArrayBuffer;
};

export const convertWorkbookJsonToArrayBufferMap = async (
  workbookJson: WorkbookJson, {
    defaultExportFileType = undefined,
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

    if(defaultExportFileType) {
      const namespaceIndexArrayBuffer = createNamespaceIndexJsString(worksheetJsonNameList);
      arrayBufferMap.set(
        `/${language}/index.${defaultExportFileType}`,
        namespaceIndexArrayBuffer
      );
    }
  };

  if(defaultExportFileType) {
    const languageIndexArrayBuffer = createLanguageIndexJsString(languageList);
    arrayBufferMap.set(
      `/index.${defaultExportFileType}`,
      languageIndexArrayBuffer
    );
  }

  return arrayBufferMap;
};

export const convertZipArrayBufferToWorkbookJson = async (arrayBuffer: ArrayBuffer) => {
  const getLanguageAndNamespaceFromFilename = (zipFile: ZipFile) => {
    const splitedFilename = zipFile.name.replace(/\.json$/i, '').split('/');
    return {
      language: splitedFilename[0],
      namespace: splitedFilename[1],
    };
  };

  const zip = await convertArrayBufferToZip(arrayBuffer) as ZipFiles;
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
    const { namespace } = getLanguageAndNamespaceFromFilename(zipFile);
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
