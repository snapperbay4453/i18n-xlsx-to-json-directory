import * as XLSX from 'xlsx';
import JSZip from 'jszip/dist/jszip';
import { saveAs } from 'file-saver-es';
import { templateCommonJsonArray, templatePageJsonArray } from '@/assets/template';
import { COLUMN_NAME } from '@/consts/code';

type I18nLanguageSectionJson = object;

interface I18nLanguageJson {
  [name: string]: I18nLanguageSectionJson
}

interface I18nJson {
  [name: string]: I18nLanguageJson
}

type WorkSheetJson = object[];

/*
interface WorkSheetGroupJson {
  [name: string]: WorkSheetJson[];
}
*/

// https://eblo.tistory.com/84
function stringToArrayBuffer(s) { 
  var buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
  var view = new Uint8Array(buf);  //create uint8array as viewer
  for (var i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF; //convert to octet
  return buf;    
}

const saveI18nJsonZip = async (zipName: string, i18nJson: I18nJson) => {
  const jsZip: JSZip = new JSZip();
  Object.keys(i18nJson).forEach((languageCode: string) => {
    jsZip.folder(languageCode);
    Object.keys(i18nJson[languageCode]).forEach((languageSectionName: string) => {
      var i18nLanguageSectionBlob = new Blob(
        [JSON.stringify(i18nJson[languageCode][languageSectionName])],
        { type: 'text/plain;charset=utf-8' }
      );
      jsZip.folder(languageCode).file(`${languageSectionName}.json`, i18nLanguageSectionBlob);
    });
  });
  const i18nJsonZip = await jsZip.generateAsync({ type: 'blob' })
  saveAs(i18nJsonZip, `${zipName}.zip`);
};

const createNewWorkBook = () => {
  const workBook: XLSX.WorkBook = XLSX.utils.book_new();
  return workBook;
};

const addWorkSheetJsonToWorkbook = (workBook: XLSX.WorkBook, workSheetName: string, sheetJson: WorkSheetJson) => {
  const newWorkSheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(sheetJson); 
  XLSX.utils.book_append_sheet(workBook, newWorkSheet, workSheetName);
};

const saveWorkBookXlsx = (filename: string, workBook: XLSX.WorkBook) => {
  const workBookOut = XLSX.write(workBook, { bookType: 'xlsx',  type: 'binary' });
  saveAs(new Blob([stringToArrayBuffer(workBookOut)], { type: 'application/octet-stream' }), filename);
};



export const createTemplateI18nXlsx = () => {
  const templateXlsxFilename = `template_${(new Date().getTime())}.xlsx`;

  const workBook: XLSX.WorkBook = createNewWorkBook();
  addWorkSheetJsonToWorkbook(workBook, 'common', templateCommonJsonArray);
  addWorkSheetJsonToWorkbook(workBook, 'page', templatePageJsonArray);
  saveWorkBookXlsx(templateXlsxFilename, workBook);
};

export const convertI18XlsxToJsonDirectory = async (file: Blob) => {
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
    await saveI18nJsonZip('test', i18nJson);
  };
};

/*
export const jsonToXlsx = (filename: string, workSheetGroupJson: WorkSheetGroupJson) => {
  const xlsxFilename = `${filename}_${(new Date().getTime())}.xlsx`;

  const workBook: XLSX.WorkBook = createNewWorkBook();

  Object.entries(workSheetGroupJson).forEach(([workSheetName, workSheetJson]) => {
    addWorkSheetJsonToWorkbook(workBook, workSheetName, workSheetJson);
  })
  saveWorkBookXlsx(xlsxFilename, workBook);
};
*/
