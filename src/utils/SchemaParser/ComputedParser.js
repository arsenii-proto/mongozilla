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

const checkMixin = mixin => {
  if (!mixin) {
    throw new Error("Mixin must be passed");
  }
};

/** @type {MongoZilla.MixinParser.ParserMethod} */
const parseMixinComputed = ({ mixin, manager }) => {
  checkMixin(mixin);
  checkManager(manager);

  Object.keys(mixin.computed || {}).forEach(key => {
    const callable = mixin.computed[key];

    if (callable instanceof Function || typeof callable === "function") {
      manager.proto.getters.set(key, function(...args) {
        return callable.apply(this, args);
      });
    } else if (callable instanceof Object) {
      if (
        "get" in callable &&
        (callable.get instanceof Function || typeof callable.get === "function")
      ) {
        manager.proto.getters.set(key, function(...args) {
          return callable.get.apply(this, args);
        });
      }
      if (
        "set" in callable &&
        (callable.set instanceof Function || typeof callable.set === "function")
      ) {
        manager.proto.setters.set(key, function(...args) {
          return callable.set.apply(this, args);
        });
      }
    }
  });
};

export { parseMixinComputed };
