# i18n-xlsx-to-json-directory

.xlsx 파일에 저장된 다국어 데이터를 json 디렉토리 구조로 변환 및 다운로드하는 라이브러리입니다. 디렉토리 구조는 i18next 라이브러리에 맞추어져 있습니다.

브라우저 및 Node 환경을 지원합니다.


## 브라우저 환경에서의 사용법

스크립트 파일에 라이브러리를 아래와 같이 import하세요.

```javascript
import {
  createTemplateXlsx,
  convertXlsxToZip,
  convertZipToXlsx,
} from 'i18n-xlsx-to-json-directory/browser';
```

### createTemplateXlsx()

템플릿 xlsx 파일을 생성 및 다운로드합니다.

### convertXlsxToZip(file)

xlsx 파일을 json 디렉토리 구조로 변환한 후, 이를 압축하여 zip 파일을 생성 및 다운로드합니다.

### convertZipToXlsx(file, options)

.zip 파일을 분석한 후, xlsx 파일을 생성 및 다운로드합니다.

#### options

defaultExportFileType: 각 언어 및 네임스페이스를 export하는 기본 index 스크립트 파일을 생성합니다. ('js' || 'ts' || undefined)


## Node 환경에서의 사용법

package.json에 아래 예시 스크립트를 추가해주세요.

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

템플릿 xlsx 파일을 생성 및 저장합니다.

#### options

-s, --source: 변환할 파일을 불러올 경로입니다.

-d, --destination: 변환된 파일이 저장될 경로입니다.

### npm run xlsx-to-zip

xlsx 파일을 json 디렉토리 구조로 변환한 후, 이를 압축하여 zip 파일을 생성 및 다운로드합니다.

#### options

-s, --source: 변환할 파일을 불러올 경로입니다.

-d, --destination: 변환된 파일이 저장될 경로입니다.

--export-file-type: 각 언어 및 네임스페이스를 export하는 기본 index 스크립트 파일을 생성합니다. ('js' || 'ts' || undefined)

--auto-extract: 변환된 zip 파일을 자동으로 압축 해제합니다. -d 옵션에 디렉토리를 지정해야 합니다.

### npm run zip-to-xlsx

.zip 파일을 분석한 후, xlsx 파일을 생성 및 다운로드합니다.

#### options

-s, --source: 변환할 파일을 불러올 경로입니다.

-d, --destination: 변환된 파일이 저장될 경로입니다.


## 기여

풀 리퀘스트는 언제나 환영입니다. 주요 변경 사항에 대해서는 먼저 이슈를 열어 변경 사항을 논의해주세요.

테스트를 적절하게 업데이트 해주시기 바랍니다.


## 라이선스

[Apache License Version 2.0](https://www.apache.org/licenses/LICENSE-2.0)


## 참조

* [https://wormwlrm.github.io/2021/11/07/Rollup-React-TypeScript.html](https://wormwlrm.github.io/2021/11/07/Rollup-React-TypeScript.html)
* [https://chanyeong.com/blog/post/54](https://chanyeong.com/blog/post/54)
* [https://eblo.tistory.com/84](https://eblo.tistory.com/84)
* [https://redstapler.co/sheetjs-tutorial-create-xlsx/](https://redstapler.co/sheetjs-tutorial-create-xlsx/)
