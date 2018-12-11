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
const parseMixinMethods = ({ mixin, manager }) => {
  checkMixin(mixin);
  checkManager(manager);

  Object.keys(mixin.methods || {}).forEach(key => {
    const callable = mixin.methods[key];

    if (!(callable instanceof Function || typeof callable === "function"))
      return;

    manager.proto.getters.set(key, function() {
      return (...args) => callable.apply(this, args);
    });
  });
};

export { parseMixinMethods };
