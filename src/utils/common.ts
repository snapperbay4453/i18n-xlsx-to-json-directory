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

// https://eblo.tistory.com/84
// https://redstapler.co/sheetjs-tutorial-create-xlsx/
export const stringToArrayBuffer = (s) => { 
  const buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
  let view = new Uint8Array(buf);  //create uint8array as viewer
  for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF; //convert to octet
  return buf;    
};
