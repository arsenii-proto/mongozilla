import { MIXIN, MODEL, SYSTEM } from "@/src/conts/MixinTypes";
import { parseMixinAction } from "@/src/utils/SchemaParser/ActionsParser";
import { parseMixinComputed } from "@/src/utils/SchemaParser/ComputedParser";
import { parseMixinLifeCycle } from "@/src/utils/SchemaParser/LifeCycleParser";
import { parseMixinMethods } from "@/src/utils/SchemaParser/MethodsParser";

const parsers = [
  parseMixinAction,
  parseMixinComputed,
  parseMixinLifeCycle,
  parseMixinMethods
];

/** @type {MongoZilla.MixinParser.ParserMethod} */
const parseMixin = arg => {
  parsers.forEach(parser => parser(arg));
};

export { parseMixin, MIXIN, MODEL, SYSTEM };
