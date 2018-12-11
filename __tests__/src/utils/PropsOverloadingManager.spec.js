import { createOverloadingManager } from "@/src/utils/PropsOverloadingManager";

describe("createOverloadingManager", () => {
  it("should be exported", () => {
    expect(createOverloadingManager).toBeDefined();
  });
  it("should return object by shape", () => {
    const propsManager = createOverloadingManager();

    expect(propsManager.proto).toBeDefined();
    expect(propsManager.proto.getters).toBeDefined();
    expect(propsManager.proto.getters.has).toBeDefined();
    expect(propsManager.proto.getters.set).toBeDefined();
    expect(propsManager.proto.getters.delete).toBeDefined();
    expect(propsManager.proto.getters.apply).toBeDefined();
    expect(propsManager.proto.setters).toBeDefined();
    expect(propsManager.proto.setters.has).toBeDefined();
    expect(propsManager.proto.setters.set).toBeDefined();
    expect(propsManager.proto.setters.delete).toBeDefined();
    expect(propsManager.proto.setters.apply).toBeDefined();
    expect(propsManager.statically).toBeDefined();
    expect(propsManager.statically.getters).toBeDefined();
    expect(propsManager.statically.getters.has).toBeDefined();
    expect(propsManager.statically.getters.set).toBeDefined();
    expect(propsManager.statically.getters.delete).toBeDefined();
    expect(propsManager.statically.getters.apply).toBeDefined();
    expect(propsManager.statically.setters).toBeDefined();
    expect(propsManager.statically.setters.has).toBeDefined();
    expect(propsManager.statically.setters.set).toBeDefined();
    expect(propsManager.statically.setters.delete).toBeDefined();
    expect(propsManager.statically.setters.apply).toBeDefined();
  });
});

describe("Manager returned by createOverloadingManager", () => {
  describe("proto namespace", () => {
    describe("getters facade", () => {
      describe("set method", () => {
        it("should pass called with correct args", () => {
          const manager = createOverloadingManager();

          expect(() =>
            manager.proto.getters.set("testName", () => {})
          ).not.toThrowError();
        });
        it("should throw error called with first arg only", () => {
          const manager = createOverloadingManager();

          expect(() => manager.proto.getters.set("testName")).toThrowError();
        });
        it("should throw error called with wrong first arg", () => {
          const manager = createOverloadingManager();

          expect(() => manager.proto.getters.set(11, () => {})).toThrowError();
          expect(() => manager.proto.getters.set({}, () => {})).toThrowError();
          expect(() =>
            manager.proto.getters.set(true, () => {})
          ).toThrowError();
        });
        it("should throw error called with wrong second arg", () => {
          const manager = createOverloadingManager();

          expect(() =>
            manager.proto.getters.set("testName", 11)
          ).toThrowError();
          expect(() =>
            manager.proto.getters.set("testName", {})
          ).toThrowError();
          expect(() =>
            manager.proto.getters.set("testName", true)
          ).toThrowError();
        });
      });
      describe("has method", () => {
        it("should return false before set", () => {
          const manager = createOverloadingManager();

          expect(manager.proto.getters.has("testName")).toBe(false);
        });
        it("should return true before set same name", () => {
          const manager = createOverloadingManager();

          manager.proto.getters.set("testName", () => {});

          expect(manager.proto.getters.has("testName")).toBe(true);
        });
        it("should throw error called with wrong args", () => {
          const manager = createOverloadingManager();

          expect(() => manager.proto.getters.has(11)).toThrowError();
          expect(() => manager.proto.getters.has({})).toThrowError();
          expect(() => manager.proto.getters.has(true)).toThrowError();
        });
      });
      describe("delete method", () => {
        it("should pass with correct name arg", () => {
          const manager = createOverloadingManager();

          expect(() =>
            manager.proto.getters.delete("testName")
          ).not.toThrowError();
        });
        it("should throw error with wrong arg", () => {
          const manager = createOverloadingManager();

          expect(() => manager.proto.getters.delete(11)).toThrowError();
          expect(() => manager.proto.getters.delete({})).toThrowError();
          expect(() => manager.proto.getters.delete(true)).toThrowError();
        });
      });
      describe("apply method", () => {
        it("should pass with correct args", () => {
          const manager = createOverloadingManager();

          expect(() =>
            manager.proto.getters.apply("testName", {}, [])
          ).not.toThrowError();
        });
        it("should throw error with first arg only", () => {
          const manager = createOverloadingManager();

          expect(() => manager.proto.getters.apply("testName")).toThrowError();
        });
        it("should throw error with wrong first arg", () => {
          const manager = createOverloadingManager();

          expect(() => manager.proto.getters.apply(11, {})).toThrowError();
          expect(() => manager.proto.getters.apply({}, {})).toThrowError();
          expect(() => manager.proto.getters.apply(true, {})).toThrowError();
        });
        it("should throw error with wrong second arg", () => {
          const manager = createOverloadingManager();

          expect(() =>
            manager.proto.getters.apply("testName", 11)
          ).toThrowError();

          expect(() =>
            manager.proto.getters.apply("testName", "")
          ).toThrowError();

          expect(() =>
            manager.proto.getters.apply("testName", true)
          ).toThrowError();
        });
        it("should throw error with wrong third arg", () => {
          const manager = createOverloadingManager();

          expect(() =>
            manager.proto.getters.apply("testName", {}, 11)
          ).toThrowError();

          expect(() =>
            manager.proto.getters.apply("testName", {}, {})
          ).toThrowError();

          expect(() =>
            manager.proto.getters.apply("testName", {}, true)
          ).toThrowError();
        });
        it("should call spyCallable function on called", () => {
          const manager = createOverloadingManager();
          const target = {
            called: null,
            passed: {}
          };
          const spyCallable = jest.fn(function() {
            return (target.called = this);
          });

          manager.proto.getters.set("testName", spyCallable);

          const result = manager.proto.getters.apply("testName", target.passed);

          expect(spyCallable).toBeCalledTimes(1);
          expect(target.passed).toBe(target.called);
          expect(result).toBe(target.passed);
        });
      });
    });
  });
});
