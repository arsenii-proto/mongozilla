import { createOverloadingManager } from "@/src/utils/PropsOverloadingManager";
import { parseMixinComputed } from "@/src/utils/SchemaParser/ComputedParser";

describe("parseMixinComputed", () => {
  it("should be exported", () => {
    expect(parseMixinComputed).toBeDefined();
  });

  it("should throw error called without arg", () => {
    expect(() => parseMixinComputed()).toThrowError();
  });
  it("should throw error called without mixin param", () => {
    expect(() => parseMixinComputed({})).toThrowError();
  });
  it("should throw error called without manager param", () => {
    const mixin = {};
    expect(() => parseMixinComputed({ mixin })).toThrowError();
  });
  it("should pass called with correct params", () => {
    const manager = createOverloadingManager();
    const mixin = {};

    expect(() => parseMixinComputed({ mixin, manager })).not.toThrowError();
  });
  it("should add just proto getter called with mixin been function", () => {
    const manager = createOverloadingManager();
    const computedName = "testName";
    const mixin = {
      computed: {
        [computedName]() {}
      }
    };

    parseMixinComputed({ mixin, manager });

    expect(manager.proto.getters.has(computedName)).toBe(true);
    expect(manager.proto.setters.has(computedName)).toBe(false);
  });
  it("should add just proto getter called with mixin been {get}", () => {
    const manager = createOverloadingManager();
    const computedName = "testName";
    const mixin = {
      computed: {
        [computedName]: {
          get() {}
        }
      }
    };

    parseMixinComputed({ mixin, manager });

    expect(manager.proto.getters.has(computedName)).toBe(true);
    expect(manager.proto.setters.has(computedName)).toBe(false);
  });
  it("should add just proto setter called with mixin been {set}", () => {
    const manager = createOverloadingManager();
    const computedName = "testName";
    const mixin = {
      computed: {
        [computedName]: {
          set() {}
        }
      }
    };

    parseMixinComputed({ mixin, manager });

    expect(manager.proto.getters.has(computedName)).toBe(false);
    expect(manager.proto.setters.has(computedName)).toBe(true);
  });
  it("should add proto setter/getter called with mixin been {set, get}", () => {
    const manager = createOverloadingManager();
    const computedName = "testName";
    const mixin = {
      computed: {
        [computedName]: {
          set() {},
          get() {}
        }
      }
    };

    parseMixinComputed({ mixin, manager });

    expect(manager.proto.getters.has(computedName)).toBe(true);
    expect(manager.proto.setters.has(computedName)).toBe(true);
  });
  it("should return correct data called been funcion", () => {
    const manager = createOverloadingManager();
    const computedName = "testName";
    const target = {
      name: "testName"
    };
    const called = {};
    const mixin = {
      computed: {
        [computedName]() {
          called.target = target;

          return this.name;
        }
      }
    };

    parseMixinComputed({ mixin, manager });

    expect(manager.proto.getters.has(computedName)).toBe(true);

    const result = manager.proto.getters.apply(computedName, target, []);

    expect(called.target).toBe(target);
    expect(result).toBe(target.name);
  });
  it("should return correct data called been {get}", () => {
    const manager = createOverloadingManager();
    const computedName = "testName";
    const target = {
      name: "testName"
    };
    const called = {};
    const mixin = {
      computed: {
        [computedName]: {
          get() {
            called.target = target;

            return this.name;
          }
        }
      }
    };

    parseMixinComputed({ mixin, manager });

    expect(manager.proto.getters.has(computedName)).toBe(true);

    const result = manager.proto.getters.apply(computedName, target, []);

    expect(called.target).toBe(target);
    expect(result).toBe(target.name);
  });
  it("should return correct data called been {set}", () => {
    const manager = createOverloadingManager();
    const computedName = "testName";
    const target = {
      name: "testName"
    };
    const called = {};
    const mixin = {
      computed: {
        [computedName]: {
          set(name) {
            called.target = target;

            this.name = name;
          }
        }
      }
    };

    parseMixinComputed({ mixin, manager });

    expect(manager.proto.setters.has(computedName)).toBe(true);

    manager.proto.setters.apply(computedName, target, ["newTestName"]);

    expect(called.target).toBe(target);
    expect(target.name).toBe("newTestName");
  });
  it("should return correct data called been {set, get}", () => {
    const manager = createOverloadingManager();
    const computedName = "testName";
    const target = {
      name: "testName"
    };
    const called = {};
    const mixin = {
      computed: {
        [computedName]: {
          get() {
            called.target = target;

            return this.name;
          },
          set(name) {
            called.target = target;

            this.name = name;
          }
        }
      }
    };

    parseMixinComputed({ mixin, manager });

    expect(manager.proto.getters.has(computedName)).toBe(true);

    const result = manager.proto.getters.apply(computedName, target, []);

    expect(called.target).toBe(target);
    expect(result).toBe(target.name);

    expect(manager.proto.setters.has(computedName)).toBe(true);

    manager.proto.setters.apply(computedName, target, ["newTestName"]);

    expect(called.target).toBe(target);
    expect(target.name).toBe("newTestName");
  });
});
