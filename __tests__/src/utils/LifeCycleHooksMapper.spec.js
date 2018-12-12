import {
  createHooksMapper,
  MIXIN,
  SYSTEM,
  MODEL
} from "@/src/utils/LifeCycleHooksMapper";

describe("createHooksMapper", () => {
  it("should be exported", () => {
    expect(createHooksMapper).toBeInstanceOf(Function);
  });
  it("should return object shape", () => {
    const mapper = createHooksMapper();

    expect(mapper).toBeInstanceOf(Object);
    expect(mapper.on).toBeDefined();
    expect(mapper.fire).toBeDefined();
    expect(mapper.fireReverse).toBeDefined();
    expect(mapper.fireChain).toBeDefined();
    expect(mapper.fireChainReverse).toBeDefined();
  });
});

describe("returned mapper from createHooksMapper", () => {
  describe("on method", () => {
    it("should pass with correct args", () => {
      const mapper = createHooksMapper();

      expect(mapper.on("construct", function(args) {}, MIXIN));
      expect(mapper.on("saving", function(args) {}, SYSTEM));
    });
    it("should throw error called without args", () => {
      const mapper = createHooksMapper();
      expect(() => mapper.on()).toThrowError();
    });
    it("should throw error called with first arg only", () => {
      const mapper = createHooksMapper();
      expect(() => mapper.on("saving")).toThrowError();
    });
    it("should throw error when pass not string as first arg", () => {
      const mapper = createHooksMapper();
      expect(() => mapper.on(11, function(args) {})).toThrowError();
      expect(() => mapper.on({}, function(args) {})).toThrowError();
      expect(() => mapper.on(true, function(args) {})).toThrowError();
    });
    it("should throw error when pass not allowed string as first arg", () => {
      const mapper = createHooksMapper();
      expect(() => mapper.on("11", function(args) {})).toThrowError();
      expect(() => mapper.on("{}", function(args) {})).toThrowError();
      expect(() => mapper.on("true", function(args) {})).toThrowError();
    });
    it("should throw error when pass not function as second arg", () => {
      const mapper = createHooksMapper();
      expect(() => mapper.on("construct", 11)).toThrowError();
      expect(() => mapper.on("construct", {})).toThrowError();
      expect(() => mapper.on("construct", true)).toThrowError();
    });
    it("should throw error when pass not allowed third arg", () => {
      const mapper = createHooksMapper();
      expect(() => mapper.on("construct", function() {}, 11111)).toThrowError();
      expect(() => mapper.on("construct", function() {}, {})).toThrowError();
      expect(() => mapper.on("construct", function() {}, true)).toThrowError();
    });
  });
  describe("fire method", () => {
    it("should pass with correct args", () => {
      const mapper = createHooksMapper();

      expect(mapper.fire("saving", {}, [], []));
      expect(mapper.fire("saving", {}, []));
      expect(mapper.fire("saving", {}));
    });
    it("should throw error called without args", () => {
      const mapper = createHooksMapper();

      expect(() => mapper.fire()).toThrowError();
    });
    it("should throw error called with first arg only", () => {
      const mapper = createHooksMapper();

      expect(() => mapper.fire("saving")).toThrowError();
    });
    it("should throw error called with not string first arg", () => {
      const mapper = createHooksMapper();

      expect(() => mapper.fire(11, {})).toThrowError();
      expect(() => mapper.fire({}, {})).toThrowError();
      expect(() => mapper.fire(true, {})).toThrowError();
    });
    it("should throw error called with not allowed string first arg", () => {
      const mapper = createHooksMapper();

      expect(() => mapper.fire("11", {})).toThrowError();
      expect(() => mapper.fire("{}", {})).toThrowError();
      expect(() => mapper.fire("true", {})).toThrowError();
    });
    it("should throw error called with not object second arg", () => {
      const mapper = createHooksMapper();

      expect(() => mapper.fire("saving", 11)).toThrowError();
      expect(() => mapper.fire("saving", "")).toThrowError();
      expect(() => mapper.fire("saving", true)).toThrowError();
    });
  });
  describe("on -> fire intergation", () => {
    const mapper = createHooksMapper();

    const calledOrder = [];
    const calledThis = [];
    const args = [1, 2];
    const systemArgs = [3, 4];
    const target = {};
    const hook = "construct";

    const mixinListenerSpy = jest.fn(function() {
      calledOrder.push(2);
      calledThis.push(this);
    });
    const modelListenerSpy = jest.fn(function() {
      calledOrder.push(1);
      calledThis.push(this);
    });
    const systemListenerSpy = jest.fn(function() {
      calledOrder.push(3);
      calledThis.push(this);
    });

    mapper.on(hook, mixinListenerSpy);
    mapper.on(hook, modelListenerSpy, MODEL);
    mapper.on(hook, systemListenerSpy, SYSTEM);

    mapper.fire(hook, target, args, systemArgs);

    it("should fire hook in aspected order", () => {
      expect(calledOrder).toEqual([1, 2, 3]);
    });

    it("should fire hook with target as this ", () => {
      expect(calledThis).toEqual([target, target, target]);
    });

    it("should fire mixin and model hook with args", () => {
      expect(mixinListenerSpy.mock.calls[0]).toEqual(args);
      expect(modelListenerSpy.mock.calls[0]).toEqual(args);
    });

    it("should fire system hook with systemArgs", () => {
      expect(systemListenerSpy.mock.calls[0]).toEqual([args, systemArgs]);
    });
  });
  describe("fireReverse method", () => {
    it("should pass with correct args", () => {
      const mapper = createHooksMapper();

      expect(mapper.fireReverse("saving", {}, [], []));
      expect(mapper.fireReverse("saving", {}, []));
      expect(mapper.fireReverse("saving", {}));
    });
    it("should throw error called without args", () => {
      const mapper = createHooksMapper();

      expect(() => mapper.fireReverse()).toThrowError();
    });
    it("should throw error called with first arg only", () => {
      const mapper = createHooksMapper();

      expect(() => mapper.fireReverse("saving")).toThrowError();
    });
    it("should throw error called with not string first arg", () => {
      const mapper = createHooksMapper();

      expect(() => mapper.fireReverse(11, {})).toThrowError();
      expect(() => mapper.fireReverse({}, {})).toThrowError();
      expect(() => mapper.fireReverse(true, {})).toThrowError();
    });
    it("should throw error called with not allowed string first arg", () => {
      const mapper = createHooksMapper();

      expect(() => mapper.fireReverse("11", {})).toThrowError();
      expect(() => mapper.fireReverse("{}", {})).toThrowError();
      expect(() => mapper.fireReverse("true", {})).toThrowError();
    });
    it("should throw error called with not object second arg", () => {
      const mapper = createHooksMapper();

      expect(() => mapper.fireReverse("saving", 11)).toThrowError();
      expect(() => mapper.fireReverse("saving", "")).toThrowError();
      expect(() => mapper.fireReverse("saving", true)).toThrowError();
    });
  });
  describe("on -> fireReverse intergation", () => {
    const mapper = createHooksMapper();

    const calledOrder = [];
    const calledThis = [];
    const args = [1, 2];
    const systemArgs = [3, 4];
    const target = {};
    const hook = "construct";

    const mixinListenerSpy = jest.fn(function() {
      calledOrder.push(3);
      calledThis.push(this);
    });
    const modelListenerSpy = jest.fn(function() {
      calledOrder.push(2);
      calledThis.push(this);
    });
    const systemListenerSpy = jest.fn(function() {
      calledOrder.push(1);
      calledThis.push(this);
    });

    mapper.on(hook, mixinListenerSpy);
    mapper.on(hook, modelListenerSpy, MODEL);
    mapper.on(hook, systemListenerSpy, SYSTEM);

    mapper.fireReverse(hook, target, args, systemArgs);

    it("should fire hook in aspected order", () => {
      expect(calledOrder).toEqual([1, 2, 3]);
    });

    it("should fire hook with target as this ", () => {
      expect(calledThis).toEqual([target, target, target]);
    });

    it("should fire mixin and model hook with args", () => {
      expect(mixinListenerSpy.mock.calls[0]).toEqual(args);
      expect(modelListenerSpy.mock.calls[0]).toEqual(args);
    });

    it("should fire system hook with systemArgs", () => {
      expect(systemListenerSpy.mock.calls[0]).toEqual([args, systemArgs]);
    });
  });
  describe("fireChain method", () => {
    it("should pass with correct args", () => {
      const mapper = createHooksMapper();

      expect(mapper.fireChain("saving", {}, [], []));
      expect(mapper.fireChain("saving", {}, []));
      expect(mapper.fireChain("saving", {}));
    });
    it("should return boolean", () => {
      const mapper = createHooksMapper();

      expect(typeof mapper.fireChain("saving", {})).toBe("boolean");
    });
    it("should throw error called without args", () => {
      const mapper = createHooksMapper();

      expect(() => mapper.fireChain()).toThrowError();
    });
    it("should throw error called with first arg only", () => {
      const mapper = createHooksMapper();

      expect(() => mapper.fireChain("saving")).toThrowError();
    });
    it("should throw error called with not string first arg", () => {
      const mapper = createHooksMapper();

      expect(() => mapper.fireChain(11, {})).toThrowError();
      expect(() => mapper.fireChain({}, {})).toThrowError();
      expect(() => mapper.fireChain(true, {})).toThrowError();
    });
    it("should throw error called with not allowed string first arg", () => {
      const mapper = createHooksMapper();

      expect(() => mapper.fireChain("11", {})).toThrowError();
      expect(() => mapper.fireChain("{}", {})).toThrowError();
      expect(() => mapper.fireChain("true", {})).toThrowError();
    });
    it("should throw error called with not object second arg", () => {
      const mapper = createHooksMapper();

      expect(() => mapper.fireChain("saving", 11)).toThrowError();
      expect(() => mapper.fireChain("saving", "")).toThrowError();
      expect(() => mapper.fireChain("saving", true)).toThrowError();
    });
  });
  describe("on -> fireChain intergation", () => {
    describe("check order and args", () => {
      const mapper = createHooksMapper();

      const calledOrder = [];
      const calledThis = [];
      const args = [1, 2];
      const systemArgs = [3, 4];
      const target = {};
      const hook = "construct";

      const mixinListenerSpy = jest.fn(function() {
        calledOrder.push(2);
        calledThis.push(this);
      });
      const modelListenerSpy = jest.fn(function() {
        calledOrder.push(1);
        calledThis.push(this);
      });
      const systemListenerSpy = jest.fn(function() {
        calledOrder.push(3);
        calledThis.push(this);
      });

      mapper.on(hook, mixinListenerSpy);
      mapper.on(hook, modelListenerSpy, MODEL);
      mapper.on(hook, systemListenerSpy, SYSTEM);

      mapper.fireChain(hook, target, args, systemArgs);

      it("should fire hook in aspected order", () => {
        expect(calledOrder).toEqual([1, 2, 3]);
      });

      it("should fire hook with target as this ", () => {
        expect(calledThis).toEqual([target, target, target]);
      });

      it("should fire mixin and model hook with args", () => {
        expect(mixinListenerSpy.mock.calls[0]).toEqual(args);
        expect(modelListenerSpy.mock.calls[0]).toEqual(args);
      });

      it("should fire system hook with systemArgs", () => {
        expect(systemListenerSpy.mock.calls[0]).toEqual([args, systemArgs]);
      });
    });
    describe("check chain responsability", () => {
      it("should not call mixin and system callables when model return false and result must be false", () => {
        const mapper = createHooksMapper();
        const hook = "construct";

        const modelListenerSpy = jest.fn().mockReturnValue(false);
        const mixinListenerSpy = jest.fn().mockReturnValue(false);
        const systemListenerSpy = jest.fn().mockReturnValue(false);

        mapper.on(hook, mixinListenerSpy);
        mapper.on(hook, modelListenerSpy, MODEL);
        mapper.on(hook, systemListenerSpy, SYSTEM);

        const result = mapper.fireChain(hook, {}, [], []);

        expect(modelListenerSpy.mock.calls.length).toBe(1);
        expect(mixinListenerSpy.mock.calls.length).toBe(0);
        expect(systemListenerSpy.mock.calls.length).toBe(0);
        expect(result).toBe(false);
      });
      it("should not call system callable when mixin return false and result must be false", () => {
        const mapper = createHooksMapper();
        const hook = "construct";

        const modelListenerSpy = jest.fn().mockReturnValue(true);
        const mixinListenerSpy = jest.fn().mockReturnValue(false);
        const systemListenerSpy = jest.fn().mockReturnValue(false);

        mapper.on(hook, mixinListenerSpy);
        mapper.on(hook, modelListenerSpy, MODEL);
        mapper.on(hook, systemListenerSpy, SYSTEM);

        const result = mapper.fireChain(hook, {}, [], []);

        expect(modelListenerSpy.mock.calls.length).toBe(1);
        expect(mixinListenerSpy.mock.calls.length).toBe(1);
        expect(systemListenerSpy.mock.calls.length).toBe(0);
        expect(result).toBe(false);
      });
      it("should give result false when system callabe return false", () => {
        const mapper = createHooksMapper();
        const hook = "construct";

        const modelListenerSpy = jest.fn().mockReturnValue(true);
        const mixinListenerSpy = jest.fn().mockReturnValue(true);
        const systemListenerSpy = jest.fn().mockReturnValue(false);

        mapper.on(hook, mixinListenerSpy);
        mapper.on(hook, modelListenerSpy, MODEL);
        mapper.on(hook, systemListenerSpy, SYSTEM);

        const result = mapper.fireChain(hook, {}, [], []);

        expect(modelListenerSpy.mock.calls.length).toBe(1);
        expect(mixinListenerSpy.mock.calls.length).toBe(1);
        expect(systemListenerSpy.mock.calls.length).toBe(1);
        expect(result).toBe(false);
      });
      it("should give result true when all callabes return true", () => {
        const mapper = createHooksMapper();
        const hook = "construct";

        const modelListenerSpy = jest.fn().mockReturnValue(true);
        const mixinListenerSpy = jest.fn().mockReturnValue(true);
        const systemListenerSpy = jest.fn().mockReturnValue(true);

        mapper.on(hook, mixinListenerSpy);
        mapper.on(hook, modelListenerSpy, MODEL);
        mapper.on(hook, systemListenerSpy, SYSTEM);

        const result = mapper.fireChain(hook, {}, [], []);

        expect(modelListenerSpy.mock.calls.length).toBe(1);
        expect(mixinListenerSpy.mock.calls.length).toBe(1);
        expect(systemListenerSpy.mock.calls.length).toBe(1);
        expect(result).toBe(true);
      });
    });
  });
  describe("fireChainReverse method", () => {
    it("should pass with correct args", () => {
      const mapper = createHooksMapper();

      expect(mapper.fireChainReverse("saving", {}, [], []));
      expect(mapper.fireChainReverse("saving", {}, []));
      expect(mapper.fireChainReverse("saving", {}));
    });
    it("should return boolean", () => {
      const mapper = createHooksMapper();

      expect(typeof mapper.fireChainReverse("saving", {})).toBe("boolean");
    });
    it("should throw error called without args", () => {
      const mapper = createHooksMapper();

      expect(() => mapper.fireChainReverse()).toThrowError();
    });
    it("should throw error called with first arg only", () => {
      const mapper = createHooksMapper();

      expect(() => mapper.fireChainReverse("saving")).toThrowError();
    });
    it("should throw error called with not string first arg", () => {
      const mapper = createHooksMapper();

      expect(() => mapper.fireChainReverse(11, {})).toThrowError();
      expect(() => mapper.fireChainReverse({}, {})).toThrowError();
      expect(() => mapper.fireChainReverse(true, {})).toThrowError();
    });
    it("should throw error called with not allowed string first arg", () => {
      const mapper = createHooksMapper();

      expect(() => mapper.fireChainReverse("11", {})).toThrowError();
      expect(() => mapper.fireChainReverse("{}", {})).toThrowError();
      expect(() => mapper.fireChainReverse("true", {})).toThrowError();
    });
    it("should throw error called with not object second arg", () => {
      const mapper = createHooksMapper();

      expect(() => mapper.fireChainReverse("saving", 11)).toThrowError();
      expect(() => mapper.fireChainReverse("saving", "")).toThrowError();
      expect(() => mapper.fireChainReverse("saving", true)).toThrowError();
    });
  });
  describe("on -> fireChainReverse intergation", () => {
    describe("check order and args", () => {
      const mapper = createHooksMapper();

      const calledOrder = [];
      const calledThis = [];
      const args = [1, 2];
      const systemArgs = [3, 4];
      const target = {};
      const hook = "construct";

      const mixinListenerSpy = jest.fn(function() {
        calledOrder.push(3);
        calledThis.push(this);
      });
      const modelListenerSpy = jest.fn(function() {
        calledOrder.push(2);
        calledThis.push(this);
      });
      const systemListenerSpy = jest.fn(function() {
        calledOrder.push(1);
        calledThis.push(this);
      });

      mapper.on(hook, mixinListenerSpy);
      mapper.on(hook, modelListenerSpy, MODEL);
      mapper.on(hook, systemListenerSpy, SYSTEM);

      mapper.fireChainReverse(hook, target, args, systemArgs);

      it("should fire hook in aspected order", () => {
        expect(calledOrder).toEqual([1, 2, 3]);
      });

      it("should fire hook with target as this ", () => {
        expect(calledThis).toEqual([target, target, target]);
      });

      it("should fire mixin and model hook with args", () => {
        expect(mixinListenerSpy.mock.calls[0]).toEqual(args);
        expect(modelListenerSpy.mock.calls[0]).toEqual(args);
      });

      it("should fire system hook with systemArgs", () => {
        expect(systemListenerSpy.mock.calls[0]).toEqual([args, systemArgs]);
      });
    });
    describe("check chain responsability", () => {
      it("should not call mixin and model callables when system return false and result must be false", () => {
        const mapper = createHooksMapper();
        const hook = "construct";

        const systemListenerSpy = jest.fn().mockReturnValue(false);
        const modelListenerSpy = jest.fn().mockReturnValue(false);
        const mixinListenerSpy = jest.fn().mockReturnValue(false);

        mapper.on(hook, mixinListenerSpy);
        mapper.on(hook, modelListenerSpy, MODEL);
        mapper.on(hook, systemListenerSpy, SYSTEM);

        const result = mapper.fireChainReverse(hook, {}, [], []);

        expect(systemListenerSpy.mock.calls.length).toBe(1);
        expect(modelListenerSpy.mock.calls.length).toBe(0);
        expect(mixinListenerSpy.mock.calls.length).toBe(0);
        expect(result).toBe(false);
      });
      it("should not call mixin callable when model return false and result must be false", () => {
        const mapper = createHooksMapper();
        const hook = "construct";

        const systemListenerSpy = jest.fn().mockReturnValue(true);
        const modelListenerSpy = jest.fn().mockReturnValue(false);
        const mixinListenerSpy = jest.fn().mockReturnValue(false);

        mapper.on(hook, mixinListenerSpy);
        mapper.on(hook, modelListenerSpy, MODEL);
        mapper.on(hook, systemListenerSpy, SYSTEM);

        const result = mapper.fireChainReverse(hook, {}, [], []);

        expect(systemListenerSpy.mock.calls.length).toBe(1);
        expect(modelListenerSpy.mock.calls.length).toBe(1);
        expect(mixinListenerSpy.mock.calls.length).toBe(0);
        expect(result).toBe(false);
      });
      it("should give result false when mixin callabe return false", () => {
        const mapper = createHooksMapper();
        const hook = "construct";

        const systemListenerSpy = jest.fn().mockReturnValue(true);
        const modelListenerSpy = jest.fn().mockReturnValue(true);
        const mixinListenerSpy = jest.fn().mockReturnValue(false);

        mapper.on(hook, mixinListenerSpy);
        mapper.on(hook, modelListenerSpy, MODEL);
        mapper.on(hook, systemListenerSpy, SYSTEM);

        const result = mapper.fireChainReverse(hook, {}, [], []);

        expect(systemListenerSpy.mock.calls.length).toBe(1);
        expect(modelListenerSpy.mock.calls.length).toBe(1);
        expect(mixinListenerSpy.mock.calls.length).toBe(1);
        expect(result).toBe(false);
      });
      it("should give result true when all callabes return true", () => {
        const mapper = createHooksMapper();
        const hook = "construct";

        const systemListenerSpy = jest.fn().mockReturnValue(true);
        const modelListenerSpy = jest.fn().mockReturnValue(true);
        const mixinListenerSpy = jest.fn().mockReturnValue(true);

        mapper.on(hook, mixinListenerSpy);
        mapper.on(hook, modelListenerSpy, MODEL);
        mapper.on(hook, systemListenerSpy, SYSTEM);

        const result = mapper.fireChainReverse(hook, {}, [], []);

        expect(systemListenerSpy.mock.calls.length).toBe(1);
        expect(modelListenerSpy.mock.calls.length).toBe(1);
        expect(mixinListenerSpy.mock.calls.length).toBe(1);
        expect(result).toBe(true);
      });
    });
  });
});
