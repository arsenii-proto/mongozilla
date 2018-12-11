import { MIXIN, MODEL, SYSTEM } from "@/src/conts/MixinTypes";
import { parseMixinAction } from "@/src/utils/SchemaParser/ActionsParser";

const parsers = [parseMixinAction];

/** @type {MongoZilla.MixinParser.ParserMethod} */
const parseMixin = arg => {
  parsers.forEach(parser => parser(arg));
};

export { parseMixin, MIXIN, MODEL, SYSTEM };
