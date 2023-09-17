import * as XLSX from 'xlsx';
import JSZip from 'jszip/dist/jszip';
import { saveAs } from 'file-saver-es';
import { templateCommonJsonArray, templatePageJsonArray } from '@/assets/template';
import { COLUMN_NAME } from '@/consts/code';

import type {
  JsZipFile, JsZipFiles, GroupifiedJsZipFiles,
  I18nLanguageNamespaceJson, I18nLanguageJson, I18nJson,
  WorkSheetJson, WorkSheetGroupJson
} from '@/types';

// Utilities

const getByteSize = (targetString: string) => {
  const str: string = targetString.toString();
  let byteSize: number = 0;
  let char: number;

  for (let i = 0; !isNaN(str.charCodeAt(i)); i++) {
    char = str.charCodeAt(i);

    /*
    if (char >> 11) {
      byteSize += 3;
    }
    */

    if (char >> 7) {
      byteSize += 2;
    }
    else {
      byteSize += 1;
    }
  }

  return byteSize;
}

// https://eblo.tistory.com/84
// https://redstapler.co/sheetjs-tutorial-create-xlsx/
const stringToArrayBuffer = (s) => { 
  const buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
  let view = new Uint8Array(buf);  //create uint8array as viewer
  for (let i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF; //convert to octet
  return buf;    
}

const saveI18nJsonZip = async (zipName: string, i18nJson: I18nJson) => {
  const jsZip: JSZip = new JSZip();
  Object.keys(i18nJson).forEach((languageCode: string) => {
    jsZip.folder(languageCode);
    Object.keys(i18nJson[languageCode]).forEach((languageNamespaceName: string) => {
      const i18nLanguageNamespaceBlob = new Blob(
        [JSON.stringify(i18nJson[languageCode][languageNamespaceName], null, 2)],
        { type: 'text/plain;charset=utf-8' }
      );
      jsZip.folder(languageCode).file(`${languageNamespaceName}.json`, i18nLanguageNamespaceBlob);
    });
  });
  const i18nJsonZip = await jsZip.generateAsync({ type: 'blob' })
  saveAs(i18nJsonZip, `${zipName}.zip`);
};

// https://github.com/SheetJS/sheetjs/issues/1473#issuecomment-1291746676
const autofitWorkSheet = (workSheet: XLSX.WorkSheet) => {
  const [startLetter, endLetter] = workSheet['!ref']?.replace(/\d/, '').split(':')!;
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
      let cellLength = getByteSize(workSheet[`${cell}${y}`].v) + 2;
      if(cellLength > maxCellLength) {
        maxCellLength = cellLength;
      }
    }
    objectMaxLength.push({ width: maxCellLength });
  });
  workSheet['!cols'] = objectMaxLength;
}

const createNewWorkBook = () => {
  const workBook: XLSX.WorkBook = XLSX.utils.book_new();
  return workBook;
};
const addWorkSheetJsonToWorkbook = (workBook: XLSX.WorkBook, workSheetName: string, sheetJson: WorkSheetJson) => {
  const newWorkSheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(sheetJson);
  autofitWorkSheet(newWorkSheet);
  XLSX.utils.book_append_sheet(workBook, newWorkSheet, workSheetName);
};
const saveWorkBookXlsx = (filename: string, workBook: XLSX.WorkBook) => {
  const workBookOut = XLSX.write(workBook, { bookType: 'xlsx',  type: 'binary' });
  saveAs(new Blob([stringToArrayBuffer(workBookOut)], { type: 'application/octet-stream' }), `${filename}.xlsx`);
};

// Methods

export const createTemplateI18nXlsx = () => {
  const templateXlsxFilename = `template_i18n_${(new Date().getTime())}`;

  const workBook: XLSX.WorkBook = createNewWorkBook();
  addWorkSheetJsonToWorkbook(workBook, 'common', templateCommonJsonArray);
  addWorkSheetJsonToWorkbook(workBook, 'page', templatePageJsonArray);
  saveWorkBookXlsx(templateXlsxFilename, workBook);
};

export const convertI18XlsxToJsonDirectoryZip = (file: Blob) => {
  const outputJsonDirectoryName = `i18n_${(new Date().getTime())}`;

  const fileReader = new FileReader();
  fileReader.readAsArrayBuffer(file);
  fileReader.onload = async (e) => {
    if (!e.target) return;
    const bufferArray = e.target.result;
    const fileInformation = XLSX.read(bufferArray, {
      type: 'buffer',
      cellText: false,
      cellDates: true,
    });

    const sheetNames = fileInformation.SheetNames;
    const i18nJson: I18nJson = {};
    (sheetNames ?? []).forEach((sheetName: string) => {
      const rawData = fileInformation.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(rawData);

      data.map(row => {
        Object.keys(row).filter(rowHeader => rowHeader !== COLUMN_NAME.code).map(languageCode => {
          if(!i18nJson[languageCode]) {
            i18nJson[languageCode] = {};
          }
          if(!i18nJson[languageCode][sheetName]) {
            i18nJson[languageCode][sheetName] = {};
          }
          i18nJson[languageCode][sheetName][row[COLUMN_NAME.code]] = row[languageCode];
        })
      });
    });
    await saveI18nJsonZip(outputJsonDirectoryName, i18nJson);
  };
};

export const convertJsonDirectoryZipToI18Xlsx = async (file: Blob) => {
  const getLanguageAndNamespaceFromFilename = (file: JsZipFile) => {
    const splitedFilename = file.name.replace(/\.json$/i, '').split('/');
    return {
      language: splitedFilename[0],
      namespace: splitedFilename[1],
    };
  }

  const jsZip: JSZip = new JSZip();
  const zip = await jsZip.loadAsync(file) as JsZipFiles;
  const workSheetGroupJson: WorkSheetGroupJson = {};
  const outputI18nXlsxName = `i18n_${(new Date().getTime())}`;

  const groupifiedZip = Object.values(zip.files).reduce((acc: GroupifiedJsZipFiles, file: JsZipFile) => {
    if(file.dir) acc.directories.push(file);
    else if(file.name.endsWith('.json')) acc.files.push(file);
    return acc;
  }, {
    files: [],
    directories: [],
  });

  const namespaceSet = new Set();
  groupifiedZip.files.forEach((file) => {
    const { namespace } = getLanguageAndNamespaceFromFilename(file);
    namespace && namespaceSet.add(namespace);
    if(!workSheetGroupJson[namespace]) workSheetGroupJson[namespace] = [];
  });
  const namespaces = [ ...namespaceSet ];

  const workBook: XLSX.WorkBook = createNewWorkBook();

  for await (const file of groupifiedZip.files) {
    const { language, namespace } = getLanguageAndNamespaceFromFilename(file);
    const data = await file.async('string');
    var json = JSON.parse(data);
    
    Object.entries(json).forEach(([code, value]) => {
      const existedCodeIndex = workSheetGroupJson[namespace].findIndex(item => item[COLUMN_NAME.code] === code);
      if(existedCodeIndex < 0) workSheetGroupJson[namespace].push({ [COLUMN_NAME.code]: code });
      const codeIndex = workSheetGroupJson[namespace].findIndex(item => item[COLUMN_NAME.code] === code);
      workSheetGroupJson[namespace][codeIndex] = {
        ...workSheetGroupJson[namespace][codeIndex],
        [language]: value,
      }
    });
  }

  namespaces.forEach((namespace: string) => {
    addWorkSheetJsonToWorkbook(workBook, namespace, workSheetGroupJson[namespace]);
  });

  saveWorkBookXlsx(outputI18nXlsxName, workBook);
};
