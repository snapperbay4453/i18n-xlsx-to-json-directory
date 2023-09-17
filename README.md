# i18n-xlsx-to-json-directory

Library that converts and downloads multilingual data stored in .xlsx files into a json directory structure.

The directory structure is tailored to the i18next library.

## Usage

```javascript
import {
  createTemplateI18nXlsx,
  convertI18XlsxToJsonDirectoryZip,
  convertJsonDirectoryZipToI18Xlsx,
} from 'i18n-xlsx-to-json-directory';
```

### createTemplateI18nXlsx

Create and download template .xlsx files.

### convertI18XlsxToJsonDirectoryZip

Convert the .xlsx file to the json directory structure, then compress it to create and download the zip file.

### convertJsonDirectoryZipToI18Xlsx

Analyze the .zip file, then create and download the .xlsx file.

#### options

createDefaultExportFileType: Create a default index script file to export each language and namespace. ('js' || 'ts' || undefined)


## Contributing

Pull requests are always welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[Apache License Version 2.0](https://www.apache.org/licenses/LICENSE-2.0)

## Reference

* [https://wormwlrm.github.io/2021/11/07/Rollup-React-TypeScript.html](https://wormwlrm.github.io/2021/11/07/Rollup-React-TypeScript.html)
* [https://git.sheetjs.com/sheetjs/sheetjs/src/commit/9add78a29073eaafc2e83c6522ff79219ee7053f/demos/rollup](https://git.sheetjs.com/sheetjs/sheetjs/src/commit/
* [https://chanyeong.com/blog/post/54](https://chanyeong.com/blog/post/54)9add78a29073eaafc2e83c6522ff79219ee7053f/demos/rollup)
* [https://eblo.tistory.com/84](https://eblo.tistory.com/84)
* [https://redstapler.co/sheetjs-tutorial-create-xlsx/](https://redstapler.co/sheetjs-tutorial-create-xlsx/)
