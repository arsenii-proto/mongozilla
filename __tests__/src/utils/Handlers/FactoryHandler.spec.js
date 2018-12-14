import { createModelFactoryHandler } from "@/src/utils/Handlers/FactoryHandler";
import { createHooksMapper } from "@/src/utils/LifeCycleHooksMapper";
import { createOverloadingManager } from "@/src/utils/PropsOverloadingManager";
import { createValidator } from "@/src/utils/BlueprintValidator";

describe("createModelFactoryHandler", () => {
  it("should be exported", () => {
    expect(createModelFactoryHandler).toBeDefined();
  });

  it("should return proxy handler", () => {
    const mapper = createHooksMapper();
    const handler = createModelFactoryHandler({ mapper });

    expect(handler.apply).toBeDefined();
    expect(handler.constructor).toBeDefined();
    expect(handler.defineProperty).toBeDefined();
    expect(handler.deleteProperty).toBeDefined();
    expect(handler.get).toBeDefined();
    expect(handler.getOwnPropertyDescriptor).toBeDefined();
    expect(handler.has).toBeDefined();
    expect(handler.ownKeys).toBeDefined();
    expect(handler.preventExtensions).toBeDefined();
    expect(handler.set).toBeDefined();
    expect(handler.setPrototypeOf).toBeDefined();
  });

  it("should throw error on apply", () => {
    const mapper = createHooksMapper();
    const handler = createModelFactoryHandler({ mapper });

    expect(() => handler.apply()).toThrowError();
  });

  it("should return value on get after defineProperty", () => {
    const mapper = createHooksMapper();
    const manager = createOverloadingManager();
    const handler = createModelFactoryHandler({ mapper, manager });
    const target = { proxy: {} };
    const propName = "name";
    const descriptor = {
      configurable: true,
      value: 123
    };

    const result = handler.defineProperty(target, propName, descriptor);

    expect(result).toBe(true);
    expect(handler.get(target, propName)).toBe(descriptor.value);
  });

  it("should return value on get after set", () => {
    const mapper = createHooksMapper();
    const manager = createOverloadingManager();
    const handler = createModelFactoryHandler({ mapper, manager });
    const target = { proxy: {} };
    const propName = "name";
    const value = 123;

    const result = handler.set(target, propName, value);

    expect(result).toBe(value);
    expect(handler.get(target, propName)).toBe(value);
  });

  it("should return true on delete after set", () => {
    const mapper = createHooksMapper();
    const manager = createOverloadingManager();
    const handler = createModelFactoryHandler({ mapper, manager });
    const target = { proxy: {} };
    const propName = "name";
    const value = 123;

    const result = handler.set(target, propName, value);

    expect(result).toBe(value);
    expect(handler.deleteProperty(target, propName)).toBe(true);
  });

  it("should return configurable from descriptor return from getOwnPropertyDescriptor after set", () => {
    const mapper = createHooksMapper();
    const manager = createOverloadingManager();
    const handler = createModelFactoryHandler({ mapper, manager });
    const target = { proxy: {} };
    const propName = "name";
    const value = 123;

    const result = handler.set(target, propName, value);
    const descriptor = handler.getOwnPropertyDescriptor(target, propName);

    expect(result).toBe(value);
    expect(descriptor.configurable).toBe(true);
    expect(descriptor.value).toBe(value);
  });

  it("should return true on has after set", () => {
    const mapper = createHooksMapper();
    const manager = createOverloadingManager();
    const handler = createModelFactoryHandler({ mapper, manager });
    const target = { proxy: {} };
    const propName = "name";
    const value = 123;

    const result = handler.set(target, propName, value);
    const has = handler.has(target, propName);

    expect(result).toBe(value);
    expect(has).toBe(true);
  });

  it("should return true on isExtensible ", () => {
    const mapper = createHooksMapper();
    const manager = createOverloadingManager();
    const handler = createModelFactoryHandler({ mapper, manager });
    const target = { proxy: {} };

    const result = handler.isExtensible(target);

    expect(result).toBe(true);
  });

  it("should return keys on ownKeys after set", () => {
    const mapper = createHooksMapper();
    const manager = createOverloadingManager();
    const handler = createModelFactoryHandler({ mapper, manager });
    const target = { proxy: {} };
    const propNames = ["name", "age"];
    const values = ["Andrei", 123];

    const result0 = handler.set(target, propNames[0], values[0]);
    const result1 = handler.set(target, propNames[1], values[1]);
    const keys = handler.ownKeys();

    expect(result0).toBe(values[0]);
    expect(result1).toBe(values[1]);
    expect(keys[0]).toBe(propNames[0]);
    expect(keys[1]).toBe(propNames[1]);
  });

  it("should return false on isExtensible after preventExtensions", () => {
    const mapper = createHooksMapper();
    const manager = createOverloadingManager();
    const handler = createModelFactoryHandler({ mapper, manager });
    const target = { proxy: {} };

    handler.preventExtensions(target);

    const result = handler.isExtensible(target);

    expect(result).toBe(false);
  });
});
