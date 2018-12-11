import { createOverloadingManager } from "@/src/utils/PropsOverloadingManager";
import { parseMixinAction } from "@/src/utils/SchemaParser/ActionsParser";

describe("parseMixinAction", () => {
  it("should be exported", () => {
    expect(parseMixinAction).toBeDefined();
  });
  it("should throw error called without arg", () => {
    expect(() => parseMixinAction()).toThrowError();
  });
  it("should throw error called without mixin param", () => {
    expect(() => parseMixinAction({})).toThrowError();
  });
  it("should throw error called without manager param", () => {
    const mixin = {};
    expect(() => parseMixinAction({ mixin })).toThrowError();
  });
  it("should pass called with correct params", () => {
    const manager = createOverloadingManager();
    const mixin = {};

    expect(() => parseMixinAction({ mixin, manager })).not.toThrowError();
  });
  it("should add statically getter in manager", () => {
    const manager = createOverloadingManager();
    const getterName = "testName";
    const mixin = {
      actions: {
        [getterName]() {}
      }
    };

    parseMixinAction({ mixin, manager });

    expect(manager.statically.getters.has(getterName)).toBe(true);
  });
  it("should return promise when apply statically getter from manager", () => {
    const manager = createOverloadingManager();
    const getterName = "testName";
    const mixin = {
      actions: {
        [getterName]() {}
      }
    };

    parseMixinAction({ mixin, manager });

    expect(manager.statically.getters.has(getterName)).toBe(true);

    const result = manager.statically.getters.apply(getterName, {}, []);

    expect(result).toBeInstanceOf(Promise);
  });
  it("should resolve promise when apply statically getter from manager", done => {
    const manager = createOverloadingManager();
    const getterName = "testName";
    const args = {
      name: "testName",
      age: 18,
      target: {
        id: "idd"
      }
    };
    const called = {};
    const mixin = {
      actions: {
        [getterName](name, age) {
          called.name = name;
          called.age = age;
          called.target = this;
          return `${name}-${age}-${this.id}`;
        }
      }
    };

    parseMixinAction({ mixin, manager });

    manager.statically.getters
      .apply(getterName, args.target, [args.name, args.age])
      .then(result => {
        expect(args.name).toBe(called.name);
        expect(args.age).toBe(called.age);
        expect(args.target).toBe(called.target);
        expect(result.started).toBeDefined();
        expect(result.ended).toBeDefined();
        expect(result.result).toBeDefined();
        expect(result.result).toBe(
          `${args.name}-${args.age}-${args.target.id}`
        );
        done();
      })
      .catch(done);
  });
});
