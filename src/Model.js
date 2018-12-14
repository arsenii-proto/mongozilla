import { createHooksMapper } from "@/src/utils/LifeCycleHooksMapper";
import { createOverloadingManager } from "@/src/utils/PropsOverloadingManager";
import { makeBlueprintValidator } from "./utils/BlueprintValidator";
import ModelDatabaseInteractions from "@/src/mixins/ModelDatabaseInteractions";
import { extractMixins } from "@/src/utils/MixinsExtracter";
import { createModelFactoryHandler } from "@/src/utils/Handlers/ModelHandler";

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
    retrieve
  };
  const handler = createModelFactoryHandler(operator);

  mixins.forEach(mixin => parseMixin({ ...operator, mixin }));

  return new Proxy(Factory, handler);
};
