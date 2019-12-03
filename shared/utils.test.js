const { getRange } = require("./utils");

describe("getRange", () => {
  test("should return [5, 4, 3, 2] for 5, 2 input", () => {
    expect(getRange(5, 2)).toEqual([5, 4, 3, 2]);
  });
  test("should return [2, 1, 0, -1, -2] for 2, -2 input", () => {
    expect(getRange(2, -2)).toEqual([2, 1, 0, -1, -2]);
  });
  test("should return [2, 3, 4, 5] for 2, 5 input", () => {
    expect(getRange(2, 5)).toEqual([2, 3, 4, 5]);
  });
  test("should return [-2, -1, 0, 1, 2] for -2, 2 input", () => {
    expect(getRange(-2, 2)).toEqual([-2, -1, 0, 1, 2]);
  });
  test("should return [5] for 5, 5 input", () => {
    expect(getRange(5, 5)).toEqual([5]);
  });
});
