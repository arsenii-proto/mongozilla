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
const parseMixinAction = ({ mixin, manager }) => {
  checkMixin(mixin);
  checkManager(manager);

  Object.keys(mixin.actions || {}).forEach(key => {
    const callable = mixin.actions[key];

    if (!(callable instanceof Function || typeof callable === "function"))
      return;

    manager.statically.getters.set(key, function(...args) {
      const started = new Date();
      const target = this;

      return Promise.resolve()
        .then(() => callable.apply(target, args))
        .catch(error => {
          const ended = new Date();
          throw {
            error,
            started,
            ended
          };
        })
        .then(result => {
          const ended = new Date();
          return {
            result,
            started,
            ended
          };
        });
    });
  });
};

export { parseMixinAction };
