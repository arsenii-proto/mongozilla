import {
  createOverloadingManager,
  createExtendedOverloadingManager
} from "@/src/utils/PropsOverloadingManager";

describe("createOverloadingManager", () => {
  it("should be exported", () => {
    expect(createOverloadingManager).toBeDefined();
  });
  it("should return object by shape", () => {
    const manager = createOverloadingManager();

    expect(manager.proto).toBeDefined();
    expect(manager.proto.getters).toBeDefined();
    expect(manager.proto.getters.has).toBeDefined();
    expect(manager.proto.getters.set).toBeDefined();
    expect(manager.proto.getters.delete).toBeDefined();
    expect(manager.proto.getters.apply).toBeDefined();
    expect(manager.proto.setters).toBeDefined();
    expect(manager.proto.setters.has).toBeDefined();
    expect(manager.proto.setters.set).toBeDefined();
    expect(manager.proto.setters.delete).toBeDefined();
    expect(manager.proto.setters.apply).toBeDefined();
    expect(manager.statically).toBeDefined();
    expect(manager.statically.getters).toBeDefined();
    expect(manager.statically.getters.has).toBeDefined();
    expect(manager.statically.getters.set).toBeDefined();
    expect(manager.statically.getters.delete).toBeDefined();
    expect(manager.statically.getters.apply).toBeDefined();
    expect(manager.statically.setters).toBeDefined();
    expect(manager.statically.setters.has).toBeDefined();
    expect(manager.statically.setters.set).toBeDefined();
    expect(manager.statically.setters.delete).toBeDefined();
    expect(manager.statically.setters.apply).toBeDefined();
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
        it("should delete after set same name", () => {
          const manager = createOverloadingManager();
          const getterName = "testName";

          manager.proto.getters.set(getterName, () => {});
          expect(manager.proto.getters.has(getterName)).toBe(true);

          manager.proto.getters.delete(getterName);
          expect(manager.proto.getters.has(getterName)).toBe(false);
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
    describe("setters facade", () => {
      describe("set method", () => {
        it("should pass called with correct args", () => {
          const manager = createOverloadingManager();

          expect(() =>
            manager.proto.setters.set("testName", () => {})
          ).not.toThrowError();
        });
        it("should throw error called with first arg only", () => {
          const manager = createOverloadingManager();

          expect(() => manager.proto.setters.set("testName")).toThrowError();
        });
        it("should throw error called with wrong first arg", () => {
          const manager = createOverloadingManager();

          expect(() => manager.proto.setters.set(11, () => {})).toThrowError();
          expect(() => manager.proto.setters.set({}, () => {})).toThrowError();
          expect(() =>
            manager.proto.setters.set(true, () => {})
          ).toThrowError();
        });
        it("should throw error called with wrong second arg", () => {
          const manager = createOverloadingManager();

          expect(() =>
            manager.proto.setters.set("testName", 11)
          ).toThrowError();
          expect(() =>
            manager.proto.setters.set("testName", {})
          ).toThrowError();
          expect(() =>
            manager.proto.setters.set("testName", true)
          ).toThrowError();
        });
      });
      describe("has method", () => {
        it("should return false before set", () => {
          const manager = createOverloadingManager();

          expect(manager.proto.setters.has("testName")).toBe(false);
        });
        it("should return true before set same name", () => {
          const manager = createOverloadingManager();

          manager.proto.setters.set("testName", () => {});

          expect(manager.proto.setters.has("testName")).toBe(true);
        });
        it("should throw error called with wrong args", () => {
          const manager = createOverloadingManager();

          expect(() => manager.proto.setters.has(11)).toThrowError();
          expect(() => manager.proto.setters.has({})).toThrowError();
          expect(() => manager.proto.setters.has(true)).toThrowError();
        });
      });
      describe("delete method", () => {
        it("should pass with correct name arg", () => {
          const manager = createOverloadingManager();

          expect(() =>
            manager.proto.setters.delete("testName")
          ).not.toThrowError();
        });
        it("should throw error with wrong arg", () => {
          const manager = createOverloadingManager();

          expect(() => manager.proto.setters.delete(11)).toThrowError();
          expect(() => manager.proto.setters.delete({})).toThrowError();
          expect(() => manager.proto.setters.delete(true)).toThrowError();
        });
        it("should delete after set same name", () => {
          const manager = createOverloadingManager();
          const setterName = "testName";

          manager.proto.setters.set(setterName, () => {});
          expect(manager.proto.setters.has(setterName)).toBe(true);

          manager.proto.setters.delete(setterName);
          expect(manager.proto.setters.has(setterName)).toBe(false);
        });
      });
      describe("apply method", () => {
        it("should pass with correct args", () => {
          const manager = createOverloadingManager();

          expect(() =>
            manager.proto.setters.apply("testName", {}, [])
          ).not.toThrowError();
        });
        it("should throw error with first arg only", () => {
          const manager = createOverloadingManager();

          expect(() => manager.proto.setters.apply("testName")).toThrowError();
        });
        it("should throw error with wrong first arg", () => {
          const manager = createOverloadingManager();

          expect(() => manager.proto.setters.apply(11, {})).toThrowError();
          expect(() => manager.proto.setters.apply({}, {})).toThrowError();
          expect(() => manager.proto.setters.apply(true, {})).toThrowError();
        });
        it("should throw error with wrong second arg", () => {
          const manager = createOverloadingManager();

          expect(() =>
            manager.proto.setters.apply("testName", 11)
          ).toThrowError();

          expect(() =>
            manager.proto.setters.apply("testName", "")
          ).toThrowError();

          expect(() =>
            manager.proto.setters.apply("testName", true)
          ).toThrowError();
        });
        it("should throw error with wrong third arg", () => {
          const manager = createOverloadingManager();

          expect(() =>
            manager.proto.setters.apply("testName", {}, 11)
          ).toThrowError();

          expect(() =>
            manager.proto.setters.apply("testName", {}, {})
          ).toThrowError();

          expect(() =>
            manager.proto.setters.apply("testName", {}, true)
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

          manager.proto.setters.set("testName", spyCallable);

          const result = manager.proto.setters.apply("testName", target.passed);

          expect(spyCallable).toBeCalledTimes(1);
          expect(target.passed).toBe(target.called);
          expect(result).toBe(target.passed);
        });
      });
    });
  });
  describe("statically namespace", () => {
    describe("getters facade", () => {
      describe("set method", () => {
        it("should pass called with correct args", () => {
          const manager = createOverloadingManager();

          expect(() =>
            manager.statically.getters.set("testName", () => {})
          ).not.toThrowError();
        });
        it("should throw error called with first arg only", () => {
          const manager = createOverloadingManager();

          expect(() =>
            manager.statically.getters.set("testName")
          ).toThrowError();
        });
        it("should throw error called with wrong first arg", () => {
          const manager = createOverloadingManager();

          expect(() =>
            manager.statically.getters.set(11, () => {})
          ).toThrowError();
          expect(() =>
            manager.statically.getters.set({}, () => {})
          ).toThrowError();
          expect(() =>
            manager.statically.getters.set(true, () => {})
          ).toThrowError();
        });
        it("should throw error called with wrong second arg", () => {
          const manager = createOverloadingManager();

          expect(() =>
            manager.statically.getters.set("testName", 11)
          ).toThrowError();
          expect(() =>
            manager.statically.getters.set("testName", {})
          ).toThrowError();
          expect(() =>
            manager.statically.getters.set("testName", true)
          ).toThrowError();
        });
      });
      describe("has method", () => {
        it("should return false before set", () => {
          const manager = createOverloadingManager();

          expect(manager.statically.getters.has("testName")).toBe(false);
        });
        it("should return true before set same name", () => {
          const manager = createOverloadingManager();

          manager.statically.getters.set("testName", () => {});

          expect(manager.statically.getters.has("testName")).toBe(true);
        });
        it("should throw error called with wrong args", () => {
          const manager = createOverloadingManager();

          expect(() => manager.statically.getters.has(11)).toThrowError();
          expect(() => manager.statically.getters.has({})).toThrowError();
          expect(() => manager.statically.getters.has(true)).toThrowError();
        });
      });
      describe("delete method", () => {
        it("should pass with correct name arg", () => {
          const manager = createOverloadingManager();

          expect(() =>
            manager.statically.getters.delete("testName")
          ).not.toThrowError();
        });
        it("should throw error with wrong arg", () => {
          const manager = createOverloadingManager();

          expect(() => manager.statically.getters.delete(11)).toThrowError();
          expect(() => manager.statically.getters.delete({})).toThrowError();
          expect(() => manager.statically.getters.delete(true)).toThrowError();
        });
        it("should delete after set same name", () => {
          const manager = createOverloadingManager();
          const getterName = "testName";

          manager.statically.getters.set(getterName, () => {});
          expect(manager.statically.getters.has(getterName)).toBe(true);

          manager.statically.getters.delete(getterName);
          expect(manager.statically.getters.has(getterName)).toBe(false);
        });
      });
      describe("apply method", () => {
        it("should pass with correct args", () => {
          const manager = createOverloadingManager();

          expect(() =>
            manager.statically.getters.apply("testName", {}, [])
          ).not.toThrowError();
        });
        it("should throw error with first arg only", () => {
          const manager = createOverloadingManager();

          expect(() =>
            manager.statically.getters.apply("testName")
          ).toThrowError();
        });
        it("should throw error with wrong first arg", () => {
          const manager = createOverloadingManager();

          expect(() => manager.statically.getters.apply(11, {})).toThrowError();
          expect(() => manager.statically.getters.apply({}, {})).toThrowError();
          expect(() =>
            manager.statically.getters.apply(true, {})
          ).toThrowError();
        });
        it("should throw error with wrong second arg", () => {
          const manager = createOverloadingManager();

          expect(() =>
            manager.statically.getters.apply("testName", 11)
          ).toThrowError();

          expect(() =>
            manager.statically.getters.apply("testName", "")
          ).toThrowError();

          expect(() =>
            manager.statically.getters.apply("testName", true)
          ).toThrowError();
        });
        it("should throw error with wrong third arg", () => {
          const manager = createOverloadingManager();

          expect(() =>
            manager.statically.getters.apply("testName", {}, 11)
          ).toThrowError();

          expect(() =>
            manager.statically.getters.apply("testName", {}, {})
          ).toThrowError();

          expect(() =>
            manager.statically.getters.apply("testName", {}, true)
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

          manager.statically.getters.set("testName", spyCallable);

          const result = manager.statically.getters.apply(
            "testName",
            target.passed
          );

          expect(spyCallable).toBeCalledTimes(1);
          expect(target.passed).toBe(target.called);
          expect(result).toBe(target.passed);
        });
      });
    });
    describe("setters facade", () => {
      describe("set method", () => {
        it("should pass called with correct args", () => {
          const manager = createOverloadingManager();

          expect(() =>
            manager.statically.setters.set("testName", () => {})
          ).not.toThrowError();
        });
        it("should throw error called with first arg only", () => {
          const manager = createOverloadingManager();

          expect(() =>
            manager.statically.setters.set("testName")
          ).toThrowError();
        });
        it("should throw error called with wrong first arg", () => {
          const manager = createOverloadingManager();

          expect(() =>
            manager.statically.setters.set(11, () => {})
          ).toThrowError();
          expect(() =>
            manager.statically.setters.set({}, () => {})
          ).toThrowError();
          expect(() =>
            manager.statically.setters.set(true, () => {})
          ).toThrowError();
        });
        it("should throw error called with wrong second arg", () => {
          const manager = createOverloadingManager();

          expect(() =>
            manager.statically.setters.set("testName", 11)
          ).toThrowError();
          expect(() =>
            manager.statically.setters.set("testName", {})
          ).toThrowError();
          expect(() =>
            manager.statically.setters.set("testName", true)
          ).toThrowError();
        });
      });
      describe("has method", () => {
        it("should return false before set", () => {
          const manager = createOverloadingManager();

          expect(manager.statically.setters.has("testName")).toBe(false);
        });
        it("should return true before set same name", () => {
          const manager = createOverloadingManager();

          manager.statically.setters.set("testName", () => {});

          expect(manager.statically.setters.has("testName")).toBe(true);
        });
        it("should throw error called with wrong args", () => {
          const manager = createOverloadingManager();

          expect(() => manager.statically.setters.has(11)).toThrowError();
          expect(() => manager.statically.setters.has({})).toThrowError();
          expect(() => manager.statically.setters.has(true)).toThrowError();
        });
      });
      describe("delete method", () => {
        it("should pass with correct name arg", () => {
          const manager = createOverloadingManager();

          expect(() =>
            manager.statically.setters.delete("testName")
          ).not.toThrowError();
        });
        it("should throw error with wrong arg", () => {
          const manager = createOverloadingManager();

          expect(() => manager.statically.setters.delete(11)).toThrowError();
          expect(() => manager.statically.setters.delete({})).toThrowError();
          expect(() => manager.statically.setters.delete(true)).toThrowError();
        });
        it("should delete after set same name", () => {
          const manager = createOverloadingManager();
          const setterName = "testName";

          manager.statically.setters.set(setterName, () => {});
          expect(manager.statically.setters.has(setterName)).toBe(true);

          manager.statically.setters.delete(setterName);
          expect(manager.statically.setters.has(setterName)).toBe(false);
        });
      });
      describe("apply method", () => {
        it("should pass with correct args", () => {
          const manager = createOverloadingManager();

          expect(() =>
            manager.statically.setters.apply("testName", {}, [])
          ).not.toThrowError();
        });
        it("should throw error with first arg only", () => {
          const manager = createOverloadingManager();

          expect(() =>
            manager.statically.setters.apply("testName")
          ).toThrowError();
        });
        it("should throw error with wrong first arg", () => {
          const manager = createOverloadingManager();

          expect(() => manager.statically.setters.apply(11, {})).toThrowError();
          expect(() => manager.statically.setters.apply({}, {})).toThrowError();
          expect(() =>
            manager.statically.setters.apply(true, {})
          ).toThrowError();
        });
        it("should throw error with wrong second arg", () => {
          const manager = createOverloadingManager();

          expect(() =>
            manager.statically.setters.apply("testName", 11)
          ).toThrowError();

          expect(() =>
            manager.statically.setters.apply("testName", "")
          ).toThrowError();

          expect(() =>
            manager.statically.setters.apply("testName", true)
          ).toThrowError();
        });
        it("should throw error with wrong third arg", () => {
          const manager = createOverloadingManager();

          expect(() =>
            manager.statically.setters.apply("testName", {}, 11)
          ).toThrowError();

          expect(() =>
            manager.statically.setters.apply("testName", {}, {})
          ).toThrowError();

          expect(() =>
            manager.statically.setters.apply("testName", {}, true)
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

          manager.statically.setters.set("testName", spyCallable);

          const result = manager.statically.setters.apply(
            "testName",
            target.passed
          );

          expect(spyCallable).toBeCalledTimes(1);
          expect(target.passed).toBe(target.called);
          expect(result).toBe(target.passed);
        });
      });
    });
  });
});

describe("createExtendedOverloadingManager", () => {
  it("should be exported", () => {
    expect(createExtendedOverloadingManager).toBeDefined();
  });
  it("should return object by shape", () => {
    const source = createOverloadingManager();
    const manager = createExtendedOverloadingManager(source);

    expect(manager.proto).toBeDefined();
    expect(manager.proto.getters).toBeDefined();
    expect(manager.proto.getters.has).toBeDefined();
    expect(manager.proto.getters.set).toBeDefined();
    expect(manager.proto.getters.delete).toBeDefined();
    expect(manager.proto.getters.apply).toBeDefined();
    expect(manager.proto.setters).toBeDefined();
    expect(manager.proto.setters.has).toBeDefined();
    expect(manager.proto.setters.set).toBeDefined();
    expect(manager.proto.setters.delete).toBeDefined();
    expect(manager.proto.setters.apply).toBeDefined();
    expect(manager.statically).toBeDefined();
    expect(manager.statically.getters).toBeDefined();
    expect(manager.statically.getters.has).toBeDefined();
    expect(manager.statically.getters.set).toBeDefined();
    expect(manager.statically.getters.delete).toBeDefined();
    expect(manager.statically.getters.apply).toBeDefined();
    expect(manager.statically.setters).toBeDefined();
    expect(manager.statically.setters.has).toBeDefined();
    expect(manager.statically.setters.set).toBeDefined();
    expect(manager.statically.setters.delete).toBeDefined();
    expect(manager.statically.setters.apply).toBeDefined();
  });
});

describe("Manager returned by createExtendedOverloadingManager", () => {
  describe("proto namespace", () => {
    describe("getters facade", () => {
      describe("set method", () => {
        it("should pass called with correct args", () => {
          const source = createOverloadingManager();
          const manager = createExtendedOverloadingManager(source);

          expect(() =>
            manager.proto.getters.set("testName", () => {})
          ).not.toThrowError();
        });
        it("should throw error called with first arg only", () => {
          const source = createOverloadingManager();
          const manager = createExtendedOverloadingManager(source);

          expect(() => manager.proto.getters.set("testName")).toThrowError();
        });
        it("should throw error called with wrong first arg", () => {
          const source = createOverloadingManager();
          const manager = createExtendedOverloadingManager(source);

          expect(() => manager.proto.getters.set(11, () => {})).toThrowError();
          expect(() => manager.proto.getters.set({}, () => {})).toThrowError();
          expect(() =>
            manager.proto.getters.set(true, () => {})
          ).toThrowError();
        });
        it("should throw error called with wrong second arg", () => {
          const source = createOverloadingManager();
          const manager = createExtendedOverloadingManager(source);

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
        it("should set in owned stack not in source", () => {
          const source = createOverloadingManager();
          const manager = createExtendedOverloadingManager(source);
          const getterName = "testName";

          manager.proto.getters.set(getterName, () => {});

          expect(manager.proto.getters.has(getterName)).toBe(true);
          expect(source.proto.getters.has(getterName)).toBe(false);
        });
      });
      describe("has method", () => {
        it("should return false before set", () => {
          const source = createOverloadingManager();
          const manager = createExtendedOverloadingManager(source);

          expect(manager.proto.getters.has("testName")).toBe(false);
        });
        it("should return true before set same name", () => {
          const source = createOverloadingManager();
          const manager = createExtendedOverloadingManager(source);

          manager.proto.getters.set("testName", () => {});

          expect(manager.proto.getters.has("testName")).toBe(true);
        });
        it("should throw error called with wrong args", () => {
          const source = createOverloadingManager();
          const manager = createExtendedOverloadingManager(source);

          expect(() => manager.proto.getters.has(11)).toThrowError();
          expect(() => manager.proto.getters.has({})).toThrowError();
          expect(() => manager.proto.getters.has(true)).toThrowError();
        });
        it("should return true before set same name on source", () => {
          const source = createOverloadingManager();
          const manager = createExtendedOverloadingManager(source);

          source.proto.getters.set("testName", () => {});

          expect(manager.proto.getters.has("testName")).toBe(true);
        });
      });
      describe("delete method", () => {
        it("should pass with correct name arg", () => {
          const source = createOverloadingManager();
          const manager = createExtendedOverloadingManager(source);

          expect(() =>
            manager.proto.getters.delete("testName")
          ).not.toThrowError();
        });
        it("should throw error with wrong arg", () => {
          const source = createOverloadingManager();
          const manager = createExtendedOverloadingManager(source);

          expect(() => manager.proto.getters.delete(11)).toThrowError();
          expect(() => manager.proto.getters.delete({})).toThrowError();
          expect(() => manager.proto.getters.delete(true)).toThrowError();
        });
        it("should delete after set same name", () => {
          const manager = createOverloadingManager();
          const getterName = "testName";

          manager.proto.getters.set(getterName, () => {});
          expect(manager.proto.getters.has(getterName)).toBe(true);

          manager.proto.getters.delete(getterName);
          expect(manager.proto.getters.has(getterName)).toBe(false);
        });
        it("should delete after set same name on source", () => {
          const source = createOverloadingManager();
          const manager = createExtendedOverloadingManager(source);
          const getterName = "testName";

          source.proto.getters.set(getterName, () => {});
          expect(manager.proto.getters.has(getterName)).toBe(true);

          manager.proto.getters.delete(getterName);
          expect(manager.proto.getters.has(getterName)).toBe(false);
        });
      });
      describe("apply method", () => {
        it("should pass with correct args", () => {
          const source = createOverloadingManager();
          const manager = createExtendedOverloadingManager(source);

          expect(() =>
            manager.proto.getters.apply("testName", {}, [])
          ).not.toThrowError();
        });
        it("should throw error with first arg only", () => {
          const source = createOverloadingManager();
          const manager = createExtendedOverloadingManager(source);

          expect(() => manager.proto.getters.apply("testName")).toThrowError();
        });
        it("should throw error with wrong first arg", () => {
          const source = createOverloadingManager();
          const manager = createExtendedOverloadingManager(source);

          expect(() => manager.proto.getters.apply(11, {})).toThrowError();
          expect(() => manager.proto.getters.apply({}, {})).toThrowError();
          expect(() => manager.proto.getters.apply(true, {})).toThrowError();
        });
        it("should throw error with wrong second arg", () => {
          const source = createOverloadingManager();
          const manager = createExtendedOverloadingManager(source);

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
          const source = createOverloadingManager();
          const manager = createExtendedOverloadingManager(source);

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
          const source = createOverloadingManager();
          const manager = createExtendedOverloadingManager(source);
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
        it("should call source spyCallable function on called", () => {
          const source = createOverloadingManager();
          const manager = createExtendedOverloadingManager(source);
          const target = {
            called: null,
            passed: {}
          };
          const spyCallable = jest.fn(function() {
            return (target.called = this);
          });

          source.proto.getters.set("testName", spyCallable);

          const result = manager.proto.getters.apply("testName", target.passed);

          expect(spyCallable).toBeCalledTimes(1);
          expect(target.passed).toBe(target.called);
          expect(result).toBe(target.passed);
        });
      });
    });
    describe("setters facade", () => {
      describe("set method", () => {
        it("should pass called with correct args", () => {
          const source = createOverloadingManager();
          const manager = createExtendedOverloadingManager(source);

          expect(() =>
            manager.proto.setters.set("testName", () => {})
          ).not.toThrowError();
        });
        it("should throw error called with first arg only", () => {
          const source = createOverloadingManager();
          const manager = createExtendedOverloadingManager(source);

          expect(() => manager.proto.setters.set("testName")).toThrowError();
        });
        it("should throw error called with wrong first arg", () => {
          const source = createOverloadingManager();
          const manager = createExtendedOverloadingManager(source);

          expect(() => manager.proto.setters.set(11, () => {})).toThrowError();
          expect(() => manager.proto.setters.set({}, () => {})).toThrowError();
          expect(() =>
            manager.proto.setters.set(true, () => {})
          ).toThrowError();
        });
        it("should throw error called with wrong second arg", () => {
          const source = createOverloadingManager();
          const manager = createExtendedOverloadingManager(source);

          expect(() =>
            manager.proto.setters.set("testName", 11)
          ).toThrowError();
          expect(() =>
            manager.proto.setters.set("testName", {})
          ).toThrowError();
          expect(() =>
            manager.proto.setters.set("testName", true)
          ).toThrowError();
        });
        it("should set in owned stack not in source", () => {
          const source = createOverloadingManager();
          const manager = createExtendedOverloadingManager(source);
          const setterName = "testName";

          manager.proto.setters.set(setterName, () => {});

          expect(manager.proto.setters.has(setterName)).toBe(true);
          expect(source.proto.setters.has(setterName)).toBe(false);
        });
      });
      describe("has method", () => {
        it("should return false before set", () => {
          const source = createOverloadingManager();
          const manager = createExtendedOverloadingManager(source);

          expect(manager.proto.setters.has("testName")).toBe(false);
        });
        it("should return true before set same name", () => {
          const source = createOverloadingManager();
          const manager = createExtendedOverloadingManager(source);

          manager.proto.setters.set("testName", () => {});

          expect(manager.proto.setters.has("testName")).toBe(true);
        });
        it("should throw error called with wrong args", () => {
          const source = createOverloadingManager();
          const manager = createExtendedOverloadingManager(source);

          expect(() => manager.proto.setters.has(11)).toThrowError();
          expect(() => manager.proto.setters.has({})).toThrowError();
          expect(() => manager.proto.setters.has(true)).toThrowError();
        });
        it("should return true before set same name on source", () => {
          const source = createOverloadingManager();
          const manager = createExtendedOverloadingManager(source);

          source.proto.setters.set("testName", () => {});

          expect(manager.proto.setters.has("testName")).toBe(true);
        });
      });
      describe("delete method", () => {
        it("should pass with correct name arg", () => {
          const source = createOverloadingManager();
          const manager = createExtendedOverloadingManager(source);

          expect(() =>
            manager.proto.setters.delete("testName")
          ).not.toThrowError();
        });
        it("should throw error with wrong arg", () => {
          const source = createOverloadingManager();
          const manager = createExtendedOverloadingManager(source);

          expect(() => manager.proto.setters.delete(11)).toThrowError();
          expect(() => manager.proto.setters.delete({})).toThrowError();
          expect(() => manager.proto.setters.delete(true)).toThrowError();
        });
        it("should delete after set same name on source", () => {
          const source = createOverloadingManager();
          const manager = createExtendedOverloadingManager(source);
          const setterName = "testName";

          source.proto.setters.set(setterName, () => {});
          expect(manager.proto.setters.has(setterName)).toBe(true);

          manager.proto.setters.delete(setterName);
          expect(manager.proto.setters.has(setterName)).toBe(false);
        });
      });
      describe("apply method", () => {
        it("should pass with correct args", () => {
          const source = createOverloadingManager();
          const manager = createExtendedOverloadingManager(source);

          expect(() =>
            manager.proto.setters.apply("testName", {}, [])
          ).not.toThrowError();
        });
        it("should throw error with first arg only", () => {
          const source = createOverloadingManager();
          const manager = createExtendedOverloadingManager(source);

          expect(() => manager.proto.setters.apply("testName")).toThrowError();
        });
        it("should throw error with wrong first arg", () => {
          const source = createOverloadingManager();
          const manager = createExtendedOverloadingManager(source);

          expect(() => manager.proto.setters.apply(11, {})).toThrowError();
          expect(() => manager.proto.setters.apply({}, {})).toThrowError();
          expect(() => manager.proto.setters.apply(true, {})).toThrowError();
        });
        it("should throw error with wrong second arg", () => {
          const source = createOverloadingManager();
          const manager = createExtendedOverloadingManager(source);

          expect(() =>
            manager.proto.setters.apply("testName", 11)
          ).toThrowError();

          expect(() =>
            manager.proto.setters.apply("testName", "")
          ).toThrowError();

          expect(() =>
            manager.proto.setters.apply("testName", true)
          ).toThrowError();
        });
        it("should throw error with wrong third arg", () => {
          const source = createOverloadingManager();
          const manager = createExtendedOverloadingManager(source);

          expect(() =>
            manager.proto.setters.apply("testName", {}, 11)
          ).toThrowError();

          expect(() =>
            manager.proto.setters.apply("testName", {}, {})
          ).toThrowError();

          expect(() =>
            manager.proto.setters.apply("testName", {}, true)
          ).toThrowError();
        });
        it("should call spyCallable function on called", () => {
          const source = createOverloadingManager();
          const manager = createExtendedOverloadingManager(source);
          const target = {
            called: null,
            passed: {}
          };
          const spyCallable = jest.fn(function() {
            return (target.called = this);
          });

          manager.proto.setters.set("testName", spyCallable);

          const result = manager.proto.setters.apply("testName", target.passed);

          expect(spyCallable).toBeCalledTimes(1);
          expect(target.passed).toBe(target.called);
          expect(result).toBe(target.passed);
        });
        it("should call source spyCallable function on called", () => {
          const source = createOverloadingManager();
          const manager = createExtendedOverloadingManager(source);
          const target = {
            called: null,
            passed: {}
          };
          const spyCallable = jest.fn(function() {
            return (target.called = this);
          });

          source.proto.setters.set("testName", spyCallable);

          const result = manager.proto.setters.apply("testName", target.passed);

          expect(spyCallable).toBeCalledTimes(1);
          expect(target.passed).toBe(target.called);
          expect(result).toBe(target.passed);
        });
      });
    });
  });
  describe("statically namespace", () => {
    describe("getters facade", () => {
      describe("set method", () => {
        it("should pass called with correct args", () => {
          const source = createOverloadingManager();
          const manager = createExtendedOverloadingManager(source);

          expect(() =>
            manager.statically.getters.set("testName", () => {})
          ).not.toThrowError();
        });
        it("should throw error called with first arg only", () => {
          const source = createOverloadingManager();
          const manager = createExtendedOverloadingManager(source);

          expect(() =>
            manager.statically.getters.set("testName")
          ).toThrowError();
        });
        it("should throw error called with wrong first arg", () => {
          const source = createOverloadingManager();
          const manager = createExtendedOverloadingManager(source);

          expect(() =>
            manager.statically.getters.set(11, () => {})
          ).toThrowError();
          expect(() =>
            manager.statically.getters.set({}, () => {})
          ).toThrowError();
          expect(() =>
            manager.statically.getters.set(true, () => {})
          ).toThrowError();
        });
        it("should throw error called with wrong second arg", () => {
          const source = createOverloadingManager();
          const manager = createExtendedOverloadingManager(source);

          expect(() =>
            manager.statically.getters.set("testName", 11)
          ).toThrowError();
          expect(() =>
            manager.statically.getters.set("testName", {})
          ).toThrowError();
          expect(() =>
            manager.statically.getters.set("testName", true)
          ).toThrowError();
        });
        it("should set in owned stack not in source", () => {
          const source = createOverloadingManager();
          const manager = createExtendedOverloadingManager(source);
          const getterName = "testName";

          manager.statically.getters.set(getterName, () => {});

          expect(manager.statically.getters.has(getterName)).toBe(true);
          expect(source.statically.getters.has(getterName)).toBe(false);
        });
      });
      describe("has method", () => {
        it("should return false before set", () => {
          const source = createOverloadingManager();
          const manager = createExtendedOverloadingManager(source);

          expect(manager.statically.getters.has("testName")).toBe(false);
        });
        it("should return true before set same name", () => {
          const source = createOverloadingManager();
          const manager = createExtendedOverloadingManager(source);

          manager.statically.getters.set("testName", () => {});

          expect(manager.statically.getters.has("testName")).toBe(true);
        });
        it("should throw error called with wrong args", () => {
          const source = createOverloadingManager();
          const manager = createExtendedOverloadingManager(source);

          expect(() => manager.statically.getters.has(11)).toThrowError();
          expect(() => manager.statically.getters.has({})).toThrowError();
          expect(() => manager.statically.getters.has(true)).toThrowError();
        });
        it("should return true before set same name on source", () => {
          const source = createOverloadingManager();
          const manager = createExtendedOverloadingManager(source);

          source.statically.getters.set("testName", () => {});

          expect(manager.statically.getters.has("testName")).toBe(true);
        });
      });
      describe("delete method", () => {
        it("should pass with correct name arg", () => {
          const source = createOverloadingManager();
          const manager = createExtendedOverloadingManager(source);

          expect(() =>
            manager.statically.getters.delete("testName")
          ).not.toThrowError();
        });
        it("should throw error with wrong arg", () => {
          const source = createOverloadingManager();
          const manager = createExtendedOverloadingManager(source);

          expect(() => manager.statically.getters.delete(11)).toThrowError();
          expect(() => manager.statically.getters.delete({})).toThrowError();
          expect(() => manager.statically.getters.delete(true)).toThrowError();
        });
        it("should delete after set same name on source", () => {
          const source = createOverloadingManager();
          const manager = createExtendedOverloadingManager(source);
          const getterName = "testName";

          source.statically.getters.set(getterName, () => {});
          expect(manager.statically.getters.has(getterName)).toBe(true);

          manager.statically.getters.delete(getterName);
          expect(manager.statically.getters.has(getterName)).toBe(false);
        });
      });
      describe("apply method", () => {
        it("should pass with correct args", () => {
          const source = createOverloadingManager();
          const manager = createExtendedOverloadingManager(source);

          expect(() =>
            manager.statically.getters.apply("testName", {}, [])
          ).not.toThrowError();
        });
        it("should throw error with first arg only", () => {
          const source = createOverloadingManager();
          const manager = createExtendedOverloadingManager(source);

          expect(() =>
            manager.statically.getters.apply("testName")
          ).toThrowError();
        });
        it("should throw error with wrong first arg", () => {
          const source = createOverloadingManager();
          const manager = createExtendedOverloadingManager(source);

          expect(() => manager.statically.getters.apply(11, {})).toThrowError();
          expect(() => manager.statically.getters.apply({}, {})).toThrowError();
          expect(() =>
            manager.statically.getters.apply(true, {})
          ).toThrowError();
        });
        it("should throw error with wrong second arg", () => {
          const source = createOverloadingManager();
          const manager = createExtendedOverloadingManager(source);

          expect(() =>
            manager.statically.getters.apply("testName", 11)
          ).toThrowError();

          expect(() =>
            manager.statically.getters.apply("testName", "")
          ).toThrowError();

          expect(() =>
            manager.statically.getters.apply("testName", true)
          ).toThrowError();
        });
        it("should throw error with wrong third arg", () => {
          const source = createOverloadingManager();
          const manager = createExtendedOverloadingManager(source);

          expect(() =>
            manager.statically.getters.apply("testName", {}, 11)
          ).toThrowError();

          expect(() =>
            manager.statically.getters.apply("testName", {}, {})
          ).toThrowError();

          expect(() =>
            manager.statically.getters.apply("testName", {}, true)
          ).toThrowError();
        });
        it("should call spyCallable function on called", () => {
          const source = createOverloadingManager();
          const manager = createExtendedOverloadingManager(source);
          const target = {
            called: null,
            passed: {}
          };
          const spyCallable = jest.fn(function() {
            return (target.called = this);
          });

          manager.statically.getters.set("testName", spyCallable);

          const result = manager.statically.getters.apply(
            "testName",
            target.passed
          );

          expect(spyCallable).toBeCalledTimes(1);
          expect(target.passed).toBe(target.called);
          expect(result).toBe(target.passed);
        });
        it("should call source spyCallable function on called", () => {
          const source = createOverloadingManager();
          const manager = createExtendedOverloadingManager(source);
          const target = {
            called: null,
            passed: {}
          };
          const spyCallable = jest.fn(function() {
            return (target.called = this);
          });

          source.statically.getters.set("testName", spyCallable);

          const result = manager.statically.getters.apply(
            "testName",
            target.passed
          );

          expect(spyCallable).toBeCalledTimes(1);
          expect(target.passed).toBe(target.called);
          expect(result).toBe(target.passed);
        });
      });
    });
    describe("setters facade", () => {
      describe("set method", () => {
        it("should pass called with correct args", () => {
          const source = createOverloadingManager();
          const manager = createExtendedOverloadingManager(source);

          expect(() =>
            manager.statically.setters.set("testName", () => {})
          ).not.toThrowError();
        });
        it("should throw error called with first arg only", () => {
          const source = createOverloadingManager();
          const manager = createExtendedOverloadingManager(source);

          expect(() =>
            manager.statically.setters.set("testName")
          ).toThrowError();
        });
        it("should throw error called with wrong first arg", () => {
          const source = createOverloadingManager();
          const manager = createExtendedOverloadingManager(source);

          expect(() =>
            manager.statically.setters.set(11, () => {})
          ).toThrowError();
          expect(() =>
            manager.statically.setters.set({}, () => {})
          ).toThrowError();
          expect(() =>
            manager.statically.setters.set(true, () => {})
          ).toThrowError();
        });
        it("should throw error called with wrong second arg", () => {
          const source = createOverloadingManager();
          const manager = createExtendedOverloadingManager(source);

          expect(() =>
            manager.statically.setters.set("testName", 11)
          ).toThrowError();
          expect(() =>
            manager.statically.setters.set("testName", {})
          ).toThrowError();
          expect(() =>
            manager.statically.setters.set("testName", true)
          ).toThrowError();
        });
        it("should set in owned stack not in source", () => {
          const source = createOverloadingManager();
          const manager = createExtendedOverloadingManager(source);
          const setterName = "testName";

          manager.statically.setters.set(setterName, () => {});

          expect(manager.statically.setters.has(setterName)).toBe(true);
          expect(source.statically.setters.has(setterName)).toBe(false);
        });
      });
      describe("has method", () => {
        it("should return false before set", () => {
          const source = createOverloadingManager();
          const manager = createExtendedOverloadingManager(source);

          expect(manager.statically.setters.has("testName")).toBe(false);
        });
        it("should return true before set same name", () => {
          const source = createOverloadingManager();
          const manager = createExtendedOverloadingManager(source);

          manager.statically.setters.set("testName", () => {});

          expect(manager.statically.setters.has("testName")).toBe(true);
        });
        it("should throw error called with wrong args", () => {
          const source = createOverloadingManager();
          const manager = createExtendedOverloadingManager(source);

          expect(() => manager.statically.setters.has(11)).toThrowError();
          expect(() => manager.statically.setters.has({})).toThrowError();
          expect(() => manager.statically.setters.has(true)).toThrowError();
        });
        it("should return true before set same name on source", () => {
          const source = createOverloadingManager();
          const manager = createExtendedOverloadingManager(source);

          source.statically.setters.set("testName", () => {});

          expect(manager.statically.setters.has("testName")).toBe(true);
        });
      });
      describe("delete method", () => {
        it("should pass with correct name arg", () => {
          const source = createOverloadingManager();
          const manager = createExtendedOverloadingManager(source);

          expect(() =>
            manager.statically.setters.delete("testName")
          ).not.toThrowError();
        });
        it("should throw error with wrong arg", () => {
          const source = createOverloadingManager();
          const manager = createExtendedOverloadingManager(source);

          expect(() => manager.statically.setters.delete(11)).toThrowError();
          expect(() => manager.statically.setters.delete({})).toThrowError();
          expect(() => manager.statically.setters.delete(true)).toThrowError();
        });
        it("should delete after set same name on source", () => {
          const source = createOverloadingManager();
          const manager = createExtendedOverloadingManager(source);
          const setterName = "testName";

          source.statically.setters.set(setterName, () => {});
          expect(manager.statically.setters.has(setterName)).toBe(true);

          manager.statically.setters.delete(setterName);
          expect(manager.statically.setters.has(setterName)).toBe(false);
        });
      });
      describe("apply method", () => {
        it("should pass with correct args", () => {
          const source = createOverloadingManager();
          const manager = createExtendedOverloadingManager(source);

          expect(() =>
            manager.statically.setters.apply("testName", {}, [])
          ).not.toThrowError();
        });
        it("should throw error with first arg only", () => {
          const source = createOverloadingManager();
          const manager = createExtendedOverloadingManager(source);

          expect(() =>
            manager.statically.setters.apply("testName")
          ).toThrowError();
        });
        it("should throw error with wrong first arg", () => {
          const source = createOverloadingManager();
          const manager = createExtendedOverloadingManager(source);

          expect(() => manager.statically.setters.apply(11, {})).toThrowError();
          expect(() => manager.statically.setters.apply({}, {})).toThrowError();
          expect(() =>
            manager.statically.setters.apply(true, {})
          ).toThrowError();
        });
        it("should throw error with wrong second arg", () => {
          const source = createOverloadingManager();
          const manager = createExtendedOverloadingManager(source);

          expect(() =>
            manager.statically.setters.apply("testName", 11)
          ).toThrowError();

          expect(() =>
            manager.statically.setters.apply("testName", "")
          ).toThrowError();

          expect(() =>
            manager.statically.setters.apply("testName", true)
          ).toThrowError();
        });
        it("should throw error with wrong third arg", () => {
          const source = createOverloadingManager();
          const manager = createExtendedOverloadingManager(source);

          expect(() =>
            manager.statically.setters.apply("testName", {}, 11)
          ).toThrowError();

          expect(() =>
            manager.statically.setters.apply("testName", {}, {})
          ).toThrowError();

          expect(() =>
            manager.statically.setters.apply("testName", {}, true)
          ).toThrowError();
        });
        it("should call spyCallable function on called", () => {
          const source = createOverloadingManager();
          const manager = createExtendedOverloadingManager(source);
          const target = {
            called: null,
            passed: {}
          };
          const spyCallable = jest.fn(function() {
            return (target.called = this);
          });

          manager.statically.setters.set("testName", spyCallable);

          const result = manager.statically.setters.apply(
            "testName",
            target.passed
          );

          expect(spyCallable).toBeCalledTimes(1);
          expect(target.passed).toBe(target.called);
          expect(result).toBe(target.passed);
        });
        it("should call source spyCallable function on called", () => {
          const source = createOverloadingManager();
          const manager = createExtendedOverloadingManager(source);
          const target = {
            called: null,
            passed: {}
          };
          const spyCallable = jest.fn(function() {
            return (target.called = this);
          });

          source.statically.setters.set("testName", spyCallable);

          const result = manager.statically.setters.apply(
            "testName",
            target.passed
          );

          expect(spyCallable).toBeCalledTimes(1);
          expect(target.passed).toBe(target.called);
          expect(result).toBe(target.passed);
        });
      });
    });
  });
});
