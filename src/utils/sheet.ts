import * as XLSX from 'xlsx';
import { templateCommonJsonArray, templatePageJsonArray } from '@/assets/template';
import { getByteSize, stringToArrayBuffer } from './common';
import { convertBlobToArrayBuffer, convertArrayBufferToZip } from './file';
import { getZipBuilder } from './zip';
import type { GroupifiedZipFiles, ZipFiles, ZipFile } from './zip';

export const DEFAULT_COLUMN_NAME = Object.freeze({
  key: 'code'
});

type Workbook = XLSX.WorkBook;
type Worksheet = XLSX.WorkSheet;

export class WorksheetJson {
  constructor() {
    this.recordList = [];
  }
  recordList: object[];
  getRecordKeyList() {
    return this.recordList.map(record => record[DEFAULT_COLUMN_NAME.key]);
  };
  getFieldList({ includeKey = false } = {}) {
    const columnSet = this.recordList.reduce((acc: Set<string>, record) => {
      Object.keys(record).forEach(column => {
        acc.add(column)
      });
      return acc;
    }, new Set()) as Set<string>;

    if(includeKey) return [...columnSet];
    else return [...columnSet].filter(column => column !== DEFAULT_COLUMN_NAME.key);
  };
  findRecordIndex(key: string) {
    return this.recordList.findIndex(record => record[DEFAULT_COLUMN_NAME.key] === key);
  };
  hasRecord(key: string) {
    return this.recordList.findIndex(item => item[DEFAULT_COLUMN_NAME.key] === key) >= 0;
  };
  appendRecord(record: object) {
    this.recordList.push(record);
  };
  getRecord(key: string) {
    const recordIndex = this.findRecordIndex(key);
    if(recordIndex < 0) undefined;
    else return this.recordList[recordIndex];
  };
  getRecordList() {
    return this.recordList;
  };
  setRecord(key: string, record: object) {
    const recordIndex = this.findRecordIndex(key);
    if(recordIndex < 0) this.appendRecord(record);
    else this.recordList[recordIndex] = record;
  };
  updateRecord(key: string, record: object) {
    const recordIndex = this.findRecordIndex(key);
    if(recordIndex < 0) this.appendRecord(record);
    else this.recordList[recordIndex] = {
      ...this.recordList[recordIndex],
      ...record,
    };
  };
}
export class WorkbookJson {
  constructor() {
    this.worksheetJsonMap = new Map();
  }
  worksheetJsonMap: Map<string, WorksheetJson>;
  getWorksheetJsonNameList() {
    return [...this.worksheetJsonMap.keys()];
  }
  getWorksheetJsonFieldList({ includeKey = false } = {}) {
    const fieldSet = [...this.worksheetJsonMap.values()]
    .map(worksheetJson => worksheetJson.getFieldList({ includeKey }))
    .reduce((acc: Set<string>, fieldList) => {
      fieldList.forEach(field => {
        acc.add(field);
      });
      return acc;
    }, new Set()) as Set<string>;
    return [...fieldSet];
  };
  hasWorksheet(name: string) {
    return this.worksheetJsonMap.has(name);
  };
  getWorksheetJson(name: string) {
    return this.worksheetJsonMap.get(name);
  };
  setWorksheetJson(name: string, worksheetJson: WorksheetJson) {
    this.worksheetJsonMap.set(name, worksheetJson);
  };
}

const createLanguageIndexJsString = (languageList: string[]) => {
  let lines = [];
  languageList.forEach((language: string) => lines.push(`import ${language} from './${language}';`));
  lines.push('');
  lines.push(`export { ${languageList.map((language: string) => `${language}`).join(', ')} };`);
  return lines.join('\n');
}
const createNamespaceIndexJsString = (namespaceList: string[]) => {
  let lines = [];
  namespaceList.forEach((namespace: string) => lines.push(`import ${namespace} from './${namespace}.json';`));
  lines.push('');
  lines.push(`export { ${namespaceList.map((namespace: string) => `${namespace}`).join(', ')} };`);
  return lines.join('\n');
}

