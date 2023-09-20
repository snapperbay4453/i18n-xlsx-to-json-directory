import * as XLSX from 'xlsx';
import { Workbook, WorkbookJson } from '@/models/workbook';
import { Worksheet, WorksheetJson } from '@/models/worksheet';
import { getByteSize, stringToArrayBuffer } from './common';

/**
 * Calculates worksheet column width based on worksheet data.
 */
export const autoFitWorksheetColumnWidth = (worksheet: Worksheet) => {
  // https://github.com/SheetJS/sheetjs/issues/1473#issuecomment-1291746676
  const [startLetter, endLetter] = (worksheet['!ref'] ?? '').replace(/\d/, '').split(':')!;
  let numRegexp = new RegExp(/\d+$/g);
  let start = startLetter.charCodeAt(0);
  let end = endLetter.charCodeAt(0) + 1;
  let rows = +numRegexp.exec(endLetter)[0];

  let ranges: number[] = [];
  for(let i = start; i < end; i++) {
    ranges.push(i);
  }
  
  let maxLength = [];
  ranges.forEach((c) => {
    const cell = String.fromCharCode(c);
    let maxCellLength = 0;
    for(let y = 1; y <= rows; y++) {
      let cellLength = getByteSize(worksheet[`${cell}${y}`].v) + 2;
      if(cellLength > maxCellLength) {
        maxCellLength = cellLength;
      }
    }
    maxLength.push({ width: maxCellLength });
  });
  
  worksheet['!cols'] = maxLength;
}

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
  }
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

export const convertXlsxArrayBufferToWorkbook = (arrayBuffer: ArrayBuffer) => {
  return XLSX.read(arrayBuffer, {
    type: 'buffer',
    cellText: false,
    cellDates: true,
  });
};

export const convertWorkbookToXlsxArrayBuffer = (workbook: Workbook) => {
  const workbookOutput = XLSX.write(workbook, { bookType: 'xlsx',  type: 'binary' });
  return stringToArrayBuffer(workbookOutput);
};

export const convertWorksheetToWorksheetJson = (worksheet: Worksheet) => {
  const recordList = XLSX.utils.sheet_to_json(worksheet);
  const worksheetJson = new WorksheetJson();
  recordList.map((record: object) => {
    worksheetJson.appendRecord(record);
  });
  return worksheetJson;
};
