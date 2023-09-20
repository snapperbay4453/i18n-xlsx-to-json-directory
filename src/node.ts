import { Command } from 'commander';
import { WorkbookJson } from '@/models/workbook';
import {
  convertArrayBufferMapToWorkbookJson,
  convertWorkbookJsonToArrayBufferMap,
  convertWorkbookJsonToXlsxArrayBuffer,
  convertWorkbookJsonToZipArrayBuffer,
  convertXlsxArrayBufferToWorkbookJson,
  convertZipArrayBufferToWorkbookJson,
  createTemplateXlsxArrayBuffer,
} from '@/services/sheet';
import {
  getDirectoryFileArrayBufferMap,
  readFileViaNode,
  writeFileViaNode,
} from '@/utils/nodeFileIo';

export const convertXlsxToJsonZip = async (source: string, destination: string, {
  autoExtract = false,
  defaultExportFileType = undefined,
} = {}) => {
  const arrayBuffer = await readFileViaNode(source);
  const workbookJson = await convertXlsxArrayBufferToWorkbookJson(arrayBuffer);

  if(autoExtract) {
    const arrayBufferMap = await convertWorkbookJsonToArrayBufferMap(workbookJson, { defaultExportFileType });
    for(const [path, arrayBuffer] of arrayBufferMap) {
      await writeFileViaNode(`${destination}${path}`, arrayBuffer);
    }
    return arrayBufferMap;
  } else {
    const zipArrayBuffer = await convertWorkbookJsonToZipArrayBuffer(workbookJson, { defaultExportFileType });
    await writeFileViaNode(destination, zipArrayBuffer);
    return zipArrayBuffer;
  }
};

export const convertJsonZipToXlsx = async (source: string, destination: string, {
  autoCompress = false,
} = {}) => {
  let workbookJson: WorkbookJson;
  if(autoCompress) {
    const arrayBufferMap = await getDirectoryFileArrayBufferMap(source);
    workbookJson = await convertArrayBufferMapToWorkbookJson(arrayBufferMap);
  } else {
    const arrayBuffer = await readFileViaNode(source);
    workbookJson = await convertZipArrayBufferToWorkbookJson(arrayBuffer);
  }

  const xlsxArrayBuffer = await convertWorkbookJsonToXlsxArrayBuffer(workbookJson);
  await writeFileViaNode(destination, xlsxArrayBuffer);
  return xlsxArrayBuffer;
};

export const createTemplateXlsx = async (destination: string) => {
  const xlsxArrayBuffer = await createTemplateXlsxArrayBuffer();
  await writeFileViaNode(destination, xlsxArrayBuffer);
  return xlsxArrayBuffer;
};


const program = new Command();

program.name('i18n-xlsx-to-json-directory')
  .description('Library that converts and downloads multilingual data stored in xlsx files into a json directory structure.')
  .version(process.env.npm_package_version)

program.command('xlsx-to-json-zip')
  .description('Convert the xlsx file to the json directory structure, then compress it to create and download the zip file.')
  .option('-s, --source <char>', 'Source path')
  .option('-d, --destination <char>', 'Target path')
  .option('--auto-extract', 'Auto-extract json files')
  .option('--export-file-type <char>', 'Default export file type')
  .action((options) => {
    const source = options.source;
    const destination = options.destination;
    const autoExtract = options.autoExtract;
    const exportFileType = options.exportFileType ?? undefined;
    convertXlsxToJsonZip(source, destination, {
      autoExtract: autoExtract,
      defaultExportFileType: exportFileType,
    });
  });

program.command('json-zip-to-xlsx')
  .description('Analyze the zip file, then create and download the xlsx file.')
  .option('-s, --source <char>', 'Source path')
  .option('-d, --destination <char>', 'Target path')
  .option('--auto-compress', 'Auto-compress json zip file')
  .action((options) => {
    const source = options.source;
    const destination = options.destination;
    const autoCompress = options.autoCompress;
    convertJsonZipToXlsx(source, destination, {
      autoCompress: autoCompress,
    });
  });

program.command('template-xlsx')
  .description('Create and download template xlsx file.')
  .option('-d, --destination <char>', 'Target path')
  .action((options) => {
    const destination = options.destination;
    createTemplateXlsx(destination);
  });

program.parse();
