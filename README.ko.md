# i18n-xlsx-to-json-directory

![](https://img.shields.io/npm/v/i18n-xlsx-to-json-directory)
![](https://img.shields.io/npm/l/i18n-xlsx-to-json-directory)
![](https://img.shields.io/npm/dt/i18n-xlsx-to-json-directory)
![](https://img.shields.io/github/contributors/snapperbay4453/i18n-xlsx-to-json-directory)
![](https://img.shields.io/github/last-commit/snapperbay4453/i18n-xlsx-to-json-directory)


xlsx 파일에 저장된 다국어 데이터를 JSON 디렉토리 구조로 변환 및 다운로드하거나, 그 반대로도 동작하는 라이브러리입니다. 디렉토리 구조는 i18next 라이브러리에 맞추어져 있습니다.


## 특장점

### 다양한 실행 환경 지원
npx 명령어를 통한 직접 실행을 지원합니다. 또한 브라우저 및 Node 환경에서의 import를 지원합니다.

### JSON 디렉터리 압축 여부 선택
JSON 디렉터리로 변환 시, zip 파일로의 압축 여부를 선택할 수 있습니다. 또한 역으로도 가능합니다.

### index.js/ts 파일 자동 생성
다국어 데이터를 프로젝트에 import하기 위한 index.js/ts 파일의 생성 여부를 선택할 수 있습니다.

### 템플릿 xlsx 파일 생성 가능
템플릿 xlsx 파일을 생성하여, 편리하게 작업을 시작할 수 있습니다.


## 직접 사용하는 방법

터미널에서 직접 실행할 수 있는 명령어의 예시는 아래와 같습니다.

JSON 디렉터리 자동 압축/압축해제 미사용 및 index.js 자동 생성:

```bash
npx i18n-xlsx-to-json-directory template-xlsx -d ./template_i18n.xlsx
npx i18n-xlsx-to-json-directory xlsx-to-json-zip -s ./template_i18n.xlsx -d ./i18n.zip --export-file-type js
npx i18n-xlsx-to-json-directory json-zip-to-xlsx -s ./i18n.zip -d ./i18n.xlsx
```

JSON 디렉터리 자동 압축/압축해제 사용 및 index.ts 자동 생성:

```bash
npx i18n-xlsx-to-json-directory template-xlsx -d ./template_i18n.xlsx
npx i18n-xlsx-to-json-directory xlsx-to-json-zip -s ./template_i18n.xlsx -d ./i18n --export-file-type ts --auto-extract
npx i18n-xlsx-to-json-directory json-zip-to-xlsx -s ./i18n -d ./i18n.xlsx --auto-compress
```

### template-xlsx

템플릿 xlsx 파일을 생성 및 저장합니다.

#### options

-d, --destination: 변환된 파일이 저장될 경로입니다.

### xlsx-to-json-zip

xlsx 파일을 json 디렉토리 구조로 변환한 후, 이를 압축하여 zip 파일을 생성 및 다운로드합니다.

#### options

-s, --source: 변환할 파일을 불러올 경로입니다.

-d, --destination: 변환된 파일이 저장될 경로입니다.

--auto-extract: 변환된 zip 파일을 자동으로 압축 해제합니다. -d 옵션에 디렉토리를 지정해야 합니다.

--export-file-type: 각 언어 및 네임스페이스를 export하는 기본 index 스크립트 파일을 생성합니다. ('js' || 'ts' || undefined)

### json-zip-to-xlsx

zip 파일을 분석한 후, xlsx 파일을 생성 및 다운로드합니다.

#### options

-s, --source: 변환할 파일을 불러올 경로입니다.

-d, --destination: 변환된 파일이 저장될 경로입니다.

--auto-compress: 선택한 디렉터리를 자동으로 압축한 후 변환합니다. -d 옵션에 디렉토리를 지정해야 합니다.


## 브라우저 환경에서 사용하는 방법

스크립트 파일에 라이브러리를 아래와 같이 import하세요.

```javascript
import {
  createTemplateXlsx,
  convertXlsxToJsonZip,
  convertJsonZipToXlsx,
} from 'i18n-xlsx-to-json-directory/browser';
```

### createTemplateXlsx()

템플릿 xlsx 파일을 생성 및 다운로드합니다.

### convertXlsxToJsonZip(file, options)

xlsx 파일을 json 디렉토리 구조로 변환한 후, 이를 압축하여 zip 파일을 생성 및 다운로드합니다.

#### options

exportFileType: 각 언어 및 네임스페이스를 export하는 기본 index 스크립트 파일을 생성합니다. ('js' || 'ts' || undefined)

### convertJsonZipToXlsx(file)

zip 파일을 분석한 후, xlsx 파일을 생성 및 다운로드합니다.


## Node.js 환경에서 사용하는 방법

스크립트 파일에 라이브러리를 아래와 같이 import하세요.

```javascript
import {
  createTemplateXlsx,
  convertXlsxToJsonZip,
  convertJsonZipToXlsx,
} from 'i18n-xlsx-to-json-directory/node';
```

### createTemplateXlsx(destination)

템플릿 xlsx 파일을 생성 및 다운로드합니다.

### convertXlsxToJsonZip(source, destination, options)

xlsx 파일을 json 디렉토리 구조로 변환한 후, 이를 압축하여 zip 파일을 생성 및 다운로드합니다.

#### options

autoExtract: 변환된 zip 파일을 자동으로 압축 해제합니다. -d 옵션에 디렉토리를 지정해야 합니다.

exportFileType: 각 언어 및 네임스페이스를 export하는 기본 index 스크립트 파일을 생성합니다. ('js' || 'ts' || undefined)

### convertJsonZipToXlsx(source, destination, options)

zip 파일을 분석한 후, xlsx 파일을 생성 및 다운로드합니다.

#### options

autoCompress: 선택한 디렉터리를 자동으로 압축한 후 변환합니다. -d 옵션에 디렉토리를 지정해야 합니다.


## 트러블슈팅

### SheetJS 의존성과 관련하여 SSL 인증서 문제가 발생합니다.

[SheetJS 라이브러리 웹사이트](https://docs.sheetjs.com/docs/miscellany/contributing/#build-from-source-tree)를 참조하여 문제를 해결할 수 있습니다.


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
