import {
  createTemplateXlsxArrayBuffer,
  convertWorkbookJsonToArrayBufferMap,
  convertWorkbookJsonToXlsxArrayBuffer,
  convertWorkbookJsonToZipArrayBuffer,
  convertXlsxArrayBufferToWorkbookJson,
  convertZipArrayBufferToWorkbookJson,
} from '@/utils/sheet';
import {
  readFileViaNode,
  writeFileViaNode,
} from '@/utils/nodeFileIo';

export const createTemplateXlsx = async (destination: string) => {
  const xlsxArrayBuffer = await createTemplateXlsxArrayBuffer();
  await writeFileViaNode(destination, xlsxArrayBuffer);
  return xlsxArrayBuffer;
};

export const convertXlsxToZip = async (source: string, destination: string, {
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

export const convertZipToXlsx = async (source: string, destination: string) => {
  const arrayBuffer = await readFileViaNode(source);
  const workbookJson = await convertZipArrayBufferToWorkbookJson(arrayBuffer);
  const xlsxArrayBuffer = await convertWorkbookJsonToXlsxArrayBuffer(workbookJson);
  await writeFileViaNode(destination, xlsxArrayBuffer);
  return xlsxArrayBuffer;
};

import { Command } from 'commander';
const program = new Command();

program.name('i18n-xlsx-to-json-directory')
  .description('Library that converts and downloads multilingual data stored in xlsx files into a json directory structure.')
  .version(process.env.npm_package_version)

program.command('template-xlsx')
  .description('Create and download template xlsx file.')
  .option('-d, --destination <char>', 'Target path')
  .action((options) => {
    const destination = options.destination;
    createTemplateXlsx(destination);
  });

program.command('xlsx-to-zip')
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
    convertXlsxToZip(source, destination, {
      autoExtract: autoExtract,
      defaultExportFileType: exportFileType,
    });
  });

program.command('zip-to-xlsx')
  .description('Analyze the zip file, then create and download the xlsx file.')
  .option('-s, --source <char>', 'Source path')
  .option('-d, --destination <char>', 'Target path')
  .action((options) => {
    const source = options.source;
    const destination = options.destination;
    convertZipToXlsx(source, destination);
  });

program.parse();
