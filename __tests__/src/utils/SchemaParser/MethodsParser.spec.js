import { createOverloadingManager } from "@/src/utils/PropsOverloadingManager";
import { parseMixinMethods } from "@/src/utils/SchemaParser/MethodsParser";

describe("parseMixinMethods", () => {
  it("should be exported", () => {
    expect(parseMixinMethods).toBeDefined();
  });
  it("should throw error called without arg", () => {
    expect(() => parseMixinMethods()).toThrowError();
  });
  it("should throw error called without mixin param", () => {
    expect(() => parseMixinMethods({})).toThrowError();
  });
  it("should throw error called without manager param", () => {
    const mixin = {};
    expect(() => parseMixinMethods({ mixin })).toThrowError();
  });
  it("should pass called with correct params", () => {
    const manager = createOverloadingManager();
    const mixin = {};

    expect(() => parseMixinMethods({ mixin, manager })).not.toThrowError();
  });
  it("should add proto getter in manager", () => {
    const manager = createOverloadingManager();
    const getterName = "testName";
    const mixin = {
      methods: {
        [getterName]() {}
      }
    };

    parseMixinMethods({ mixin, manager });

    expect(manager.proto.getters.has(getterName)).toBe(true);
  });
  it("should call spy on manager apply", () => {
    const manager = createOverloadingManager();
    const getterName = "testName";
    const args = {
      name: "testName",
      age: 18,
      target: {
        id: "some-id"
      }
    };
    const called = {};
    const mixin = {
      methods: {
        [getterName](name, age) {
          called.name = name;
          called.age = age;
          called.target = this;

          return `${name}-${age}-${this.id}`;
        }
      }
    };

    parseMixinMethods({ mixin, manager });

    expect(manager.proto.getters.has(getterName)).toBe(true);

    const result = manager.proto.getters.apply(getterName, args.target)(
      args.name,
      args.age
    );

    expect(called.name).toBe(args.name);
    expect(called.age).toBe(args.age);
    expect(called.target).toBe(args.target);
    expect(result).toBe(`${args.name}-${args.age}-${args.target.id}`);
  });
});
