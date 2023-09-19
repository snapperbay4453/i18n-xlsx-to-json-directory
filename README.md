# i18n-xlsx-to-json-directory

![](https://img.shields.io/npm/v/i18n-xlsx-to-json-directory)
![](https://img.shields.io/npm/l/i18n-xlsx-to-json-directory)
![](https://img.shields.io/npm/dt/i18n-xlsx-to-json-directory)
![](https://img.shields.io/github/contributors/snapperbay4453/i18n-xlsx-to-json-directory)
![](https://img.shields.io/github/last-commit/snapperbay4453/i18n-xlsx-to-json-directory)


Library that converts and downloads multilingual data stored in .xlsx files into a json directory structure. The directory structure is tailored to the i18next library.

Supports browser and node environments.


## Usage in Browser Environment

Import the library into the script file as shown below.

```javascript
import {
  createTemplateXlsx,
  convertXlsxToZip,
  convertZipToXlsx,
} from 'i18n-xlsx-to-json-directory/browser';
```

### createTemplateXlsx()

Create and download template xlsx file.

### convertXlsxToZip(file)

Convert the xlsx file to the json directory structure, then compress it to create and download the zip file.

### convertZipToXlsx(file, options)

Analyze the zip file, then create and download the xlsx file.

#### options

defaultExportFileType: Create a default index script file to export each language and namespace. ('js' || 'ts' || undefined)


## Usage in Node Environment

Please add the example script below to package.json.

```json
{
  "scripts": {
    "template-xlsx": "node ./node_modules/i18n-xlsx-to-json-directory/dist/node.cjs template-xlsx -d ./template_i18n.xlsx",
    "xlsx-to-zip": "node ./node_modules/i18n-xlsx-to-json-directory/dist/node.cjs xlsx-to-zip -s ./i18n.xlsx -d ./i18n.zip --export-file-type js",
    "xlsx-to-directory": "node ./node_modules/i18n-xlsx-to-json-directory/dist/node.cjs xlsx-to-zip -s ./i18n.xlsx -d ./i18n --export-file-type ts --auto-extract",
    "zip-to-xlsx": "node ./node_modules/i18n-xlsx-to-json-directory/dist/node.cjs zip-to-xlsx -s ./i18n.zip -d ./i18n.xlsx"
  },
}
```

### npm run template-xlsx

Create and download template xlsx file.

#### options

-s, --source: Path to recall files to convert.

-d, --destination: Path where the converted file is stored.

### npm run xlsx-to-zip

Convert the xlsx file to the json directory structure, then compress it to create and download the zip file.

#### options

-s, --source: Path to recall files to convert.

-d, --destination: Path where the converted file is stored.

--export-file-type: Create a default index script file to export each language and namespace. ('js' || 'ts' || undefined)

--auto-extract: Automatically decompresses converted zip files. You must specify a directory in the -d option.

### npm run zip-to-xlsx

Analyze the zip file, then create and download the xlsx file.

#### options

-s, --source: Path to recall files to convert.

-d, --destination: Path where the converted file is stored.


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
