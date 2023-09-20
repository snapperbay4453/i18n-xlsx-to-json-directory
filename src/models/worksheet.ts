import * as XLSX from 'xlsx';
import { DEFAULT_COLUMN_NAME } from '@/consts/column';

/**
 * Class that wraps XLSX.WorkSheet.
 */
export type Worksheet = XLSX.WorkSheet;

/**
 * Keeps spreadsheet row data
 * and provides utility methods.
 */
export class WorksheetJson {
  constructor() {
    this.recordList = [];
  }
  recordList: object[];
  getRecordKeyList() {
    return this.recordList.map(record => record[DEFAULT_COLUMN_NAME.key]);
  }
  getFieldList({ includeKey = false } = {}) {
    const columnSet = this.recordList.reduce((acc: Set<string>, record) => {
      Object.keys(record).forEach(column => {
        acc.add(column)
      });
      return acc;
    }, new Set()) as Set<string>;

    if(includeKey) return [...columnSet];
    else return [...columnSet].filter(column => column !== DEFAULT_COLUMN_NAME.key);
  }
  findRecordIndex(key: string) {
    return this.recordList.findIndex(record => record[DEFAULT_COLUMN_NAME.key] === key);
  }
  hasRecord(key: string) {
    return this.recordList.findIndex(item => item[DEFAULT_COLUMN_NAME.key] === key) >= 0;
  }
  appendRecord(record: object) {
    this.recordList.push(record);
  }
  getRecord(key: string) {
    const recordIndex = this.findRecordIndex(key);
    if(recordIndex < 0) undefined;
    else return this.recordList[recordIndex];
  }
  getRecordList() {
    return this.recordList;
  }
  setRecord(key: string, record: object) {
    const recordIndex = this.findRecordIndex(key);
    if(recordIndex < 0) this.appendRecord(record);
    else this.recordList[recordIndex] = record;
  }
  updateRecord(key: string, record: object) {
    const recordIndex = this.findRecordIndex(key);
    if(recordIndex < 0) this.appendRecord(record);
    else this.recordList[recordIndex] = {
      ...this.recordList[recordIndex],
      ...record,
    };
  }
}
