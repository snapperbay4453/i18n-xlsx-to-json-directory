import * as XLSX from 'xlsx';
import { WorksheetJson } from './worksheet';

export type Workbook = XLSX.WorkBook;

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
