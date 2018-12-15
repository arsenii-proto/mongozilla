import { createModelHandler } from "@/src/utils/Handlers/ModelHandler";
import { createExtendedOverloadingManager } from "@/src/utils/PropsOverloadingManager";
import { SYSTEM } from "../SchemaParser/Parse";

/** @type {MongoZilla.ModelHandler.Constructor} */
const createModelFactoryHandler = operator => {
  operator.mapper.on("retrieving", (...args) => {});

  return {
    apply() {
      throw new Error("Model Factory need can be used just like constructor");
    },
    construct(Model, args) {
      const instance = new Model();
      const instanceManager = createExtendedOverloadingManager(
        operator.manager
      );
      const instanceOperator = {
        manager: instanceManager,
        mapper: operator.mapper,
        validator: operator.validator,
        mixin: operator.mixin,
        mixins: operator.mixins,
        retrieve: operator.retrieve,
        Factory: operator.Factory,
        blueprint: operator.blueprint,
        collection: operator.collection,
        connection: operator.connection
      };
      const instanceProxy = new Proxy(
        instance,
        createModelHandler(instanceOperator)
      );

      instanceOperator.proxy = instance.proxy = instanceProxy;
      instanceManager.proto.getters.set(SYSTEM, () => instanceOperator);

      if (
        !operator.mapper.fireChainReverse(
          "creating",
          instanceProxy,
          args,
          instance
        )
      ) {
        return 1;
      }

      if (!operator.validator.valid(instanceProxy.json)) {
        return 2;
      }

      if (
        !operator.mapper.fireChainReverse(
          "validating",
          instanceProxy,
          [],
          instance
        )
      ) {
        return 3;
      }

      operator.mapper.fire("validated", instanceProxy);
      operator.mapper.fire("created", instanceProxy);

      return instanceProxy;
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
