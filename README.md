# i18n-xlsx-to-json-directory

![](https://img.shields.io/npm/v/i18n-xlsx-to-json-directory)
![](https://img.shields.io/npm/l/i18n-xlsx-to-json-directory)
![](https://img.shields.io/npm/dt/i18n-xlsx-to-json-directory)
![](https://img.shields.io/github/contributors/snapperbay4453/i18n-xlsx-to-json-directory)
![](https://img.shields.io/github/last-commit/snapperbay4453/i18n-xlsx-to-json-directory)


Library that converts and downloads multilingual data stored in xlsx files into a json directory structure. The directory structure is tailored to the i18next library.

Supports direct execution via npx commands. It also supports importing from browser and Node environments.


## Direct usage

Examples of commands that can be executed directly from the terminal include the following.

```bash
npx i18n-xlsx-to-json-directory template-xlsx -d ./template_i18n.xlsx
npx i18n-xlsx-to-json-directory xlsx-to-json-zip -s ./i18n.xlsx -d ./i18n.zip --export-file-type js
npx i18n-xlsx-to-json-directory xlsx-to-json-zip -s ./i18n.xlsx -d ./i18n --export-file-type ts --auto-extract
npx i18n-xlsx-to-json-directory json-zip-to-xlsx -s ./i18n.zip -d ./i18n.xlsx
npx i18n-xlsx-to-json-directory json-zip-to-xlsx -s ./i18n -d ./i18n.xlsx --auto-compress
```

### template-xlsx

Create and save template xlsx files.

#### options

-d, --destination: The path on which the converted file will be stored.

### xlsx-to-json-zip

After converting the xlsx file into a json directory structure, compress it to create and download a zip file.

#### options

-s, --source: The path to import the file you want to convert.

-d, --destination: The path on which the converted file will be stored.

--auto-extract: Automatically decompress converted zip files. You must specify a directory in the -d option.

--export-file-type: Creates a default index script file that exports each language and namespace.('js' || 'ts' || undefined)

### json-zip-to-xlsx

After analyzing the zip file, create and download the xlsx file.

#### options

-s, --source: The path to import the file you want to convert.

-d, --destination: The path on which the converted file will be stored.

--auto-compress: Automatically compresses and converts the selected directory. You must specify a directory in the -d option.


## Usage in a browser environment

Import the library into the script file as follows.

```javascript
import {
  createTemplateXlsx,
  convertXlsxToJsonZip,
  convertJsonZipToXlsx,
} from 'i18n-xlsx-to-json-directory/browser';
```

### createTemplateXlsx()

Create and save template xlsx files.

### convertXlsxToJsonZip(file)

After converting the xlsx file into a json directory structure, compress it to create and download a zip file.

#### options

exportFileType: Creates a default index script file that exports each language and namespace.('js' || 'ts' || undefined)

### convertJsonZipToXlsx(file, options)

After analyzing the zip file, create and download the xlsx file.


## Usage in Node environment

Import the library into the script file as follows.

```javascript
import {
  createTemplateXlsx,
  convertXlsxToJsonZip,
  convertJsonZipToXlsx,
} from 'i18n-xlsx-to-json-directory/node';
```

### createTemplateXlsx(destination)

Create and save template xlsx files.

### convertXlsxToJsonZip(source, destination, options)

After converting the xlsx file into a json directory structure, compress it to create and download a zip file.

#### options

autoExtract: Automatically decompress converted zip files. You must specify a directory in the -d option.

exportFileType: Creates a default index script file that exports each language and namespace.('js' || 'ts' || undefined)

### convertJsonZipToXlsx(source, destination, options)

After analyzing the zip file, create and download the xlsx file.

#### options

autoCompress: Automatically compresses and converts the selected directory. You must specify a directory in the -d option.


## Contributing

Pull requests are always welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.


## License

[Apache License Version 2.0](https://www.apache.org/licenses/LICENSE-2.0)


## Reference

* [https://wormwlrm.github.io/2021/11/07/Rollup-React-TypeScript.html](https://wormwlrm.github.io/2021/11/07/Rollup-React-TypeScript.html)
* [https://chanyeong.com/blog/post/54](https://chanyeong.com/blog/post/54)
* [https://eblo.tistory.com/84](https://eblo.tistory.com/84)
* [https://redstapler.co/sheetjs-tutorial-create-xlsx/](https://redstapler.co/sheetjs-tutorial-create-xlsx/)
