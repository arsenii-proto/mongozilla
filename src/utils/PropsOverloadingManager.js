import { MIXIN } from "@/src/conts/MixinTypes";

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
const list = namespace => () => {
  return Object.keys(namespace);
};
const checkManager = manager => {
  ["has", "set", "delete", "apply"].forEach(key => {
    ["setters", "getters"].forEach(type => {
      ["proto", "statically"].forEach(namespace => {
        if (
          !(namespace in manager) &&
          !(type in manager[namespace]) &&
          !(key in manager[namespace][type])
        ) {
          throw new Error(
            "Manager must have shape of {MongoZilla.PropsOveloadingManager.Manager}"
          );
        }
      });
    });
  });
};

/** @type {MongoZilla.PropsOveloadingManager.Constructor} */
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
        apply: apply(proto.setters),
        list: list(proto.setters)
      },
      getters: {
        has: has(proto.getters),
        set: set(proto.getters),
        delete: unset(proto.getters),
        apply: apply(proto.getters),
        list: list(proto.getters)
      }
    },
    statically: {
      setters: {
        has: has(statically.setters),
        set: set(statically.setters),
        delete: unset(statically.setters),
        apply: apply(statically.setters),
        list: list(statically.setters)
      },
      getters: {
        has: has(statically.getters),
        set: set(statically.getters),
        delete: unset(statically.getters),
        apply: apply(statically.getters),
        list: list(statically.getters)
      }
    }
  };

  return manager;
};

/** @type {MongoZilla.PropsOveloadingManager.ExtendedContructed} */
const createExtendedOverloadingManager = source => {
  checkManager(source);

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
        has(name) {
          if (has(proto.setters)(name)) {
            return true;
          }
          return source.proto.setters.has(name);
        },
        set: set(proto.setters),
        delete(name) {
          if (has(proto.setters)(name)) {
            unset(proto.setters)(name);
          }
          return source.proto.setters.delete(name);
        },
        apply(name, target, args = [], systemArgs = []) {
          if (has(proto.setters)(name)) {
            return apply(proto.setters)(name, target, args, systemArgs);
          }
          return source.proto.setters.apply(name, target, args, systemArgs);
        },
        list() {
          const ownKeys = list(proto.setters)();
          const sourceKeys = source.proto.setters.list();

          sourceKeys.forEach(key => {
            if (!ownKeys.includes(key)) {
              ownKeys.push(key);
            }
          });

          return ownKeys;
        }
      },
      getters: {
        has(name) {
          if (has(proto.getters)(name)) {
            return true;
          }
          return source.proto.getters.has(name);
        },
        set: set(proto.getters),
        delete(name) {
          if (has(proto.getters)(name)) {
            unset(proto.getters)(name);
          }
          return source.proto.getters.delete(name);
        },
        apply(name, target, args = [], systemArgs = []) {
          if (has(proto.getters)(name)) {
            return apply(proto.getters)(name, target, args, systemArgs);
          }
          return source.proto.getters.apply(name, target, args, systemArgs);
        },
        list() {
          const ownKeys = list(proto.getters)();
          const sourceKeys = source.proto.getters.list();

          sourceKeys.forEach(key => {
            if (!ownKeys.includes(key)) {
              ownKeys.push(key);
            }
          });

          return ownKeys;
        }
      }
    },
    statically: {
      setters: {
        has(name) {
          if (has(statically.setters)(name)) {
            return true;
          }
          return source.statically.setters.has(name);
        },
        set: set(statically.setters),
        delete(name) {
          if (has(statically.setters)(name)) {
            unset(statically.setters)(name);
          }
          return source.statically.setters.delete(name);
        },
        apply(name, target, args = [], systemArgs = []) {
          if (has(statically.setters)(name)) {
            return apply(statically.setters)(name, target, args, systemArgs);
          }
          return source.statically.setters.apply(
            name,
            target,
            args,
            systemArgs
          );
        },
        list() {
          const ownKeys = list(statically.setters)();
          const sourceKeys = source.statically.setters.list();

          sourceKeys.forEach(key => {
            if (!ownKeys.includes(key)) {
              ownKeys.push(key);
            }
          });

          return ownKeys;
        }
      },
      getters: {
        has(name) {
          if (has(statically.getters)(name)) {
            return true;
          }
          return source.statically.getters.has(name);
        },
        set: set(statically.getters),
        delete(name) {
          if (has(statically.getters)(name)) {
            unset(statically.getters)(name);
          }
          return source.statically.getters.delete(name);
        },
        apply(name, target, args = [], systemArgs = []) {
          if (has(statically.getters)(name)) {
            return apply(statically.getters)(name, target, args, systemArgs);
          }
          return source.statically.getters.apply(
            name,
            target,
            args,
            systemArgs
          );
        },
        list() {
          const ownKeys = list(statically.getters)();
          const sourceKeys = source.statically.getters.list();

          sourceKeys.forEach(key => {
            if (!ownKeys.includes(key)) {
              ownKeys.push(key);
            }
          });

          return ownKeys;
        }
      }
    }
  };

  return manager;
};

export { createOverloadingManager, createExtendedOverloadingManager };
