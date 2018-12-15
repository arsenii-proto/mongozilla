/** @type {MongoZilla.ModelHandler.Constructor} */
const createModelHandler = ({ manager }) => {
  return {
    defineProperty(Model, key, descriptor) {
      if (!Reflect.isExtensible(Model)) return false;

      if (manager.proto.getters.has(key)) {
        if (manager.proto.setters.has(key)) {
          if (descriptor.configurable) {
            manager.proto.setters.apply(key, Model.proxy, descriptor.value);
          } else {
            manager.proto.setters.delete(key);
            manager.proto.getters.delete(key);
            manager.proto.getters.set(key, () => descriptor.value);
          }
        } else {
          return false;
        }
      } else {
        if (manager.proto.setters.has(key)) {
          return false;
        }

        let { value } = descriptor;
        manager.proto.getters.set(key, () => value);

        if (descriptor.configurable) {
          manager.proto.setters.set(key, v => (value = v));
        }
      }

      return true;
    },
    deleteProperty(Model, key) {
      if (!Reflect.isExtensible(Model)) return false;

      if (manager.proto.getters.has(key) && !manager.proto.setters.has(key)) {
        return false;
      }

      if (!manager.proto.getters.has(key) && manager.proto.setters.has(key)) {
        return false;
      }

      if (manager.proto.getters.has(key)) {
        manager.proto.getters.delete(key);
      }

      if (manager.proto.setters.has(key)) {
        manager.proto.setters.delete(key);
      }

      return true;
    },
    get(Model, key) {
      if (key in Model) {
        return Model[key];
      }

      if (manager.proto.getters.has(String(key))) {
        return manager.proto.getters.apply(String(key), Model.proxy);
      }

      return undefined;
    },
    getOwnPropertyDescriptor(Model, key) {
      const descriptor = {
        configurable: true,
        writable: true,
        value: undefined
      };

      if (manager.proto.getters.has(key)) {
        descriptor.value = manager.proto.getters.apply(key, Model.proxy);
      }

      return descriptor;
    },
    has(Model, key) {
      return manager.proto.getters.has(key) || manager.proto.setters.has(key);
    },
    isExtensible(Model) {
      return Reflect.isExtensible(Model);
    },
    ownKeys() {
      const keys = manager.proto.getters.list();

      manager.proto.setters.list().forEach(key => {
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

      if (manager.proto.getters.has(key)) {
        if (manager.proto.setters.has(key)) {
          manager.proto.setters.apply(key, Model.proxy, [value]);
        } else {
          return value;
        }
      } else {
        if (manager.proto.setters.has(key)) {
          return value;
        }

        let valueCopy = value;

        manager.proto.getters.set(key, () => value);
        manager.proto.setters.set(key, v => (value = v));
      }

      return value;
    },
    setPrototypeOf() {
      return false;
    }
  };
};

export { createModelHandler };
