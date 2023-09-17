export interface JsZipFile {
  name: string;
  dir: boolean;
  async: (type: string) => Promise<any>
}
export interface JsZipFiles {
  files: JsZipFile[];
}
export interface GroupifiedJsZipFiles {
  files: JsZipFile[];
  directories: JsZipFile[];
}

export type I18nLanguageNamespaceJson = object;
export interface I18nLanguageJson {
  [name: string]: I18nLanguageNamespaceJson
}
export interface I18nJson {
  [name: string]: I18nLanguageJson
}

export type WorkSheetJson = object[];
export interface WorkSheetGroupJson {
  [name: string]: WorkSheetJson;
}
