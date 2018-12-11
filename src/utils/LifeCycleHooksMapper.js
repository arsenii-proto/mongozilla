import { MIXIN, MODEL, SYSTEM } from "@/src/conts/MixinTypes";

const availableHhooks = [
  "construct",
  "validating",
  "validated",
  "validator",
  "saving",
  "saved",
  "retrieved",
  "creating",
  "created",
  "updating",
  "updated",
  "deleting",
  "deleted",
  "refreshed"
];

const checkFireParams = (hook, target, args = [], systemArgs = []) => {
  if (!availableHhooks.includes(hook)) {
    throw new Error("Hook are not available");
  }

  if (!(target instanceof Object)) {
    throw new Error("Target need to be an Object");
  }

  if (!(args instanceof Array)) {
    throw new Error("Args must be an array");
  }

  if (!(systemArgs instanceof Array)) {
    throw new Error("SystemArgs must be an array");
  }
};

const performFireInOrder = (map, order) => (
  hook,
  target,
  args = [],
  systemArgs = []
) => {
  checkFireParams(hook, target, args, systemArgs);

  if (hook in map) {
    let all = true;

    order.forEach(type => {
      if (all && type in map[hook]) {
        all = map[hook][type].reduce((all, callable) => {
          const argsToPass = type === SYSTEM ? [args, systemArgs] : args;
          const result = all && callable.apply(target, argsToPass);

          return result === undefined || Boolean(result);
        }, all);
      }
    });

    return all;
  }

  return false;
};

/** @type {MongoZilla.LifeCycleHooks.Mapper} */
function createHooksMapper() {
  const map = {};

  /** @type {MongoZilla.LifeCycleHooks.AddListener} */
  const on = (hook, callable, type = MIXIN) => {
    if (!availableHhooks.includes(hook)) {
      throw new Error("Hook are not available");
    }

    if (![MIXIN, MODEL, SYSTEM].includes(type)) {
      throw new Error("Type are not allowed");
    }

    if (typeof callable !== "function") {
      throw new Error("Callable need to be an function");
    }

    if (!(hook in map)) {
      map[hook] = {};
    }

    if (!(type in map[hook])) {
      map[hook][type] = [];
    }

    map[hook][type].push(callable);
  };

  /** @type {MongoZilla.LifeCycleHooks.FireHook} */
  const fire = (hook, target, args = [], systemArgs = []) => {
    checkFireParams(hook, target, args, systemArgs);

    if (hook in map) {
      if (MODEL in map[hook]) {
        map[hook][MODEL].forEach(callable => callable.apply(target, args));
      }
      if (MIXIN in map[hook]) {
        map[hook][MIXIN].forEach(callable => callable.apply(target, args));
      }
      if (SYSTEM in map[hook]) {
        map[hook][SYSTEM].forEach(callable =>
          callable.apply(target, [args, systemArgs])
        );
      }
    }
  };

  /** @type {MongoZilla.LifeCycleHooks.FireHookChain} */
  const fireChain = performFireInOrder(map, [MODEL, MIXIN, SYSTEM]);

  /** @type {MongoZilla.LifeCycleHooks.FireHookChain} */
  const fireChainReverse = performFireInOrder(map, [SYSTEM, MODEL, MIXIN]);

  /** @type {MongoZilla.LifeCycleHooks.Mapper} */
  const mapper = { on, fire, fireChain, fireChainReverse };

  return mapper;
}

export { createHooksMapper, MIXIN, SYSTEM, MODEL };
