export const getByteSize = (targetString: string) => {
  const str: string = targetString.toString();
  let byteSize: number = 0;
  let char: number;

  for (let i = 0; !isNaN(str.charCodeAt(i)); i++) {
    char = str.charCodeAt(i);

    /*
    if (char >> 11) {
      byteSize += 3;
    }
    */

    if (char >> 7) {
      byteSize += 2;
    }
    else {
      byteSize += 1;
    }
  }

  return byteSize;
};

export const stringToArrayBuffer = (str: string) => {
  // https://eblo.tistory.com/84
  // https://redstapler.co/sheetjs-tutorial-create-xlsx/
  const buf = new ArrayBuffer(str.length); //convert s to arrayBuffer
  let view = new Uint8Array(buf);  //create uint8array as viewer
  for (let i = 0; i < str.length; i++) view[i] = str.charCodeAt(i) & 0xFF; //convert to octet
  return buf;    
};

export const ArrayBufferToString = (arrayBuffer: ArrayBuffer) => {
  const str = new TextDecoder().decode(arrayBuffer);
  return str;  
}

export const JsonMapper = (() => {
  // https://stackoverflow.com/questions/29085197/how-do-you-json-stringify-an-es6-map
  // https://stackoverflow.com/questions/23097928/node-js-throws-btoa-is-not-defined-error

  function replacer(_key: any, value: any) {
    if(value instanceof ArrayBuffer) {
      const dec = new TextDecoder("utf-8");
      const b64encoded = Buffer.from(dec.decode(value)).toString('base64');
      return {
        dataType: 'ArrayBuffer',
        value: b64encoded,
      };
    } else if(value instanceof Map) {
      return {
        dataType: 'Map',
        value: Array.from(value.entries()), // or with spread: value: [...value]
      };
    } else {
      return value;
    }
  }

  function reviver(_key: any, value: any) {
    if(typeof value === 'object' && value !== null) {
      if (value.dataType === 'ArrayBuffer') {
        const enc = new TextEncoder();
        const b64decoded = enc.encode(Buffer.from(value, 'base64').toString());
        return b64decoded;
      } else if (value.dataType === 'Map') {
        return new Map(value.value);
      }
    }
    return value;
  }

  return {
    stringify: (originalValue: any) => JSON.stringify(originalValue, replacer),
    parse: (str: string) => JSON.parse(str, reviver),
  }
})();
