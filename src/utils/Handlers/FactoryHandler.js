import { createModelHandler } from "@/src/utils/Handlers/ModelHandler";

/** @type {MongoZilla.ModelHandler.Constructor} */
const createModelFactoryHandler = operator => {
  operator.mapper.on("retrieving", (...args) => {});

  return {
    apply() {
      throw new Error("Model Factory need can be used just like constructor");
    },
    construct(Model, args) {
      const model = new Model();
      const modelProxy = new Proxy(model, createModelHandler(operator));

      model.proxy = modelProxy;
      model.originals = {};
      model.attributes = args.length ? args[0] : {};

      if (
        !operator.mapper.fireChainReverse(
          "construct",
          modelProxy,
          args,
          operator
        )
      ) {
        return null;
      }

      if (!operator.validator.valid(modelProxy.json)) {
        return null;
      }

      if (
        !operator.mapper.fireChainReverse(
          "validating",
          modelProxy,
          [],
          operator
        )
      ) {
        return null;
      }

      if (
        !operator.mapper.fireChainReverse("validated", modelProxy, [], operator)
      ) {
        return null;
      }

      return modelProxy;
    },
    defineProperty(Model, key, descriptor) {
      if (!Reflect.isExtensible(Model)) return false;

      if (operator.manager.statically.getters.has(key)) {
        if (operator.manager.statically.setters.has(key)) {
          if (descriptor.configurable) {
            operator.manager.statically.setters.apply(
              key,
              Model.proxy,
              descriptor.value
            );
          } else {
            operator.manager.statically.setters.delete(key);
            operator.manager.statically.getters.delete(key);
            operator.manager.statically.getters.set(
              key,
              () => descriptor.value
            );
          }
        } else {
          return false;
        }
      } else {
        if (operator.manager.statically.setters.has(key)) {
          return false;
        }

        let { value } = descriptor;
        operator.manager.statically.getters.set(key, () => value);

        if (descriptor.configurable) {
          operator.manager.statically.setters.set(key, v => (value = v));
        }
      }

      return true;
    },
    deleteProperty(Model, key) {
      if (!Reflect.isExtensible(Model)) return false;

      if (
        operator.manager.statically.getters.has(key) &&
        !operator.manager.statically.setters.has(key)
      ) {
        return false;
      }

      if (
        !operator.manager.statically.getters.has(key) &&
        operator.manager.statically.setters.has(key)
      ) {
        return false;
      }

      if (operator.manager.statically.getters.has(key)) {
        operator.manager.statically.getters.delete(key);
      }

      if (operator.manager.statically.setters.has(key)) {
        operator.manager.statically.setters.delete(key);
      }

      return true;
    },
    get(Model, key) {
      if (key in Model) {
        return Model[key];
      }

      if (operator.manager.statically.getters.has(key)) {
        return operator.manager.statically.getters.apply(key, Model.proxy);
      }

      return undefined;
    },
    getOwnPropertyDescriptor(Model, key) {
      const descriptor = {
        configurable: true,
        enumerable: true,
        value: undefined
      };

      if (operator.manager.statically.getters.has(key)) {
        if (!operator.manager.statically.setters.has(key)) {
          descriptor.configurable = false;
        }

        descriptor.value = operator.manager.statically.getters.apply(
          key,
          Model.proxy
        );
      }

      return descriptor;
    },
    has(Model, key) {
      return (
        operator.manager.statically.getters.has(key) ||
        operator.manager.statically.setters.has(key)
      );
    },
    isExtensible(Model) {
      return Reflect.isExtensible(Model);
    },
    ownKeys() {
      const keys = operator.manager.statically.getters.list();

      operator.manager.statically.setters.list().forEach(key => {
        if (!keys.includes(key)) {
          keys.push(key);
        }
      });

      return keys;
    },
    preventExtensions(Model) {
      Object.preventExtensions(Model);
      return true;
    },
    set(Model, key, value) {
      if (!Reflect.isExtensible(Model)) return value;

      if (operator.manager.statically.getters.has(key)) {
        if (operator.manager.statically.setters.has(key)) {
          operator.manager.statically.setters.apply(key, Model.proxy, value);
        } else {
          return value;
        }
      } else {
        if (operator.manager.statically.setters.has(key)) {
          return value;
        }

        let valueCopy = value;

        operator.manager.statically.getters.set(key, () => value);
        operator.manager.statically.setters.set(key, v => (value = v));
      }

      return value;
    },
    setPrototypeOf() {
      return false;
    }
  };
};

export { createModelFactoryHandler };
