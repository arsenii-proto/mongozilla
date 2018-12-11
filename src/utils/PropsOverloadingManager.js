const checkName = name => {
  if (!(name instanceof String || typeof name === "string")) {
    throw new Error("Name must be an String");
  }
};
const checkTarget = target => {
  if (!(target instanceof Object)) {
    throw new Error("Target must be an Object");
  }
};
const checkArgs = args => {
  if (!(args instanceof Array)) {
    throw new Error("Arguments must be an Array");
  }
};
const checkCallable = callable => {
  if (!(callable instanceof Function || typeof callable === "function")) {
    throw new Error("Callable must be an Function");
  }
};
const checkNameCallable = (name, callable) => {
  checkName(name);
  checkCallable(callable);
};
const checkNameTargetArgs = (name, target, args) => {
  checkName(name);
  checkTarget(target);
  checkArgs(args);
};
const has = namespace => name => {
  checkName(name);

  return name in namespace;
};
const apply = namespace => (name, target, args = []) => {
  checkNameTargetArgs(name, target, args);

  if (name in namespace) {
    return namespace[name].apply(target, args);
  }
};
const set = namespace => (name, callable) => {
  checkNameCallable(name, callable);
  namespace[name] = callable;
};
const unset = namespace => name => {
  checkName(name);
  return delete namespace[name];
};
const createOverloadingManager = () => {
  const proto = {
    setters: {},
    getters: {}
  };
  const statically = {
    setters: {},
    getters: {}
  };

  /** @type {MongoZilla.PropsOveloadingManager.Manager} */
  const manager = {
    proto: {
      setters: {
        has: has(proto.setters),
        set: set(proto.setters),
        delete: unset(proto.setters),
        apply: apply(proto.setters)
      },
      getters: {
        has: has(proto.getters),
        set: set(proto.getters),
        delete: unset(proto.getters),
        apply: apply(proto.getters)
      }
    },
    statically: {
      setters: {
        has: has(statically.setters),
        set: set(statically.setters),
        delete: unset(statically.setters),
        apply: apply(statically.setters)
      },
      getters: {
        has: has(statically.getters),
        set: set(statically.getters),
        delete: unset(statically.getters),
        apply: apply(statically.getters)
      }
    }
  };

  return manager;
};

export { createOverloadingManager };