// https://github.com/SheetJS/sheetjs/issues/1473#issuecomment-1291746676
export const autoFitWorksheetColumnWidth = (worksheet: Worksheet) => {
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
export const createWorksheet = (worksheetJson) => {
  return XLSX.utils.json_to_sheet(worksheetJson);
};
export const addWorksheetToWorkbook = (workbook: Workbook, worksheet: Worksheet, worksheetName: string) => {
  autoFitWorksheetColumnWidth(worksheet);
  XLSX.utils.book_append_sheet(workbook, worksheet, worksheetName);
};

export const convertWorkbookToXlsxBlob = (workbook: Workbook) => {
  const workbookOutput = XLSX.write(workbook, { bookType: 'xlsx',  type: 'binary' });
  return new Blob([stringToArrayBuffer(workbookOutput)], { type: 'application/octet-stream' });
};



export const createTemplateXlsxBlob = async () => {
  const workbook: Workbook = createEmptyWorkbook();

  const templateCommonWorksheet = createWorksheet(templateCommonJsonArray);
  const templatePageWorksheet = createWorksheet(templatePageJsonArray);

  addWorksheetToWorkbook(workbook, templateCommonWorksheet, 'common');
  addWorksheetToWorkbook(workbook, templatePageWorksheet, 'page');
  
  const xlsxBlob = convertWorkbookToXlsxBlob(workbook);
  return xlsxBlob;
};

export const convertWorkbookJsonToXlsxBlob = async (workbookJson: WorkbookJson) => {
  const worksheetNameList = workbookJson.getWorksheetJsonNameList();
  const workbook: Workbook = createEmptyWorkbook();

  for (const worksheetName of worksheetNameList) {
    const worksheetJson = workbookJson.getWorksheetJson(worksheetName);
    const worksheet = createWorksheet(worksheetJson.getRecordList());
    addWorksheetToWorkbook(workbook, worksheet, worksheetName);
  }

  const xlsxBlob = convertWorkbookToXlsxBlob(workbook);
  return xlsxBlob;
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

export const convertWorkbookJsonToZipBlob = async (
  workbookJson: WorkbookJson, {
    defaultExportFileType = undefined
  } = {}
) => {
  const zipBuilder = getZipBuilder();
  const languageList = workbookJson.getWorksheetJsonFieldList({ includeKey: false });
  languageList.forEach((language: string) => {
    zipBuilder.folder(language);

    const worksheetJsonNameList = workbookJson.getWorksheetJsonNameList();
    worksheetJsonNameList.forEach((namespace: string) => {
      const worksheetJson = workbookJson.getWorksheetJson(namespace);
      const worksheetBlob = new Blob(
        [JSON.stringify(worksheetJson.getRecordList(), null, 2)],
        { type: 'text/plain;charset=utf-8' }
      );
      zipBuilder.folder(language).file(`${namespace}.json`, worksheetBlob);
    });

    if(defaultExportFileType) {
      const namespaceIndexBlob = new Blob(
        [createNamespaceIndexJsString(worksheetJsonNameList)],
        { type: 'text/plain;charset=utf-8' }
      );
      zipBuilder.folder(language).file(`index.${defaultExportFileType}`, namespaceIndexBlob);
    }
  });

  if(defaultExportFileType) {
    const languageIndexBlob = new Blob(
      [createLanguageIndexJsString(languageList)],
      { type: 'text/plain;charset=utf-8' }
    );
    zipBuilder.file(`index.${defaultExportFileType}`, languageIndexBlob);
  }

  const zipBlob = await zipBuilder.generateAsync({ type: 'blob' });
  return zipBlob;
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
  const workBookJson = new WorkbookJson();

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
    if(!workBookJson.hasWorksheet(namespace)) workBookJson.setWorksheetJson(namespace, new WorksheetJson());

    const zipFileData = await zipFile.async('string');
    var parsedZipFileData = JSON.parse(zipFileData);
    
    Object.values(parsedZipFileData).forEach((record: object) => {
      const worksheetJson = workBookJson.getWorksheetJson(namespace);
      worksheetJson.updateRecord(record[DEFAULT_COLUMN_NAME.key], record);
    });
  }

  return workBookJson;
};
