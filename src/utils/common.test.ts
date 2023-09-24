import { getByteSize } from './common';

describe("within /utils/common.ts file", () => {
  describe("within getByteSize function", () => {
    it("should return correct byte size of the string", () => {
      expect(getByteSize('a')).toEqual(1);
      expect(getByteSize('가')).toEqual(2);
      expect(getByteSize('각')).toEqual(2);
      expect(getByteSize('가a')).toEqual(3);
    });
  });
});
