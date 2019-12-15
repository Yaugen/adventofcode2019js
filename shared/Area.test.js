const Area = require("./Area");

global.console = { log: jest.fn() };

describe("Area", () => {
  test("it should have zero dimensions for empty area", () => {
    const area = new Area();
    expect(area.height).toBe(0);
    expect(area.width).toBe(0);
    expect(area.get(1, 1)).toBe(undefined);
  });
  test("it return element using index", () => {
    const area = new Area();
    for (let i = 0; i < 5; i++) {
      area.set(i, i, i);
    }
    expect(area.height).toBe(5);
    expect(area.width).toBe(5);
    expect(area.get(1, 1)).toBe(1);
  });
  test("it should work with negative indexes", () => {
    const area = new Area();
    area.set(2, 2, "value1");
    area.set(-3, -2, "value2");
    expect(area.width).toBe(6);
    expect(area.height).toBe(5);
    expect(area.get(2, 2)).toBe("value1");
    expect(area.get(-3, -2)).toBe("value2");
    expect(area.get(-3, 2)).toBe(undefined);
  });

  test("area should be traversible", () => {
    const area = new Area();
    area.set(2, 2, "value1");
    area.set(-2, -2, "value2");
    const cb = jest.fn();
    area.traverse(cb);
    expect(cb.mock.calls.length).toBe(25);
    expect(cb.mock.calls[0]).toEqual([-2, -2, "value2"]);
    expect(cb.mock.calls[4]).toEqual([-2, 2, undefined]);
    expect(cb.mock.calls[24]).toEqual([2, 2, "value1"]);
  });

  test("it should print itself", () => {
    jest.spyOn(global.console, "log");
    const area = new Area("_");
    area.set(1, 1, "1");
    area.set(0, 0, "0");
    area.print();
    expect(console.log.mock.calls.length).toBe(1);
    expect(console.log.mock.calls[0][0]).toBe("0_\n_1\n");
  });
});
