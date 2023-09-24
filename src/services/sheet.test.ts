import { 
  getDirectoryDescendantsArrayBufferMapViaNode,
  readFileViaNode
} from '@/utils/nodeFileIo';
import { JsonMapper } from '@/utils/common';
import {
  createTemplateXlsxArrayBuffer,
  convertXlsxArrayBufferToWorkbookJson,
  convertWorkbookJsonToXlsxArrayBuffer,
  convertZipArrayBufferToWorkbookJson,
  convertWorkbookJsonToZipArrayBuffer,
  convertDirectoryDescendantsArrayBufferMapToWorkbookJson,
  convertWorkbookJsonToDirectoryDescendantsArrayBufferMap,
} from './sheet';
import { WorkbookJson } from '@/models/workbook';

let sourceXlsxFileXs: ArrayBuffer | Uint8Array;
let sourceJsonZipFileXsNoscript: ArrayBuffer | Uint8Array;
let sourceDirectoryDescendantsArrayBufferMap: Map<string, ArrayBuffer>;

beforeAll(async() => {
  sourceXlsxFileXs = await readFileViaNode('./tests/assets/sheet_xs.xlsx');
  sourceJsonZipFileXsNoscript = await readFileViaNode('./tests/assets/sheet_xs_noscript.zip');
  sourceDirectoryDescendantsArrayBufferMap = await getDirectoryDescendantsArrayBufferMapViaNode('./tests/assets/sheet_xs_noscript');
});

describe('within /services/sheet.ts file', () => {
  describe('within createTemplateXlsxArrayBuffer',() => {
    let templateXlsxArrayBuffer: ArrayBuffer;
    it('should return correct ArrayBuffer', async () => {
      templateXlsxArrayBuffer = await createTemplateXlsxArrayBuffer();
      expect(JsonMapper.stringify(templateXlsxArrayBuffer)).toMatchSnapshot();
    });
  });

  describe('within XlsxArrayBuffer <=> WorkbookJson', () => {
    let inputWorkbookJson: WorkbookJson;
    let outputXlsxArrayBuffer: ArrayBuffer;

    it('should return correct WorkbookJson', async () => {
      inputWorkbookJson = await convertXlsxArrayBufferToWorkbookJson(sourceXlsxFileXs);
      expect(JsonMapper.stringify(inputWorkbookJson)).toMatchSnapshot();
    });

    it('should return correct XlsxArrayBuffer', async () => {
      outputXlsxArrayBuffer = await convertWorkbookJsonToXlsxArrayBuffer(inputWorkbookJson);
      expect(JsonMapper.stringify(outputXlsxArrayBuffer)).toMatchSnapshot();
    });
  });

  describe('within ZipArrayBuffer <=> WorkbookJson', () => {
    let inputWorkbookJson: WorkbookJson;
    let outputZipArrayBuffer: ArrayBuffer;

    it('should return correct WorkbookJson', async () => {
      inputWorkbookJson = await convertZipArrayBufferToWorkbookJson(sourceJsonZipFileXsNoscript);
      expect(JsonMapper.stringify(inputWorkbookJson)).toMatchSnapshot();
    });

    it('should return correct ZipArrayBuffer', async () => {
      outputZipArrayBuffer = await convertWorkbookJsonToZipArrayBuffer(inputWorkbookJson);
      expect(JsonMapper.stringify(outputZipArrayBuffer)).toMatchSnapshot();
    });
  });

  describe('within ArrayBufferMap <=> WorkbookJson', () => {
    let inputWorkbookJson: WorkbookJson;
    let outputDirectoryDescendantsArrayBufferMap: Map<string, ArrayBuffer>;

    it('should return correct WorkbookJson', async () => {
      inputWorkbookJson = await convertDirectoryDescendantsArrayBufferMapToWorkbookJson(sourceDirectoryDescendantsArrayBufferMap);
      expect(JsonMapper.stringify(inputWorkbookJson)).toMatchSnapshot();
    });

    it('should return correct ArrayBufferMap', async () => {
      outputDirectoryDescendantsArrayBufferMap = await convertWorkbookJsonToDirectoryDescendantsArrayBufferMap(inputWorkbookJson);
      expect(JsonMapper.stringify(outputDirectoryDescendantsArrayBufferMap)).toMatchSnapshot();
    });
  });
});
