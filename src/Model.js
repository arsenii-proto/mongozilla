import { createHooksMapper } from "@/src/utils/LifeCycleHooksMapper";
import { createOverloadingManager } from "@/src/utils/PropsOverloadingManager";
import { makeBlueprintValidator } from "./utils/BlueprintValidator";
import ModelDatabaseInteractions from "@/src/mixins/ModelDatabaseInteractions";
import { extractMixins } from "@/src/utils/MixinsExtracter";
import { createModelFactoryHandler } from "@/src/utils/Handlers/FactoryHandler";
import { parseMixin } from "@/src/utils/SchemaParser/Parse";

const modelMixins = [ModelDatabaseInteractions];

/** @type {MongoZilla.Model.FactoryBuilder} */
const Model = ({ blueprint, colection, connection, ...rest }) => {
  /** @type {MongoZilla.Model.Factory} */
  const Factory = function() {};
  const mapper = createHooksMapper();
  const manager = createOverloadingManager();
  const validator = makeBlueprintValidator(blueprint);
  const mixins = [...modelMixins, ...extractMixins(rest)];
  const retrieve = (...args) =>
    mapper.fireChainReverse("retrieving", null, args);
  const operator = {
    mapper,
    manager,
    validator,
    mixins,
    retrieve,
    Factory
  };
  const handler = createModelFactoryHandler(operator);

  mixins.forEach(mixin => parseMixin({ ...operator, mixin }));

  Factory.proxy = new Proxy(Factory, handler);

  return Factory.proxy;
};

export { Model };
