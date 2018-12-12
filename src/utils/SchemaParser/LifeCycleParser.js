import { MIXIN, MODEL, SYSTEM } from "@/src/conts/MixinTypes";
import { availableHooks } from "@/src/utils/LifeCycleHooksMapper";

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
const checkMapper = mapper => {
  ["on", "fire", "fireReverse", "fireChain", "fireChainReverse"].forEach(
    key => {
      if (!(key in mapper)) {
        throw new Error(
          "Hooks Mapper must have shape of {MongoZilla.LifeCycleHooks.Mapper}"
        );
      }
    }
  );
};
const checkMixin = mixin => {
  if (!mixin) {
    throw new Error("Mixin must be passed");
  }
};

/** @type {MongoZilla.MixinParser.ParserMethod} */
const parseMixinLifeCycle = ({ mixin, mapper }) => {
  checkMixin(mixin);
  checkMapper(mapper);

  let _$type = MIXIN;

  if ("_$type" in mixin && [MIXIN, MODEL, SYSTEM].includes(mixin._$type)) {
    _$type = mixin._$type;
  }

  availableHooks.forEach(type => {
    if (type in mixin) {
      const callable = mixin[type];

      if (callable instanceof Function || typeof callable === "function") {
        mapper.on(type, callable, _$type);
      }
    }
  });
};

export { parseMixinLifeCycle };
