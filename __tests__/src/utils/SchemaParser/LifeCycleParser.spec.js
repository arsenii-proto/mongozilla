import { parseMixinLifeCycle } from "@/src/utils/SchemaParser/LifeCycleParser";
import {
  availableHooks,
  createHooksMapper,
  MIXIN,
  MODEL,
  SYSTEM
} from "@/src/utils/LifeCycleHooksMapper";

describe("parseMixinLifeCycle", () => {
  it("should be exported", () => {
    expect(parseMixinLifeCycle).toBeDefined();
  });
  it("should pass called with correct args", () => {
    const mapper = createHooksMapper();
    const mixin = {};
    expect(() => parseMixinLifeCycle({ mixin, mapper })).not.toThrowError();
  });
  it("should throw error called without args", () => {
    expect(() => parseMixinLifeCycle()).toThrowError();
  });
  it("should throw error called just with mixin", () => {
    const mixin = {};
    expect(() => parseMixinLifeCycle({ mixin })).toThrowError();
  });
  it("should throw error called just with mapper", () => {
    const mapper = createHooksMapper();
    expect(() => parseMixinLifeCycle({ mapper })).toThrowError();
  });
  it("should call lifecycle spy hook on mapper fire after register", () => {
    const mapper = createHooksMapper();
    const lifecycleName = availableHooks[0];
    const lifecycleSpy = jest.fn();
    const mixin = {
      [lifecycleName]: lifecycleSpy
    };

    parseMixinLifeCycle({ mixin, mapper });
    mapper.fire(lifecycleName, {}, [], []);

    expect(lifecycleSpy).toBeCalled();
  });
  it("should call lifecycle spy hook with correct this on mapper fire after register", () => {
    const mapper = createHooksMapper();
    const lifecycleName = availableHooks[0];
    const args = {
      target: {},
      calledTarget: null
    };
    const mixin = {
      [lifecycleName]() {
        args.calledTarget = this;
      }
    };

    parseMixinLifeCycle({ mixin, mapper });
    mapper.fire(lifecycleName, args.target, [], []);

    expect(args.calledTarget).toBe(args.target);
  });
  it("should call lifecycle spy hook with correct args on mapper fire after register", () => {
    const mapper = createHooksMapper();
    const lifecycleName = availableHooks[0];
    const args = {
      passed: {
        name: "testName",
        age: 18
      },
      called: {}
    };
    const mixin = {
      [lifecycleName](name, age) {
        args.called.name = name;
        args.called.age = age;
      }
    };

    parseMixinLifeCycle({ mixin, mapper });
    mapper.fire(lifecycleName, {}, [args.passed.name, args.passed.age], []);

    expect(args.passed.name).toBe(args.called.name);
    expect(args.passed.age).toBe(args.called.age);
  });
  it("should add lifecycle hook as MIXIN _$type without passing it", () => {
    const mapper = createHooksMapper();
    const lifecycleName = availableHooks[0];
    const args = {
      passed: {
        name: "testName",
        age: 18
      },
      called: {},
      system: {
        mapper
      }
    };
    const mixin = {
      [lifecycleName](name, age) {
        args.called.name = name;
        args.called.age = age;
      }
    };

    parseMixinLifeCycle({ mixin, mapper });
    mapper.fire(
      lifecycleName,
      {},
      [args.passed.name, args.passed.age],
      [args.system.mapper]
    );

    expect(args.passed.name).toBe(args.called.name);
    expect(args.passed.age).toBe(args.called.age);
  });
  it("should add lifecycle hook as MIXIN _$type with passing it", () => {
    const mapper = createHooksMapper();
    const lifecycleName = availableHooks[0];
    const args = {
      passed: {
        name: "testName",
        age: 18
      },
      called: {},
      system: {
        mapper
      }
    };
    const mixin = {
      _$type: MIXIN,
      [lifecycleName](name, age) {
        args.called.name = name;
        args.called.age = age;
      }
    };

    parseMixinLifeCycle({ mixin, mapper });
    mapper.fire(
      lifecycleName,
      {},
      [args.passed.name, args.passed.age],
      [args.system.mapper]
    );

    expect(args.passed.name).toBe(args.called.name);
    expect(args.passed.age).toBe(args.called.age);
  });
  it("should add lifecycle hook as MODEL _$type when pass it", () => {
    const mapper = createHooksMapper();
    const lifecycleName = availableHooks[0];
    const args = {
      passed: {
        name: "testName",
        age: 18
      },
      called: {},
      system: {
        mapper
      }
    };
    const mixin = {
      _$type: MODEL,
      [lifecycleName](name, age) {
        args.called.name = name;
        args.called.age = age;
      }
    };

    parseMixinLifeCycle({ mixin, mapper });
    mapper.fire(
      lifecycleName,
      {},
      [args.passed.name, args.passed.age],
      [args.system.mapper]
    );

    expect(args.passed.name).toBe(args.called.name);
    expect(args.passed.age).toBe(args.called.age);
  });
  it("should add lifecycle hook as SYSTEM _$type when pass it", () => {
    const mapper = createHooksMapper();
    const lifecycleName = availableHooks[0];
    const args = {
      passed: {
        name: "testName",
        age: 18
      },
      called: {},
      system: {
        mapper
      }
    };
    const mixin = {
      _$type: SYSTEM,
      [lifecycleName](name, age) {
        args.called.name = name;
        args.called.age = age;
      }
    };

    parseMixinLifeCycle({ mixin, mapper });
    mapper.fire(
      lifecycleName,
      {},
      [args.passed.name, args.passed.age],
      [args.system.mapper]
    );

    expect(args.called.name).toBeInstanceOf(Array);
    expect(args.called.name.length).toBe(2);
    expect(args.called.name[0]).toBe(args.passed.name);
    expect(args.called.name[1]).toBe(args.passed.age);
    expect(args.called.age).toBeInstanceOf(Array);
    expect(args.called.age.length).toBe(1);
    expect(args.called.age[0]).toBe(args.system.mapper);
  });
});
