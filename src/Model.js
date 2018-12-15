import { createHooksMapper } from "@/src/utils/LifeCycleHooksMapper";
import { createOverloadingManager } from "@/src/utils/PropsOverloadingManager";
import { makeBlueprintValidator } from "./utils/BlueprintValidator";
import { extractMixins } from "@/src/utils/MixinsExtracter";
import { createModelFactoryHandler } from "@/src/utils/Handlers/FactoryHandler";
import { parseMixin } from "@/src/utils/SchemaParser/Parse";
import { Serialized } from "./mixins/Serializable";
import { DBInjectable } from "./mixins/DBInjectable";

const modelMixins = [DBInjectable, Serialized];

/** @type {MongoZilla.Model.FactoryBuilder} */
const Model = ({ blueprint, collection, connection, ...mixin }) => {
  /** @type {MongoZilla.Model.Factory} */
  const Factory = function() {};
  const mapper = createHooksMapper();
  const manager = createOverloadingManager();
  const validator = makeBlueprintValidator(blueprint);
  const mixins = [...modelMixins, ...extractMixins(mixin)];
  const retrieve = (...args) =>
    mapper.fireChainReverse("retrieving", null, args);
  const operator = {
    mapper,
    manager,
    validator,
    mixin,
    mixins,
    retrieve,
    Factory,
    blueprint,
    collection,
    connection
  };

  const handler = createModelFactoryHandler(operator);

  mixins.forEach(mixin => parseMixin({ ...operator, mixin }));

  Factory.proxy = new Proxy(Factory, handler);

  return Factory.proxy;
};

export { Model };
