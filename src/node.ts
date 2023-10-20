import { Command } from 'commander';
import { compressedFilenameRegex, sheetFilenameRegex } from '@/consts/file-extension';
import { WorkbookJson } from '@/models/workbook';
import {
  convertDirectoryDescendantsArrayBufferMapToWorkbookJson,
  convertWorkbookJsonToDirectoryDescendantsArrayBufferMap,
  convertWorkbookJsonToXlsxArrayBuffer,
  convertWorkbookJsonToZipArrayBuffer,
  convertXlsxArrayBufferToWorkbookJson,
  convertZipArrayBufferToWorkbookJson,
  createTemplateXlsxArrayBuffer,
} from '@/services/sheet';
import {
  getDirectoryDescendantsArrayBufferMapViaNode,
  readFileViaNode,
  writeFileViaNode,
} from '@/utils/nodeFileIo';


export const createTemplateXlsx = async (destination: string) => {
  try {
    if(!destination) throw new Error('destination path is not specified.');
    if(!sheetFilenameRegex.test(destination)) throw new Error('destination path doesn\'t have a sheet file extension.');
  
    const xlsxArrayBuffer = await createTemplateXlsxArrayBuffer();
    await writeFileViaNode(destination, xlsxArrayBuffer);
    return xlsxArrayBuffer;
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
};

export const convertXlsxToJsonZip = async (source: string, destination: string, {
  autoExtract = false,
  exportFileType = undefined,
} = {}) => {
  try {
    if(!source) throw new Error('source path is not specified.');
    if(!destination) throw new Error('destination path is not specified.');
    if(!sheetFilenameRegex.test(source)) throw new Error('source path doesn\'t have a sheet file extension.');
    if(!autoExtract && !compressedFilenameRegex.test(destination)) throw new Error('destination path doesn\'t have a compressed file extension.');
    
    const arrayBuffer = await readFileViaNode(source);
    const workbookJson = await convertXlsxArrayBufferToWorkbookJson(arrayBuffer);
  
    if(autoExtract) {
      const arrayBufferMap = await convertWorkbookJsonToDirectoryDescendantsArrayBufferMap(workbookJson, { exportFileType });
      for(const [path, arrayBuffer] of arrayBufferMap) {
        await writeFileViaNode(`${destination}${path}`, arrayBuffer);
      }
      return arrayBufferMap;
    } else {
      const zipArrayBuffer = await convertWorkbookJsonToZipArrayBuffer(workbookJson, { exportFileType });
      await writeFileViaNode(destination, zipArrayBuffer);
      return zipArrayBuffer;
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
};

export const convertJsonZipToXlsx = async (source: string, destination: string, {
  autoCompress = false,
} = {}) => {
  try {
    if(!source) throw new Error('source path is not specified.');
    if(!destination) throw new Error('destination path is not specified.');
    if(!autoCompress && !sheetFilenameRegex.test(source)) throw new Error('source path doesn\'t have a compressed file extension.');
    if(!compressedFilenameRegex.test(destination)) throw new Error('destination path doesn\'t have a sheet file extension.');
  
    let workbookJson: WorkbookJson;
    if(autoCompress) {
      const arrayBufferMap = await getDirectoryDescendantsArrayBufferMapViaNode(source);
      workbookJson = await convertDirectoryDescendantsArrayBufferMapToWorkbookJson(arrayBufferMap);
    } else {
      const arrayBuffer = await readFileViaNode(source);
      workbookJson = await convertZipArrayBufferToWorkbookJson(arrayBuffer);
    }
  
    const xlsxArrayBuffer = await convertWorkbookJsonToXlsxArrayBuffer(workbookJson);
    await writeFileViaNode(destination, xlsxArrayBuffer);
    return xlsxArrayBuffer;
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
};


const program = new Command();

program.name('i18n-xlsx-to-json-directory')
  .description('Library that converts and downloads multilingual data stored in xlsx files into a json directory structure, and vice versa.')
  .version(process.env.npm_package_version)

program.command('template-xlsx')
.description('Create and download template xlsx file.')
.requiredOption('-d, --destination <char>', 'Target path')
.action((options) => {
  const destination = options.destination;
  createTemplateXlsx(destination);
});

program.command('xlsx-to-json-zip')
  .description('Convert the xlsx file to the json directory structure, then compress it to create and download the zip file.')
  .requiredOption('-s, --source <char>', 'Source path')
  .requiredOption('-d, --destination <char>', 'Target path')
  .option('--auto-extract', 'Auto-extract json files')
  .option('--export-file-type <char>', 'Default export file type')
  .action((options) => {
    const source = options.source;
    const destination = options.destination;
    const autoExtract = options.autoExtract;
    const exportFileType = options.exportFileType ?? undefined;
    convertXlsxToJsonZip(source, destination, {
      autoExtract: autoExtract,
      exportFileType: exportFileType,
    });
  });

program.command('json-zip-to-xlsx')
  .description('Analyze the zip file, then create and download the xlsx file.')
  .requiredOption('-s, --source <char>', 'Source path')
  .requiredOption('-d, --destination <char>', 'Target path')
  .option('--auto-compress', 'Auto-compress json zip file')
  .action((options) => {
    const source = options.source;
    const destination = options.destination;
    const autoCompress = options.autoCompress;
    convertJsonZipToXlsx(source, destination, {
      autoCompress: autoCompress,
    });
  });

program.parse();
